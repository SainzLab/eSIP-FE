<template>
  <header class="h-16 bg-white flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 z-10 w-full shrink-0">
    
    <div class="text-slate-500 text-sm font-medium pl-8 sm:pl-6 hidden sm:block truncate">
      SMP NEGERI 1 PABUARAN
    </div>
    
    <div class="flex items-center gap-2 sm:gap-4 ml-auto">
      <button class="relative text-slate-400 hover:text-blue-600 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50">
        <i class="fa-regular fa-bell text-[20px]"></i>
        <span class="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
      </button>
      
      <div class="h-6 w-px bg-slate-200 mx-1"></div>
      
      <div class="flex items-center gap-3 cursor-pointer group pl-2">
        <img src="https://i.pravatar.cc/150?img=11" alt="Profile" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-slate-100 object-cover group-hover:border-blue-200 transition-colors">
        <button class="text-sm font-semibold text-slate-600 group-hover:text-blue-600 hidden sm:flex items-center gap-2 transition-colors">
          Logout <i class="fa-solid fa-right-from-bracket text-slate-400 group-hover:text-blue-600 transition-colors"></i>
        </button>
      </div>
    </div>
  </header>
</template>