import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";
import Warung from "../components/Warung";
import { useApp } from "../context/AppContext";
import { CABANG, LANGKAH } from "../data/menu";
import { langkahPesanan, rupiah } from "../utils/harga";

const UCAPAN = [
  "Pesanan saya sudah masuk, kan?",
  "Wah, wanginya sampai sini!",
  "Nah, itu dia datang!",
  "Mantap! Makasih, Bang!",
];
const EFEK_LANGKAH = [null, "tuang", "geser", "sukses"];

export default function LacakPage({ idPesanan, pindah }) {
  const { pesanan, menu, user, play } = useApp();
  const order = pesanan.find((p) => p.id === idPesanan) ?? pesanan.find((p) => p.userId === user.id);

  const [sekarang, setSekarang] = useState(() => Date.now());
  const langkah = order ? langkahPesanan(order, sekarang) : 0;
  const selesai = langkah === LANGKAH.length - 1;

  // perbarui waktu selama pesanan belum selesai
  useEffect(() => {
    if (selesai) return;
    const t = setInterval(() => setSekarang(Date.now()), 400);
    return () => clearInterval(t);
  }, [selesai]);

  // efek suara setiap status berganti
  const sebelumnya = useRef(langkah);
  useEffect(() => {
    if (langkah !== sebelumnya.current) {
      const efek = EFEK_LANGKAH[langkah];
      if (efek) play(efek);
      sebelumnya.current = langkah;
    }
  }, [langkah, play]);

  if (!order) {
    return (
      <div className="kosong halaman-kosong">
        <Icon nama="struk" ukuran={48} />
        <p>Belum ada pesanan untuk dilacak.</p>
        <button type="button" className="tombol" onClick={() => pindah("pesan")}>Mulai pesan</button>
      </div>
    );
  }

  const itemUtama = order.items[0];
  const kopiUtama = menu.find((m) => m.id === itemUtama.racikan.kopiId);
  const cabang = CABANG.find((c) => c.id === order.cabangId);
  const statusAdegan = langkah === 2 ? "antar" : langkah === 3 ? "selesai" : "pesan";
  const jumlahGelas = order.items.reduce((t, i) => t + i.qty, 0);
  const isiQR = [
    "WARKOP NAIBAHO",
    `ID: ${order.id}`,
    `Cabang: ${cabang?.nama}`,
    `Pemesan: ${order.namaPelanggan}`,
    `${jumlahGelas} gelas, total ${rupiah(order.total)}`,
  ].join("\n");

  return (
    <div className="hal-lacak">
      <div className="lacak-kiri">
        <div className="kartu stepper-kartu">
          <div className="stepper-judul">
            <h2>Status pesanan</h2>
            <span className="kode-pesanan">{order.id}</span>
          </div>
          <div className="stepper">
            <div className="stepper-rel">
              <motion.div
                className="stepper-isi"
                initial={false}
                animate={{ width: `${(langkah / (LANGKAH.length - 1)) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </div>
            {LANGKAH.map((l, i) => (
              <div key={l.id} className={`langkah ${i <= langkah ? "lewat" : ""} ${i === langkah ? "kini" : ""}`}>
                <motion.span
                  className="bulatan"
                  animate={i === langkah && !selesai ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                  transition={{ repeat: i === langkah && !selesai ? Infinity : 0, duration: 1.2 }}
                >
                  {i < langkah || selesai ? <Icon nama="cek" ukuran={16} /> : i + 1}
                </motion.span>
                <strong>{l.label}</strong>
                <small>{l.ket}</small>
              </div>
            ))}
          </div>
          {!selesai && (
            <p className="catatan-demo">
              Estimasi siap {order.estimasi.min}–{order.estimasi.max} menit. Mode demo: prosesnya dipercepat jadi beberapa detik.
            </p>
          )}
        </div>

        <Warung
          kopi={kopiUtama}
          racikan={itemUtama.racikan}
          status={statusAdegan}
          isi={langkah >= 1 ? 1 : 0}
          lambat
          ucapan={UCAPAN[langkah]}
          cabangId={order.cabangId}
        >
          {jumlahGelas > 1 && (
            <div className="lencana-adegan">
              <span className="lencana-est">+{jumlahGelas - 1} gelas lainnya</span>
            </div>
          )}
        </Warung>
      </div>

      <motion.div className="struk-kartu" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
        <h3>WARKOP NAIBAHO</h3>
        <p className="tengah">Cabang {cabang?.nama}</p>
        <p className="tengah">
          {new Date(order.dibuat).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
        </p>

        <div className="qr-bingkai">
          <QRCodeSVG value={isiQR} size={148} bgColor="#fffdf6" fgColor="#2b1a12" level="M" />
          <small>Tunjukkan QR ini ke kasir</small>
        </div>

        <hr />
        <p><span>Pemesan</span><span>{order.namaPelanggan}</span></p>
        <hr />
        {order.items.map((it, i) => (
          <div key={i} className="baris-struk">
            <p>
              <span>{it.qty}x {menu.find((m) => m.id === it.racikan.kopiId)?.nama ?? "Kopi"}</span>
              <span>{rupiah(it.hargaSatuan * it.qty)}</span>
            </p>
            <small>{it.label}</small>
          </div>
        ))}
        <hr />
        <p><span>Subtotal</span><span>{rupiah(order.subtotal)}</span></p>
        {order.potongan > 0 && (
          <p><span>Voucher {order.voucher}</span><span>-{rupiah(order.potongan)}</span></p>
        )}
        <p className="jumlah"><span>TOTAL</span><span>{rupiah(order.total)}</span></p>
        <hr />
        <p className="tengah">Status: {LANGKAH[langkah].label.toUpperCase()}</p>

        <div className="tombol-baris">
          <button type="button" className="tombol kecil" onClick={() => pindah("pesan")}>Pesan lagi</button>
          <button type="button" className="tombol kecil sekunder" onClick={() => pindah("riwayat")}>Riwayat</button>
        </div>
      </motion.div>
    </div>
  );
}
