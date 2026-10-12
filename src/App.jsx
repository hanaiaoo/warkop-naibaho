import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import "./App.css";
import KeranjangDrawer from "./components/KeranjangDrawer";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import { AppProvider, useApp } from "./context/AppContext";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CeritaPage from "./pages/CeritaPage";
import FavoritPage from "./pages/FavoritPage";
import LacakPage from "./pages/LacakPage";
import PesanPage from "./pages/PesanPage";
import RiwayatPage from "./pages/RiwayatPage";

const transisi = {
  initial: { opacity: 0, y: 18, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: { duration: 0.3, ease: "easeOut" },
};

function Isi() {
  const { user, play } = useApp();
  const [halaman, setHalaman] = useState({ nama: "pesan", param: null });
  const [keranjangTerbuka, setKeranjangTerbuka] = useState(false);

  const pindah = (nama, param = null) => {
    setHalaman({ nama, param });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!user) {
    return (
      <motion.div key="auth" {...transisi}>
        <AuthPage />
      </motion.div>
    );
  }

  // halaman admin hanya untuk akun admin
  const nama = halaman.nama === "admin" && user.role !== "admin" ? "pesan" : halaman.nama;

  let isi;
  if (nama === "riwayat") isi = <RiwayatPage pindah={pindah} />;
  else if (nama === "favorit") isi = <FavoritPage pindah={pindah} />;
  else if (nama === "cerita") isi = <CeritaPage pindah={pindah} kopiAwal={halaman.param} />;
  else if (nama === "lacak") isi = <LacakPage key={halaman.param} idPesanan={halaman.param} pindah={pindah} />;
  else if (nama === "admin") isi = <AdminPage />;
  else isi = <PesanPage pindah={pindah} />;

  return (
    <div className="kerangka">
      <Navbar
        halaman={nama}
        pindah={pindah}
        bukaKeranjang={() => {
          play("klik");
          setKeranjangTerbuka(true);
        }}
      />
      <main className="isi-halaman">
        <AnimatePresence mode="wait">
          <motion.div key={nama + (halaman.param ?? "")} {...transisi}>
            {isi}
          </motion.div>
        </AnimatePresence>
      </main>
      <KeranjangDrawer
        terbuka={keranjangTerbuka}
        tutup={() => setKeranjangTerbuka(false)}
        setelahCheckout={(id) => {
          setKeranjangTerbuka(false);
          pindah("lacak", id);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AnimatePresence mode="wait">
        <Isi />
      </AnimatePresence>
      <Toast />
    </AppProvider>
  );
}
