import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const IKON = { sukses: "cek", gagal: "tutup", info: "kopi" };

export default function Toast() {
  const { toasts, tutupToast } = useApp();
  return (
    <div className="toast-wadah" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            className={`toast toast-${t.tipe}`}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <span className="toast-ikon">
              <Icon nama={IKON[t.tipe] ?? "kopi"} ukuran={16} />
            </span>
            <span>{t.pesan}</span>
            <button type="button" onClick={() => tutupToast(t.id)} aria-label="Tutup notifikasi">
              <Icon nama="tutup" ukuran={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
