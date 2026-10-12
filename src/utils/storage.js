import { useEffect, useState } from "react";

// Semua data disimpan di localStorage browser (tidak ada server).
export function baca(kunci, bawaan) {
  try {
    const isi = localStorage.getItem(kunci);
    return isi ? JSON.parse(isi) : bawaan;
  } catch {
    return bawaan;
  }
}

export function simpan(kunci, nilai) {
  try {
    localStorage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    /* penyimpanan penuh / diblokir: abaikan */
  }
}

// useState yang otomatis tersimpan ke localStorage
// (bawaan boleh berupa fungsi, dipanggil hanya kalau data belum ada)
export function useTersimpan(kunci, bawaan) {
  const [nilai, setNilai] = useState(
    () => baca(kunci, undefined) ?? (typeof bawaan === "function" ? bawaan() : bawaan)
  );
  useEffect(() => simpan(kunci, nilai), [kunci, nilai]);
  return [nilai, setNilai];
}

// Hash password (SHA-256). Ini hanya untuk demo tugas, bukan pengganti backend.
export async function hashPassword(password) {
  const teks = "warkop-sederhana:" + password;
  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(teks));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // cadangan bila dibuka lewat http non-localhost
  let h = 5381;
  for (const c of teks) h = (h * 33) ^ c.charCodeAt(0);
  return "x" + (h >>> 0).toString(16);
}
