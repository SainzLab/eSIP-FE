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

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari nama kategori atau deskripsi..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm transition-shadow"
        >
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-4 px-6 font-bold w-12 text-center">No</th>
              <th class="py-4 px-6 font-bold w-16 text-center"></th>
              <th class="py-4 px-6 font-bold">Nama Kategori</th>
              <th class="py-4 px-6 font-bold">Deskripsi</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-if="isLoading" class="text-center">
              <td colspan="5" class="py-8 text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p>Memuat data kategori...</p>
              </td>
            </tr>

            <tr v-else-if="paginatedCategories.length === 0" class="text-center">
              <td colspan="5" class="py-8 text-slate-400">
                <p>Belum ada kategori yang sesuai pencarian.</p>
              </td>
            </tr>

            <tr v-else v-for="(kat, index) in paginatedCategories" :key="kat.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="py-4 px-6 text-center text-slate-500 font-medium">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-4 px-6 text-center">
                <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                  <i class="fa-solid fa-folder text-lg"></i>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="font-bold text-slate-800">{{ kat.nama }}</span>
                <span v-if="kat.is_system" class="ml-2 text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase font-bold">Bawaan Sistem</span>
              </td>
              <td class="py-4 px-6">
                <p class="text-slate-500 text-xs line-clamp-1 italic">{{ kat.deskripsi || '-' }}</p>
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal('edit', kat)" class="w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" title="Edit Kategori">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    @click="deleteCategory(kat)" 
                    :disabled="kat.is_system"
                    :class="kat.is_system ? 'text-slate-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'"
                    class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" 
                    title="Hapus Kategori"
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
        <div>Menampilkan <span class="font-bold text-slate-700">{{ paginatedCategories.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> hingga <span class="font-bold text-slate-700">{{ Math.min(currentPage * itemsPerPage, filteredCategories.length) }}</span> dari <span class="font-bold text-slate-700">{{ filteredCategories.length }}</span> kategori</div>
        <div class="flex gap-1">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Prev</button>
          <span class="px-3 py-1.5 bg-emerald-600 text-white rounded-md font-bold shadow-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Next</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
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
              v-model="formData.nama" 
              type="text" 
              placeholder="Contoh: Arsip Kurikulum" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all"
              required
            >
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Deskripsi Singkat</label>
            <textarea 
              v-model="formData.deskripsi" 
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
              :disabled="isSaving"
              class="flex-1 px-4 py-2.5 bg-emerald-600 disabled:bg-slate-400 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-shadow shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
            >
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Data' }}
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
        <h3 class="font-bold text-slate-800 text-lg mb-2">Hapus Kategori?</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus kategori <br><span class="font-bold text-slate-700">"{{ itemToDelete?.nama }}"</span>?<br>
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Batal</button>
          <button @click="confirmDelete" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-red-200">Ya, Hapus</button>
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
import { ref, onMounted, computed, watch } from 'vue'
import pb from '../pb.js'

const showModal = ref(false)
const showDeleteModal = ref(false) 
const itemToDelete = ref(null)
const isEdit = ref(false)
const isLoading = ref(true)
const isSaving = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 15
const categories = ref([])

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const formData = ref({
  id: '',
  nama: '',
  deskripsi: ''
})

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const fetchCategories = async () => {
  isLoading.value = true
  try {
    const records = await pb.collection('kategori').getFullList({
      sort: 'is_system,-created', 
    })
    categories.value = records
  } catch (error) {
    console.error("Gagal mengambil data kategori:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
})

const openModal = (mode, data = null) => {
  isEdit.value = mode === 'edit'
  if (isEdit.value && data) {
    formData.value = { id: data.id, nama: data.nama, deskripsi: data.deskripsi }
  } else {
    formData.value = { id: '', nama: '', deskripsi: '' }
  }
  showModal.value = true
}

const saveCategory = async () => {
  isSaving.value = true
  try {
    if (isEdit.value) {
      await pb.collection('kategori').update(formData.value.id, {
        nama: formData.value.nama,
        deskripsi: formData.value.deskripsi
      })
      showToast('Kategori berhasil diperbarui!', 'success')
    } else {
      await pb.collection('kategori').create({
        nama: formData.value.nama,
        deskripsi: formData.value.deskripsi,
        is_system: false
      })
      showToast('Kategori baru berhasil ditambahkan!', 'success')
    }
    
    showModal.value = false
    fetchCategories() 
  } catch (error) {
    console.error("Gagal menyimpan kategori:", error)
    showToast('Gagal menyimpan data kategori!', 'error')
  } finally {
    isSaving.value = false
  }
}

const deleteCategory = (kat) => {
  // if (kat.is_system) {
  //   showToast("Kategori bawaan sistem tidak dapat dihapus!", 'error')
  //   return
  // }

  itemToDelete.value = kat
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return

  try {
    await pb.collection('kategori').delete(itemToDelete.value.id)
    fetchCategories() 
    showToast('Kategori berhasil dihapus.', 'success')
  } catch (error) {
    console.error("Gagal menghapus:", error)
    showToast('Gagal menghapus kategori. Pastikan Anda memiliki akses.', 'error')
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  const q = searchQuery.value.toLowerCase()
  return categories.value.filter(k => k.nama.toLowerCase().includes(q) || (k.deskripsi && k.deskripsi.toLowerCase().includes(q)))
})

const totalPages = computed(() => {
  return Math.ceil(filteredCategories.value.length / itemsPerPage) || 1
})

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredCategories.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

watch(searchQuery, () => {
  currentPage.value = 1
})
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