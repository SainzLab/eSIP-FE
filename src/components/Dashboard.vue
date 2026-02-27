<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Surat Masuk" subtitle="Total Dokumen" iconClass="fa-solid fa-inbox text-xl" value="1.284" />
      <StatCard title="Surat Keluar" subtitle="Total Dokumen" iconClass="fa-solid fa-paper-plane text-xl" value="842" />
      <StatCard title="Total Arsip" subtitle="Semua Kategori" iconClass="fa-solid fa-box-archive text-xl" value="4.521" />
      <StatCard title="Total Pengguna" subtitle="Pengguna Terdaftar" iconClass="fa-solid fa-users text-xl" value="64" />
    </div>

    <ChartSection />
    
    <RecentDocuments />
  </div>
</template>

<script setup>
import StatCard from './StatCard.vue'
import ChartSection from './ChartSection.vue'
import RecentDocuments from './RecentDocuments.vue'
</script>