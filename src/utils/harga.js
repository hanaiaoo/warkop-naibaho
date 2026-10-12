import {
  CABANG,
  HARGA_ES,
  HARGA_SUSU_PER_LEVEL,
  JEDA_LANGKAH,
  LEVEL_PAHIT,
  OPSI,
  UKURAN,
  VOUCHER,
} from "../data/menu";

export const rupiah = (n) => "Rp" + Math.round(n || 0).toLocaleString("id-ID");

// Happy hour: jam 14.00 - 16.59, semua minuman diskon 10%
export const isHappyHour = (waktu = new Date()) => {
  const jam = waktu.getHours();
  return jam >= 14 && jam < 17;
};

const bulatkanRatusan = (n) => Math.round(n / 100) * 100;

// Rincian harga satu gelas (harga dinamis)
export function rincianHarga(racikan, menu, waktu = new Date()) {
  const kopi = menu.find((m) => m.id === racikan.kopiId);
  if (!kopi) return null;

  const ukuran = UKURAN[racikan.ukuran];
  const pahit = LEVEL_PAHIT[racikan.pahit];

  const bagian = [
    { label: `Kopi ${kopi.nama}`, nilai: kopi.harga },
    { label: `Ukuran ${ukuran.label}`, nilai: ukuran.tambah },
    { label: `Susu ${OPSI.susu[racikan.susu].toLowerCase()}`, nilai: racikan.susu * HARGA_SUSU_PER_LEVEL },
    { label: "Es batu", nilai: racikan.es > 0 ? HARGA_ES : 0 },
    { label: "Shot tambahan", nilai: pahit.tambah },
  ].filter((b, i) => i === 0 || b.nilai > 0);

  const subtotal = bagian.reduce((t, b) => t + b.nilai, 0);
  const diskonHappyHour = isHappyHour(waktu) ? bulatkanRatusan(subtotal * 0.1) : 0;

  return { kopi, bagian, subtotal, diskonHappyHour, total: subtotal - diskonHappyHour };
}

export function labelRacikan(racikan, menu) {
  const kopi = menu.find((m) => m.id === racikan.kopiId);
  if (!kopi) return "Kopi";
  const potongan = [`${kopi.nama} ${UKURAN[racikan.ukuran].label}`];
  potongan.push(racikan.es === 0 ? "Panas" : `Es ${OPSI.es[racikan.es].toLowerCase()}`);
  if (racikan.susu > 0) potongan.push(`susu ${OPSI.susu[racikan.susu].toLowerCase()}`);
  potongan.push(`gula ${OPSI.gula[racikan.gula].toLowerCase()}`);
  potongan.push(`pahit ${racikan.pahit}/5`);
  return potongan.join(", ");
}

export function cekVoucher(kode, subtotal, waktu = new Date()) {
  const v = VOUCHER.find((x) => x.kode === kode.trim().toUpperCase());
  if (!v) return { ok: false, pesan: "Kode voucher tidak dikenal" };
  if (subtotal < v.minimal) return { ok: false, pesan: `Minimal belanja ${rupiah(v.minimal)}` };
  if (v.sebelumJam && waktu.getHours() >= v.sebelumJam)
    return { ok: false, pesan: `Hanya berlaku sebelum jam ${v.sebelumJam}.00` };

  let potongan = v.tipe === "persen" ? (subtotal * v.nilai) / 100 : v.nilai;
  if (v.maks) potongan = Math.min(potongan, v.maks);
  potongan = Math.min(bulatkanRatusan(potongan), subtotal);
  return { ok: true, potongan, voucher: v, pesan: `${v.judul} dipakai` };
}

// Jam sibuk: pagi, makan siang, pulang kerja
export const isJamSibuk = (waktu = new Date()) => {
  const j = waktu.getHours();
  return (j >= 7 && j < 9) || (j >= 12 && j < 13) || (j >= 17 && j < 19);
};

// Estimasi waktu siap (menit), dalam bentuk rentang
export function estimasi(cabangId, daftarRacikan, waktu = new Date()) {
  const cabang = CABANG.find((c) => c.id === cabangId) ?? CABANG[0];
  let menit = cabang.antrian;
  daftarRacikan.forEach(({ racikan, qty = 1 }) => {
    menit += qty * (1.5 + UKURAN[racikan.ukuran].menit + (racikan.pahit >= 4 ? 0.5 : 0));
  });
  if (isJamSibuk(waktu)) menit += 3;
  const min = Math.max(2, Math.round(menit));
  return { min, max: min + 3, sibuk: isJamSibuk(waktu) };
}

export function langkahPesanan(pesanan, sekarang = Date.now()) {
  const lewat = sekarang - pesanan.dibuat;
  let i = 0;
  JEDA_LANGKAH.forEach((jeda, k) => {
    if (lewat >= jeda) i = k;
  });
  return i;
}

// Warna kopi berubah mengikuti level kepahitan
export function warnaKopi(warnaDasar, pahit) {
  if (pahit <= 2) return `color-mix(in srgb, ${warnaDasar} ${60 + pahit * 12}%, #a0703f)`;
  if (pahit === 3) return warnaDasar;
  return `color-mix(in srgb, ${warnaDasar} ${100 - (pahit - 3) * 18}%, #000)`;
}

export const buatIdPesanan = () =>
  "WK-" + (Date.now().toString(36).slice(-4) + Math.random().toString(36).slice(2, 4)).toUpperCase();
