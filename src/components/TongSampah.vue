<template>
  <div class="flex flex-col gap-6 pb-10">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-red-100">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-trash-can text-red-500"></i>
          Tong Sampah
        </h1>
        <p class="text-slate-500 text-sm mt-1">Dokumen yang dihapus akan tersimpan di sini sebelum dimusnahkan.</p>
      </div>
      <button 
        v-if="arsipTerhapus.length > 0"
        @click="kosongkanTongSampah"
        class="bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all border border-red-200 shadow-sm"
      >
        <i class="fa-solid fa-fire"></i> Kosongkan Semua
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-4 px-6 font-bold w-12 text-center">No</th>
              <th class="py-4 px-6 font-bold">Informasi Dokumen</th>
              <th class="py-4 px-6 font-bold">Kategori & Bidang</th>
              <th class="py-4 px-6 font-bold">Waktu Dihapus</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-if="isLoading" class="text-center">
              <td colspan="5" class="py-8 text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p>Memuat isi tong sampah...</p>
              </td>
            </tr>
            
            <tr v-else-if="paginatedTrash.length === 0" class="text-center">
              <td colspan="5" class="py-12">
                <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i class="fa-solid fa-seedling text-2xl text-emerald-400"></i>
                </div>
                <p class="text-slate-500 font-medium">Tong sampah bersih! Tidak ada dokumen yang terhapus.</p>
              </td>
            </tr>
            
            <tr v-else v-for="(arsip, index) in paginatedTrash" :key="arsip.id" class="hover:bg-red-50/30 transition-colors group">
              <td class="py-4 px-6 text-center text-slate-500 font-medium">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-start gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                  <div class="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <i class="fa-solid fa-file-excel text-lg" v-if="arsip.file_dokumen.includes('.xls')"></i>
                    <i class="fa-solid fa-file-word text-lg" v-else-if="arsip.file_dokumen.includes('.doc')"></i>
                    <i class="fa-solid fa-file-pdf text-lg" v-else></i>
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 line-clamp-1 strike line-through decoration-slate-400">{{ arsip.judul }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">No: {{ arsip.no_surat || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6 opacity-70">
                <div class="flex flex-col gap-1.5 items-start">
                  <span class="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">
                    {{ arsip.expand?.kategori_id?.nama || 'Tanpa Kategori' }}
                  </span>
                  <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    <i class="fa-solid fa-building text-[10px] mr-1 text-slate-400"></i> {{ arsip.bidang }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-500 text-xs font-medium">
                {{ formatDateTime(arsip.updated) }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button 
                    @click="restoreArsip(arsip)" 
                    class="px-3 py-1.5 rounded-lg text-emerald-600 font-bold text-xs hover:bg-emerald-50 flex items-center gap-1.5 border border-emerald-100 transition-colors bg-white shadow-sm" 
                    title="Kembalikan Dokumen"
                  >
                    <i class="fa-solid fa-rotate-left"></i> Restore
                  </button>
                  <button 
                    @click="deletePermanent(arsip)" 
                    class="w-8 h-8 rounded-lg text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors border border-red-100 bg-white shadow-sm" 
                    title="Musnahkan Permanen"
                  >
                    <i class="fa-solid fa-fire"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && arsipTerhapus.length > 0" class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50">
        <div>Menampilkan <span class="font-bold text-slate-700">{{ paginatedTrash.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> hingga <span class="font-bold text-slate-700">{{ Math.min(currentPage * itemsPerPage, arsipTerhapus.length) }}</span> dari <span class="font-bold text-slate-700">{{ arsipTerhapus.length }}</span> dokumen terhapus</div>
        <div class="flex gap-1">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Prev</button>
          <span class="px-3 py-1.5 bg-red-500 text-white rounded-md font-bold shadow-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Next</button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import pb from '../pb.js'

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const isLoading = ref(true)
const arsipTerhapus = ref([])

const currentPage = ref(1)
const itemsPerPage = 15

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + 
         date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const fetchTrash = async () => {
  isLoading.value = true
  try {
    let filterQuery = 'is_deleted = true'

    if (userRole.value !== 'Petugas Arsip' && userRole.value !== 'Kepala Sekolah' && userRole.value !== 'Arsiparis') {
      filterQuery += ` && bidang = "${userBidang.value}"`
    }

    const records = await pb.collection('arsip').getFullList({
      filter: filterQuery,
      sort: '-updated', 
      expand: 'kategori_id'
    })
    
    arsipTerhapus.value = records

    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  } catch (error) {
    console.error("Gagal mengambil data tong sampah:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchTrash()
})

const restoreArsip = async (arsip) => {
  try {
    await pb.collection('arsip').update(arsip.id, {
      is_deleted: false
    })
    fetchTrash() 
    alert(`Dokumen "${arsip.judul}" berhasil dikembalikan ke Manajemen Arsip.`)
  } catch (error) {
    console.error("Gagal merestore arsip:", error)
    alert("Terjadi kesalahan saat mengembalikan dokumen.")
  }
}

const deletePermanent = async (arsip) => {
  if (confirm(`PERINGATAN! Anda akan memusnahkan dokumen "${arsip.judul}" secara permanen. File tidak dapat dikembalikan. Lanjutkan?`)) {
    try {
      await pb.collection('arsip').delete(arsip.id)
      fetchTrash() 
    } catch (error) {
      console.error("Gagal menghapus permanen:", error)
      alert("Gagal memusnahkan dokumen. Pastikan Anda memiliki izin akses.")
    }
  }
}

const kosongkanTongSampah = async () => {
  if (confirm(`Apakah Anda yakin ingin memusnahkan SEMUA dokumen di tong sampah secara permanen?`)) {
    try {
      isLoading.value = true
      for (const arsip of arsipTerhapus.value) {
        await pb.collection('arsip').delete(arsip.id)
      }
      fetchTrash()
      currentPage.value = 1
    } catch (error) {
      console.error("Gagal mengosongkan:", error)
      alert("Terjadi kesalahan saat mengosongkan tong sampah.")
    } finally {
      isLoading.value = false
    }
  }
}

const totalPages = computed(() => {
  return Math.ceil(arsipTerhapus.value.length / itemsPerPage) || 1
})

const paginatedTrash = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return arsipTerhapus.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>