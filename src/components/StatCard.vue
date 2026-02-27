<template>
  <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-700 rounded-xl">
        <i :class="iconClass"></i>
      </div>
      <h3 class="font-bold text-slate-800 text-lg">{{ title }}</h3>
    </div>
    
    <div class="mt-6 flex items-end justify-between">
      <span class="text-sm font-medium text-slate-400">{{ subtitle }}</span>
      <span class="text-3xl font-extrabold text-blue-600">{{ value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String,
  iconClass: String,
  value: [String, Number]
})
</script>