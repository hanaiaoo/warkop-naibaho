import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Gelas from "../components/Gelas";
import Icon from "../components/Icon";
import PilihLevel from "../components/PilihLevel";
import Warung from "../components/Warung";
import { useApp } from "../context/AppContext";
import { CABANG, LEVEL_PAHIT, OPSI, RACIKAN_AWAL, UKURAN, URUTAN_UKURAN } from "../data/menu";
import { estimasi, isHappyHour, rincianHarga, rupiah } from "../utils/harga";

const OPSI_UKURAN = URUTAN_UKURAN.map((k) => ({
  nilai: k,
  label: UKURAN[k].label,
  sub: `${UKURAN[k].ml}${UKURAN[k].tambah ? ` · +${UKURAN[k].tambah / 1000}rb` : ""}`,
}));
const OPSI_CABANG = CABANG.map((c) => ({ nilai: c.id, label: c.nama, sub: `antre ±${c.antrian} mnt` }));

// Komentar pelanggan berubah sesuai pilihan terakhir
function komentar(kunci, nilai, kopi) {
  switch (kunci) {
    case "kopiId":
      return `${kopi?.nama ?? "Kopi"}? Pilihan mantap!`;
    case "ukuran":
      return nilai === "besar" ? "Gelas besar, buat begadang ya?" : nilai === "kecil" ? "Kecil aja, icip-icip dulu." : "Ukuran pas, Bang.";
    case "pahit":
      return nilai >= 5 ? "Pahit mantap! Berani juga." : nilai <= 1 ? "Yang lembut-lembut saja." : `Kepahitan ${LEVEL_PAHIT[nilai].label.split(" (")[0].toLowerCase()}, oke.`;
    case "gula":
      return nilai === 0 ? "Tanpa gula, sehat!" : nilai === 3 ? "Manis kayak senyum kasir." : "Gulanya secukupnya ya.";
    case "susu":
      return nilai === 0 ? "Hitam pekat, klasik." : nilai === 3 ? "Susunya banyak, legit!" : "Kopi susu, enak ini.";
    case "es":
      return nilai === 0 ? "Panas-panas, nikmat." : nilai === 3 ? "Esnya banyak, segar!" : "Pakai es, cocok siang-siang.";
    case "cabang":
      return `Ngopi di ${CABANG.find((c) => c.id === nilai)?.nama}, siap!`;
    default:
      return "Mau ngopi apa hari ini, Bang?";
  }
}

export default function PesanPage({ pindah }) {
  const { menu, racikan, setRacikan, cabangId, setCabangId, tambahKeKeranjang, simpanFavorit, play, toast } = useApp();
  const [ucapan, setUcapan] = useState("Mau ngopi apa hari ini, Bang?");
  const [errorKopi, setErrorKopi] = useState("");

  const kopi = menu.find((m) => m.id === racikan.kopiId);
  const harga = rincianHarga(racikan, menu);
  const est = kopi ? estimasi(cabangId, [{ racikan, qty: 1 }]) : null;

  const ubah = (kunci, nilai) => {
    setRacikan((r) => ({ ...r, [kunci]: nilai }));
    if (kunci !== "catatan") setUcapan(komentar(kunci, nilai, menu.find((m) => m.id === (kunci === "kopiId" ? nilai : racikan.kopiId))));
    if (kunci === "kopiId") setErrorKopi("");
    const efek = { kopiId: "tuang", susu: "tuang", es: nilai > 0 ? "es" : "klik", ukuran: "gelas" }[kunci];
    play(efek ?? "klik");
  };

  const gantiUkuranLewatGelas = () => {
    const i = URUTAN_UKURAN.indexOf(racikan.ukuran);
    ubah("ukuran", URUTAN_UKURAN[(i + 1) % URUTAN_UKURAN.length]);
  };

  const pastikanKopi = () => {
    if (kopi) return true;
    setErrorKopi("Pilih jenis kopinya dulu, Bang");
    play("gagal");
    toast("Pilih jenis kopi dulu", "gagal");
    return false;
  };

  const tambah = (e) => {
    e.preventDefault();
    if (!pastikanKopi()) return;
    if (!kopi.tersedia) {
      toast(`${kopi.nama} sedang habis`, "gagal");
      play("gagal");
      return;
    }
    tambahKeKeranjang(racikan);
    play("ting");
    setUcapan("Siap, masuk keranjang!");
    toast(`${kopi.nama} ${UKURAN[racikan.ukuran].label} masuk keranjang`);
    setRacikan((r) => ({ ...r, catatan: "" }));
  };

  const favorit = () => {
    if (!pastikanKopi()) return;
    if (simpanFavorit(racikan)) {
      play("ting");
      toast("Racikan disimpan ke Favorit");
    } else {
      toast("Racikan ini sudah ada di Favorit", "info");
    }
  };

  const reset = () => {
    setRacikan(RACIKAN_AWAL);
    setUcapan("Mau ngopi apa hari ini, Bang?");
    play("klik");
  };

  return (
    <div className="hal-pesan">
      {/* ================= PAPAN PESANAN ================= */}
      <form className="papan" onSubmit={tambah} noValidate>
        <div className="papan-judul">
          <h1>Papan Pesanan</h1>
          <button type="button" className="tombol-teks" onClick={reset} title="Kosongkan racikan">
            <Icon nama="ulang" ukuran={16} /> ulang
          </button>
        </div>
        <p className="sub">racik kopimu, gelasnya ikut terisi</p>

        <PilihLevel label="Cabang" nilai={cabangId} opsi={OPSI_CABANG} kolom={3} onPilih={(v) => { setCabangId(v); setUcapan(komentar("cabang", v)); play("klik"); }} />

        <div className="field">
          <span className="label">Jenis kopi</span>
          <div className="pilihan-kopi" role="radiogroup" aria-label="Jenis kopi">
            {menu.map((m) => (
              <motion.button
                type="button"
                key={m.id}
                role="radio"
                aria-checked={racikan.kopiId === m.id}
                className={`kartu-kopi ${racikan.kopiId === m.id ? "aktif" : ""} ${!m.tersedia ? "habis" : ""}`}
                onClick={() => ubah("kopiId", m.id)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="biji" style={{ background: m.warna }} />
                <span className="nama-kopi">{m.nama}</span>
                <span className="harga">{m.tersedia ? rupiah(m.harga) : "Habis"}</span>
              </motion.button>
            ))}
          </div>
          {errorKopi && <p className="error">{errorKopi}</p>}
        </div>

        <PilihLevel label="Ukuran gelas" nilai={racikan.ukuran} opsi={OPSI_UKURAN} kolom={3} onPilih={(v) => ubah("ukuran", v)} />

        <div className="field">
          <span className="label">
            Level kepahitan: <b className="nilai-pahit">{LEVEL_PAHIT[racikan.pahit].label}</b>
          </span>
          <div className="slider-pahit">
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={racikan.pahit}
              onChange={(e) => ubah("pahit", Number(e.target.value))}
              aria-label="Level kepahitan"
              style={{ "--isi": `${((racikan.pahit - 1) / 4) * 100}%` }}
            />
            <div className="biji-pahit" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.span
                  key={n}
                  className={n <= racikan.pahit ? "nyala" : ""}
                  animate={{ scale: n === racikan.pahit ? 1.3 : 1 }}
                />
              ))}
            </div>
          </div>
        </div>

        <PilihLevel label="Gula" nilai={racikan.gula} opsi={OPSI.gula} onPilih={(v) => ubah("gula", v)} />
        <PilihLevel label="Susu" nilai={racikan.susu} opsi={OPSI.susu} onPilih={(v) => ubah("susu", v)} />
        <PilihLevel label="Es" nilai={racikan.es} opsi={OPSI.es} onPilih={(v) => ubah("es", v)} />

        <div className="field">
          <label className="label" htmlFor="catatan">Catatan (opsional)</label>
          <input id="catatan" className="input" placeholder="contoh: aduk yang rata" value={racikan.catatan} maxLength={40} onChange={(e) => ubah("catatan", e.target.value)} />
        </div>

        <div className="total">
          <span>Harga</span>
          <AnimatePresence mode="wait">
            <motion.span key={harga?.total ?? 0} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} transition={{ duration: 0.15 }}>
              {rupiah(harga?.total ?? 0)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="tombol-baris">
          <button type="submit" className="tombol">
            <Icon nama="keranjang" ukuran={18} /> Tambah ke Keranjang
          </button>
          <motion.button type="button" className="tombol-hati" onClick={favorit} whileTap={{ scale: 0.8 }} aria-label="Simpan ke favorit" title="Simpan ke favorit">
            <Icon nama="hati" />
          </motion.button>
        </div>
      </form>

      {/* pratinjau kecil yang ikut melayang di layar HP */}
      <AnimatePresence>
        {kopi && harga && (
          <motion.button
            type="button"
            className="pratinjau-mengambang"
            onClick={() => document.querySelector(".warung")?.scrollIntoView({ behavior: "smooth" })}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            aria-label="Lihat pratinjau gelas"
          >
            <Gelas kopi={kopi} racikan={racikan} mini />
            <span>
              <b>{kopi.nama} {UKURAN[racikan.ukuran].label}</b>
              <small>{rupiah(harga.total)}</small>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ================= KOLOM KANAN ================= */}
      <div className="kolom-kanan">
        <Warung
          kopi={kopi}
          racikan={racikan}
          ucapan={ucapan}
          cabangId={cabangId}
          onGelasClick={gantiUkuranLewatGelas}
          petunjuk={`${UKURAN[racikan.ukuran].label} · klik gelas untuk ganti ukuran`}
        >
          <div className="lencana-adegan">
            {isHappyHour() && <span className="lencana-happy">Happy hour -10%</span>}
            {est && (
              <span className="lencana-est">
                <Icon nama="jam" ukuran={14} /> {est.min}–{est.max} mnt
              </span>
            )}
          </div>
        </Warung>

        <div className="kartu-bawah">
          <div className="kartu">
            <h3>Rincian harga</h3>
            {harga ? (
              <ul className="rincian">
                <AnimatePresence initial={false}>
                  {harga.bagian.map((b) => (
                    <motion.li key={b.label.split(" ")[0]} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                      <span>{b.label}</span>
                      <span>{rupiah(b.nilai)}</span>
                    </motion.li>
                  ))}
                  {harga.diskonHappyHour > 0 && (
                    <motion.li key="hh" className="teks-sukses" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span>Happy hour</span>
                      <span>-{rupiah(harga.diskonHappyHour)}</span>
                    </motion.li>
                  )}
                </AnimatePresence>
                <li className="jumlah">
                  <span>Per gelas</span>
                  <span>{rupiah(harga.total)}</span>
                </li>
              </ul>
            ) : (
              <p className="redup">Pilih kopi untuk melihat harga.</p>
            )}
          </div>

          <div className="kartu">
            <h3>Kenalan dengan kopinya</h3>
            {kopi ? (
              <>
                <p className="kopi-asal">
                  <Icon nama="peta" ukuran={14} /> {kopi.asal} · {kopi.jenis}
                </p>
                <p className="redup">{kopi.rasa}</p>
                <button type="button" className="tombol-teks" onClick={() => pindah("cerita", kopi.id)}>
                  <Icon nama="buku" ukuran={16} /> Baca ceritanya
                </button>
              </>
            ) : (
              <p className="redup">Setiap kopi punya cerita asal-usul. Pilih satu dulu.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
