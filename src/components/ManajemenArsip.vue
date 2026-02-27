<template>
  <div class="flex flex-col gap-6 relative">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Manajemen Arsip</h1>
        <p class="text-slate-500 text-sm mt-1">Kelola semua dokumen surat masuk, keluar, SK, dan disposisi.</p>
      </div>
      <button @click="showAddModal = true" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center">
        <i class="fa-solid fa-plus"></i> Tambah Arsip
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="relative w-full sm:w-72">
          <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari no. surat atau perihal..." 
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-shadow"
          >
        </div>
        <select v-model="filterKategori" class="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-sm text-slate-600 w-full sm:w-auto bg-white cursor-pointer transition-shadow">
          <option value="">Semua Kategori</option>
          <option value="Surat Masuk">Surat Masuk</option>
          <option value="Surat Keluar">Surat Keluar</option>
          <option value="SK">Surat Keputusan (SK)</option>
          <option value="Disposisi">Disposisi</option>
        </select>
      </div>
      
      <button class="text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
        <i class="fa-solid fa-file-export"></i> Export Excel
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Nomor Surat</th>
              <th class="py-3.5 px-4 font-semibold">Perihal</th>
              <th class="py-3.5 px-4 font-semibold">Kategori</th>
              <th class="py-3.5 px-4 font-semibold">Tanggal</th>
              <th class="py-3.5 px-4 font-semibold text-center">File</th>
              <th class="py-3.5 px-4 font-semibold text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="filteredArsip.length === 0">
            <tr>
              <td colspan="7" class="py-8 text-center text-slate-400">
                Tidak ada dokumen yang sesuai dengan pencarian.
              </td>
            </tr>
          </tbody>
          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in filteredArsip" :key="index" class="hover:bg-slate-50 transition-colors group">
              <td class="py-3 px-4 text-center text-slate-500">{{ index + 1 }}</td>
              <td class="py-3 px-4 font-semibold text-slate-800">{{ item.noSurat }}</td>
              <td class="py-3 px-4 text-slate-600">{{ item.perihal }}</td>
              <td class="py-3 px-4">
                <span :class="item.badgeClass" class="px-2.5 py-1 rounded-md text-xs font-semibold border">
                  {{ item.kategori }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-500">{{ item.tanggal }}</td>
              <td class="py-3 px-4 text-center">
                <button class="text-slate-300 hover:text-red-500 transition-colors" title="Lihat PDF">
                  <i class="fa-solid fa-file-pdf text-xl"></i>
                </button>
              </td>
              <td class="py-3 px-4">
                <div class="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="w-8 h-8 rounded text-blue-600 hover:bg-blue-100 transition-colors flex items-center justify-center" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="hapusArsip(index)" class="w-8 h-8 rounded text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center" title="Hapus">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>Menampilkan <span class="font-medium text-slate-700">{{ filteredArsip.length > 0 ? 1 : 0 }}</span> hingga <span class="font-medium text-slate-700">{{ filteredArsip.length }}</span> dari <span class="font-medium text-slate-700">{{ arsipData.length }}</span> arsip</div>
        <div class="flex gap-1">
          <button class="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 cursor-not-allowed" disabled>Prev</button>
          <button class="px-3 py-1.5 bg-blue-600 text-white rounded-md font-medium shadow-sm">1</button>
          <button class="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-400 cursor-not-allowed" disabled>Next</button>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-lg text-slate-800">Tambah Arsip Baru</h3>
          <button @click="closeModal" class="text-slate-400 hover:text-red-500 transition-colors">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nomor Surat</label>
            <input v-model="form.noSurat" type="text" placeholder="Contoh: 010/SK/II/2026" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Perihal</label>
            <input v-model="form.perihal" type="text" placeholder="Masukkan perihal surat..." class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
              <select v-model="form.kategori" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm bg-white">
                <option value="Surat Masuk">Surat Masuk</option>
                <option value="Surat Keluar">Surat Keluar</option>
                <option value="SK">Surat Keputusan (SK)</option>
                <option value="Disposisi">Disposisi</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
              <input v-model="form.tanggal" type="date" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-600">
            </div>
          </div>
          
          <div class="mt-2">
            <label class="block text-sm font-medium text-slate-700 mb-2">Upload File (PDF)</label>
            <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-blue-500 transition-colors relative bg-slate-50 group">
              <div class="space-y-2 text-center">
                <i v-if="!form.fileName" class="fa-solid fa-file-pdf text-4xl text-slate-300 group-hover:text-blue-400 transition-colors"></i>
                <i v-else class="fa-solid fa-file-circle-check text-4xl text-green-500"></i>
                
                <div class="flex flex-col items-center text-sm text-slate-600">
                  <label for="file-upload" class="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
                    <span v-if="!form.fileName">Pilih file PDF</span>
                    <span v-else class="text-green-600">{{ form.fileName }}</span>
                    <input id="file-upload" type="file" class="sr-only" accept="application/pdf" @change="handleFileUpload">
                  </label>
                  <p class="pl-1 mt-1" v-if="!form.fileName">atau drag and drop di sini</p>
                </div>
                <p class="text-xs text-slate-500" v-if="!form.fileName">Maksimal 5MB</p>
                
                <button v-if="form.fileName" @click="hapusFile" class="text-xs text-red-500 hover:text-red-700 mt-2 font-medium">
                  Hapus File
                </button>
              </div>
            </div>
          </div>

        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Batal</button>
          <button @click="simpanArsip" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Simpan Data
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const filterKategori = ref('')
const showAddModal = ref(false)

const form = ref({
  noSurat: '',
  perihal: '',
  kategori: 'Surat Masuk',
  tanggal: '',
  file: null,
  fileName: ''
})

const arsipData = ref([
  { noSurat: '001/SK/II/2026', perihal: 'Undangan Rapat Koordinasi', kategori: 'Surat Masuk', tanggal: '26 Feb 2026', badgeClass: 'bg-green-50 text-green-600 border-green-200' },
  { noSurat: '045/ND/II/2026', perihal: 'Pengajuan Anggaran IT', kategori: 'Surat Keluar', tanggal: '25 Feb 2026', badgeClass: 'bg-blue-50 text-blue-600 border-blue-200' },
  { noSurat: '089/SP/II/2026', perihal: 'Surat Perintah Tugas', kategori: 'Disposisi', tanggal: '24 Feb 2026', badgeClass: 'bg-orange-50 text-orange-600 border-orange-200' },
  { noSurat: '112/SK/II/2026', perihal: 'Pengangkatan Pegawai Baru', kategori: 'SK', tanggal: '20 Feb 2026', badgeClass: 'bg-purple-50 text-purple-600 border-purple-200' },
  { noSurat: '012/SE/II/2026', perihal: 'Edaran Cuti Bersama', kategori: 'Surat Masuk', tanggal: '18 Feb 2026', badgeClass: 'bg-green-50 text-green-600 border-green-200' },
])

const filteredArsip = computed(() => {
  return arsipData.value.filter(item => {
    const matchSearch = item.noSurat.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                        item.perihal.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchKategori = filterKategori.value === '' || item.kategori === filterKategori.value
    return matchSearch && matchKategori
  })
})

const getBadgeClass = (kategori) => {
  switch (kategori) {
    case 'Surat Masuk': return 'bg-green-50 text-green-600 border-green-200'
    case 'Surat Keluar': return 'bg-blue-50 text-blue-600 border-blue-200'
    case 'SK': return 'bg-purple-50 text-purple-600 border-purple-200'
    case 'Disposisi': return 'bg-orange-50 text-orange-600 border-orange-200'
    default: return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const formatTanggal = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      alert('Maaf, hanya file PDF yang diperbolehkan!')
      event.target.value = ''
      return
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB.')
      event.target.value = ''
      return
    }

    form.value.file = file
    form.value.fileName = file.name
  }
}

const hapusFile = () => {
  form.value.file = null
  form.value.fileName = ''
}

const closeModal = () => {
  showAddModal.value = false
  form.value = { noSurat: '', perihal: '', kategori: 'Surat Masuk', tanggal: '', file: null, fileName: '' }
}

const simpanArsip = () => {
  if (!form.value.noSurat || !form.value.perihal) {
    alert("Nomor surat dan perihal harus diisi!")
    return
  }
  
  if (!form.value.file) {
    alert("Silakan upload file PDF terlebih dahulu!")
    return
  }

  arsipData.value.unshift({
    noSurat: form.value.noSurat,
    perihal: form.value.perihal,
    kategori: form.value.kategori,
    tanggal: form.value.tanggal ? formatTanggal(form.value.tanggal) : 'Hari Ini',
    badgeClass: getBadgeClass(form.value.kategori)
  })

  closeModal()
}

const hapusArsip = (index) => {
  if (confirm('Apakah Anda yakin ingin menghapus arsip ini?')) {
    arsipData.value.splice(index, 1)
  }
}
</script>