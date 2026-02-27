<template>
  <div class="flex flex-col gap-6 pb-10">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <i class="fa-solid fa-folder-tree text-emerald-500"></i>
          Kelola Kategori Kustom
        </h1>
        <p class="text-slate-500 text-sm mt-1">Tambahkan atau sesuaikan pengelompokan arsip sekolah Anda.</p>
      </div>
      <button 
        @click="openModal('add')"
        class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-100"
      >
        <i class="fa-solid fa-plus"></i> Kategori Baru
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-4 px-6 font-bold w-16 text-center">Ikon</th>
              <th class="py-4 px-6 font-bold">Nama Kategori</th>
              <th class="py-4 px-6 font-bold">Deskripsi</th>
              <th class="py-4 px-6 font-bold text-center">Jumlah Dokumen</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-for="(kat, index) in categories" :key="index" class="hover:bg-slate-50/50 transition-colors group">
              <td class="py-4 px-6 text-center">
                <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <i :class="kat.icon" class="text-lg"></i>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-bold text-slate-800">{{ kat.title }}</span>
              </td>
              <td class="py-4 px-6">
                <p class="text-slate-500 text-xs line-clamp-1 italic">{{ kat.description }}</p>
              </td>
              <td class="py-4 px-6 text-center">
                <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold">
                  {{ kat.count }} Items
                </span>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal('edit', kat)" class="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button @click="deleteCategory(index)" class="w-8 h-8 rounded-lg text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Kategori</label>
            <input 
              v-model="formData.title" 
              type="text" 
              placeholder="Contoh: Arsip Kurikulum" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
              required
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ikon (FontAwesome Class)</label>
            <div class="flex gap-2">
              <input 
                v-model="formData.icon" 
                type="text" 
                placeholder="fa-solid fa-folder" 
                class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
                required
              >
              <div class="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-emerald-600 border border-slate-200">
                <i :class="formData.icon"></i>
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deskripsi Singkat</label>
            <textarea 
              v-model="formData.description" 
              rows="3"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
              placeholder="Jelaskan isi kategori ini..."
            ></textarea>
          </div>

          <div class="pt-2 flex gap-3">
            <button 
              type="button" 
              @click="showModal = false"
              class="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-shadow shadow-md shadow-emerald-100"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const isEdit = ref(false)
const selectedIndex = ref(null)

const categories = ref([
  { title: 'Dokumen Kepala Sekolah', description: 'Arsip rahasia dan laporan manajerial khusus.', icon: 'fa-solid fa-user-tie', count: 45 },
  { title: 'Arsip PPDB 2025/2026', description: 'Kumpulan berkas pendaftaran siswa baru.', icon: 'fa-solid fa-users-rectangle', count: 850 },
  { title: 'Portofolio Guru A', description: 'Dokumen RPP dan sertifikasi guru.', icon: 'fa-solid fa-chalkboard-user', count: 112 },
])

const formData = ref({
  title: '',
  icon: 'fa-solid fa-folder',
  description: ''
})

const openModal = (mode, data = null) => {
  isEdit.value = mode === 'edit'
  if (isEdit.value && data) {
    formData.value = { ...data }
    selectedIndex.value = categories.value.indexOf(data)
  } else {
    formData.value = { title: '', icon: 'fa-solid fa-folder', description: '' }
  }
  showModal.value = true
}

const saveCategory = () => {
  if (isEdit.value) {
    categories.value[selectedIndex.value] = { ...formData.value, count: categories.value[selectedIndex.value].count }
  } else {
    categories.value.push({ ...formData.value, count: 0 })
  }
  showModal.value = false
}

const deleteCategory = (index) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori ini? Semua arsip di dalamnya akan kehilangan label kategorinya.')) {
    categories.value.splice(index, 1)
  }
}
</script>