<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-slate-800">Dokumen Terbaru</h2>
      <button class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
        Lihat Semua <i class="fa-solid fa-arrow-right text-xs"></i>
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr class="text-slate-400 text-sm border-b border-slate-100">
            <th class="pb-3 font-medium px-4">No. Surat</th>
            <th class="pb-3 font-medium px-4">Perihal</th>
            <th class="pb-3 font-medium px-4">Kategori</th>
            <th class="pb-3 font-medium px-4">Tanggal</th>
            <th class="pb-3 font-medium px-4">Status</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr 
            v-for="(doc, index) in documents" 
            :key="index" 
            class="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
          >
            <td class="py-4 px-4 text-slate-800 font-medium">{{ doc.noSurat }}</td>
            <td class="py-4 px-4 text-slate-600">{{ doc.perihal }}</td>
            <td class="py-4 px-4">
              <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                {{ doc.kategori }}
              </span>
            </td>
            <td class="py-4 px-4 text-slate-500">{{ doc.tanggal }}</td>
            <td class="py-4 px-4">
              <span 
                :class="doc.statusClass" 
                class="px-3 py-1 rounded-full text-xs font-medium flex items-center w-max gap-1.5"
              >
                <i :class="doc.icon"></i> {{ doc.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const documents = ref([
  { 
    noSurat: '001/SK/II/2026', 
    perihal: 'Undangan Rapat Koordinasi', 
    kategori: 'Surat Masuk', 
    tanggal: '26 Feb 2026', 
    status: 'Selesai', 
    statusClass: 'bg-green-50 text-green-600 border border-green-200', 
    icon: 'fa-solid fa-check-circle' 
  },
  { 
    noSurat: '045/ND/II/2026', 
    perihal: 'Pengajuan Anggaran IT', 
    kategori: 'Surat Keluar', 
    tanggal: '25 Feb 2026', 
    status: 'Diproses', 
    statusClass: 'bg-blue-50 text-blue-600 border border-blue-200', 
    icon: 'fa-solid fa-clock-rotate-left' 
  },
  { 
    noSurat: '089/SP/II/2026', 
    perihal: 'Surat Perintah Tugas', 
    kategori: 'Disposisi', 
    tanggal: '24 Feb 2026', 
    status: 'Menunggu', 
    statusClass: 'bg-orange-50 text-orange-600 border border-orange-200', 
    icon: 'fa-solid fa-triangle-exclamation' 
  },
  { 
    noSurat: '012/SE/II/2026', 
    perihal: 'Edaran Cuti Bersama', 
    kategori: 'Surat Masuk', 
    tanggal: '23 Feb 2026', 
    status: 'Selesai', 
    statusClass: 'bg-green-50 text-green-600 border border-green-200', 
    icon: 'fa-solid fa-check-circle' 
  },
])
</script>