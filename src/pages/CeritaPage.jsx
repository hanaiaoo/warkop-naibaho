import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Icon from "../components/Icon";
import PetaKopi from "../components/PetaKopi";
import { useApp } from "../context/AppContext";
import { rupiah } from "../utils/harga";

export default function CeritaPage({ kopiAwal, pindah }) {
  const { menu, setRacikan, play } = useApp();
  const [terpilihId, setTerpilihId] = useState(kopiAwal ?? menu.find((m) => m.peta)?.id ?? menu[0]?.id);
  const kopi = menu.find((m) => m.id === terpilihId);

  const pilih = (id) => {
    setTerpilihId(id);
    play("klik");
  };

  const pesan = () => {
    setRacikan((r) => ({ ...r, kopiId: kopi.id }));
    play("tuang");
    pindah("pesan");
  };

  return (
    <div className="hal-cerita">
      <div className="judul-hal">
        <div>
          <h1>Cerita & Peta Asal Kopi</h1>
          <p className="redup">Dari kebun di pegunungan sampai ke gelas di mejamu.</p>
        </div>
      </div>

      <div className="cerita-grid">
        <div className="kartu peta-kartu">
          <PetaKopi menu={menu} terpilihId={terpilihId} pilih={pilih} />
          <div className="chip-baris">
            {menu.map((m) => (
              <button type="button" key={m.id} className={`chip ${m.id === terpilihId ? "aktif" : ""}`} onClick={() => pilih(m.id)}>
                <span className="titik-warna" style={{ background: m.warna }} /> {m.nama}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {kopi && (
            <motion.article
              key={kopi.id}
              className="kartu kartu-cerita"
              initial={{ opacity: 0, x: 30, rotate: 1 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="cerita-kepala">
                <span className="biji besar" style={{ background: kopi.warna }} />
                <div>
                  <h2>Kopi {kopi.nama}</h2>
                  <p className="kopi-asal">
                    <Icon nama="peta" ukuran={14} /> {kopi.asal || "Asal belum diisi"}
                  </p>
                </div>
              </div>
              <div className="fakta">
                <div><small>Jenis</small><b>{kopi.jenis}</b></div>
                <div><small>Harga</small><b>{rupiah(kopi.harga)}</b></div>
                <div><small>Status</small><b>{kopi.tersedia ? "Tersedia" : "Habis"}</b></div>
              </div>
              {kopi.rasa && (
                <p className="rasa">
                  <b>Catatan rasa:</b> {kopi.rasa}
                </p>
              )}
              <p className="isi-cerita">{kopi.cerita || "Cerita kopi ini belum ditulis oleh admin."}</p>
              <button type="button" className="tombol" onClick={pesan} disabled={!kopi.tersedia}>
                <Icon nama="kopi" ukuran={18} /> {kopi.tersedia ? `Racik Kopi ${kopi.nama}` : "Sedang habis"}
              </button>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
