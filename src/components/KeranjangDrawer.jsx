import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { CABANG, VOUCHER } from "../data/menu";
import {
  buatIdPesanan,
  cekVoucher,
  estimasi,
  isHappyHour,
  labelRacikan,
  rincianHarga,
  rupiah,
} from "../utils/harga";
import Gelas from "./Gelas";
import Icon from "./Icon";

export default function KeranjangDrawer({ terbuka, tutup, setelahCheckout }) {
  const { keranjang, setKeranjang, menu, cabangId, setCabangId, user, setPesanan, play, toast } = useApp();
  const [kode, setKode] = useState("");
  const [voucher, setVoucher] = useState(null); // kode yang sudah dipakai
  const [pesanVoucher, setPesanVoucher] = useState("");

  const sekarang = new Date();
  const baris = keranjang
    .map((item) => ({ ...item, harga: rincianHarga(item.racikan, menu, sekarang) }))
    .filter((b) => b.harga); // menu yang dihapus admin otomatis hilang

  const subtotal = baris.reduce((t, b) => t + b.harga.total * b.qty, 0);
  const hasilVoucher = voucher ? cekVoucher(voucher, subtotal, sekarang) : null;
  const potongan = hasilVoucher?.ok ? hasilVoucher.potongan : 0;
  const total = subtotal - potongan;
  const est = estimasi(cabangId, baris, sekarang);
  const adaHabis = baris.some((b) => !b.harga.kopi.tersedia);

  const ubahQty = (id, delta) => {
    play("klik");
    setKeranjang((k) =>
      k.map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0)
    );
  };

  const pakaiVoucher = (k) => {
    const hasil = cekVoucher(k, subtotal, sekarang);
    setPesanVoucher(hasil.pesan);
    if (hasil.ok) {
      setVoucher(hasil.voucher.kode);
      setKode(hasil.voucher.kode);
      play("ting");
      toast(`Voucher ${hasil.voucher.kode} berhasil dipakai`);
    } else {
      play("gagal");
    }
  };

  const checkout = () => {
    if (!baris.length || adaHabis) return;
    const pesananBaru = {
      id: buatIdPesanan(),
      userId: user.id,
      namaPelanggan: user.nama,
      cabangId,
      items: baris.map((b) => ({
        racikan: b.racikan,
        qty: b.qty,
        hargaSatuan: b.harga.total,
        label: labelRacikan(b.racikan, menu),
      })),
      subtotal,
      potongan,
      voucher: hasilVoucher?.ok ? voucher : null,
      total,
      estimasi: { min: est.min, max: est.max },
      dibuat: Date.now(),
    };
    setPesanan((p) => [pesananBaru, ...p]);
    setKeranjang([]);
    setVoucher(null);
    setKode("");
    setPesanVoucher("");
    play("sukses");
    toast(`Pesanan ${pesananBaru.id} dikirim ke dapur`);
    setelahCheckout(pesananBaru.id);
  };

  return (
    <AnimatePresence>
      {terbuka && (
        <>
          <motion.div
            className="latar-gelap"
            onClick={tutup}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="laci"
            role="dialog"
            aria-label="Keranjang"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <div className="laci-kepala">
              <h2>
                <Icon nama="keranjang" /> Keranjang
              </h2>
              <button type="button" className="ikon-tombol" onClick={tutup} aria-label="Tutup keranjang">
                <Icon nama="tutup" />
              </button>
            </div>

            {baris.length === 0 ? (
              <div className="kosong">
                <Icon nama="kopi" ukuran={44} />
                <p>Keranjang masih kosong.</p>
                <small>Racik kopimu dulu, lalu tekan "Tambah ke Keranjang".</small>
              </div>
            ) : (
              <>
                <ul className="daftar-item">
                  <AnimatePresence initial={false}>
                    {baris.map((b) => (
                      <motion.li
                        key={b.id}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30, height: 0, marginBottom: 0 }}
                        className="item-keranjang"
                      >
                        <div className="item-gelas">
                          <Gelas kopi={b.harga.kopi} racikan={b.racikan} mini />
                        </div>
                        <div className="item-info">
                          <strong>{b.harga.kopi.nama}</strong>
                          <small>{labelRacikan(b.racikan, menu)}</small>
                          {b.racikan.catatan && <small className="catatan">"{b.racikan.catatan}"</small>}
                          {!b.harga.kopi.tersedia && <small className="teks-error">Sedang habis</small>}
                          <div className="qty">
                            <button type="button" onClick={() => ubahQty(b.id, -1)} aria-label="Kurangi">
                              <Icon nama={b.qty === 1 ? "sampah" : "kurang"} ukuran={14} />
                            </button>
                            <span>{b.qty}</span>
                            <button type="button" onClick={() => ubahQty(b.id, 1)} aria-label="Tambah">
                              <Icon nama="tambah" ukuran={14} />
                            </button>
                          </div>
                        </div>
                        <strong className="item-harga">{rupiah(b.harga.total * b.qty)}</strong>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="blok-laci">
                  <span className="label-kecil">
                    <Icon nama="toko" ukuran={14} /> Cabang
                  </span>
                  <div className="chip-baris">
                    {CABANG.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        className={`chip ${cabangId === c.id ? "aktif" : ""}`}
                        onClick={() => setCabangId(c.id)}
                      >
                        {c.nama}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="blok-laci">
                  <span className="label-kecil">
                    <Icon nama="tag" ukuran={14} /> Voucher
                  </span>
                  <div className="voucher-input">
                    <input
                      value={kode}
                      onChange={(e) => {
                        setKode(e.target.value.toUpperCase());
                        setPesanVoucher("");
                      }}
                      placeholder="Masukkan kode"
                      aria-label="Kode voucher"
                    />
                    {voucher ? (
                      <button
                        type="button"
                        onClick={() => {
                          setVoucher(null);
                          setKode("");
                          setPesanVoucher("");
                        }}
                      >
                        Lepas
                      </button>
                    ) : (
                      <button type="button" onClick={() => pakaiVoucher(kode)} disabled={!kode}>
                        Pakai
                      </button>
                    )}
                  </div>
                  {pesanVoucher && (
                    <small className={hasilVoucher?.ok ? "teks-sukses" : "teks-error"}>{pesanVoucher}</small>
                  )}
                  {voucher && hasilVoucher && !hasilVoucher.ok && (
                    <small className="teks-error">{hasilVoucher.pesan}</small>
                  )}
                  <div className="kupon-baris">
                    {VOUCHER.map((v) => (
                      <button
                        type="button"
                        key={v.kode}
                        className={`kupon ${voucher === v.kode ? "aktif" : ""}`}
                        onClick={() => pakaiVoucher(v.kode)}
                      >
                        <b>{v.kode}</b>
                        <span>{v.judul}</span>
                        <small>{v.info}</small>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ringkasan">
                  {isHappyHour(sekarang) && <p className="happy">Happy hour aktif: semua minuman -10%</p>}
                  <p>
                    <span>Subtotal</span>
                    <span>{rupiah(subtotal)}</span>
                  </p>
                  {potongan > 0 && (
                    <p className="teks-sukses">
                      <span>Voucher {voucher}</span>
                      <span>-{rupiah(potongan)}</span>
                    </p>
                  )}
                  <p className="besar">
                    <span>Total</span>
                    <motion.span key={total} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                      {rupiah(total)}
                    </motion.span>
                  </p>
                  <p className="estimasi-baris">
                    <Icon nama="jam" ukuran={14} />
                    Siap sekitar {est.min}–{est.max} menit
                    {est.sibuk && <em> (jam sibuk)</em>}
                  </p>
                </div>

                <button type="button" className="tombol" onClick={checkout} disabled={adaHabis}>
                  {adaHabis ? "Ada menu yang habis" : `Pesan Sekarang · ${rupiah(total)}`}
                </button>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
