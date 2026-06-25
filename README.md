# 📝 NoteKeeper — Aplikasi Catatan dengan Persistensi Data

Aplikasi **NoteKeeper** adalah aplikasi catatan sederhana yang dibangun dengan **React Native (Expo)**. Aplikasi ini memungkinkan pengguna untuk menambah, mengedit, menghapus, dan menyimpan catatan secara permanen menggunakan **AsyncStorage**. Dibuat sebagai tugas akhir praktikum Pemrograman Mobile (Pertemuan 12).

<p align="center">
  <img src="https://github.com/user-attachments/assets/c8f7b7e4-2072-4956-bbba-4b46555f8b06" width="250" alt="NoteKeeper Home UI" />
</p>

---
LINK EXPO https://snack.expo.dev/@idhosembiring3107/persistent-app
## 📋 Daftar Isi
- [✨ Fitur](#-fitur)
- [📸 Screenshot](#-screenshot)
- [🧰 Tech Stack](#-tech-stack)
- [🚀 Cara Menjalankan](#-cara-menjalankan)
- [🌐 Link Expo Snack](#-link-expo-snack)
- [📁 Struktur Proyek](#-struktur-proyek)

---

## ✨ Fitur

### ✅ Level 1 – Fitur Wajib (Core)
- [x] **CREATE** – tambah catatan baru via TextInput (validasi: tolak input kosong)
- [x] **READ** – muat data tersimpan saat app dibuka (`useEffect` + `JSON.parse` + `setState`)
- [x] **DELETE** – hapus catatan (filter + sinkron ke storage)
- [x] **Simpan ke AsyncStorage** dengan `JSON.stringify` setiap data berubah
- [x] **FlatList** menampilkan daftar catatan dengan `keyExtractor`
- [x] **Empty state** – pesan saat daftar masih kosong (`ListEmptyComponent`)
- [x] **Persistensi terbukti** – data tetap ada setelah app ditutup total

### 🚀 Level 2 – Fitur Pengembangan (Dipilih)
Saya memilih **3 fitur** untuk pengembangan:

1. **UPDATE / Edit** – tap catatan untuk mengedit teks; toggle status selesai (coret)
2. **Konfirmasi Hapus** – tampilkan `Alert` konfirmasi sebelum benar-benar menghapus
3. **Search / Filter** – TextInput untuk mencari catatan berdasarkan teks (client-side filter)

### 🌟 Level 3 – Tantangan Bonus (Opsional)
- [x] **Timestamp** – simpan & tampilkan tanggal/waktu pembuatan tiap catatan
- [x] **Sorting** – urutkan catatan (terbaru, terlama, abjad, status selesai)

---

## 📸 Screenshot

Berikut tampilan aplikasi dari **Expo Go**:

### Tampilan Utama & Fitur CRUD

| Home (Daftar Catatan) | Menambahkan Catatan | Edit Catatan (Modal) |
|-----------------------|---------------------|----------------------|
| <img src="https://github.com/user-attachments/assets/c8f7b7e4-2072-4956-bbba-4b46555f8b06" width="200" alt="Home" /> | <img src="https://github.com/user-attachments/assets/c8f7b7e4-2072-4956-bbba-4b46555f8b06" width="200" alt="Add Note" /> | <img src="https://github.com/user-attachments/assets/6d3d0549-ad51-43c7-86ff-222c2960043b" width="200" alt="Edit Note" /> |

| Konfirmasi Hapus (Alert) | Search / Filter Berfungsi | Hasil Pencarian Tidak Ditemukan |
|--------------------------|---------------------------|---------------------------------|
| <img src="https://github.com/user-attachments/assets/5fd8f34b-07a1-44e1-8aa0-43517013a76f" width="200" alt="Delete Confirmation" /> | <img src="https://github.com/user-attachments/assets/06795456-0080-406e-b42b-508f408154c3" width="200" alt="Search Working" /> | <img src="https://github.com/user-attachments/assets/6ab2346d-d2c6-4d3b-a313-a140e4fa438c" width="200" alt="Empty Search" /> |

### Fitur Tambahan (Sorting)

| Sorting Options (Section) |
|---------------------------|
| <img src="https://github.com/user-attachments/assets/fda542ba-c0f1-4a98-b4fe-aa96d2265fbf" width="200" alt="Sorting" /> |

---

### 📸 Bukti Persistensi

| Sebelum Aplikasi Ditutup | Setelah Aplikasi Dibuka Kembali |
|--------------------------|--------------------------------|
| <img src="https://github.com/user-attachments/assets/c8f7b7e4-2072-4956-bbba-4b46555f8b06" width="200" alt="Before Close" /> | <img src="https://github.com/user-attachments/assets/c8f7b7e4-2072-4956-bbba-4b46555f8b06" width="200" alt="After Reopen" /> |

> **Catatan:** Data catatan tetap ada setelah aplikasi ditutup total dan dibuka kembali, membuktikan bahwa AsyncStorage bekerja dengan baik.

---

## 🧰 Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| **React Native (Expo)** | Framework utama aplikasi |
| **JavaScript (ES6+)** | Bahasa pemrograman |
| **AsyncStorage** | Penyimpanan lokal persisten |
| **React Hooks** (`useState`, `useEffect`) | Manajemen state & efek |
| **FlatList** | Render daftar catatan efisien |
| **Alert** | Konfirmasi hapus |
| **TextInput** | Input & edit catatan |
| **Modal** | Edit catatan dalam popup |

---

## 🚀 Cara Menjalankan

### 1. Prasyarat
- Node.js (versi 14+)
- Expo CLI (`npm install -g expo-cli`)
- Smartphone dengan **Expo Go** (Android/iOS) atau emulator

### 2. Clone Repository
```bash
git clone https://github.com/username/note-keeper.git
cd note-keeper
