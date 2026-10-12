import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CABANG, MENU_AWAL, RACIKAN_AWAL, URUTAN_UKURAN } from "../data/menu";
import { labelRacikan, rincianHarga } from "../utils/harga";
import { hashPassword, useTersimpan } from "../utils/storage";
import { EFEK } from "../utils/suara";

const AppContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);

// Data penjualan contoh supaya dashboard admin tidak kosong saat pertama dibuka
function buatPesananContoh() {
  let benih = 7;
  const acak = () => (benih = (benih * 9301 + 49297) % 233280) / 233280;
  const namaPembeli = ["Budi", "Sari", "Rina", "Tono", "Uli", "Dedi", "Maya", "Joko"];
  const sekarang = Date.now();
  const hasil = [];

  for (let i = 0; i < 18; i++) {
    const kopi = MENU_AWAL[Math.floor(acak() * MENU_AWAL.length)];
    const racikan = {
      ...RACIKAN_AWAL,
      kopiId: kopi.id,
      ukuran: URUTAN_UKURAN[Math.floor(acak() * 3)],
      pahit: 1 + Math.floor(acak() * 5),
      gula: Math.floor(acak() * 4),
      susu: Math.floor(acak() * 4),
      es: Math.floor(acak() * 4),
    };
    const qty = 1 + Math.floor(acak() * 3);
    const dibuat = sekarang - Math.floor(acak() * 6 * 24 * 3600e3) - 3600e3;
    const harga = rincianHarga(racikan, MENU_AWAL, new Date(dibuat));
    const subtotal = harga.total * qty;
    hasil.push({
      id: "WK-D" + (100 + i),
      userId: "demo",
      namaPelanggan: namaPembeli[Math.floor(acak() * namaPembeli.length)],
      cabangId: CABANG[Math.floor(acak() * CABANG.length)].id,
      items: [{ racikan, qty, hargaSatuan: harga.total, label: labelRacikan(racikan, MENU_AWAL) }],
      subtotal,
      potongan: 0,
      voucher: null,
      total: subtotal,
      estimasi: { min: 5, max: 8 },
      dibuat,
    });
  }
  return hasil.sort((a, b) => b.dibuat - a.dibuat);
}

const samaRacikan = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export function AppProvider({ children }) {
  const [users, setUsers] = useTersimpan("warkop_users", []);
  const [sesiId, setSesiId] = useTersimpan("warkop_sesi", null);
  const [tema, setTema] = useTersimpan("warkop_tema", "gelap");
  const [suaraAktif, setSuaraAktif] = useTersimpan("warkop_suara", true);
  const [menu, setMenu] = useTersimpan("warkop_menu", MENU_AWAL);
  const [pesanan, setPesanan] = useTersimpan("warkop_pesanan", buatPesananContoh);
  const [favorit, setFavorit] = useTersimpan("warkop_favorit", []);
  const [keranjang, setKeranjang] = useTersimpan("warkop_keranjang", []);
  const [cabangId, setCabangId] = useTersimpan("warkop_cabang", "medan");
  const [racikan, setRacikan] = useState(RACIKAN_AWAL);
  const [toasts, setToasts] = useState([]);

  const user = users.find((u) => u.id === sesiId) ?? null;

  // akun admin bawaan: admin / admin123
  useEffect(() => {
    if (users.some((u) => u.username === "admin")) return;
    hashPassword("admin123").then((hash) =>
      setUsers((prev) =>
        prev.some((u) => u.username === "admin")
          ? prev
          : [...prev, { id: "admin", nama: "Admin Warkop", username: "admin", hash, role: "admin" }]
      )
    );
  }, [users, setUsers]);

  // terapkan tema ke <html data-theme="...">
  useEffect(() => {
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  const play = useCallback(
    (nama) => {
      if (suaraAktif) EFEK[nama]?.();
    },
    [suaraAktif]
  );

  const toast = useCallback((pesan, tipe = "sukses") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, pesan, tipe }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const tutupToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  // ---------- Auth ----------
  const cekLogin = async (username, password) => {
    const akun = users.find((u) => u.username === username.trim().toLowerCase());
    if (!akun) return { ok: false, pesan: "Username belum terdaftar" };
    if (akun.hash !== (await hashPassword(password))) return { ok: false, pesan: "Password salah" };
    return { ok: true, user: akun };
  };

  const daftar = async ({ nama, username, password }) => {
    const uname = username.trim().toLowerCase();
    if (users.some((u) => u.username === uname)) return { ok: false, pesan: "Username sudah dipakai" };
    const akun = {
      id: "u" + Date.now().toString(36),
      nama: nama.trim(),
      username: uname,
      hash: await hashPassword(password),
      role: "pelanggan",
    };
    setUsers((prev) => [...prev, akun]);
    return { ok: true, user: akun };
  };

  const masuk = (akun) => setSesiId(akun.id);
  const keluar = () => {
    setSesiId(null);
    setKeranjang([]);
    setRacikan(RACIKAN_AWAL);
  };

  // ---------- Keranjang ----------
  const tambahKeKeranjang = (r, qty = 1) => {
    setKeranjang((k) => {
      const ada = k.find((i) => samaRacikan(i.racikan, r));
      if (ada) return k.map((i) => (i === ada ? { ...i, qty: i.qty + qty } : i));
      return [...k, { id: Math.random().toString(36).slice(2), racikan: { ...r }, qty }];
    });
  };

  // ---------- Favorit ----------
  const favoritSaya = favorit.filter((f) => f.userId === user?.id);
  const simpanFavorit = (r) => {
    if (favoritSaya.some((f) => samaRacikan(f.racikan, r))) return false;
    setFavorit((f) => [...f, { id: Math.random().toString(36).slice(2), userId: user.id, racikan: { ...r } }]);
    return true;
  };
  const hapusFavorit = (id) => setFavorit((f) => f.filter((x) => x.id !== id));

  const nilai = {
    user,
    users,
    cekLogin,
    daftar,
    masuk,
    keluar,
    tema,
    toggleTema: () => setTema((t) => (t === "gelap" ? "terang" : "gelap")),
    suaraAktif,
    toggleSuara: () => setSuaraAktif((s) => !s),
    play,
    toast,
    menu,
    setMenu,
    pesanan,
    setPesanan,
    favoritSaya,
    simpanFavorit,
    hapusFavorit,
    keranjang,
    setKeranjang,
    tambahKeKeranjang,
    cabangId,
    setCabangId,
    racikan,
    setRacikan,
    toasts,
    tutupToast,
  };

  return <AppContext.Provider value={nilai}>{children}</AppContext.Provider>;
}
