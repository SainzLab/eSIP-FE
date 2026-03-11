<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
    
    <div 
      v-if="isOpen" 
      class="w-[340px] sm:w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 origin-bottom-right"
    >
      <div class="p-4 bg-slate-900 text-white flex items-center justify-between shadow-md z-10">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shrink-0">
            <i class="fa-solid fa-robot text-sm"></i>
          </div>
          <div>
            <h2 class="font-bold text-sm">eSip Assistant</h2>
            <p class="text-[10px] text-emerald-400 flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="clearChat" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs" title="Bersihkan Chat">
            <i class="fa-solid fa-trash-can"></i>
          </button>
          <button @click="isOpen = false" class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-sm" title="Tutup">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 relative" ref="chatContainer">
        <div class="flex gap-3 max-w-[85%]">
          <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
            <i class="fa-solid fa-robot text-[10px] text-slate-600"></i>
          </div>
          <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed">
            Halo! Saya asisten cerdas eSIP. Ada yang bisa saya bantu terkait pengelolaan dokumen hari ini?
          </div>
        </div>

        <div v-for="(chat, i) in chatHistory" :key="i" 
          :class="['flex gap-3 max-w-[85%]', chat.role === 'user' ? 'ml-auto flex-row-reverse' : '']">
          
          <div :class="['w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm', 
            chat.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-purple-600']">
            <i :class="chat.role === 'user' ? 'fa-solid fa-user text-[10px]' : 'fa-solid fa-wand-magic-sparkles text-[10px]'"></i>
          </div>

          <div :class="['p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap', 
            chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none']">
            {{ chat.text }}
          </div>
        </div>

        <div v-if="isLoading" class="flex gap-3 animate-pulse">
          <div class="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
            <i class="fa-solid fa-ellipsis text-slate-400 text-xs"></i>
          </div>
          <div class="bg-slate-200 h-9 w-16 rounded-2xl rounded-tl-none"></div>
        </div>
      </div>

      <div class="p-3 bg-white border-t border-slate-100">
        <form @submit.prevent="sendMessage" class="flex gap-2">
          <input 
            v-model="userInput"
            type="text" 
            placeholder="Tanyakan sesuatu..." 
            class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            :disabled="isLoading"
          >
          <button 
            type="submit"
            :disabled="!userInput || isLoading"
            class="w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-200 shrink-0"
          >
            <i class="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </form>
      </div>
    </div>

    <button 
      @click="isOpen = !isOpen"
      class="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 z-50 group"
    >
      <i :class="isOpen ? 'fa-solid fa-xmark text-2xl' : 'fa-solid fa-wand-magic-sparkles text-xl group-hover:animate-pulse'"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const userInput = ref('')
const chatHistory = ref([])
const isLoading = ref(false)
const chatContainer = ref(null)

// GANTI DENGAN API KEY GEMINI
const API_KEY = "MASUKKAN_API_KEY_GEMINI_DISINI" 

const scrollToBottom = async () => {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!userInput.value) return

  const userText = userInput.value
  chatHistory.value.push({ role: 'user', text: userText })
  userInput.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }]
      })
    })

    const data = await response.json()
    const aiResponse = data.candidates[0].content.parts[0].text
    
    chatHistory.value.push({ role: 'model', text: aiResponse })
  } catch (error) {
    chatHistory.value.push({ role: 'model', text: "Maaf, Server sedang sibuk. coba beberapa saat lagi :)" })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const clearChat = () => {
  chatHistory.value = []
}
</script>