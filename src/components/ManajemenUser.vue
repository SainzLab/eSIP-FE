<template>
  <div class="flex flex-col gap-6 pb-10 relative">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-users-gear text-indigo-600"></i>
          Manajemen Pengguna
        </h1>
        <p class="text-slate-500 text-sm mt-1">Kelola akun pegawai, bidang, dan atur tingkat akses sistem.</p>
      </div>
      <button 
        @click="openModal('add')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
      >
        <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:w-96">
        <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Cari nama, email, atau bidang..." 
          class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-shadow"
        >
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-4 px-6 font-bold w-12 text-center">No</th>
              <th class="py-4 px-6 font-bold">Identitas Pengguna</th>
              <th class="py-4 px-6 font-bold">Bidang / Bagian</th>
              <th class="py-4 px-6 font-bold">Role / Peran</th>
              <th class="py-4 px-6 font-bold">Update Terakhir</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-if="isLoading" class="text-center">
              <td colspan="6" class="py-8 text-slate-400">
                <i class="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p>Memuat data pengguna...</p>
              </td>
            </tr>

            <tr v-else-if="paginatedUsers.length === 0" class="text-center">
              <td colspan="6" class="py-8 text-slate-400">
                <p>Tidak ada pengguna yang cocok dengan pencarian.</p>
              </td>
            </tr>

            <tr v-else v-for="(user, index) in paginatedUsers" :key="user.id" class="hover:bg-slate-50/50 transition-colors group">
              <td class="py-4 px-6 text-center text-slate-500 font-medium">
                 {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner shrink-0 uppercase">
                    {{ user.name ? user.name.charAt(0) : 'U' }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 whitespace-nowrap">{{ user.name }}</span>
                    <span class="text-xs text-slate-400">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span class="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 whitespace-nowrap">
                  {{ user.bidang || '-' }}
                </span>
              </td>
              <td class="py-4 px-6">
                <span :class="getRoleClass(user.role)" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight whitespace-nowrap">
                  {{ user.role || 'Staff' }}
                </span>
              </td>
              <td class="py-4 px-6 text-slate-500 text-xs">
                {{ formatDate(user.updated) }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openResetModal(user)" class="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 flex items-center justify-center transition-colors" title="Reset Password">
                    <i class="fa-solid fa-key"></i>
                  </button>
                  <button @click="openModal('edit', user)" class="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors" title="Edit Akun">
                    <i class="fa-solid fa-user-pen"></i>
                  </button>
                  <button @click="deleteUser(user)" class="w-8 h-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" title="Hapus Akun">
                    <i class="fa-solid fa-user-xmark"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!isLoading" class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50">
        <div>Menampilkan <span class="font-bold text-slate-700">{{ paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> hingga <span class="font-bold text-slate-700">{{ Math.min(currentPage * itemsPerPage, filteredUsers.length) }}</span> dari <span class="font-bold text-slate-700">{{ filteredUsers.length }}</span> pengguna</div>
        <div class="flex gap-1">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Prev</button>
          <span class="px-3 py-1.5 bg-indigo-600 text-white rounded-md font-bold shadow-sm">{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium">Next</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ isEdit ? 'Update Akun' : 'Registrasi Akun Baru' }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap</label>
            <input v-model="formData.name" type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email / Username</label>
            <input v-model="formData.email" type="email" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required :disabled="isEdit">
            <p v-if="isEdit" class="text-[10px] text-slate-400 mt-1">*Email tidak dapat diubah setelah dibuat.</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role Pengguna</label>
              <select v-model="formData.role" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer">
                <option value="Petugas Arsip">Petugas Arsip (Admin)</option>
                <option value="Kepala Sekolah">Kepala Sekolah</option>
                <option value="Staff">Staff / Guru</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Bidang / Bagian</label>
              <select 
                v-model="formData.bidang" 
                :disabled="formData.role !== 'Staff'"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed transition-all"
              >
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
          
          <div v-if="!isEdit" class="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Masukan Password</label>
              <input v-model="formData.password" type="password" minlength="8" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Konfirmasi Password</label>
              <input v-model="formData.confirmPassword" type="password" minlength="8" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all" required>
            </div>
          </div>

          <p v-if="passwordError" class="text-xs text-red-500 font-bold flex items-center gap-1 bg-red-50 p-2 rounded-lg">
            <i class="fa-solid fa-circle-exclamation"></i> {{ passwordError }}
          </p>
          
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Menyimpan...' : 'Simpan User' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showResetModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showResetModal = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-6 text-center border-b border-slate-100">
          <div class="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-4 border-amber-100">
            <i class="fa-solid fa-key"></i>
          </div>
          <h3 class="font-bold text-slate-800 text-lg">Reset Password</h3>
          <p class="text-xs text-slate-500 mt-1">Ganti password untuk <span class="font-bold text-slate-700">{{ userToReset?.name }}</span></p>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password Baru</label>
            <input 
              v-model="newPasswordInput" 
              type="text" 
              placeholder="Minimal 8 karakter" 
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 text-sm transition-all"
            >
          </div>
          <p v-if="resetPasswordError" class="text-xs text-red-500 font-bold"><i class="fa-solid fa-circle-exclamation"></i> {{ resetPasswordError }}</p>

          <div class="flex gap-3 pt-2">
            <button @click="showResetModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm">Batal</button>
            <button @click="confirmResetPassword" class="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-md shadow-amber-200 text-sm flex justify-center items-center gap-2">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Memproses...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-4 border-red-100">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-2">Hapus Pengguna?</h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          Apakah Anda yakin ingin menghapus akses untuk <br><span class="font-bold text-slate-700">"{{ itemToDelete?.name }}"</span>?<br>Tindakan ini tidak dapat dibatalkan.
        </p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Batal</button>
          <button @click="confirmDeleteUser" class="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-md shadow-red-200">Ya, Hapus</button>
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
import { ref, computed, watch, onMounted } from 'vue'
import pb from '../pb.js'

const showModal = ref(false)
const isEdit = ref(false)
const passwordError = ref('')
const isLoading = ref(true)
const isSaving = ref(false)
const searchQuery = ref('') 
const currentPage = ref(1)
const itemsPerPage = 15
const users = ref([])

const showDeleteModal = ref(false)
const itemToDelete = ref(null)

const showResetModal = ref(false)
const userToReset = ref(null)
const newPasswordInput = ref('')
const resetPasswordError = ref('')

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const formData = ref({ 
  id: '', 
  name: '', 
  email: '', 
  role: 'Staff', 
  bidang: 'Tata Usaha', 
  password: '', 
  confirmPassword: '' 
})

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

watch(() => formData.value.role, (newRole) => {
  if (newRole === 'Kepala Sekolah') {
    formData.value.bidang = 'Pimpinan'
  } else if (newRole === 'Petugas Arsip') {
    formData.value.bidang = 'Tata Usaha'
  }
})

const getRoleClass = (role) => {
  switch(role) {
    case 'Petugas Arsip': return 'bg-purple-100 text-purple-700'
    case 'Kepala Sekolah': return 'bg-amber-100 text-amber-700'
    case 'Staff': return 'bg-blue-100 text-blue-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const records = await pb.collection('users').getFullList({
      sort: '-created',
    })
    users.value = records
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const openModal = (mode, data = null) => {
  isEdit.value = mode === 'edit'
  passwordError.value = '' 

  if (isEdit.value && data) {
    formData.value = { 
      id: data.id,
      name: data.name, 
      email: data.email, 
      role: data.role, 
      bidang: data.bidang,
      password: '', 
      confirmPassword: '' 
    }
  } else {
    formData.value = { id: '', name: '', email: '', role: 'Staff', bidang: 'Tata Usaha', password: '', confirmPassword: '' }
  }
  showModal.value = true
}

const saveUser = async () => {
  passwordError.value = ''
  isSaving.value = true

  try {
    if (!isEdit.value) {
      if (formData.value.password !== formData.value.confirmPassword) {
        passwordError.value = 'Password dan Konfirmasi Password tidak sama!'
        isSaving.value = false
        return
      }

      await pb.collection('users').create({
        email: formData.value.email,
        emailVisibility: true,
        password: formData.value.password,
        passwordConfirm: formData.value.confirmPassword,
        name: formData.value.name,
        role: formData.value.role,
        bidang: formData.value.bidang
      })
      showToast('Pengguna baru berhasil ditambahkan!', 'success')
    } else {
      await pb.collection('users').update(formData.value.id, {
        name: formData.value.name,
        role: formData.value.role,
        bidang: formData.value.bidang
      })
      showToast('Data pengguna berhasil diperbarui!', 'success')
    }

    showModal.value = false
    fetchUsers() 

  } catch (error) {
    console.error("Gagal menyimpan:", error)
    passwordError.value = 'Terjadi kesalahan! Pastikan format email benar dan belum digunakan.'
  } finally {
    isSaving.value = false
  }
}

const openResetModal = (user) => {
  userToReset.value = user
  newPasswordInput.value = ''
  resetPasswordError.value = ''
  showResetModal.value = true
}

const confirmResetPassword = async () => {
  if (newPasswordInput.value.trim().length < 8) {
    resetPasswordError.value = 'Password harus minimal 8 karakter.'
    return
  }

  isSaving.value = true
  resetPasswordError.value = ''

  try {
    await pb.send('/api/admin/reset-password', {
      method: 'POST',
      body: {
        targetUserId: userToReset.value.id,
        newPassword: newPasswordInput.value
      }
    })
    
    showToast(`Password untuk ${userToReset.value.name} telah direset.`, 'success')
    showResetModal.value = false
  } catch (error) {
    console.error("Gagal reset password:", error)
    resetPasswordError.value = error?.response?.message || 'Gagal mereset password.'
  } finally {
    isSaving.value = false
  }
}

const deleteUser = (user) => {
  itemToDelete.value = user
  showDeleteModal.value = true
}

const confirmDeleteUser = async () => {
  if (!itemToDelete.value) return

  try {
    await pb.collection('users').delete(itemToDelete.value.id)
    fetchUsers() 
    showToast('Akses pengguna berhasil dihapus.', 'success')
  } catch (error) {
    console.error("Gagal menghapus:", error)
    showToast('Gagal menghapus pengguna. Cek izin API Rules.', 'error')
  } finally {
    showDeleteModal.value = false
    itemToDelete.value = null
  }
}

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  const q = searchQuery.value.toLowerCase()
  return users.value.filter(u => {
    return (u.name && u.name.toLowerCase().includes(q)) || 
           (u.email && u.email.toLowerCase().includes(q)) ||
           (u.bidang && u.bidang.toLowerCase().includes(q))
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage) || 1
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
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