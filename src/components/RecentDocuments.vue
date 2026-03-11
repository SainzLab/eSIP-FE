<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6 relative">
    
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-slate-800">Dokumen Terbaru</h2>
      <button @click="$router.push('/manajemen-arsip')" class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors">
        Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>

    <div class="overflow-x-auto min-h-[200px]">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr class="text-slate-400 text-sm border-b border-slate-100">
            <th class="pb-3 font-medium px-4">No. Surat</th>
            <th class="pb-3 font-medium px-4">Perihal</th>
            <th class="pb-3 font-medium px-4">Kategori</th>
            <th class="pb-3 font-medium px-4">Tanggal Surat</th>
            <th class="pb-3 font-medium px-4">Status</th>
          </tr>
        </thead>
        
        <tbody v-if="isLoading">
          <tr>
            <td colspan="5" class="py-12 text-center text-slate-400">
              <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-blue-500"></i>
              <p>Memuat dokumen terbaru...</p>
            </td>
          </tr>
        </tbody>
        
        <tbody v-else-if="documents.length === 0">
          <tr>
            <td colspan="5" class="py-12 text-center text-slate-400">
              <p>Belum ada dokumen yang diarsipkan.</p>
            </td>
          </tr>
        </tbody>

        <tbody v-else class="text-sm">
          <tr 
            v-for="doc in documents" 
            :key="doc.id" 
            class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
          >
            <td class="py-4 px-4 text-slate-800 font-medium">{{ doc.no_surat || '-' }}</td>
            <td class="py-4 px-4 text-slate-600 font-medium">{{ doc.judul }}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium uppercase">
                {{ doc.expand?.kategori_id?.nama || 'Tanpa Kategori' }}
              </span>
            </td>
            <td class="py-4 px-4 text-slate-500">{{ formatDate(doc.tanggal_surat) }}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200">
                <i class="fa-solid fa-check-circle"></i> Diarsipkan
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import pb from '../pb.js'

const isLoading = ref(true)
const documents = ref([])

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fetchRecentDocs = async () => {
  isLoading.value = true
  try {
    let filterArsip = 'is_deleted != true'
    
    if (userRole.value !== 'Arsiparis' && userRole.value !== 'Petugas Arsip' && userRole.value !== 'Kepala Sekolah') {
      filterArsip += ` && bidang = "${userBidang.value}"`
    }

    const records = await pb.collection('arsip').getList(1, 5, {
      filter: filterArsip,
      sort: '-created',
      expand: 'kategori_id'
    })

    documents.value = records.items
  } catch (error) {
    console.error("Gagal mengambil dokumen terbaru:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRecentDocs()
})
</script>