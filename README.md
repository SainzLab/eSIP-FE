![Capstone Project Glitch](./glitch.svg)

# 📂 eSIP (Sistem Informasi Pengelolaan Arsip)

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![PocketBase](https://img.shields.io/badge/PocketBase-B8E986?style=for-the-badge&logo=pocketbase&logoColor=16161a)
![MinIO](https://img.shields.io/badge/MinIO-C7202C?style=for-the-badge&logo=minio&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**eSIP** adalah platform digitalisasi dan manajemen arsip terpadu yang dibangun untuk efisiensi administrasi sekolah (studi kasus: SMPN 1 Pabuaran). Sistem ini dirancang untuk memudahkan penyimpanan, pencarian, dan pengelolaan dokumen penting seperti rapor siswa secara aman dan terpusat.

## ✨ Fitur Utama

* 🔐 **Role-Based Access Control (RBAC):** Hak akses spesifik untuk *Kepala Sekolah*, *Arsiparis*, dan *Staff*.
* 🤖 **Asisten AI Terintegrasi:** Dilengkapi dengan asisten cerdas berbasis *Local LLM* untuk membantu pengguna bertanya seputar kearsipan.
* 🛡️ **Keamanan Login:** Proteksi *brute-force* menggunakan integrasi Google reCAPTCHA v2.
* ☁️ **Penyimpanan Objek Skalabel:** Integrasi dengan S3-compatible storage untuk menyimpan file dokumen bervolume besar secara aman.
* ⚡ **Performa Tinggi:** Menggunakan arsitektur *backend* yang ringan dan reaktif.

## 🛠️ Tech Stack

Sistem ini dikembangkan menggunakan teknologi modern:
* **Frontend:** [Vue.js 3](https://vuejs.org/) (Vite) + Tailwind CSS untuk UI/UX yang responsif.
* **Backend & Auth:** [PocketBase](https://pocketbase.io/) (Lightweight backend + SQLite database).
* **File Storage:** [MinIO](https://min.io/) (Self-hosted S3 Object Storage).
* **AI Engine:** [Ollama](https://ollama.ai/) (Local LLM `qwen2.5:7b` via API).

---

## 🚀 Panduan Instalasi (Development)

### Prasyarat:
Pastikan Anda telah menginstal Node.js, PocketBase, MinIO Server, dan Ollama di sistem/server lokal Anda.

### 1. Setup Backend (PocketBase + Hooks)
Sistem ini menggunakan kustomisasi PocketBase JS Hooks (`pb_hooks`) untuk menangani reCAPTCHA dan _routing_ API Ollama.
1. Unduh dan jalankan PocketBase.
2. Pastikan folder `pb_hooks` (yang berisi `main.pb.js`) berada di direktori yang sama dengan *executable* PocketBase.
3. Buka Admin UI PocketBase, masuk ke setelan **Files storage (S3)** dan hubungkan dengan kredensial S3 MinIO Anda.
4. Jalankan server backend:
   ```bash
   ./pocketbase serve
   ```

### 2. Setup AI Engine (Ollama)
Pastikan server Ollama berjalan di latar belakang dengan model yang telah diunduh:
```bash
ollama run qwen2.5:7b
```

### 3. Setup Frontend (Vue.js)
Clone repositori ini dan masuk ke direktori frontend:

```bash
# Instalasi dependensi
npm install

# Setup Environment Variables
# Buat file .env dan isi dengan konfigurasi berikut:
# VITE_PB_URL=[http://127.0.0.1:8090](http://127.0.0.1:8090)
# VITE_RECAPTCHA_SITE_KEY=your_site_key_here

# Jalankan development server (dengan Hot-Reload)
npm run dev
```

### 📦 Build untuk Production
Untuk mengkompilasi dan meminimalkan aset untuk *production*:
```bash
npm run build
```

## 👥 Kredit & Dukungan
Dikembangkan sebagai bagian dari **Capstone Project Universitas Subang (Unsub)**. 
*Support By: Mahasiswa Ilmu Komputer Unsub untuk SMP Negeri 1 Pabuaran.*
