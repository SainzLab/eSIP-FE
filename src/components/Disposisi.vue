<template>
  <div class="flex flex-col gap-6 relative">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Lembar Disposisi</h1>
        <p class="text-slate-500 text-sm mt-1">Pantau instruksi pimpinan dan tindak lanjut surat.</p>
      </div>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center">
        <i class="fa-solid fa-file-circle-plus"></i> Buat Disposisi
      </button>
    </div>

    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="relative w-full sm:w-72">
          <i class="fa-solid fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Cari no. surat atau instruksi..." 
            class="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
          >
        </div>
        <select v-model="filterStatus" class="border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-sm text-slate-600 bg-white">
          <option value="">Semua Status</option>
          <option value="Selesai">Selesai</option>
          <option value="Proses">Dalam Proses</option>
          <option value="Tertunda">Tertunda</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr class="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
              <th class="py-3.5 px-4 font-semibold w-12 text-center">No</th>
              <th class="py-3.5 px-4 font-semibold">Asal Surat & Instruksi</th>
              <th class="py-3.5 px-4 font-semibold">Diteruskan Ke</th>
              <th class="py-3.5 px-4 font-semibold">Sifat</th>
              <th class="py-3.5 px-4 font-semibold">Batas Waktu</th>
              <th class="py-3.5 px-4 font-semibold text-center">Status</th>
              <th class="py-3.5 px-4 font-semibold text-center w-28">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            <tr v-for="(item, index) in disposisiData" :key="index" class="hover:bg-slate-50 transition-colors group">
              <td class="py-4 px-4 text-center text-slate-500">{{ index + 1 }}</td>
              <td class="py-4 px-4">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800">{{ item.noSurat }}</span>
                  <span class="text-xs text-indigo-600 italic mt-1">"{{ item.instruksi }}"</span>
                </div>
              </td>
              <td class="py-4 px-4 text-slate-600">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {{ item.penerimaSingkatan }}
                  </div>
                  {{ item.penerima }}
                </div>
              </td>
              <td class="py-4 px-4">
                <span :class="item.sifatClass" class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                  {{ item.sifat }}
                </span>
              </td>
              <td class="py-4 px-4 text-slate-500 font-medium">{{ item.deadline }}</td>
              <td class="py-4 px-4 text-center">
                <span :class="item.statusClass" class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ item.status }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center justify-center gap-2">
                  <button class="text-slate-400 hover:text-indigo-600 transition-colors"><i class="fa-solid fa-print"></i></button>
                  <button class="text-slate-400 hover:text-blue-600 transition-colors"><i class="fa-solid fa-pen-to-square"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const filterStatus = ref('')

const disposisiData = ref([
  { 
    noSurat: '045/ND/II/2026', 
    instruksi: 'Segera koordinasikan dengan bagian sarpras', 
    penerima: 'Wakasek Sarpras',
    penerimaSingkatan: 'WSP',
    sifat: 'Segera',
    sifatClass: 'bg-red-100 text-red-700',
    deadline: '28 Feb 2026',
    status: 'Proses',
    statusClass: 'bg-amber-100 text-amber-700'
  },
  { 
    noSurat: '112/SK/II/2026', 
    instruksi: 'Arsipkan dan buatkan salinan untuk ybs', 
    penerima: 'Tata Usaha',
    penerimaSingkatan: 'TU',
    sifat: 'Biasa',
    sifatClass: 'bg-slate-100 text-slate-600',
    deadline: '02 Mar 2026',
    status: 'Selesai',
    statusClass: 'bg-emerald-100 text-emerald-700'
  },
  { 
    noSurat: '089/SP/II/2026', 
    instruksi: 'Tindak lanjuti laporan hasil akreditasi', 
    penerima: 'Kepala Perpustakaan',
    penerimaSingkatan: 'KP',
    sifat: 'Penting',
    sifatClass: 'bg-blue-100 text-blue-700',
    deadline: '05 Mar 2026',
    status: 'Tertunda',
    statusClass: 'bg-slate-100 text-slate-500'
  }
])
</script>