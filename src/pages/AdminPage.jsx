import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { CABANG, MENU_AWAL } from "../data/menu";
import { rupiah } from "../utils/harga";

function Batang({ data, format = (v) => v }) {
  const maks = Math.max(1, ...data.map((d) => d.nilai));
  return (
    <ul className="batang-daftar">
      {data.map((d, i) => (
        <li key={d.label}>
          <span className="batang-label">{d.label}</span>
          <div className="batang-rel">
            <motion.div
              className="batang-isi"
              style={{ background: d.warna }}
              initial={{ width: 0 }}
              animate={{ width: `${(d.nilai / maks) * 100}%` }}
              transition={{ delay: i * 0.06, duration: 0.6, ease: "easeOut" }}
            />
          </div>
          <span className="batang-nilai">{format(d.nilai)}</span>
        </li>
      ))}
    </ul>
  );
}

function Statistik() {
  const { pesanan, menu } = useApp();
  const [filter, setFilter] = useState("semua");
  const data = pesanan.filter((p) => filter === "semua" || p.cabangId === filter);

  const pendapatan = data.reduce((t, p) => t + p.total, 0);
  const gelas = data.reduce((t, p) => t + p.items.reduce((s, i) => s + i.qty, 0), 0);

  const perMenu = {};
  data.forEach((p) =>
    p.items.forEach((it) => {
      const id = it.racikan.kopiId;
      perMenu[id] = perMenu[id] || { gelas: 0, uang: 0 };
      perMenu[id].gelas += it.qty;
      perMenu[id].uang += it.hargaSatuan * it.qty;
    })
  );
  const dataMenu = Object.entries(perMenu)
    .map(([id, v]) => {
      const m = menu.find((x) => x.id === id);
      return { label: m?.nama ?? id, nilai: v.gelas, warna: "linear-gradient(90deg, var(--aksen-gelap), var(--aksen))" };
    })
    .sort((a, b) => b.nilai - a.nilai);

  const dataCabang = CABANG.map((c) => ({
    label: c.nama,
    nilai: pesanan.filter((p) => p.cabangId === c.id).reduce((t, p) => t + p.total, 0),
    warna: "linear-gradient(90deg, var(--aksen-gelap), var(--aksen))",
  }));

  // pendapatan 7 hari terakhir
  const hari = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });
  const perHari = hari.map((d) => {
    const akhir = d.getTime() + 864e5;
    return {
      label: d.toLocaleDateString("id-ID", { weekday: "short" }),
      nilai: data.filter((p) => p.dibuat >= d.getTime() && p.dibuat < akhir).reduce((t, p) => t + p.total, 0),
    };
  });
  const maksHari = Math.max(1, ...perHari.map((h) => h.nilai));

  const kartu = [
    { label: "Pendapatan", nilai: rupiah(pendapatan), ikon: "grafik" },
    { label: "Pesanan", nilai: data.length, ikon: "struk" },
    { label: "Gelas terjual", nilai: gelas, ikon: "kopi" },
    { label: "Rata-rata / pesanan", nilai: rupiah(data.length ? pendapatan / data.length : 0), ikon: "tag" },
    { label: "Terlaris", nilai: dataMenu[0]?.label ?? "-", ikon: "hati" },
  ];

  return (
    <>
      <div className="chip-baris">
        {[{ id: "semua", nama: "Semua cabang" }, ...CABANG].map((c) => (
          <button type="button" key={c.id} className={`chip ${filter === c.id ? "aktif" : ""}`} onClick={() => setFilter(c.id)}>
            {c.nama}
          </button>
        ))}
      </div>

      <div className="grid-statistik">
        {kartu.map((k, i) => (
          <motion.div key={k.label} className="kartu kartu-angka" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <span className="ikon-bulat"><Icon nama={k.ikon} ukuran={18} /></span>
            <small>{k.label}</small>
            <b>{k.nilai}</b>
          </motion.div>
        ))}
      </div>

      <div className="grid-grafik">
        <div className="kartu">
          <h3>Gelas terjual per menu</h3>
          {dataMenu.length ? <Batang data={dataMenu} format={(v) => `${v} gelas`} /> : <p className="redup">Belum ada data.</p>}
        </div>
        <div className="kartu">
          <h3>Pendapatan 7 hari terakhir</h3>
          <div className="grafik-kolom">
            {perHari.map((h, i) => (
              <div key={i} className="kolom-hari" title={rupiah(h.nilai)}>
                <span className="nilai-kolom">{h.nilai ? `${Math.round(h.nilai / 1000)}rb` : ""}</span>
                <motion.div
                  className="kolom-isi"
                  initial={{ height: 0 }}
                  animate={{ height: `${(h.nilai / maksHari) * 100}%` }}
                  transition={{ delay: i * 0.06, duration: 0.6 }}
                />
                <small>{h.label}</small>
              </div>
            ))}
          </div>
        </div>
        <div className="kartu">
          <h3>Pendapatan per cabang</h3>
          <Batang data={dataCabang} format={rupiah} />
        </div>
      </div>

      <div className="kartu">
        <h3>Pesanan terbaru</h3>
        <div className="tabel-gulir">
          <table className="tabel">
            <thead>
              <tr><th>ID</th><th>Waktu</th><th>Pemesan</th><th>Cabang</th><th>Gelas</th><th>Total</th></tr>
            </thead>
            <tbody>
              {data.slice(0, 8).map((p) => (
                <tr key={p.id}>
                  <td><b>{p.id}</b></td>
                  <td>{new Date(p.dibuat).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td>{p.namaPelanggan}</td>
                  <td>{CABANG.find((c) => c.id === p.cabangId)?.nama}</td>
                  <td>{p.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td>{rupiah(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const MENU_BARU = { nama: "", harga: 8000, jenis: "Arabika", asal: "", rasa: "", warna: "#4a2c1a" };

function KelolaMenu() {
  const { menu, setMenu, toast, play } = useApp();
  const [baru, setBaru] = useState(MENU_BARU);
  const [error, setError] = useState("");

  const ubahMenu = (id, kunci, nilai) => setMenu((m) => m.map((x) => (x.id === id ? { ...x, [kunci]: nilai } : x)));

  const hapus = (m) => {
    if (!window.confirm(`Hapus ${m.nama} dari menu?`)) return;
    setMenu((list) => list.filter((x) => x.id !== m.id));
    toast(`${m.nama} dihapus dari menu`, "info");
  };

  const tambah = (e) => {
    e.preventDefault();
    if (baru.nama.trim().length < 2) return setError("Nama menu minimal 2 huruf");
    if (!(baru.harga >= 1000)) return setError("Harga minimal Rp1.000");
    if (menu.some((m) => m.nama.toLowerCase() === baru.nama.trim().toLowerCase())) return setError("Nama menu sudah ada");
    const id = baru.nama.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36).slice(-3);
    setMenu((m) => [...m, { ...baru, id, nama: baru.nama.trim(), harga: Number(baru.harga), cerita: "", peta: null, tersedia: true }]);
    setBaru(MENU_BARU);
    setError("");
    play("ting");
    toast(`${baru.nama.trim()} ditambahkan ke menu`);
  };

  return (
    <div className="kelola">
      <div className="kartu">
        <div className="kartu-judul">
          <h3>Daftar menu ({menu.length})</h3>
          <button
            type="button"
            className="tombol-teks"
            onClick={() => {
              if (window.confirm("Kembalikan menu ke data awal?")) {
                setMenu(MENU_AWAL);
                toast("Menu dikembalikan ke awal", "info");
              }
            }}
          >
            <Icon nama="ulang" ukuran={16} /> Reset menu
          </button>
        </div>
        <div className="tabel-gulir">
          <table className="tabel tabel-menu">
            <thead>
              <tr><th>Warna</th><th>Nama</th><th>Jenis</th><th>Harga</th><th>Tersedia</th><th /></tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {menu.map((m) => (
                  <motion.tr key={m.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <td><input type="color" value={m.warna} onChange={(e) => ubahMenu(m.id, "warna", e.target.value)} aria-label={`Warna ${m.nama}`} /></td>
                    <td><input className="sel" value={m.nama} onChange={(e) => ubahMenu(m.id, "nama", e.target.value)} aria-label="Nama menu" /></td>
                    <td>
                      <select className="sel" value={m.jenis} onChange={(e) => ubahMenu(m.id, "jenis", e.target.value)} aria-label="Jenis">
                        <option>Arabika</option><option>Robusta</option><option>Liberika</option>
                      </select>
                    </td>
                    <td><input className="sel angka" type="number" min={1000} step={500} value={m.harga} onChange={(e) => ubahMenu(m.id, "harga", Number(e.target.value))} aria-label="Harga" /></td>
                    <td>
                      <button type="button" role="switch" aria-checked={m.tersedia} className={`saklar ${m.tersedia ? "nyala" : ""}`} onClick={() => ubahMenu(m.id, "tersedia", !m.tersedia)} aria-label={`Ketersediaan ${m.nama}`}>
                        <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 30 }} />
                      </button>
                    </td>
                    <td>
                      <button type="button" className="ikon-tombol kecil bahaya" onClick={() => hapus(m)} aria-label={`Hapus ${m.nama}`}>
                        <Icon nama="sampah" ukuran={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <small className="redup">Perubahan langsung tersimpan dan terlihat di halaman Pesan.</small>
      </div>

      <form className="kartu form-menu" onSubmit={tambah} noValidate>
        <h3>Tambah menu baru</h3>
        <label>Nama<input value={baru.nama} onChange={(e) => setBaru({ ...baru, nama: e.target.value })} placeholder="contoh: Kopi Lintong" /></label>
        <div className="dua-kolom">
          <label>Harga<input type="number" min={1000} step={500} value={baru.harga} onChange={(e) => setBaru({ ...baru, harga: Number(e.target.value) })} /></label>
          <label>Jenis
            <select value={baru.jenis} onChange={(e) => setBaru({ ...baru, jenis: e.target.value })}>
              <option>Arabika</option><option>Robusta</option><option>Liberika</option>
            </select>
          </label>
        </div>
        <label>Asal<input value={baru.asal} onChange={(e) => setBaru({ ...baru, asal: e.target.value })} placeholder="contoh: Humbang Hasundutan" /></label>
        <label>Catatan rasa<input value={baru.rasa} onChange={(e) => setBaru({ ...baru, rasa: e.target.value })} placeholder="contoh: herbal, manis karamel" /></label>
        <label className="label-warna">Warna seduhan<input type="color" value={baru.warna} onChange={(e) => setBaru({ ...baru, warna: e.target.value })} /></label>
        {error && <p className="teks-error">{error}</p>}
        <button type="submit" className="tombol"><Icon nama="tambah" ukuran={18} /> Tambah menu</button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  const [tab, setTab] = useState("statistik");
  return (
    <div className="hal-admin">
      <div className="judul-hal">
        <div>
          <h1>Dashboard Admin</h1>
          <p className="redup">Pantau penjualan dan atur menu semua cabang.</p>
        </div>
        <div className="tab-admin" role="tablist">
          {[
            { id: "statistik", label: "Statistik" },
            { id: "menu", label: "Kelola Menu" },
          ].map((t) => (
            <button type="button" key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "aktif" : ""} onClick={() => setTab(t.id)}>
              {tab === t.id && <motion.span layoutId="tab-admin" className="sorot" />}
              <span className="teks-opsi">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="isi-admin">
          {tab === "statistik" ? <Statistik /> : <KelolaMenu />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
