import { motion } from "framer-motion";
import { UKURAN } from "../data/menu";
import { warnaKopi } from "../utils/harga";

// posisi es batu tetap supaya tidak "loncat" setiap render
const POSISI_ES = [
  { left: 14, rot: -12, geser: 0 },
  { left: 54, rot: 18, geser: 3 },
  { left: 32, rot: 6, geser: -7 },
  { left: 62, rot: -22, geser: -11 },
  { left: 8, rot: 25, geser: -13 },
];
const JUMLAH_ES = [0, 2, 3, 5];

/**
 * Gelas kopi live preview.
 * isi   : 0..1, seberapa penuh gelas (dipakai saat animasi "diracik")
 * lambat: animasi menuang dibuat pelan
 * mini  : versi kecil untuk kartu favorit / keranjang
 */
export default function Gelas({ kopi, racikan, isi = 1, lambat = false, onClick, mini = false }) {
  const ukuran = UKURAN[racikan.ukuran];
  const skala = mini ? 0.42 : 1;
  const lebar = ukuran.w * skala;
  const tinggi = ukuran.h * skala;

  const tinggiSusu = racikan.susu * 10 * isi;
  const tinggiKopi = kopi ? (40 + racikan.es * 6) * isi : 0;
  const tinggiTotal = tinggiSusu + tinggiKopi;
  const posisiEs = Math.max(tinggiTotal - 14, 3);
  const panas = kopi && racikan.es === 0 && isi > 0.5;

  const Wadah = onClick ? motion.button : motion.div;

  return (
    <div
      className={`gelas-susun ${mini ? "mini" : ""}`}
      style={{ "--durasi": lambat ? "2.6s" : "0.7s" }}
    >
      {panas && (
        <div className="uap" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      )}

      <Wadah
        type={onClick ? "button" : undefined}
        className={`gelas ${onClick ? "bisa-klik" : ""}`}
        onClick={onClick}
        initial={false}
        animate={{ width: lebar, height: tinggi }}
        whileTap={onClick ? { scale: 0.93, rotate: -3 } : undefined}
        transition={{ type: "spring", stiffness: 260, damping: 14 }}
        aria-label={onClick ? `Gelas ukuran ${ukuran.label}, klik untuk ganti ukuran` : undefined}
      >
        <div className="lapis lapis-susu" style={{ height: `${tinggiSusu}%` }} />
        <div
          className="lapis lapis-kopi"
          style={{
            bottom: `${tinggiSusu}%`,
            height: `${tinggiKopi}%`,
            "--warna-kopi": kopi ? warnaKopi(kopi.warna, racikan.pahit) : "#3b2416",
          }}
        />

        {isi > 0 &&
          Array.from({ length: racikan.gula * 5 }).map((_, i) => (
            <span
              key={`gula-${i}`}
              className="gula"
              style={{ left: `${((i * 37) % 84) + 6}%`, bottom: `${((i * 13) % 9) + 3}px` }}
            />
          ))}

        {isi > 0 &&
          POSISI_ES.slice(0, JUMLAH_ES[racikan.es]).map((p, i) => (
            <span
              key={`es-${i}`}
              className="es-batu"
              style={{
                left: `${p.left}%`,
                bottom: `${Math.max(posisiEs + p.geser, 2)}%`,
                "--rot": `${p.rot}deg`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
      </Wadah>

      <motion.div
        className="tatakan"
        initial={false}
        animate={{ width: lebar + 30 * skala }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
      />
    </div>
  );
}
