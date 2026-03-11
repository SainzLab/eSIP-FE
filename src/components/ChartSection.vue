<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative">
    
    <div v-if="isLoading" class="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-500 mb-2"></i>
      <p class="text-sm text-slate-500 font-medium">Memuat statistik data...</p>
    </div>

    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-lg font-bold text-slate-800">Statistik Surat Masuk & Keluar</h2>
        <p class="text-xs text-slate-500 mt-1">Akumulasi dokumen berdasarkan bulan pada tahun {{ currentYear }}.</p>
      </div>
      
      <div class="flex items-center gap-4 text-sm font-medium">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-blue-500"></span> Surat Masuk
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400"></span> Surat Keluar
        </div>
      </div>
    </div>

    <div id="chart">
      <apexchart 
        type="line" 
        height="320" 
        :options="chartOptions" 
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import pb from '../pb.js'

const apexchart = VueApexCharts
const currentYear = new Date().getFullYear()
const isLoading = ref(true)

const userRole = ref(localStorage.getItem('user_role') || 'Staff')
const userBidang = ref(localStorage.getItem('user_bidang') || 'Tata Usaha')

const series = ref([
  {
    name: 'Surat Masuk (Bar)',
    type: 'column',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  },
  {
    name: 'Surat Keluar (Area)',
    type: 'area',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  }
])

const chartOptions = ref({
  chart: {
    height: 320,
    type: 'line',
    fontFamily: 'inherit',
    toolbar: { 
      show: true, 
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: false,
        reset: false
      }
    }
  },
  stroke: {
    width: [0, 3], 
    curve: 'smooth' 
  },
  colors: ['#3b82f6', '#10b981'], 
  fill: {
    type: ['solid', 'gradient'], 
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#94a3b8', fontWeight: 600 } }
  },
  yaxis: {
    min: 0,
    tickAmount: 4,
    labels: { 
      style: { colors: '#94a3b8' },
      formatter: (val) => { return Math.floor(val) } 
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 4, 
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  },
  legend: { show: false }, 
  tooltip: {
    shared: true,
    intersect: false,
  }
})

const fetchChartData = async () => {
  isLoading.value = true
  try {
    const katRecords = await pb.collection('kategori').getFullList({ filter: 'is_system = true' })
    const idMasuk = katRecords.find(k => k.nama.toLowerCase().includes('masuk'))?.id
    const idKeluar = katRecords.find(k => k.nama.toLowerCase().includes('keluar'))?.id

    let dataMasuk = Array(12).fill(0)
    let dataKeluar = Array(12).fill(0)

    let filterArsip = `is_deleted != true && tanggal_surat >= "${currentYear}-01-01" && tanggal_surat <= "${currentYear}-12-31"`
    
    if (userRole.value !== 'Arsiparis' && userRole.value !== 'Petugas Arsip' && userRole.value !== 'Kepala Sekolah') {
      filterArsip += ` && bidang = "${userBidang.value}"`
    }

    const arsipRecords = await pb.collection('arsip').getFullList({
      filter: filterArsip,
      fields: 'id,kategori_id,tanggal_surat' 
    })

    arsipRecords.forEach(arsip => {
      const date = new Date(arsip.tanggal_surat)
      const monthIndex = date.getMonth() 

      if (arsip.kategori_id === idMasuk) {
        dataMasuk[monthIndex] += 1
      } else if (arsip.kategori_id === idKeluar) {
        dataKeluar[monthIndex] += 1
      }
    })

    series.value = [
      { name: 'Surat Masuk', type: 'column', data: dataMasuk },
      { name: 'Surat Keluar', type: 'area', data: dataKeluar }
    ]

  } catch (error) {
    console.error("Gagal mengambil data chart:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchChartData()
})
</script>