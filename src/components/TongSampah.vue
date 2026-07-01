<template>
  <div class="flex flex-col gap-6 relative pb-10">
    
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

    <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start sm:items-center gap-4 text-amber-800 shadow-sm">
      <div class="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
        <i class="fa-solid fa-clock-rotate-left text-amber-600 text-lg"></i>
      </div>
      <div>
        <h3 class="font-bold text-sm">Pembersihan Otomatis Aktif</h3>
        <p class="text-xs mt-0.5 opacity-80 leading-relaxed">
          Sistem akan memusnahkan dokumen di tong sampah secara permanen setelah berada di sini selama <b>7 hari</b>. Pastikan untuk me-restore dokumen penting Anda sebelum batas waktu habis.
        </p>
      </div>
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
              <td class="py-4 px-6">
                <div class="flex flex-col items-start gap-1.5">
                  <span class="text-slate-500 text-xs font-medium">
                    {{ formatDateTime(arsip.updated) }}
                  </span>
                  <span 
                    class="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                    :class="getDaysLeftClass(arsip.updated)"
                  >
                    <i class="fa-regular fa-clock mr-1"></i> {{ getDaysLeftText(arsip.updated) }}
                  </span>
                </div>
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

    <div v-if="confirmModal.show" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="confirmModal.show = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        
        <div :class="confirmModal.type === 'restore' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-4">
          <i :class="confirmModal.type === 'restore' ? 'fa-solid fa-rotate-left' : 'fa-solid fa-triangle-exclamation'"></i>
        </div>
        
        <h3 class="font-bold text-slate-800 text-lg mb-2">
          {{ confirmModal.title }}
        </h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          {{ confirmModal.message }}
        </p>
        
        <div class="flex gap-3">
          <button @click="confirmModal.show = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Batal</button>
          <button @click="executeAction" :class="confirmModal.type === 'restore' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'" class="flex-1 py-2.5 text-white font-bold rounded-lg transition-colors shadow-md flex justify-center items-center gap-2">
            <i v-if="isProcessing" class="fa-solid fa-spinner fa-spin"></i>
            {{ isProcessing ? 'Memproses...' : (confirmModal.type === 'restore' ? 'Ya, Kembalikan' : 'Ya, Musnahkan') }}
          </button>
        </div>
      </div>
    </div>

    <transition name="toast">
      <div v-if="notification.show" class="fixed bottom-6 right-6 z-[110] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border" :class="notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'">
        <i :class="notification.type === 'success' ? 'fa-solid fa-circle-check text-emerald-500' : 'fa-solid fa-circle-exclamation text-red-500'" class="text-xl"></i>
        <p class="text-sm font-bold">{{ notification.message }}</p>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import pb from '../pb.js'

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const isLoading = ref(true)
const isProcessing = ref(false)
const arsipTerhapus = ref([])

const currentPage = ref(1)
const itemsPerPage = 15

const confirmModal = ref({
  show: false,
  type: '', 
  data: null,
  title: '',
  message: ''
})

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' - ' + 
         date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

const getDaysLeft = (updatedDate) => {
  if (!updatedDate) return 0;
  
  const deletedAt = new Date(updatedDate);
  
  const autoDeleteAt = new Date(deletedAt);
  autoDeleteAt.setDate(autoDeleteAt.getDate() + 7);
  
  const today = new Date();
  const diffTime = autoDeleteAt - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

const getDaysLeftText = (updatedDate) => {
  const diffDays = getDaysLeft(updatedDate);
  if (diffDays <= 0) return 'Dimusnahkan Hari Ini';
  return `Sisa ${diffDays} Hari`;
}

const getDaysLeftClass = (updatedDate) => {
  const diffDays = getDaysLeft(updatedDate);
  if (diffDays <= 1) return 'bg-red-100 text-red-600 border border-red-200';
  if (diffDays <= 3) return 'bg-amber-100 text-amber-600 border border-amber-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
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

const restoreArsip = (arsip) => {
  confirmModal.value = {
    show: true,
    type: 'restore',
    data: arsip,
    title: 'Kembalikan Dokumen?',
    message: `Dokumen "${arsip.judul}" akan dipulihkan dan dikembalikan ke halaman Manajemen Arsip.`
  }
}

const deletePermanent = (arsip) => {
  confirmModal.value = {
    show: true,
    type: 'delete',
    data: arsip,
    title: 'Musnahkan Permanen?',
    message: `PERINGATAN! Anda akan memusnahkan dokumen "${arsip.judul}" secara permanen. File tidak dapat dikembalikan lagi.`
  }
}

const kosongkanTongSampah = () => {
  confirmModal.value = {
    show: true,
    type: 'empty',
    data: null,
    title: 'Kosongkan Tong Sampah?',
    message: 'Apakah Anda yakin ingin memusnahkan SEMUA dokumen di tong sampah ini secara permanen?'
  }
}

const executeAction = async () => {
  isProcessing.value = true
  const { type, data } = confirmModal.value

  try {
    if (type === 'restore') {
      await pb.collection('arsip').update(data.id, { is_deleted: false })
      showToast(`Dokumen "${data.judul}" berhasil dikembalikan.`, 'success')
      
    } else if (type === 'delete') {
      await pb.collection('arsip').delete(data.id)
      showToast(`Dokumen "${data.judul}" telah dimusnahkan.`, 'success')
      
    } else if (type === 'empty') {
      for (const arsip of arsipTerhapus.value) {
        await pb.collection('arsip').delete(arsip.id)
      }
      showToast('Seluruh tong sampah berhasil dikosongkan.', 'success')
      currentPage.value = 1
    }
    
    fetchTrash()
  } catch (error) {
    console.error("Gagal mengeksekusi aksi:", error)
    showToast("Terjadi kesalahan sistem. Pastikan Anda memiliki izin akses.", 'error')
  } finally {
    isProcessing.value = false
    confirmModal.value.show = false
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

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>