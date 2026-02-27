<template>
  <div class="flex flex-col h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <div class="p-4 bg-slate-900 text-white flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
          <i class="fa-solid fa-robot text-lg"></i>
        </div>
        <div>
          <h2 class="font-bold text-sm">Gemini AI Assistant</h2>
          <p class="text-[10px] text-emerald-400 flex items-center gap-1">
            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Online
          </p>
        </div>
      </div>
      <button @click="clearChat" class="text-slate-400 hover:text-white transition-colors text-xs">
        <i class="fa-solid fa-trash-can mr-1"></i> Clear Chat
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50" ref="chatContainer">
      <div class="flex gap-3 max-w-[80%]">
        <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <i class="fa-solid fa-robot text-xs text-slate-600"></i>
        </div>
        <div class="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700">
          Halo Admin! Saya asisten cerdas SMPN 1 Pabuaran. Ada yang bisa saya bantu terkait pengelolaan dokumen hari ini?
        </div>
      </div>

      <div v-for="(chat, i) in chatHistory" :key="i" 
        :class="['flex gap-3 max-w-[85%] truncate-none', chat.role === 'user' ? 'ml-auto flex-row-reverse' : '']">
        
        <div :class="['w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm', 
          chat.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-purple-600']">
          <i :class="chat.role === 'user' ? 'fa-solid fa-user text-xs' : 'fa-solid fa-sparkles text-xs'"></i>
        </div>

        <div :class="['p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap', 
          chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none']">
          {{ chat.text }}
        </div>
      </div>

      <div v-if="isLoading" class="flex gap-3 animate-pulse">
        <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
          <i class="fa-solid fa-ellipsis text-slate-400"></i>
        </div>
        <div class="bg-slate-200 h-10 w-24 rounded-2xl rounded-tl-none"></div>
      </div>
    </div>

    <div class="p-4 bg-white border-t border-slate-100">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input 
          v-model="userInput"
          type="text" 
          placeholder="Tanyakan sesuatu" 
          class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          :disabled="isLoading"
        >
        <button 
          type="submit"
          :disabled="!userInput || isLoading"
          class="w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all shadow-md shadow-blue-200"
        >
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const userInput = ref('')
const chatHistory = ref([])
const isLoading = ref(false)
const chatContainer = ref(null)

// GANTI DENGAN API KEY GOOGLE GEMINI KAMU
const API_KEY = "AIzaSyBLis5U3PbZrB_S8HshB1XE-pGRN4VzyDQ" 

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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userText }] }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 429 || (data.error?.message && data.error.message.toLowerCase().includes('quota'))) {
        throw new Error('QUOTA_EXCEEDED')
      }
    
      throw new Error(data.error?.message || 'Terjadi kesalahan pada koneksi API')
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text
    chatHistory.value.push({ role: 'model', text: aiResponse })

  } catch (error) {
    console.error("Detail Error API Gemini:", error)
    
    let balasanError = `Maaf, terjadi kesalahan: ${error.message}`
    
    if (error.message === 'QUOTA_EXCEEDED') {
      balasanError = "Maaf, kuota penggunaan AI saat ini sudah habis. Silakan periksa kembali API Key atau coba gunakan akun yang berbeda."
    }

    chatHistory.value.push({ 
      role: 'model', 
      text: balasanError 
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const clearChat = () => {
  chatHistory.value = []
}
</script>