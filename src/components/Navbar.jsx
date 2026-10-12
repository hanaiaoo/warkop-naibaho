import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import Icon from "./Icon";

const MENU_NAV = [
  { id: "pesan", label: "Pesan", ikon: "kopi" },
  { id: "riwayat", label: "Riwayat", ikon: "struk" },
  { id: "favorit", label: "Favorit", ikon: "hati" },
  { id: "cerita", label: "Cerita & Peta", ikon: "peta" },
  { id: "admin", label: "Admin", ikon: "grafik", khususAdmin: true },
];

export default function Navbar({ halaman, pindah, bukaKeranjang }) {
  const { user, keluar, tema, toggleTema, suaraAktif, toggleSuara, keranjang, play, toast } = useApp();
  const jumlah = keranjang.reduce((t, i) => t + i.qty, 0);

  return (
    <header className="navbar">
      <button type="button" className="logo" onClick={() => pindah("pesan")}>
        <span className="logo-gelas">
          <Icon nama="kopi" ukuran={22} />
        </span>
        <span>
          Warkop<b>Naibaho</b>
        </span>
      </button>

      <nav className="nav-link" aria-label="Navigasi utama">
        {MENU_NAV.filter((m) => !m.khususAdmin || user?.role === "admin").map((m) => (
          <button
            type="button"
            key={m.id}
            className={halaman === m.id ? "aktif" : ""}
            onClick={() => {
              play("klik");
              pindah(m.id);
            }}
          >
            {halaman === m.id && (
              <motion.span layoutId="nav-sorot" className="nav-sorot" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
            )}
            <Icon nama={m.ikon} ukuran={16} />
            <span>{m.label}</span>
          </button>
        ))}
      </nav>

      <div className="nav-aksi">
        <button
          type="button"
          className="ikon-tombol"
          onClick={() => {
            toggleTema();
            play("klik");
          }}
          aria-label={tema === "gelap" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
          title="Mode terang / gelap"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={tema}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "grid" }}
            >
              <Icon nama={tema === "gelap" ? "bulan" : "matahari"} />
            </motion.span>
          </AnimatePresence>
        </button>

        <button
          type="button"
          className="ikon-tombol"
          onClick={() => {
            toggleSuara();
            toast(suaraAktif ? "Efek suara dimatikan" : "Efek suara dinyalakan", "info");
          }}
          aria-label={suaraAktif ? "Matikan suara" : "Nyalakan suara"}
          title="Efek suara"
        >
          <Icon nama={suaraAktif ? "suara" : "bisu"} />
        </button>

        <button type="button" className="ikon-tombol keranjang-tombol" onClick={bukaKeranjang} aria-label={`Keranjang, ${jumlah} item`}>
          <Icon nama="keranjang" />
          <AnimatePresence>
            {jumlah > 0 && (
              <motion.span
                key={jumlah}
                className="lencana"
                initial={{ scale: 0.3 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 600, damping: 15 }}
              >
                {jumlah}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="pengguna">
          <span className="avatar">{user.nama.charAt(0).toUpperCase()}</span>
          <span className="nama-pengguna">{user.nama.split(" ")[0]}</span>
          <button
            type="button"
            className="ikon-tombol kecil"
            onClick={() => {
              keluar();
              toast("Sampai jumpa lagi!", "info");
            }}
            aria-label="Keluar"
            title="Keluar"
          >
            <Icon nama="keluar" ukuran={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
