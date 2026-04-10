<template>
  <div class="flex flex-col gap-6 pb-10">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-folder-open text-blue-600"></i>
          Manajemen Arsip
        </h1>
        <p class="text-slate-500 text-sm mt-1">Kelola, unggah, dan temukan dokumen digital sekolah.</p>
      </div>
      <button 
        v-if="userRole !== 'Kepala Sekolah'"
        @click="openModal('add')"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-100 shrink-0"
      >
        <i class="fa-solid fa-cloud-arrow-up"></i> Unggah Arsip
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari judul dokumen atau nomor surat..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-shadow"
        >
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
              <th class="py-4 px-6 font-bold">Tanggal Surat</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          
          <tbody v-if="isLoading" class="text-sm divide-y divide-slate-100">
            <tr class="text-center">
              <td colspan="5" class="py-12 text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-3xl mb-3 text-blue-500"></i>
                <p>Memuat data arsip...</p>
              </td>
            </tr>
          </tbody>
          
          <tbody v-else-if="paginatedArsip.length === 0" class="text-sm divide-y divide-slate-100">
            <tr class="text-center">
              <td colspan="5" class="py-12 text-slate-400">
                <i class="fa-solid fa-folder-open text-4xl text-slate-200 mb-3 block"></i>
                <p>Belum ada arsip ditemukan atau kata kunci tidak cocok.</p>
              </td>
            </tr>
          </tbody>
          
          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(arsip, index) in paginatedArsip" :key="arsip.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="py-4 px-6 text-center text-slate-500 font-medium">
                 {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-4 px-6 min-w-[250px]">
                <div class="flex items-start gap-3">
                  <div :class="[getFileIconInfo(arsip.file_dokumen).bgClass, getFileIconInfo(arsip.file_dokumen).textClass]" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                    <i :class="getFileIconInfo(arsip.file_dokumen).icon" class="text-lg"></i>
                  </div>
                  <div>
                    <p class="font-bold text-slate-800 line-clamp-2">{{ arsip.judul }}</p>
                    <p class="text-xs text-slate-500 mt-0.5">No: {{ arsip.no_surat || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex flex-col gap-1.5 items-start">
                  <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">
                    {{ arsip.expand?.kategori_id?.nama || 'Tanpa Kategori' }}
                  </span>
                  <span class="text-xs text-slate-500 font-medium uppercase tracking-wider">
                    <i class="fa-solid fa-building text-[10px] mr-1 text-slate-400"></i> {{ arsip.bidang }}
                  </span>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-600 text-sm font-medium">
                {{ formatDate(arsip.tanggal_surat) }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <a 
                    v-if="arsip.file_dokumen"
                    :href="getFileUrl(arsip)" 
                    target="_blank"
                    class="w-8 h-8 rounded-lg text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors" 
                    title="Lihat / Download"
                  >
                    <i class="fa-solid fa-download"></i>
                  </a>

                  <button 
                    v-if="userRole !== 'Kepala Sekolah'"
                    @click="openModal('edit', arsip)" 
                    class="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" 
                    title="Edit Dokumen"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    v-if="userRole !== 'Kepala Sekolah'"
                    @click="deleteArsip(arsip)" 
                    class="w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" 
                    title="Hapus (Pindahkan ke Tong Sampah)"
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

    <div v-if="showModal" class="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ isEdit ? 'Edit Arsip' : 'Unggah Arsip Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveArsip" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nomor Surat</label>
              <input v-model="formData.no_surat" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Contoh: 001/SK/2026">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tanggal Surat</label>
              <input v-model="formData.tanggal_surat" type="date" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Judul Dokumen</label>
            <input v-model="formData.judul" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Contoh: SK Pembagian Tugas Mengajar" required>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Kategori Arsip</label>
              <select v-model="formData.kategori_id" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm" required>
                <option value="" disabled>-- Pilih Kategori --</option>
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
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">File Dokumen (PDF/Word/Excel)</label>
            <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
              <input type="file" @change="handleFileUpload" accept=".pdf,.doc,.docx,.xls,.xlsx" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" :required="!isEdit">
              
              <div v-if="!selectedFile" class="pointer-events-none">
                <i class="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
                <p class="text-sm font-semibold text-slate-700">Klik atau drag file ke sini</p>
                <p class="text-xs text-slate-400 mt-1">Maksimal ukuran file: 10MB</p>
              </div>
              
              <div v-else class="pointer-events-none flex items-center justify-center gap-3">
                <i class="fa-solid fa-file-circle-check text-2xl text-emerald-500"></i>
                <div class="text-left">
                  <p class="text-sm font-bold text-emerald-700 line-clamp-1">{{ selectedFile.name }}</p>
                  <p class="text-xs text-emerald-600 font-medium">File Siap Diunggah</p>
                </div>
              </div>
            </div>
            <p v-if="isEdit && !selectedFile" class="text-xs text-amber-600 mt-2 font-medium">*Biarkan kosong jika tidak ingin mengubah file dokumen sebelumnya.</p>
          </div>
          
          <div class="pt-4 flex gap-3 mt-4 border-t border-slate-100 pt-6">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-400">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Menyimpan & Mengunggah...' : 'Simpan Arsip' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-4 border-red-100">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-2">Pindahkan Dokumen?</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          Apakah Anda yakin ingin memindahkan dokumen <br><span class="font-bold text-slate-700">"{{ itemToDelete?.judul }}"</span><br> ke Tong Sampah?
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Batal</button>
          <button @click="confirmDelete" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-red-200">Ya, Pindahkan</button>
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
import { ref, computed, onMounted, watch } from 'vue'
import pb from '../pb.js'

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')
const userId = ref(pb.authStore.model?.id)

const showModal = ref(false)
const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const isEdit = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const searchQuery = ref('') 

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const arsipList = ref([])
const kategoriOptions = ref([])
const selectedFile = ref(null)

const currentPage = ref(1)
const itemsPerPage = 15

const formData = ref({
  id: '',
  no_surat: '',
  judul: '',
  tanggal_surat: '',
  kategori_id: '',
  bidang: userBidang.value
})

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0]
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
    const katRecords = await pb.collection('kategori').getFullList({ sort: 'nama' })
    kategoriOptions.value = katRecords

    let filterQuery = 'is_deleted != true'
    if (userRole.value !== 'Petugas Arsip' && userRole.value !== 'Arsiparis' && userRole.value !== 'Kepala Sekolah') {
      filterQuery += ` && bidang = "${userBidang.value}"`
    }

    const arsipRecords = await pb.collection('arsip').getFullList({
      filter: filterQuery,
      sort: '-created',
      expand: 'kategori_id'
    })
    
    arsipList.value = arsipRecords
  } catch (error) {
    console.error("Gagal mengambil data:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const openModal = (mode, data = null) => {
  isEdit.value = mode === 'edit'
  selectedFile.value = null 
  
  if (isEdit.value && data) {
    formData.value = { 
      id: data.id, 
      no_surat: data.no_surat, 
      judul: data.judul, 
      tanggal_surat: data.tanggal_surat.substring(0, 10), 
      kategori_id: data.kategori_id,
      bidang: data.bidang
    }
  } else {
    formData.value = { 
      id: '', 
      no_surat: '', 
      judul: '', 
      tanggal_surat: new Date().toISOString().substring(0, 10), 
      kategori_id: kategoriOptions.value.length > 0 ? kategoriOptions.value[0].id : '', 
      bidang: userBidang.value 
    }
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
  submission.append('is_deleted', false) 
  
  if (!isEdit.value && userId.value) {
    submission.append('pengunggah', userId.value)
  }

  if (selectedFile.value) {
    submission.append('file_dokumen', selectedFile.value)
  }

  try {
    if (isEdit.value) {
      await pb.collection('arsip').update(formData.value.id, submission)
    } else {
      await pb.collection('arsip').create(submission)
    }
    showModal.value = false
    fetchData() 
    showToast(isEdit.value ? 'Arsip berhasil diperbarui!' : 'Arsip baru berhasil diunggah!', 'success') 
  } catch (error) {
    console.error("Gagal menyimpan arsip:", error)
    showToast('Terjadi kesalahan saat menyimpan dokumen.', 'error')
  } finally {
    isSaving.value = false
  }
}

const deleteArsip = (arsip) => {
  itemToDelete.value = arsip
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  try {
    await pb.collection('arsip').update(itemToDelete.value.id, {
      is_deleted: true
    })
    fetchData() 
    showToast('Dokumen berhasil dipindahkan ke Tong Sampah.', 'success')
  } catch (error) {
    console.error("Gagal menghapus:", error)
    showToast('Gagal memindahkan dokumen ke Tong Sampah.', 'error')
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

const filteredArsip = computed(() => {
  if (!searchQuery.value) return arsipList.value
  const q = searchQuery.value.toLowerCase()
  return arsipList.value.filter(item => {
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