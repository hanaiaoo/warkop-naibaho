import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Gelas from "../components/Gelas";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { CABANG, LANGKAH } from "../data/menu";
import { langkahPesanan, rupiah } from "../utils/harga";

export default function RiwayatPage({ pindah }) {
  const { pesanan, user, menu, tambahKeKeranjang, play, toast } = useApp();
  const milikku = pesanan.filter((p) => p.userId === user.id);
  const [sekarang, setSekarang] = useState(() => Date.now());

  // agar status pesanan yang masih berjalan ikut berubah
  const adaYangJalan = milikku.some((p) => langkahPesanan(p, sekarang) < LANGKAH.length - 1);
  useEffect(() => {
    if (!adaYangJalan) return;
    const t = setInterval(() => setSekarang(Date.now()), 1000);
    return () => clearInterval(t);
  }, [adaYangJalan]);

  const pesanUlang = (p) => {
    const masih = p.items.filter((it) => menu.some((m) => m.id === it.racikan.kopiId));
    masih.forEach((it) => tambahKeKeranjang(it.racikan, it.qty));
    play("ting");
    toast(`${masih.length} racikan dari ${p.id} masuk keranjang`);
  };

  const totalBelanja = milikku.reduce((t, p) => t + p.total, 0);
  const totalGelas = milikku.reduce((t, p) => t + p.items.reduce((s, i) => s + i.qty, 0), 0);

  return (
    <div className="hal-daftar">
      <div className="judul-hal">
        <div>
          <h1>Riwayat Pesanan</h1>
          <p className="redup">Semua kopi yang pernah kamu pesan.</p>
        </div>
        {milikku.length > 0 && (
          <div className="mini-statistik">
            <span><b>{milikku.length}</b> pesanan</span>
            <span><b>{totalGelas}</b> gelas</span>
            <span><b>{rupiah(totalBelanja)}</b> total</span>
          </div>
        )}
      </div>

      {milikku.length === 0 ? (
        <div className="kosong halaman-kosong">
          <Icon nama="struk" ukuran={48} />
          <p>Belum ada riwayat. Pesanan pertamamu akan muncul di sini.</p>
          <button type="button" className="tombol" onClick={() => pindah("pesan")}>Pesan kopi</button>
        </div>
      ) : (
        <div className="grid-riwayat">
          {milikku.map((p, i) => {
            const langkah = langkahPesanan(p, sekarang);
            const it = p.items[0];
            const kopi = menu.find((m) => m.id === it.racikan.kopiId);
            return (
              <motion.article
                key={p.id}
                className="kartu kartu-riwayat"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
              >
                <div className="riwayat-gelas">
                  <Gelas kopi={kopi} racikan={it.racikan} mini />
                </div>
                <div className="riwayat-info">
                  <div className="riwayat-atas">
                    <strong>{p.id}</strong>
                    <span className={`status status-${LANGKAH[langkah].id}`}>{LANGKAH[langkah].label}</span>
                  </div>
                  <small className="redup">
                    {new Date(p.dibuat).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })} · {CABANG.find((c) => c.id === p.cabangId)?.nama}
                  </small>
                  <ul>
                    {p.items.map((x, k) => (
                      <li key={k}>{x.qty}x {x.label}</li>
                    ))}
                  </ul>
                  <div className="riwayat-bawah">
                    <b>{rupiah(p.total)}</b>
                    <div className="tombol-baris">
                      <button type="button" className="tombol-teks" onClick={() => pindah("lacak", p.id)}>
                        <Icon nama="qr" ukuran={16} /> Lacak & QR
                      </button>
                      <button type="button" className="tombol-teks" onClick={() => pesanUlang(p)}>
                        <Icon nama="ulang" ukuran={16} /> Pesan lagi
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
  );
}
