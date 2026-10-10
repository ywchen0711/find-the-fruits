// Tiny Web Audio synth: sound effects + a light background loop per world.
let ctx = null, master = null, musicGain = null, enabled = true, loopTimer = null, curSong = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.16; musicGain.connect(master);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(f, t0, dur, { type = 'square', vol = 0.2, slide = 0, out = null, attack = 0.005 } = {}) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f * slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(out || master);
  o.start(t0); o.stop(t0 + dur + 0.02);
}
function noise(t0, dur, { vol = 0.2, freq = 1200, q = 0.8 } = {}) {
  const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
  const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q; g.gain.value = vol;
  s.connect(f); f.connect(g); g.connect(master); s.start(t0);
}

const N = (m) => 440 * Math.pow(2, (m - 69) / 12);

export const sfx = {
  set on(v) { enabled = v; if (master) master.gain.value = v ? 0.5 : 0; },
  get on() { return enabled; },
  unlock() { ac(); },
  play(name) {
    if (!enabled || !ac()) return;
    const t = ctx.currentTime;
    switch (name) {
      case 'jump': tone(N(64), t, 0.12, { type: 'square', vol: 0.06, slide: 2 }); break;
      case 'land': noise(t, 0.06, { vol: 0.1, freq: 400 }); break;
      case 'bounce': tone(N(55), t, 0.35, { type: 'sine', vol: 0.25, slide: 3 }); break;
      case 'collect': [72, 76, 79, 84, 88].forEach((m, i) => tone(N(m), t + i * 0.07, 0.25, { type: 'triangle', vol: 0.18 })); break;
      case 'badge': [[67, 0], [72, 0.12], [76, 0.24], [79, 0.36], [84, 0.5]].forEach(([m, d]) => { tone(N(m), t + d, 0.45, { type: 'square', vol: 0.06 }); tone(N(m - 12), t + d, 0.45, { type: 'triangle', vol: 0.12 }); }); break;
      case 'oof': tone(330, t, 0.09, { type: 'sawtooth', vol: 0.18, slide: 0.75 }); tone(250, t + 0.08, 0.16, { type: 'sawtooth', vol: 0.18, slide: 0.6 }); break;
      case 'splash': noise(t, 0.5, { vol: 0.35, freq: 900, q: 0.5 }); break;
      case 'click': tone(N(84), t, 0.05, { type: 'square', vol: 0.08 }); break;
      case 'good': [76, 83].forEach((m, i) => tone(N(m), t + i * 0.09, 0.2, { type: 'triangle', vol: 0.16 })); break;
      case 'bad': tone(140, t, 0.3, { type: 'sawtooth', vol: 0.14 }); tone(147, t, 0.3, { type: 'sawtooth', vol: 0.14 }); break;
      case 'door': noise(t, 0.4, { vol: 0.2, freq: 300 }); tone(N(60), t, 0.3, { type: 'triangle', vol: 0.12, slide: 1.5 }); break;
      case 'portal': for (let i = 0; i < 8; i++) tone(N(72 + i * 2), t + i * 0.04, 0.3, { type: 'sine', vol: 0.08 }); break;
      case 'check': [79, 84].forEach((m, i) => tone(N(m), t + i * 0.1, 0.18, { type: 'square', vol: 0.06 })); break;
      case 'key': [84, 88, 91].forEach((m, i) => tone(N(m), t + i * 0.06, 0.2, { type: 'triangle', vol: 0.15 })); break;
      case 'tick': tone(N(96), t, 0.03, { type: 'square', vol: 0.04 }); break;
      case 'vanish': tone(N(70), t, 0.15, { type: 'sine', vol: 0.08, slide: 0.5 }); break;
      default: break;
    }
  },
};

// background loop: a simple chord progression + plucky melody, different key/tempo per world
const SONGS = {
  plaza: { bpm: 112, root: 60, prog: [0, 5, 7, 5], scale: [0, 2, 4, 7, 9], wave: 'triangle' },
  tropical: { bpm: 120, root: 62, prog: [0, 7, 5, 7], scale: [0, 2, 4, 7, 9], wave: 'square' },
  frosty: { bpm: 92, root: 64, prog: [0, -3, 5, 7], scale: [0, 2, 3, 7, 10], wave: 'sine' },
  candy: { bpm: 128, root: 65, prog: [0, 9, 5, 7], scale: [0, 2, 4, 7, 9], wave: 'square' },
  sky: { bpm: 100, root: 63, prog: [0, 8, 3, 10], scale: [0, 2, 3, 7, 8], wave: 'triangle' },
};
let musicOn = true, bar = 0;
export const music = {
  set on(v) { musicOn = v; if (!v) this.stop(); else if (curSong) this.play(curSong); },
  get on() { return musicOn; },
  play(id) {
    curSong = id;
    if (!musicOn || !ac()) return;
    this.stop();
    const s = SONGS[id] || SONGS.plaza, beat = 60 / s.bpm;
    let next = ctx.currentTime + 0.1;
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const schedule = () => {
      if (!enabled || !musicOn) return;
      while (next < ctx.currentTime + 1.2) {
        const ch = s.prog[bar % s.prog.length], r = s.root + ch;
        tone(N(r - 24), next, beat * 1.8, { type: 'triangle', vol: 0.5, out: musicGain });
        tone(N(r - 12), next + beat * 2, beat * 1.8, { type: 'triangle', vol: 0.4, out: musicGain });
        for (let i = 0; i < 4; i++) {
          if (rnd() < 0.25) continue;
          const deg = s.scale[Math.floor(rnd() * s.scale.length)];
          tone(N(r + deg + (rnd() < 0.3 ? 12 : 0)), next + i * beat, beat * 0.8, { type: s.wave, vol: s.wave === 'square' ? 0.1 : 0.22, out: musicGain });
        }
        next += beat * 4; bar++;
      }
    };
    schedule();
    loopTimer = setInterval(schedule, 400);
  },
  stop() { if (loopTimer) clearInterval(loopTimer); loopTimer = null; },
};
