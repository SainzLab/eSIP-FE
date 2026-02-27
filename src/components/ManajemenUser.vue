<template>
  <div class="flex flex-col gap-6 pb-10">
    
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-users-gear text-indigo-600"></i>
          Manajemen Pengguna
        </h1>
        <p class="text-slate-500 text-sm mt-1">Kelola akun pegawai dan atur tingkat akses sistem.</p>
      </div>
      <button 
        @click="openModal('add')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
      >
        <i class="fa-solid fa-user-plus"></i> Tambah Pengguna
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
              <th class="py-4 px-6 font-bold">Identitas Pengguna</th>
              <th class="py-4 px-6 font-bold">Role / Peran</th>
              <th class="py-4 px-6 font-bold">Status</th>
              <th class="py-4 px-6 font-bold">Login Terakhir</th>
              <th class="py-4 px-6 font-bold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-for="(user, index) in users" :key="index" class="hover:bg-slate-50/50 transition-colors group">
              <td class="py-4 px-6">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-inner">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800">{{ user.name }}</span>
                    <span class="text-xs text-slate-400">{{ user.email }}</span>
                  </div>
                </div>
              </td>
              <td class="py-4 px-6">
                <span :class="getRoleClass(user.role)" class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-slate-600 font-medium">Aktif</span>
                </div>
              </td>
              <td class="py-4 px-6 text-slate-500 text-xs">
                {{ user.lastLogin }}
              </td>
              <td class="py-4 px-6 text-right">
                <div class="flex justify-end gap-2">
                  <button @click="openModal('edit', user)" class="text-slate-400 hover:text-blue-600 p-1 transition-colors">
                    <i class="fa-solid fa-user-pen"></i>
                  </button>
                  <button @click="deleteUser(index)" class="text-slate-400 hover:text-red-600 p-1 transition-colors">
                    <i class="fa-solid fa-user-xmark"></i>
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
      <div class="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ isEdit ? 'Update Akun' : 'Registrasi Akun Baru' }}
          </h3>
        </div>

        <form @submit.prevent="saveUser" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nama Lengkap</label>
            <input v-model="formData.name" type="text" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email / Username</label>
            <input v-model="formData.email" type="email" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Role Pengguna</label>
            <select v-model="formData.role" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
              <option value="Admin">Admin</option>
              <option value="Petugas">Petugas Arsip</option>
              <option value="Kepala Sekolah">Kepala Sekolah</option>
              <option value="Guru">Guru</option>
            </select>
          </div>
          <div v-if="!isEdit">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Password Sementara</label>
            <input v-model="formData.password" type="password" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
          </div>
          
          <div class="pt-4 flex gap-3">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 text-slate-600 font-bold text-sm">Batal</button>
            <button type="submit" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md">Simpan User</button>
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
const users = ref([
  { name: 'Ahmad Faisal', email: 'ahmad@smpn1.sch.id', role: 'Admin', lastLogin: '10 Menit yang lalu' },
  { name: 'Siti Aminah', email: 'siti@smpn1.sch.id', role: 'Petugas', lastLogin: '2 Jam yang lalu' },
  { name: 'Drs. Mulyadi', email: 'kepsek@smpn1.sch.id', role: 'Kepala Sekolah', lastLogin: 'Kemarin' },
])

const formData = ref({ name: '', email: '', role: 'Petugas', password: '' })

const getRoleClass = (role) => {
  switch(role) {
    case 'Admin': return 'bg-purple-100 text-purple-700'
    case 'Kepala Sekolah': return 'bg-amber-100 text-amber-700'
    case 'Petugas': return 'bg-blue-100 text-blue-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const openModal = (mode, data = null) => {
  isEdit.value = mode === 'edit'
  if (isEdit.value && data) {
    formData.value = { ...data }
  } else {
    formData.value = { name: '', email: '', role: 'Petugas', password: '' }
  }
  showModal.value = true
}

const saveUser = () => {
  if (!isEdit.value) {
    users.value.push({ ...formData.value, lastLogin: 'Baru mendaftar' })
  }
  showModal.value = false
}

const deleteUser = (index) => {
  if (confirm('Hapus akses pengguna ini?')) users.value.splice(index, 1)
}
</script>