// =====================================================
// Data statis aplikasi: menu awal, cabang, voucher, opsi
// =====================================================

export const MENU_AWAL = [
  {
    id: "tubruk",
    nama: "Tubruk",
    harga: 5000,
    warna: "#3b2416",
    jenis: "Robusta",
    asal: "Jawa",
    rasa: "Tebal, pahit, aroma gosong yang khas",
    cerita:
      "Tubruk sebenarnya nama cara seduh, bukan nama biji. Bubuk kopi yang agak kasar langsung disiram air mendidih di dalam gelas, diaduk, lalu didiamkan sampai ampasnya turun ke dasar. Tanpa saringan, tanpa mesin. Inilah kopi yang paling akrab di warung-warung Jawa.",
    peta: { x: 420, y: 333 },
    tersedia: true,
  },
  {
    id: "sidikalang",
    nama: "Sidikalang",
    harga: 7000,
    warna: "#2e1b10",
    jenis: "Robusta",
    asal: "Dairi, Sumatera Utara",
    rasa: "Body tebal, pahit kuat, sedikit rasa kayu",
    cerita:
      "Dari Kabupaten Dairi, nama Sidikalang sudah lama identik dengan kopi warung di Sumatera Utara. Robustanya pekat dan pahit, cocok diminum dengan banyak susu kental manis atau sebagai kopi hitam teman ngobrol pagi.",
    peta: { x: 140, y: 152 },
    tersedia: true,
  },
  {
    id: "gayo",
    nama: "Gayo",
    harga: 9000,
    warna: "#4a2c1a",
    jenis: "Arabika",
    asal: "Dataran Tinggi Gayo, Aceh",
    rasa: "Bersih, asam lembut, sentuhan rempah",
    cerita:
      "Ditanam di dataran tinggi Aceh Tengah dan Bener Meriah, di ketinggian lebih dari seribu meter. Udara sejuk membuat buah kopi matang perlahan, sehingga rasanya bersih dengan asam yang lembut. Gayo termasuk arabika Indonesia yang paling dikenal di pasar dunia.",
    peta: { x: 96, y: 98 },
    tersedia: true,
  },
  {
    id: "mandailing",
    nama: "Mandailing",
    harga: 9000,
    warna: "#3a2214",
    jenis: "Arabika",
    asal: "Tapanuli, Sumatera Utara",
    rasa: "Earthy, body penuh, sisa rasa cokelat",
    cerita:
      "Nama Mandailing dipakai untuk arabika dari dataran tinggi Sumatera Utara sejak masa perdagangan kolonial. Biasanya diproses giling basah, yang memberi rasa earthy dan body tebal. Banyak penikmat kopi luar negeri mengenal kopi Sumatra lewat nama ini.",
    peta: { x: 175, y: 196 },
    tersedia: true,
  },
  {
    id: "toraja",
    nama: "Toraja",
    harga: 10000,
    warna: "#24140c",
    jenis: "Arabika",
    asal: "Tana Toraja, Sulawesi Selatan",
    rasa: "Asam rendah, nada cokelat dan rempah",
    cerita:
      "Tumbuh di pegunungan Tana Toraja yang terkenal dengan rumah adat tongkonan. Kopinya berkarakter tebal dengan keasaman rendah, sering disebut punya nada cokelat gelap dan rempah. Cocok untuk yang suka kopi kuat tapi tidak terlalu asam.",
    peta: { x: 640, y: 228 },
    tersedia: true,
  },
  {
    id: "kintamani",
    nama: "Kintamani",
    harga: 10000,
    warna: "#5a3520",
    jenis: "Arabika",
    asal: "Kintamani, Bali",
    rasa: "Segar, asam seperti jeruk, ringan",
    cerita:
      "Kebunnya berada di dataran tinggi sekitar Gunung Batur. Kopi sering ditanam berdampingan dengan pohon jeruk, dan petaninya diatur lewat sistem subak abian. Hasilnya kopi yang segar dengan asam menyerupai jeruk.",
    peta: { x: 538, y: 342 },
    tersedia: true,
  },
];

export const CABANG = [
  { id: "medan", nama: "Medan", antrian: 6, info: "Cabang utama, paling ramai" },
  { id: "siantar", nama: "Pematangsiantar", antrian: 4, info: "Suasana santai, dekat pusat kota" },
  { id: "binjai", nama: "Binjai", antrian: 3, info: "Antrean paling singkat" },
];

export const UKURAN = {
  kecil: { label: "Kecil", ml: "250 ml", tambah: 0, w: 92, h: 140, menit: 0 },
  sedang: { label: "Sedang", ml: "350 ml", tambah: 3000, w: 110, h: 170, menit: 0.5 },
  besar: { label: "Besar", ml: "500 ml", tambah: 6000, w: 130, h: 205, menit: 1 },
};
export const URUTAN_UKURAN = ["kecil", "sedang", "besar"];

export const LEVEL_PAHIT = [
  null,
  { label: "Lembut", tambah: 0 },
  { label: "Ringan", tambah: 0 },
  { label: "Seimbang", tambah: 0 },
  { label: "Kuat (+1 shot)", tambah: 2000 },
  { label: "Pahit Mantap (+2 shot)", tambah: 4000 },
];

export const OPSI = {
  gula: ["Tanpa", "Sedikit", "Normal", "Manis"],
  susu: ["Tanpa", "Sedikit", "Sedang", "Banyak"],
  es: ["Panas", "Sedikit", "Normal", "Banyak"],
};

export const HARGA_SUSU_PER_LEVEL = 1500;
export const HARGA_ES = 1000;

export const VOUCHER = [
  {
    kode: "WARKOP10",
    judul: "Diskon 10%",
    info: "Maks. Rp8.000",
    tipe: "persen",
    nilai: 10,
    maks: 8000,
    minimal: 0,
  },
  {
    kode: "HEMAT5K",
    judul: "Potongan Rp5.000",
    info: "Min. belanja Rp25.000",
    tipe: "potong",
    nilai: 5000,
    minimal: 25000,
  },
  {
    kode: "NGOPIPAGI",
    judul: "Diskon 15% pagi",
    info: "Berlaku sebelum jam 11.00",
    tipe: "persen",
    nilai: 15,
    maks: 10000,
    minimal: 0,
    sebelumJam: 11,
  },
];

export const RACIKAN_AWAL = {
  kopiId: "",
  ukuran: "sedang",
  pahit: 3,
  gula: 0,
  susu: 0,
  es: 0,
  catatan: "",
};

export const LANGKAH = [
  { id: "diterima", label: "Diterima", ket: "Pesanan masuk ke kasir" },
  { id: "diracik", label: "Diracik", ket: "Barista sedang menyeduh" },
  { id: "diantar", label: "Diantar", ket: "Gelas meluncur ke mejamu" },
  { id: "selesai", label: "Selesai", ket: "Selamat menikmati!" },
];

// mode demo: waktu dipercepat supaya alur bisa dilihat dalam beberapa detik
export const JEDA_LANGKAH = [0, 3000, 8000, 12000];
