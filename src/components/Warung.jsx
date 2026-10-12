import { AnimatePresence, motion } from "framer-motion";
import { CABANG } from "../data/menu";
import Gelas from "./Gelas";

function Pelanggan({ ucapan, senang }) {
  return (
    <div className={`pelanggan ${senang ? "senang" : ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={ucapan}
          className="gelembung"
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
        >
          {ucapan}
        </motion.div>
      </AnimatePresence>
      <div className="kepala">
        <span className="rambut" />
        <span className="mata kiri" />
        <span className="mata kanan" />
        <span className="pipi kiri" />
        <span className="pipi kanan" />
        <span className="mulut" />
      </div>
      <div className="badan" />
    </div>
  );
}

/**
 * Adegan warung kopi.
 * status: "pesan" (gelas di dekat barista) | "antar" | "selesai" (gelas di depan pelanggan)
 */
export default function Warung({
  kopi,
  racikan,
  status = "pesan",
  isi = 1,
  lambat = false,
  ucapan,
  cabangId,
  onGelasClick,
  petunjuk,
  children,
}) {
  const cabang = CABANG.find((c) => c.id === cabangId);
  const diantar = status === "antar" || status === "selesai";

  return (
    <section className="warung" aria-label="Suasana warung kopi">
      <div className="jendela" aria-hidden="true">
        <span className="benda-langit" />
        <span className="awan" />
      </div>

      <div className="plang">
        WARKOP NAIBAHO
        {cabang && <small>cabang {cabang.nama}</small>}
      </div>

      <div className="lampu" aria-hidden="true">
        <span className="bohlam" />
      </div>

      <div className="rak" aria-hidden="true">
        <span className="toples t1" />
        <span className="toples t2" />
        <span className="toples t3" />
      </div>

      <Pelanggan ucapan={ucapan} senang={status === "selesai"} />

      <div className={`gelas-posisi ${diantar ? "diantar" : ""}`}>
        <Gelas kopi={kopi} racikan={racikan} isi={isi} lambat={lambat} onClick={onGelasClick} />
        {petunjuk && <p className="petunjuk">{petunjuk}</p>}
      </div>

      <div className="meja" />

      {children}
    </section>
  );
}
