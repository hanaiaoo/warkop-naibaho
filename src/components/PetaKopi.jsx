import { motion } from "framer-motion";

// Peta Indonesia versi ilustrasi (tidak berskala), cukup untuk menunjukkan asal kopi
const PULAU = [
  { nama: "Sumatra", d: "M58,58 C92,38 132,70 172,110 C222,160 270,220 300,280 C310,305 290,316 268,300 C220,262 170,222 130,172 C95,130 48,92 58,58 Z" },
  { nama: "Jawa", d: "M300,318 C350,311 420,319 480,325 C512,329 526,338 515,349 C470,353 400,347 340,341 C309,338 288,328 300,318 Z" },
  { nama: "Kalimantan", d: "M380,140 C400,98 462,80 512,95 C552,106 572,142 562,192 C553,242 520,276 470,281 C420,286 384,260 375,220 C368,190 367,164 380,140 Z" },
  { nama: "Sulawesi", d: "M620,120 C642,110 690,112 720,118 C731,124 721,133 700,133 C670,135 651,141 646,156 C661,166 690,170 715,175 C723,183 712,191 698,189 C680,187 661,185 651,193 C656,216 671,240 691,262 C697,273 684,279 673,271 C655,251 641,240 629,251 C623,271 626,291 615,301 C604,306 599,290 603,270 C608,240 612,200 610,170 C608,145 605,128 620,120 Z" },
  { nama: "Papua", d: "M840,190 C882,175 942,186 981,216 C997,242 991,291 961,311 C931,326 890,316 869,291 C858,271 844,266 829,250 C814,232 817,200 840,190 Z" },
];
const PULAU_KECIL = [
  [538, 342, 10, 6],
  [570, 346, 15, 5],
  [610, 351, 22, 6],
  [655, 356, 18, 6],
  [700, 361, 20, 7],
  [772, 182, 9, 14],
  [792, 238, 14, 8],
  [762, 280, 10, 6],
];

export default function PetaKopi({ menu, terpilihId, pilih }) {
  const titik = menu.filter((m) => m.peta);

  return (
    <div className="peta">
      <svg viewBox="0 0 1000 400" role="img" aria-label="Peta ilustrasi asal kopi Indonesia">
        <defs>
          <pattern id="ombak" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q10 4 20 10 T40 10" fill="none" className="garis-ombak" />
          </pattern>
        </defs>
        <rect width="1000" height="400" className="laut" />
        <rect width="1000" height="400" fill="url(#ombak)" />

        {PULAU.map((p) => (
          <g key={p.nama}>
            <path d={p.d} className="pulau" />
          </g>
        ))}
        {PULAU_KECIL.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} className="pulau" />
        ))}

        <text x="180" y="300" className="nama-pulau">Sumatra</text>
        <text x="420" y="378" className="nama-pulau">Jawa</text>
        <text x="455" y="190" className="nama-pulau">Kalimantan</text>
        <text x="690" y="230" className="nama-pulau">Sulawesi</text>
        <text x="905" y="255" className="nama-pulau">Papua</text>

        {titik.map((m) => {
          const aktif = m.id === terpilihId;
          return (
            <g
              key={m.id}
              className={`pin ${aktif ? "aktif" : ""}`}
              transform={`translate(${m.peta.x} ${m.peta.y})`}
              onClick={() => pilih(m.id)}
              role="button"
              tabIndex={0}
              aria-label={`Kopi ${m.nama}, ${m.asal}`}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && pilih(m.id)}
            >
              <motion.circle
                r="16"
                className="pin-denyut"
                animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.g animate={{ scale: aktif ? 1.25 : 1 }} transition={{ type: "spring", stiffness: 400 }}>
                <path d="M0 0 C-10 -12 -12 -18 -12 -22 A12 12 0 1 1 12 -22 C12 -18 10 -12 0 0 Z" className="pin-badan" />
                <ellipse cx="0" cy="-22" rx="4.5" ry="6" className="pin-biji" />
              </motion.g>
              <text y="-42" className="pin-label">{m.nama}</text>
            </g>
          );
        })}
      </svg>
      <small className="peta-catatan">Peta ilustrasi, tidak berskala. Klik pin untuk membaca ceritanya.</small>
    </div>
  );
}
