<template>
  <div class="flex flex-col gap-6 pb-10">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <i class="fa-solid fa-chart-pie text-amber-500"></i>
          Statistik Eksekutif
        </h1>
        <p class="text-slate-500 text-sm mt-1">Laporan menyeluruh e-Arsip.</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-100 shadow-sm">
      <i class="fa-solid fa-circle-notch fa-spin text-4xl text-amber-500 mb-4"></i>
      <p class="text-slate-500 font-medium">Menyusun laporan statistik sistem...</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Arsip Aktif" subtitle="Seluruh Dokumen Sistem" iconClass="fa-solid fa-box-archive text-xl" :value="formatNumber(stats.totalArsip)" />
        <StatCard title="Total Disposisi" subtitle="Instruksi Pimpinan" iconClass="fa-solid fa-share text-xl" :value="formatNumber(stats.totalDisposisi)" />
        <StatCard title="Total Kategori" subtitle="Klasifikasi Folder" iconClass="fa-solid fa-folder-tree text-xl" :value="formatNumber(stats.totalKategori)" />
        <StatCard title="Total Pengguna" subtitle="Pegawai Terdaftar" iconClass="fa-solid fa-users text-xl" :value="formatNumber(stats.totalUsers)" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-bold text-slate-800 mb-1">Rasio Penyelesaian Disposisi</h2>
          <p class="text-xs text-slate-500 mb-6">Pantau persentase instruksi yang sudah dikerjakan staff.</p>
          <div class="flex justify-center">
            <apexchart type="donut" height="320" :options="chartOptionsDisposisi" :series="seriesDisposisi"></apexchart>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 class="text-lg font-bold text-slate-800 mb-1">Sebaran Arsip per Bidang</h2>
          <p class="text-xs text-slate-500 mb-6">Volume dokumen berdasarkan bagian/bidang di sekolah.</p>
          <apexchart type="bar" height="320" :options="chartOptionsBidang" :series="seriesBidang"></apexchart>
        </div>

      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 class="text-lg font-bold text-slate-800 mb-1">Rekapitulasi Tren Arsip</h2>
            <p class="text-xs text-slate-500">Pertumbuhan volume dokumen digital berdasarkan bulan dan tahun.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <label class="text-sm font-bold text-slate-600">Pilih Tahun:</label>
            <select v-model="selectedYear" class="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm bg-slate-50 font-bold text-amber-600">
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>
        
        <apexchart type="area" height="350" :options="chartOptionsBulanan" :series="seriesBulanan"></apexchart>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import StatCard from './StatCard.vue'
import VueApexCharts from 'vue3-apexcharts'
import pb from '../pb.js'

const apexchart = VueApexCharts
const isLoading = ref(true)

const stats = ref({ totalArsip: 0, totalDisposisi: 0, totalKategori: 0, totalUsers: 0 })
const allArsipData = ref([])
const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const availableYears = ref([currentYear])
const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num)

const seriesDisposisi = ref([])
const chartOptionsDisposisi = ref({
  chart: { type: 'donut', fontFamily: 'inherit' },
  labels: ['Selesai', 'Diproses', 'Menunggu Instruksi'],
  colors: ['#10b981', '#f59e0b', '#94a3b8'], 
  plotOptions: { pie: { donut: { size: '70%' } } },
  dataLabels: { enabled: true },
  legend: { position: 'bottom' }
})

const seriesBidang = ref([{ name: 'Jumlah Dokumen', data: [] }])
const chartOptionsBidang = ref({
  chart: { type: 'bar', fontFamily: 'inherit', toolbar: { show: false } },
  colors: ['#6366f1'], 
  plotOptions: { bar: { borderRadius: 4, horizontal: true } },
  dataLabels: { enabled: true },
  xaxis: { categories: [] },
  grid: { strokeDashArray: 4 }
})

const seriesBulanan = ref([{ name: 'Total Arsip Baru', data: [0,0,0,0,0,0,0,0,0,0,0,0] }])
const chartOptionsBulanan = ref({
  chart: { type: 'area', fontFamily: 'inherit', toolbar: { show: true } },
  colors: ['#f59e0b'],
  fill: { 
    type: 'gradient', 
    gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05, stops: [0, 100] } 
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  xaxis: { 
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    labels: { style: { colors: '#94a3b8', fontWeight: 600 } }
  },
  yaxis: {
    labels: { formatter: (val) => Math.floor(val) }
  },
  grid: { strokeDashArray: 4 }
})

const fetchData = async () => {
  isLoading.value = true
  try {
    const arsipReq = pb.collection('arsip').getList(1, 1, { filter: 'is_deleted != true' })
    const disposisiReq = pb.collection('disposisi').getList(1, 1)
    const kategoriReq = pb.collection('kategori').getList(1, 1)
    const usersReq = pb.collection('users').getList(1, 1)

    const [arsipData, disposisiData, kategoriData, userData] = await Promise.all([arsipReq, disposisiReq, kategoriReq, usersReq])

    stats.value = {
      totalArsip: arsipData.totalItems,
      totalDisposisi: disposisiData.totalItems,
      totalKategori: kategoriData.totalItems,
      totalUsers: userData.totalItems
    }

    const allDisposisi = await pb.collection('disposisi').getFullList({ fields: 'status' })
    let selesai = 0, diproses = 0, menunggu = 0;
    allDisposisi.forEach(d => {
      if (d.status === 'Selesai') selesai++
      else if (d.status === 'Diproses') diproses++
      else menunggu++
    })
    seriesDisposisi.value = [selesai, diproses, menunggu]

    const allArsip = await pb.collection('arsip').getFullList({ filter: 'is_deleted != true', fields: 'bidang,tanggal_surat' })
    allArsipData.value = allArsip 

    const countBidang = {}
    const yearsSet = new Set([currentYear]) 

    allArsip.forEach(a => {
      const bidangName = a.bidang || 'Tanpa Bidang'
      countBidang[bidangName] = (countBidang[bidangName] || 0) + 1

      if(a.tanggal_surat) {
        yearsSet.add(new Date(a.tanggal_surat).getFullYear())
      }
    })

    const sortedBidang = Object.entries(countBidang).sort((a, b) => b[1] - a[1])
    chartOptionsBidang.value = { ...chartOptionsBidang.value, xaxis: { categories: sortedBidang.map(item => item[0]) } }
    seriesBidang.value = [{ name: 'Jumlah Dokumen', data: sortedBidang.map(item => item[1]) }]

    availableYears.value = Array.from(yearsSet).sort((a, b) => b - a)

    updateChartBulanan()

  } catch (error) {
    console.error("Gagal menyusun laporan eksekutif:", error)
  } finally {
    isLoading.value = false
  }
}

const updateChartBulanan = () => {
  const countBulanan = Array(12).fill(0)

  allArsipData.value.forEach(a => {
    if (a.tanggal_surat) {
      const d = new Date(a.tanggal_surat)
      if (d.getFullYear() === selectedYear.value) {
        countBulanan[d.getMonth()] += 1
      }
    }
  })

  seriesBulanan.value = [{ name: `Total Arsip (${selectedYear.value})`, data: countBulanan }]
}

watch(selectedYear, () => {
  updateChartBulanan()
})

onMounted(() => {
  fetchData()
})
</script>