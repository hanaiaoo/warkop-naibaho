# Warkop Sederhana

Formulir pemesanan kopi berbentuk adegan warung. Tugas Project 1 mata kuliah Pemrograman Web Modern (React + Vite).

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

Akun admin bawaan: **admin** / **admin123**. Akun pelanggan bisa dibuat lewat tab Daftar.

## Fitur

| Fitur | Letak |
| --- | --- |
| Login & Register (plang TUTUP berbalik jadi BUKA, pintu terbuka) | `pages/AuthPage.jsx` |
| Live preview gelas: kopi, susu, gula, es, uap untuk kopi panas | `components/Gelas.jsx` |
| Ukuran gelas berubah saat diklik (atau lewat tombol ukuran) | `components/Gelas.jsx`, `pages/PesanPage.jsx` |
| Level kepahitan (warna kopi makin pekat, level 4-5 menambah shot) | `pages/PesanPage.jsx`, `utils/harga.js` |
| Harga dinamis + happy hour 14.00-16.59 (-10%) | `utils/harga.js` |
| Pilih cabang: Medan, Pematangsiantar, Binjai | `data/menu.js` |
| Estimasi waktu (antrean cabang, jumlah & ukuran gelas, jam sibuk) | `utils/harga.js` |
| Keranjang (laci samping) | `components/KeranjangDrawer.jsx` |
| Voucher: WARKOP10, HEMAT5K, NGOPIPAGI | `data/menu.js`, `utils/harga.js` |
| Progress status pesanan + gelas meluncur ke pelanggan | `pages/LacakPage.jsx` |
| QR code pesanan + struk | `pages/LacakPage.jsx` |
| Riwayat pesanan + pesan ulang | `pages/RiwayatPage.jsx` |
| Favorit racikan | `pages/FavoritPage.jsx` |
| Peta asal kopi + cerita kopi | `pages/CeritaPage.jsx`, `components/PetaKopi.jsx` |
| Dashboard admin: statistik penjualan & kelola menu | `pages/AdminPage.jsx` |
| Dark / Light mode | `context/AppContext.jsx`, variabel tema di `App.css` |
| Toast notification | `components/Toast.jsx` |
| Sound effect (Web Audio API, tanpa file mp3) | `utils/suara.js` |
| Animasi transisi (Framer Motion) | semua halaman |

## Catatan

- Semua data (akun, pesanan, menu, favorit) disimpan di `localStorage` browser. Tidak ada server, jadi password di-hash hanya sebagai demo.
- Status pesanan dipercepat (selesai sekitar 12 detik) supaya alurnya bisa didemokan.
- Dashboard admin sudah berisi 18 pesanan contoh supaya grafiknya tidak kosong.
- Untuk mengulang dari awal, hapus data situs di DevTools (Application → Local Storage).
