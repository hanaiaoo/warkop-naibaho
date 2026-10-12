import { AnimatePresence, motion, useAnimate } from "framer-motion";
import { useState } from "react";
import Icon from "../components/Icon";
import { useApp } from "../context/AppContext";

const KOSONG = { nama: "", username: "", password: "", konfirmasi: "" };

export default function AuthPage() {
  const { cekLogin, daftar, masuk, play, toast, tema, toggleTema } = useApp();
  const [mode, setMode] = useState("masuk"); // masuk | daftar
  const [form, setForm] = useState(KOSONG);
  const [errors, setErrors] = useState({});
  const [buka, setBuka] = useState(false);
  const [scope, animate] = useAnimate();
  const [proses, setProses] = useState(false);

  const ubah = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined, umum: undefined }));
  };

  const gantiMode = (m) => {
    play("klik");
    setMode(m);
    setErrors({});
  };

  const validasi = () => {
    const e = {};
    if (mode === "daftar" && form.nama.trim().length < 2) e.nama = "Nama minimal 2 huruf";
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(form.username.trim()))
      e.username = "3-16 karakter: huruf, angka, atau _";
    if (form.password.length < 6) e.password = "Password minimal 6 karakter";
    if (mode === "daftar" && form.password !== form.konfirmasi) e.konfirmasi = "Password tidak sama";
    return e;
  };

  const kirim = async (ev) => {
    ev.preventDefault();
    const e = validasi();
    if (Object.keys(e).length) {
      setErrors(e);
      animate(scope.current, { x: [0, -12, 12, -8, 8, 0] }, { duration: 0.4 });
      play("gagal");
      return;
    }
    setProses(true);
    const hasil = mode === "masuk" ? await cekLogin(form.username, form.password) : await daftar(form);
    if (!hasil.ok) {
      setProses(false);
      setErrors({ umum: hasil.pesan });
      animate(scope.current, { x: [0, -12, 12, -8, 8, 0] }, { duration: 0.4 });
      play("gagal");
      return;
    }
    // plang berbalik jadi BUKA, pintu terbuka, lalu masuk
    setBuka(true);
    play("pintu");
    setTimeout(() => {
      masuk(hasil.user);
      toast(mode === "masuk" ? `Selamat datang lagi, ${hasil.user.nama}!` : `Akun dibuat. Halo, ${hasil.user.nama}!`);
    }, 1500);
  };

  return (
    <div className="auth">
      <button
        type="button"
        className="ikon-tombol auth-tema"
        onClick={toggleTema}
        aria-label="Ganti tema"
      >
        <Icon nama={tema === "gelap" ? "bulan" : "matahari"} />
      </button>

      {/* ====== Ilustrasi pintu warung ====== */}
      <div className="pintu-warung" aria-hidden="true">
        <div className="atap">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} />
          ))}
        </div>
        <div className="kusen">
          <motion.div
            className="daun-pintu kiri"
            animate={{ rotateY: buka ? -75 : 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="daun-pintu kanan"
            animate={{ rotateY: buka ? 75 : 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
          />
          <div className="cahaya-dalam" />
          <motion.div
            className="papan-gantung"
            animate={{ rotateY: buka ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 12 }}
          >
            <span className="tali" />
            <div className="sisi depan">TUTUP</div>
            <div className="sisi belakang">BUKA</div>
          </motion.div>
        </div>
        <p className="slogan">Ngopi dulu, baru mikir.</p>
      </div>

      {/* ====== Formulir ====== */}
      <motion.form
        ref={scope}
        className="papan papan-auth"
        onSubmit={kirim}
        noValidate
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="tab-auth" role="tablist">
          {["masuk", "daftar"].map((m) => (
            <button
              type="button"
              key={m}
              role="tab"
              aria-selected={mode === m}
              className={mode === m ? "aktif" : ""}
              onClick={() => gantiMode(m)}
            >
              {mode === m && <motion.span layoutId="tab-auth" className="sorot" />}
              <span className="teks-opsi">{m === "masuk" ? "Masuk" : "Daftar"}</span>
            </button>
          ))}
        </div>

        <h1>{mode === "masuk" ? "Absen dulu, Bang" : "Jadi pelanggan tetap"}</h1>
        <p className="sub">
          {mode === "masuk" ? "plang warung terbuka kalau kamu berhasil masuk" : "daftar sekali, ngopi berkali-kali"}
        </p>

        <fieldset disabled={proses}>
          <AnimatePresence initial={false}>
            {mode === "daftar" && (
              <motion.div
                className="field"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="label" htmlFor="nama">Nama lengkap</label>
                <input id="nama" className="input" value={form.nama} onChange={(e) => ubah("nama", e.target.value)} placeholder="contoh: Budi Santoso" maxLength={30} />
                {errors.nama && <p className="error">{errors.nama}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="field">
            <label className="label" htmlFor="username">Username</label>
            <input id="username" className="input" autoComplete="username" value={form.username} onChange={(e) => ubah("username", e.target.value)} placeholder="contoh: budi_ngopi" />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" autoComplete={mode === "masuk" ? "current-password" : "new-password"} value={form.password} onChange={(e) => ubah("password", e.target.value)} placeholder="minimal 6 karakter" />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <AnimatePresence initial={false}>
            {mode === "daftar" && (
              <motion.div
                className="field"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="label" htmlFor="konfirmasi">Ulangi password</label>
                <input id="konfirmasi" type="password" className="input" autoComplete="new-password" value={form.konfirmasi} onChange={(e) => ubah("konfirmasi", e.target.value)} />
                {errors.konfirmasi && <p className="error">{errors.konfirmasi}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {errors.umum && <p className="error umum">{errors.umum}</p>}

          <button type="submit" className="tombol">
            {proses ? "Membuka warung..." : mode === "masuk" ? "Masuk" : "Daftar & Masuk"}
          </button>
        </fieldset>

        <p className="petunjuk-admin">
          Akun admin demo: <b>admin</b> / <b>admin123</b>
        </p>
      </motion.form>
    </div>
  );
}
