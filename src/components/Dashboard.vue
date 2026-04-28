<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Surat Masuk" 
        subtitle="Berdasarkan Hak Akses" 
        iconClass="fa-solid fa-inbox text-xl" 
        :value="formatNumber(statMasuk)" 
      />
      <StatCard 
        title="Surat Keluar" 
        subtitle="Berdasarkan Hak Akses" 
        iconClass="fa-solid fa-paper-plane text-xl" 
        :value="formatNumber(statKeluar)" 
      />
      <StatCard 
        title="Total Arsip" 
        subtitle="Semua Kategori (Aktif)" 
        iconClass="fa-solid fa-box-archive text-xl" 
        :value="formatNumber(statTotal)" 
      />
      <StatCard 
        title="Total Pengguna" 
        subtitle="Pengguna Terdaftar" 
        iconClass="fa-solid fa-users text-xl" 
        :value="formatNumber(statPengguna)" 
      />
    </div>

    <ChartSection />
    
    <RecentDocuments />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import StatCard from './StatCard.vue'
import ChartSection from './ChartSection.vue'
import RecentDocuments from './RecentDocuments.vue'
import pb from '../pb.js'

const statMasuk = ref(0)
const statKeluar = ref(0)
const statTotal = ref(0)
const statPengguna = ref(0)

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

const fetchDashboardStats = async () => {
  try {
    let filterUser = ''
    if (userRole.value !== 'Arsiparis' && userRole.value !== 'Petugas Arsip' && userRole.value !== 'Kepala Sekolah') {
      filterUser = `bidang = "${userBidang.value}"`
    }
    
    const users = await pb.collection('users').getList(1, 1, { filter: filterUser })
    statPengguna.value = users.totalItems

    let filterArsip = 'is_deleted != true'
    if (userRole.value !== 'Arsiparis' && userRole.value !== 'Petugas Arsip' && userRole.value !== 'Kepala Sekolah') {
      filterArsip += ` && bidang = "${userBidang.value}"`
    }

    const arsip = await pb.collection('arsip').getList(1, 1, { filter: filterArsip })
    statTotal.value = arsip.totalItems

    const katRecords = await pb.collection('kategori').getFullList({ filter: 'is_system = true' })
    const idMasuk = katRecords.find(k => k.nama.toLowerCase().includes('masuk'))?.id
    const idKeluar = katRecords.find(k => k.nama.toLowerCase().includes('keluar'))?.id

    if (idMasuk) {
      const masuk = await pb.collection('arsip').getList(1, 1, { 
        filter: `${filterArsip} && kategori_id = "${idMasuk}"` 
      })
      statMasuk.value = masuk.totalItems
    }
    
    if (idKeluar) {
      const keluar = await pb.collection('arsip').getList(1, 1, { 
        filter: `${filterArsip} && kategori_id = "${idKeluar}"` 
      })
      statKeluar.value = keluar.totalItems
    }

  } catch (error) {
    console.error("Gagal memuat statistik dashboard:", error)
  }
}

onMounted(() => {
  fetchDashboardStats()
})
</script>