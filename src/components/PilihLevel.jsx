import { motion } from "framer-motion";

// Grup tombol pilihan (gula / susu / es / ukuran / cabang)
export default function PilihLevel({ label, nilai, opsi, onPilih, kolom }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div
        className="level"
        role="radiogroup"
        aria-label={label}
        style={kolom ? { gridTemplateColumns: `repeat(${kolom}, 1fr)` } : undefined}
      >
        {opsi.map((opsiAsli, i) => {
          // opsi boleh berupa teks biasa atau objek { nilai, label, sub }
          const o = typeof opsiAsli === "string" ? { label: opsiAsli } : opsiAsli;
          const val = o.nilai ?? i;
          const aktif = nilai === val;
          return (
            <button
              type="button"
              key={o.label}
              role="radio"
              aria-checked={aktif}
              className={aktif ? "aktif" : ""}
              onClick={() => onPilih(val)}
            >
              {aktif && (
                <motion.span
                  layoutId={`sorot-${label}`}
                  className="sorot"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="teks-opsi">{o.label}</span>
              {o.sub && <small>{o.sub}</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
