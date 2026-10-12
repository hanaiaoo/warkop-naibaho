import { AnimatePresence, motion } from "framer-motion";
import Gelas from "../components/Gelas";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";
import { labelRacikan, rincianHarga, rupiah } from "../utils/harga";

export default function FavoritPage({ pindah }) {
  const { favoritSaya, hapusFavorit, menu, setRacikan, tambahKeKeranjang, play, toast } = useApp();

  const racikUlang = (f) => {
    setRacikan(f.racikan);
    play("tuang");
    pindah("pesan");
  };

  const keKeranjang = (f, kopi) => {
    if (!kopi.tersedia) {
      toast(`${kopi.nama} sedang habis`, "gagal");
      play("gagal");
      return;
    }
    tambahKeKeranjang(f.racikan);
    play("ting");
    toast(`${kopi.nama} masuk keranjang`);
  };

  return (
    <div className="hal-daftar">
      <div className="judul-hal">
        <div>
          <h1>Racikan Favorit</h1>
          <p className="redup">Simpan racikan andalan, pesan lagi dengan sekali klik.</p>
        </div>
      </div>

      {favoritSaya.length === 0 ? (
        <div className="kosong halaman-kosong">
          <Icon nama="hati" ukuran={48} />
          <p>Belum ada favorit. Tekan tombol hati di Papan Pesanan untuk menyimpan racikan.</p>
          <button type="button" className="tombol" onClick={() => pindah("pesan")}>Racik kopi</button>
        </div>
      ) : (
        <div className="grid-favorit">
          <AnimatePresence>
            {favoritSaya.map((f, i) => {
              const harga = rincianHarga(f.racikan, menu);
              if (!harga) return null;
              return (
                <motion.article
                  key={f.id}
                  layout
                  className="kartu kartu-favorit"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  whileHover={{ y: -4 }}
                >
                  <button type="button" className="hapus-fav" onClick={() => { hapusFavorit(f.id); play("klik"); }} aria-label="Hapus favorit">
                    <Icon nama="tutup" ukuran={14} />
                  </button>
                  <div className="favorit-gelas">
                    <Gelas kopi={harga.kopi} racikan={f.racikan} mini />
                  </div>
                  <strong>{harga.kopi.nama}</strong>
                  <small className="redup">{labelRacikan(f.racikan, menu)}</small>
                  <b className="harga-fav">{rupiah(harga.total)}</b>
                  <div className="tombol-baris">
                    <button type="button" className="tombol kecil sekunder" onClick={() => racikUlang(f)}>Racik ulang</button>
                    <button type="button" className="tombol kecil" onClick={() => keKeranjang(f, harga.kopi)}>
                      <Icon nama="tambah" ukuran={14} /> Keranjang
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
