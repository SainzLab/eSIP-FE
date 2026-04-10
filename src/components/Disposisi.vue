<template>
  <div class="flex flex-col gap-6 relative pb-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Lembar Disposisi</h1>
        <p class="text-slate-500 text-sm mt-1">Pantau instruksi pimpinan dan tindak lanjut surat.</p>
      </div>
      <button 
        v-if="userRole === 'Petugas Arsip' || userRole === 'Arsiparis' || userRole === 'Kepala Sekolah'"
        @click="openModal('create')"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center"
      >
        <i class="fa-solid fa-file-circle-plus"></i> Buat Disposisi
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="relative w-full sm:w-80">
          <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari perihal surat atau instruksi..." 
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
          >
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Surat & Instruksi</th>
              <th class="py-3.5 px-4 font-semibold">Posisi Surat (Bidang)</th>
              <th class="py-3.5 px-4 font-semibold text-center">Sifat & Batas Waktu</th>
              <th class="py-3.5 px-4 font-semibold text-center">Status</th>
              <th class="py-3.5 px-4 font-semibold text-center w-32">Aksi</th>
            </tr>
          </thead>
          
          <tbody v-if="isLoading">
            <tr><td colspan="6" class="py-10 text-center text-slate-400"><i class="fa-solid fa-spinner fa-spin text-2xl mb-2"></i><br>Memuat disposisi...</td></tr>
          </tbody>
          <tbody v-else-if="paginatedDisposisi.length === 0">
            <tr><td colspan="6" class="py-10 text-center text-slate-400">Belum ada data disposisi yang relevan.</td></tr>
          </tbody>

          <tbody v-else class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in paginatedDisposisi" :key="item.id" class="hover:bg-slate-50 transition-colors group" :class="item.status === 'Selesai' ? 'opacity-60' : ''">
              <td class="py-4 px-4 text-center text-slate-500">
                {{ (currentPage - 1) * itemsPerPage + index + 1 }}
              </td>
              
              <td class="py-4 px-4 whitespace-normal min-w-[250px]">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800">{{ item.expand?.arsip_id?.no_surat || 'Tanpa Nomor' }}</span>
                  <span class="text-xs text-slate-500 mb-1">{{ item.expand?.arsip_id?.judul }}</span>
                  <span v-if="item.instruksi" class="text-xs text-indigo-600 font-medium bg-indigo-50 p-1.5 rounded border border-indigo-100 mt-1">
                    <i class="fa-solid fa-comment-dots mr-1"></i> "{{ item.instruksi }}"
                  </span>
                </div>
              </td>
              
              <td class="py-4 px-4 text-slate-600 font-bold uppercase text-xs tracking-wider">
                <i class="fa-solid fa-building text-slate-400 mr-1"></i> {{ item.tujuan_bidang }}
              </td>
              
              <td class="py-4 px-4 text-center">
                <div class="flex flex-col items-center gap-1">
                  <span v-if="item.sifat" :class="getSifatClass(item.sifat)" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {{ item.sifat }}
                  </span>
                  <span v-else class="text-slate-400 text-xs">-</span>
                  <span class="text-slate-500 text-xs font-medium">{{ formatDate(item.batas_waktu) }}</span>
                </div>
              </td>

              <td class="py-4 px-4 text-center">
                <span :class="getStatusClass(item.status)" class="px-3 py-1 rounded-full text-xs font-bold border">
                  {{ item.status }}
                </span>
              </td>

              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <a v-if="item.expand?.arsip_id?.file_dokumen" :href="getFileUrl(item.expand.arsip_id)" target="_blank" class="w-8 h-8 rounded bg-slate-100 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors" title="Lihat Surat">
                    <i class="fa-solid fa-file-pdf"></i>
                  </a>

                  <button v-if="userRole === 'Kepala Sekolah' && item.status === 'Menunggu Instruksi'" @click="openModal('forward', item)" class="w-8 h-8 rounded bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Beri Instruksi">
                    <i class="fa-solid fa-share"></i>
                  </button>

                  <button v-if="userRole === 'Kepala Sekolah' && item.status !== 'Menunggu Instruksi'" @click="openModal('edit', item)" class="w-8 h-8 rounded bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Edit Instruksi">
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>

                  <button v-if="userRole === 'Staff' && item.status === 'Diproses'" @click="selesaikanDisposisi(item)" class="w-8 h-8 rounded bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-colors shadow-sm" title="Tandai Selesai">
                    <i class="fa-solid fa-check"></i>
                  </button>

                  <button v-if="(userRole === 'Petugas Arsip' || userRole === 'Arsiparis')" @click="hapusDisposisi(item)" class="w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" title="Batalkan Disposisi">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 bg-slate-50">
        <div>Menampilkan <span class="font-bold text-slate-700">{{ paginatedDisposisi.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }}</span> hingga <span class="font-bold text-slate-700">{{ Math.min(currentPage * itemsPerPage, sortedDisposisi.length) }}</span> dari <span class="font-bold text-slate-700">{{ sortedDisposisi.length }}</span> disposisi</div>
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
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <h3 class="font-bold text-slate-800 text-lg">
            {{ modalMode === 'create' ? 'Mulai Disposisi Baru' : (modalMode === 'edit' ? 'Revisi Instruksi' : 'Instruksi Kepala Sekolah') }}
          </h3>
          <button @click="showModal = false" class="text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form @submit.prevent="saveDisposisi" class="p-6 space-y-4">
          <div v-if="modalMode === 'create'">
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Pilih Surat Masuk (Hanya PDF)</label>
            <select v-model="formData.arsip_id" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
              <option value="" disabled>-- Pilih Dokumen Arsip PDF --</option>
              <option v-for="arsip in opsiArsip" :key="arsip.id" :value="arsip.id">
                {{ arsip.no_surat || 'Tanpa No' }} - {{ arsip.judul }}
              </option>
            </select>
            <p v-if="userRole !== 'Kepala Sekolah'" class="text-xs text-amber-600 mt-2"><i class="fa-solid fa-info-circle"></i> Surat akan otomatis diteruskan ke Pimpinan untuk menunggu instruksi.</p>
          </div>

          <div v-if="modalMode === 'forward' || modalMode === 'edit' || (modalMode === 'create' && userRole === 'Kepala Sekolah')">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Teruskan Ke Bidang</label>
              <select v-model="formData.tujuan_bidang" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
                <option value="" disabled>-- Pilih Bidang Tujuan --</option>
                <option value="Tata Usaha">Tata Usaha</option>
                <option value="Kesiswaan">Kesiswaan</option>
                <option value="Kepegawaian">Kepegawaian</option>
                <option value="Keuangan">Keuangan</option>
                <option value="Kurikulum">Kurikulum</option>
                <option value="Sarana dan prasarana">Sarana dan Prasarana</option>
                <option value="Humas">Humas</option>
                <option value="Dapodik">Dapodik</option>
              </select>
            </div>
            
            <div class="mt-4">
              <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Isi Instruksi / Arahan</label>
              <textarea v-model="formData.instruksi" rows="3" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="Contoh: Segera tindak lanjuti dan buat laporannya." required></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Sifat Disposisi</label>
                <select v-model="formData.sifat" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Segera">Segera</option>
                  <option value="Rahasia">Rahasia</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase mb-1.5">Batas Waktu (Deadline)</label>
                <input v-model="formData.batas_waktu" type="date" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm" required>
              </div>
            </div>
          </div>
          
          <div class="pt-4 flex gap-3 mt-4 border-t border-slate-100">
            <button type="button" @click="showModal = false" class="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold text-sm hover:bg-slate-50 transition-colors">Batal</button>
            <button type="submit" :disabled="isSaving" class="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2 disabled:bg-slate-400">
              <i v-if="isSaving" class="fa-solid fa-spinner fa-spin"></i>
              {{ isSaving ? 'Menyimpan...' : (modalMode === 'edit' ? 'Update Instruksi' : 'Simpan Disposisi') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showConfirmModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="showConfirmModal = false"></div>
      <div class="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-200">
        <div :class="confirmAction === 'delete' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-500 border-emerald-100'" class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border-4">
          <i :class="confirmAction === 'delete' ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check'"></i>
        </div>
        <h3 class="font-bold text-slate-800 text-lg mb-2">
          {{ confirmAction === 'delete' ? 'Cabut Disposisi?' : 'Selesaikan Instruksi?' }}
        </h3>
        <p class="text-slate-500 text-sm mb-6 leading-relaxed">
          {{ confirmAction === 'delete' 
             ? 'Apakah Anda yakin ingin mencabut dan menghapus lembar disposisi ini?' 
             : 'Apakah instruksi pimpinan pada surat ini sudah Anda selesaikan?' }}
        </p>
        <div class="flex gap-3">
          <button @click="showConfirmModal = false" class="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Batal</button>
          <button @click="executeConfirm" :class="confirmAction === 'delete' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'" class="flex-1 py-2.5 text-white font-bold rounded-lg transition-colors shadow-md">
            {{ confirmAction === 'delete' ? 'Ya, Cabut' : 'Ya, Selesai' }}
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
import { ref, computed, onMounted, watch } from 'vue'
import pb from '../pb.js'

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const isLoading = ref(true)
const isSaving = ref(false)
const showModal = ref(false)
const modalMode = ref('create') 
const searchQuery = ref('')

const showConfirmModal = ref(false)
const confirmAction = ref('')
const itemToConfirm = ref(null)

const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

const currentPage = ref(1)
const itemsPerPage = 15

const disposisiList = ref([])
const opsiArsip = ref([])

const formData = ref({
  id: '',
  arsip_id: '',
  tujuan_bidang: 'Pimpinan',
  instruksi: '',
  sifat: 'Biasa',
  batas_waktu: '',
  status: 'Menunggu Instruksi'
})

const showToast = (message, type = 'success') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 4000)
}

const getSifatClass = (sifat) => {
  switch(sifat) {
    case 'Segera': return 'bg-red-100 text-red-700'
    case 'Penting': return 'bg-blue-100 text-blue-700'
    case 'Rahasia': return 'bg-purple-100 text-purple-700'
    default: return 'bg-slate-100 text-slate-600'
  }
}

const getStatusClass = (status) => {
  switch(status) {
    case 'Menunggu Instruksi': return 'bg-slate-50 text-slate-600 border-slate-200'
    case 'Diproses': return 'bg-amber-50 text-amber-600 border-amber-200'
    case 'Selesai': return 'bg-emerald-50 text-emerald-600 border-emerald-200'
    default: return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

const getFileUrl = (arsip) => {
  return `${pb.baseUrl}/api/files/${arsip.collectionId}/${arsip.id}/${arsip.file_dokumen}`
}

const fetchDisposisi = async () => {
  isLoading.value = true
  try {
    let filterQuery = ''
    
    if (userRole.value === 'Petugas Arsip' || userRole.value === 'Arsiparis' || userRole.value === 'Kepala Sekolah') {
      filterQuery = '' 
    } else {
      filterQuery = `tujuan_bidang = "${userBidang.value}" && status != "Menunggu Instruksi"`
    }

    const records = await pb.collection('disposisi').getFullList({
      filter: filterQuery,
      sort: '-created',
      expand: 'arsip_id'
    })
    
    disposisiList.value = records
  } catch (error) {
    console.error("Gagal menarik data disposisi:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDisposisi()
})

const openModal = async (mode, data = null) => {
  modalMode.value = mode
  
  if (mode === 'create') {
    try {
      const arsip = await pb.collection('arsip').getFullList({ 
        filter: 'is_deleted != true && file_dokumen ~ ".pdf"', 
        sort: '-created' 
      })
      opsiArsip.value = arsip
    } catch (e) { console.error(e) }

    formData.value = { 
      id: '', 
      arsip_id: '', 
      tujuan_bidang: userRole.value === 'Kepala Sekolah' ? '' : 'Pimpinan', 
      instruksi: '', 
      sifat: 'Biasa', 
      batas_waktu: new Date().toISOString().substring(0, 10), 
      status: userRole.value === 'Kepala Sekolah' ? 'Diproses' : 'Menunggu Instruksi' 
    }
  } else if (mode === 'forward' && data) {
    formData.value = {
      id: data.id,
      tujuan_bidang: '', 
      instruksi: '',
      sifat: 'Biasa',
      batas_waktu: new Date().toISOString().substring(0, 10), 
      status: 'Diproses' 
    }
  } else if (mode === 'edit' && data) {
    formData.value = {
      id: data.id,
      tujuan_bidang: data.tujuan_bidang, 
      instruksi: data.instruksi,
      sifat: data.sifat,
      batas_waktu: data.batas_waktu ? data.batas_waktu.substring(0, 10) : new Date().toISOString().substring(0, 10), 
      status: data.status 
    }
  }
  showModal.value = true
}

const saveDisposisi = async () => {
  isSaving.value = true
  try {
    if (modalMode.value === 'create') {
      if (userRole.value === 'Kepala Sekolah') {
        await pb.collection('disposisi').create({
          arsip_id: formData.value.arsip_id,
          tujuan_bidang: formData.value.tujuan_bidang,
          instruksi: formData.value.instruksi,
          sifat: formData.value.sifat,
          batas_waktu: formData.value.batas_waktu + ' 12:00:00.000Z',
          status: 'Diproses'
        })
        showToast('Disposisi baru berhasil dibuat!', 'success')
      } else {
        await pb.collection('disposisi').create({
          arsip_id: formData.value.arsip_id,
          tujuan_bidang: 'Pimpinan',
          status: 'Menunggu Instruksi'
        })
        showToast('Surat berhasil diteruskan ke meja Pimpinan.', 'success')
      }
    } else if (modalMode.value === 'forward') {
      await pb.collection('disposisi').update(formData.value.id, {
        tujuan_bidang: formData.value.tujuan_bidang,
        instruksi: formData.value.instruksi,
        sifat: formData.value.sifat,
        batas_waktu: formData.value.batas_waktu + ' 12:00:00.000Z',
        status: formData.value.status 
      })
      showToast('Instruksi pimpinan berhasil diteruskan ke bidang!', 'success')
    } else if (modalMode.value === 'edit') {
      await pb.collection('disposisi').update(formData.value.id, {
        tujuan_bidang: formData.value.tujuan_bidang,
        instruksi: formData.value.instruksi,
        sifat: formData.value.sifat,
        batas_waktu: formData.value.batas_waktu + ' 12:00:00.000Z',
        status: formData.value.status 
      })
      showToast('Instruksi disposisi berhasil diperbarui!', 'success')
    }
    showModal.value = false
    fetchDisposisi() 
  } catch (error) {
    console.error("Gagal menyimpan disposisi:", error)
    showToast('Terjadi kesalahan saat menyimpan data.', 'error')
  } finally {
    isSaving.value = false
  }
}

const selesaikanDisposisi = (item) => {
  itemToConfirm.value = item
  confirmAction.value = 'complete'
  showConfirmModal.value = true
}

const hapusDisposisi = (item) => {
  itemToConfirm.value = item
  confirmAction.value = 'delete'
  showConfirmModal.value = true
}

const executeConfirm = async () => {
  if (!itemToConfirm.value) return
  
  try {
    if (confirmAction.value === 'complete') {
      await pb.collection('disposisi').update(itemToConfirm.value.id, {
        status: 'Selesai'
      })
      showToast('Status disposisi berhasil ditandai Selesai!', 'success')
    } else if (confirmAction.value === 'delete') {
      await pb.collection('disposisi').delete(itemToConfirm.value.id)
      showToast('Lembar disposisi berhasil dicabut.', 'success')
    }
    fetchDisposisi()
  } catch (error) {
    console.error(error)
    showToast(`Gagal ${confirmAction.value === 'delete' ? 'mencabut' : 'menyelesaikan'} disposisi.`, 'error')
  } finally {
    showConfirmModal.value = false
    itemToConfirm.value = null
  }
}

const sortedDisposisi = computed(() => {
  let filtered = disposisiList.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return (item.instruksi && item.instruksi.toLowerCase().includes(q)) || 
             (item.expand?.arsip_id?.judul && item.expand.arsip_id.judul.toLowerCase().includes(q)) ||
             (item.expand?.arsip_id?.no_surat && item.expand.arsip_id.no_surat.toLowerCase().includes(q))
    })
  }

  return filtered.sort((a, b) => {
    const statusPriority = {
      'Menunggu Instruksi': 1, 
      'Diproses': 2,          
      'Selesai': 3             
    }
    
    const priorityA = statusPriority[a.status] || 99
    const priorityB = statusPriority[b.status] || 99
    
    return priorityA - priorityB
  })
})

const totalPages = computed(() => {
  return Math.ceil(sortedDisposisi.value.length / itemsPerPage) || 1
})

const paginatedDisposisi = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedDisposisi.value.slice(start, end)
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