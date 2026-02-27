<template>
  <div class="md:hidden fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
    <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm">
      <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl">
        <i class="fa-solid fa-desktop"></i>
      </div>
      
      <h2 class="text-xl font-bold text-slate-800 mb-2">Resolusi Tidak Didukung</h2>
      <p class="text-slate-500 text-sm mb-8 leading-relaxed">
        Sistem eSip ini dirancang khusus untuk layar besar agar pengelolaan data lebih maksimal. Mohon akses menggunakan <b>Tablet</b> atau <b>Desktop</b>.
      </p>
      
      <div class="flex items-center justify-center gap-5 text-slate-400">
        <div class="relative">
          <i class="fa-solid fa-mobile-screen text-2xl text-slate-300"></i>
          <i class="fa-solid fa-ban absolute -bottom-1 -right-2 text-red-500 text-lg bg-white rounded-full"></i>
        </div>
        <i class="fa-solid fa-arrow-right text-sm"></i>
        <i class="fa-solid fa-tablet-screen-button text-2xl text-blue-600"></i>
        <i class="fa-solid fa-laptop text-2xl text-blue-600"></i>
      </div>
    </div>
  </div>

  <div class="hidden md:flex h-screen overflow-hidden">
    <Sidebar />

    <div class="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-background">
      <Header />
      
      <main class="p-4 md:p-8">
        
        <router-view></router-view>

      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
</script>