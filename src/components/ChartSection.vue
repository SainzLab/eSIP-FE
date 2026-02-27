<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-slate-800">Time Statistics</h2>
      <div class="flex gap-4 items-center">
        <div class="flex items-center gap-2 text-sm text-slate-400">
          <span class="w-2 h-2 rounded-full bg-primary"></span>
        </div>
        <select class="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none bg-white text-slate-600 focus:border-primary">
          <option>Logout</option>
          <option>Export PDF</option>
        </select>
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
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const apexchart = VueApexCharts

const series = ref([
  {
    name: 'Dokumen Fisik (Bar)',
    type: 'column',
    data: [150, 200, 120, 380, 280, 320, 250, 130, 80, 200, 250, 220]
  },
  {
    name: 'Tren Digitalisasi (Area)',
    type: 'area',
    data: [40, 70, 110, 80, 95, 90, 85, 120, 350, 140, 240, 210]
  }
])

const chartOptions = ref({
  chart: {
    height: 320,
    type: 'line',
    toolbar: { show: false },
    fontFamily: 'inherit'
  },
  stroke: {
    width: [0, 2],
    curve: 'smooth' 
  },
  colors: ['#2563eb', '#3b82f6'],
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
    categories: ['10', '40', '50', '60', '100', '120', '125', '130', '40', '60', '100', '2k'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: '#94a3b8' } 
    }
  },
  yaxis: {
    min: 0,
    tickAmount: 4,
    labels: {
      style: { colors: '#94a3b8' }
    }
  },
  grid: {
    borderColor: '#f1f5f9',
    strokeDashArray: 0,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } }
  },
  legend: { show: false }
})
</script>