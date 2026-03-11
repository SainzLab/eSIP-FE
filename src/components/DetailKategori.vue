<template>
  <div class="flex flex-col gap-6 relative pb-10">
    
    <div class="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <button @click="$router.push('/kategori')" class="w-10 h-10 shrink-0 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all shadow-sm">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <div>
        <h1 class="text-2xl font-bold text-slate-800 capitalize">
          {{ isLoading ? 'Memuat Kategori...' : categoryData.nama }}
        </h1>
        <p class="text-slate-500 text-sm mt-1">
          {{ isLoading ? 'Mohon tunggu sebentar...' : (categoryData.deskripsi || 'Daftar dokumen di kategori ini.') }}
        </p>
      </div>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-80">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari judul atau no surat..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-shadow"
        >
      </div>
      
      <button 
        @click="exportToExcel"
        :disabled="filteredArsip.length === 0"
        class="text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 bg-emerald-50 hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fa-solid fa-file-excel"></i> Export Excel
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Dokumen</th>
              <th class="py-3.5 px-4 font-semibold">Bidang</th>
              <th class="py-3.5 px-4 font-semibold">Tanggal Surat</th>
              <th class="py-3.5 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          
          <tbody v-if="isLoading">
            <tr>
              <td colspan="5" class="py-12 text-center text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-blue-500"></i>
                <p>Mengambil data dari server...</p>
              </td>
            </tr>
          </tbody>

          <tbody v-else-if="paginatedArsip.length === 0">
            <tr>
              <td colspan="5" class="py-12 text-center text-slate-400">
                <i class="fa-solid fa-folder-open text-4xl text-slate-200 mb-3 block"></i>
                Tidak ada dokumen yang ditemukan di kategori ini.
              </td>
            </tr>
          </tbody>

          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in paginatedArsip" :key="item.id" class="hover:bg-slate-50 transition-colors group">
              <td class="py-4 px-4 text-center text-slate-500">
                 {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-4 px-4 min-w-[250px]">
                <div class="flex items-start gap-3">
                  <div :class="[getFileIconInfo(item.file_dokumen).bgClass, getFileIconInfo(item.file_dokumen).textClass]" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <i :class="getFileIconInfo(item.file_dokumen).icon" class="text-lg"></i>
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 whitespace-normal line-clamp-2">{{ item.judul }}</span>
                    <span class="text-xs text-slate-500 mt-0.5">No: {{ item.no_surat || '-' }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <i class="fa-solid fa-building text-slate-400 mr-1"></i> {{ item.bidang }}
              </td>
              <td class="py-4 px-4 text-slate-500 font-medium">{{ formatDate(item.tanggal_surat) }}</td>
              <td class="py-4 px-4 text-right">
                <div class="flex justify-end gap-2">
                  <a 
                    v-if="item.file_dokumen"
                    :href="getFileUrl(item)" 
                    target="_blank"
                    class="w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors" 
                    title="Download File"
                  >
                    <i class="fa-solid fa-download"></i>
                  </a>
                  
                  <button 
                    v-if="userRole !== 'Kepala Sekolah'"
                    @click="openModal(item)" 
                    class="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" 
                    title="Edit Dokumen"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    v-if="userRole !== 'Kepala Sekolah'"
                    @click="deleteArsip(item)" 
                    class="w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" 
                    title="Hapus Dokumen"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!isLoading" class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50">
        <div>Menampilkan <span class="font-bold text-slate-700">{{ paginatedArsip.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> hingga <span class="font-bold text-slate-700">{{ Math.min(currentPage * itemsPerPage, filteredArsip.length) }}</span> dari <span class="font-bold text-slate-700">{{ filteredArsip.length }}</span> arsip</div>
        <div class="flex gap-1">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Prev</button>
          <span class="px-3 py-1.5 bg-blue-600 text-white rounded-md font-bold shadow-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Next</button>
        </div>
      </div>
    </div>

    <div v-if="showModal && userRole !== 'Kepala Sekolah'" class="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
          <h3 class="font-bold text-slate-800 text-lg">Edit Arsip</h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveArsip" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nomor Surat</label>
              <input v-model="formData.no_surat" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal Surat</label>
              <input v-model="formData.tanggal_surat" type="date" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Judul Dokumen</label>
            <input v-model="formData.judul" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kategori Arsip</label>
              <select v-model="formData.kategori_id" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
                <option v-for="kat in kategoriOptions" :key="kat.id" :value="kat.id">{{ kat.nama }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bidang / Bagian</label>
              <select v-model="formData.bidang" :disabled="userRole !== 'Petugas Arsip' && userRole !== 'Arsiparis' && userRole !== 'Kepala Sekolah'" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                <option value="Tata Usaha">Tata Usaha</option>
                <option value="Kesiswaan">Kesiswaan</option>
                <option value="Kepegawaian">Kepegawaian</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Kurikulum">Kurikulum</option>
                <option value="Sarana dan prasarana">Sarana dan Prasarana</option>
                <option value="Humas">Humas</option>
                <option value="Perpustakaan">Perpustakaan</option>
                <option value="Pimpinan">Pimpinan</option>
                <option value="Dapodik">Dapodik</option>
              </select>
            </div>
          </div>

          <div class="pt-2">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ganti File Dokumen (Opsional)</label>
            <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
              <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx,.xls,.xlsx" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
              
              <div v-if="!selectedFile" class="pointer-events-none">
                <i class="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
                <p class="text-sm font-semibold text-slate-700">Klik atau drag file baru ke sini</p>
                <p class="text-xs text-amber-600 mt-1 font-medium">*Biarkan kosong jika tidak ingin mengubah file lama.</p>
              </div>
              
              <div v-else class="pointer-events-none flex items-center justify-center gap-3">
                <i class="fa-solid fa-file-circle-check text-2xl text-emerald-500"></i>
                <div class="text-left">
                  <p class="text-sm font-bold text-emerald-700 line-clamp-1">{{ selectedFile.name }}</p>
                  <p class="text-xs text-emerald-600 font-medium">File Siap Diperbarui</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="pt-4 flex gap-3 mt-4 border-t border-slate-100 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-400">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Menyimpan...' : 'Update Arsip' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import pb from '../pb.js'
import * as XLSX from 'xlsx'

const route = useRoute()
const categoryId = route.params.slug
const searchQuery = ref('')
const isLoading = ref(true)

const categoryData = ref({})
const arsipData = ref([])

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const showModal = ref(false)
const isSaving = ref(false)
const selectedFile = ref(null)
const kategoriOptions = ref([])
const formData = ref({ id: '', no_surat: '', judul: '', tanggal_surat: '', kategori_id: '', bidang: '' })

const currentPage = ref(1)
const itemsPerPage = 15

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getFileUrl = (arsip) => {
  return `${pb.baseUrl}/api/files/${arsip.collectionId}/${arsip.id}/${arsip.file_dokumen}`
}

const getFileIconInfo = (filename) => {
  if (!filename) return { icon: 'fa-solid fa-file', bgClass: 'bg-slate-100', textClass: 'text-slate-400' }
  const ext = filename.split('.').pop().toLowerCase()
  switch (ext) {
    case 'pdf': return { icon: 'fa-solid fa-file-pdf', bgClass: 'bg-red-100', textClass: 'text-red-600' }
    case 'xls': case 'xlsx': case 'csv': return { icon: 'fa-solid fa-file-excel', bgClass: 'bg-emerald-100', textClass: 'text-emerald-600' }
    case 'doc': case 'docx': return { icon: 'fa-solid fa-file-word', bgClass: 'bg-blue-100', textClass: 'text-blue-600' }
    case 'jpg': case 'jpeg': case 'png': return { icon: 'fa-solid fa-file-image', bgClass: 'bg-purple-100', textClass: 'text-purple-600' }
    case 'zip': case 'rar': return { icon: 'fa-solid fa-file-zipper', bgClass: 'bg-amber-100', textClass: 'text-amber-600' }
    default: return { icon: 'fa-solid fa-file', bgClass: 'bg-slate-100', textClass: 'text-slate-600' }
  }
}

const fetchData = async () => {
  isLoading.value = true
  try {
    categoryData.value = await pb.collection('kategori').getOne(categoryId)
    const katRecords = await pb.collection('kategori').getFullList({ sort: 'nama' })
    kategoriOptions.value = katRecords

    let filterQuery = `kategori_id = "${categoryId}" && is_deleted != true`
    if (userRole.value !== 'Petugas Arsip' && userRole.value !== 'Arsiparis' && userRole.value !== 'Kepala Sekolah') {
      filterQuery += ` && bidang = "${userBidang.value}"`
    }

    const records = await pb.collection('arsip').getFullList({
      filter: filterQuery,
      sort: '-tanggal_surat'
    })
    
    arsipData.value = records
  } catch (error) {
    console.error("Gagal memuat data:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
}

const openModal = (data) => {
  selectedFile.value = null
  formData.value = { 
    id: data.id, 
    no_surat: data.no_surat, 
    judul: data.judul, 
    tanggal_surat: data.tanggal_surat.substring(0, 10), 
    kategori_id: data.kategori_id,
    bidang: data.bidang
  }
  showModal.value = true
}

const saveArsip = async () => {
  isSaving.value = true
  const submission = new FormData()
  submission.append('no_surat', formData.value.no_surat)
  submission.append('judul', formData.value.judul)
  submission.append('tanggal_surat', formData.value.tanggal_surat + ' 12:00:00.000Z')
  submission.append('kategori_id', formData.value.kategori_id)
  submission.append('bidang', formData.value.bidang)
  
  if (selectedFile.value) {
    submission.append('file_dokumen', selectedFile.value)
  }

  try {
    await pb.collection('arsip').update(formData.value.id, submission)
    showModal.value = false
    fetchData()
  } catch (error) {
    console.error("Gagal update arsip:", error)
    alert("Terjadi kesalahan saat menyimpan perubahan.")
  } finally {
    isSaving.value = false
  }
}

const deleteArsip = async (arsip) => {
  if (confirm(`Pindahkan dokumen "${arsip.judul}" ke Tong Sampah?`)) {
    try {
      await pb.collection('arsip').update(arsip.id, { is_deleted: true })
      fetchData()
    } catch (error) {
      console.error(error)
      alert("Gagal memindahkan dokumen.")
    }
  }
}

const filteredArsip = computed(() => {
  if (!searchQuery.value) return arsipData.value
  const q = searchQuery.value.toLowerCase()
  return arsipData.value.filter(item => {
    return (item.no_surat && item.no_surat.toLowerCase().includes(q)) || 
           (item.judul && item.judul.toLowerCase().includes(q))
  })
})

const totalPages = computed(() => Math.ceil(filteredArsip.value.length / itemsPerPage) || 1)

const paginatedArsip = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredArsip.value.slice(start, end)
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }

watch(searchQuery, () => { currentPage.value = 1 })

const exportToExcel = () => {
  if (filteredArsip.value.length === 0) return
  const dataExcel = filteredArsip.value.map((item, index) => ({
    'No': index + 1,
    'Nomor Surat': item.no_surat || '-',
    'Judul Dokumen': item.judul,
    'Bidang': item.bidang,
    'Tanggal Surat': formatDate(item.tanggal_surat)
  }))

  const worksheet = XLSX.utils.json_to_sheet(dataExcel)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Arsip")

  const namaKategori = categoryData.value.nama ? categoryData.value.nama.replace(/\s+/g, '_') : 'Kategori'
  XLSX.writeFile(workbook, `Laporan_Arsip_${namaKategori}.xlsx`)
}
</script>