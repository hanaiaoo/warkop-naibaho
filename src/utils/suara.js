// Efek suara dibuat langsung dengan Web Audio API,
// jadi tidak perlu file mp3 sama sekali.

let ctx = null;

function audio() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function nada(frek, durasi, { tipe = "sine", volume = 0.12, jeda = 0, akhir } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + jeda;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = tipe;
  osc.frequency.setValueAtTime(frek, t);
  if (akhir) osc.frequency.exponentialRampToValueAtTime(akhir, t + durasi);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + durasi + 0.05);
}

function desis(durasi, { volume = 0.1, dari = 1800, ke = 400, jeda = 0 } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + jeda;
  const buffer = a.createBuffer(1, a.sampleRate * durasi, a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const sumber = a.createBufferSource();
  sumber.buffer = buffer;
  const filter = a.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(dari, t);
  filter.frequency.exponentialRampToValueAtTime(ke, t + durasi);
  const gain = a.createGain();
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durasi);
  sumber.connect(filter).connect(gain).connect(a.destination);
  sumber.start(t);
}

export const EFEK = {
  klik: () => nada(700, 0.06, { volume: 0.06 }),
  tuang: () => desis(0.8, { volume: 0.18, dari: 2200, ke: 500 }),
  es: () => {
    nada(2600, 0.08, { tipe: "triangle", volume: 0.07 });
    nada(3300, 0.07, { tipe: "triangle", volume: 0.05, jeda: 0.08 });
  },
  gelas: () => nada(520, 0.25, { tipe: "triangle", volume: 0.08, akhir: 760 }),
  geser: () => desis(1.1, { volume: 0.06, dari: 700, ke: 250 }),
  ting: () => {
    nada(1320, 0.7, { volume: 0.1 });
    nada(1980, 0.6, { volume: 0.05, jeda: 0.02 });
  },
  sukses: () => {
    nada(660, 0.15, { volume: 0.08 });
    nada(880, 0.15, { volume: 0.08, jeda: 0.12 });
    nada(1320, 0.35, { volume: 0.08, jeda: 0.24 });
  },
  gagal: () => {
    nada(220, 0.12, { tipe: "square", volume: 0.04 });
    nada(160, 0.18, { tipe: "square", volume: 0.04, jeda: 0.13 });
  },
  pintu: () => {
    nada(180, 0.4, { tipe: "sawtooth", volume: 0.03, akhir: 120 });
    nada(1760, 0.5, { volume: 0.06, jeda: 0.25 });
    nada(2350, 0.5, { volume: 0.04, jeda: 0.32 });
  },
};
