// Pickup check: for every fruit, is there somewhere the player's real box (HW x H) can stand, or jump from, close enough
// to collect it, without overlapping a wall, roof or table? And can the player get out of that spot (so also in)?
// tools/check.mjs proves the jumps between surfaces; this one catches what it does not model: walls, low ceilings, furniture.
// Usage: node tools/pickup-check.mjs [--verbose]
import { WORLDS, FRUITS, PHYS, buildWorld } from '../js/data.js';
import { World } from '../js/physics.js';

const { JUMPV, G, HW, H, STEP } = PHYS;
const JUMPH = (JUMPV * JUMPV) / (2 * G) - 0.1;   // highest jump, a little margin
const PICK = 1.15, REACH = HW + PICK;             // the collect test in main.js: box distance < 1.15 with a 0.9 inflation
const verbose = process.argv.includes('--verbose');

// the same collect test as main.js
const collects = (f, x, y, z) => {
  const dx = Math.max(0, Math.abs(f.x - x) - 0.9), dz = Math.max(0, Math.abs(f.z - z) - 0.9), dy = Math.max(0, y - f.y, f.y - (y + 5));
  return Math.hypot(dx, dy, dz) < PICK;
};

let bad = 0, warn = 0;
for (const wdef of WORLDS) {
  const W = new World(B0(wdef.id));
  // doors count as open (they open by keys, flags or fruit counts); fake walls are already not solid
  const solids = W.solids.filter((p) => !p.door);
  const boxFree = (x, y, z) => !solids.some((p) => x + HW > p.x0 + 1e-6 && x - HW < p.x1 - 1e-6 && y + H > p.y0 + 1e-6 && y < p.y1 - 1e-6 && z + HW > p.z0 + 1e-6 && z - HW < p.z1 - 1e-6);
  // the surfaces under the footprint at (x, z): tops a box could stand on
  // moving platforms also count at the far end of their path (a rider gets carried there)
  const ends = W.parts.filter((p) => p.move && p.collide).map((p) => { const [x, top, z] = p.move.to; return { x0: x - p.sx / 2, x1: x + p.sx / 2, z0: z - p.sz / 2, z1: z + p.sz / 2, y1: top }; });
  const tops = (x, z) => [...solids, ...ends].filter((p) => x + HW > p.x0 && x - HW < p.x1 && z + HW > p.z0 && z - HW < p.z1).map((p) => p.y1);
  const sweepFree = (x, z, ya, yb) => { const lo = Math.min(ya, yb), hi = Math.max(ya, yb); for (let y = lo; y <= hi + 1e-9; y += 0.25) if (!boxFree(x, Math.min(y, hi), z)) return false; return boxFree(x, hi, z); };
  // where the player lands if they step off at (x, z) from height y: the highest top below
  const landAt = (x, z, y) => { let best = -Infinity; for (const t of tops(x, z)) if (t <= y + 1e-6 && t > best) best = t; return best; };
  const killY = wdef.water !== undefined ? Math.max(W.def.kill ?? -50, wdef.water - 0.8) : (W.def.kill ?? -50);

  for (const f of W.fruits) {
    const meta = FRUITS.find((q) => q.id === f.id);
    // 1. a standing spot in range (collect standing, or by jumping straight up from it)
    const spots = [];
    for (let x = f.x - REACH; x <= f.x + REACH; x += 0.1) for (let z = f.z - REACH; z <= f.z + REACH; z += 0.1) {
      for (const y of tops(x, z)) {
        if (y <= killY || !boxFree(x, y, z)) continue;
        let ok = collects(f, x, y, z);
        for (let hy = 0.25; !ok && hy <= JUMPH; hy += 0.25) { if (!boxFree(x, y + hy, z)) break; ok = collects(f, x, y + hy, z); }
        if (ok) spots.push({ x, y, z });
      }
    }
    const tag = `${wdef.id.padEnd(9)} ${f.id.padEnd(16)} (${meta ? meta.name.en : '?'})`;
    if (!spots.length) {
      // explain: what blocks the nearest spots
      const why = [];
      for (const y of [...new Set(tops(f.x, f.z))]) if (!boxFree(f.x, y, f.z)) why.push(`standing at the fruit on top ${y.toFixed(1)} hits ${solids.filter((p) => f.x + HW > p.x0 && f.x - HW < p.x1 && y + H > p.y0 && y < p.y1 && f.z + HW > p.z0 && f.z - HW < p.z1).map((p) => `#${p.id}(y ${p.y0.toFixed(1)}..${p.y1.toFixed(1)})`).join(' ')}`);
      console.log(`XX ${tag}: no place to stand or jump close enough at (${f.x}, ${f.y}, ${f.z}). ${why.join('; ')}`); bad++; continue;
    }
    // 2. can the player get away from there by walking, stepping up, jumping up or dropping (if not, they could not get in either)
    const key = (x, z, y) => `${Math.round(x * 4)},${Math.round(z * 4)},${Math.round(y * 100)}`;
    const seen = new Set(), queue = spots.slice(0, 40).map((s) => ({ ...s })), D = 0.5, FAR = 22;
    queue.forEach((s) => seen.add(key(s.x, s.z, s.y)));
    let out = false, n = 0;
    while (queue.length && !out && n < 60000) {
      const s = queue.shift(); n++;
      if (Math.hypot(s.x - f.x, s.z - f.z) > FAR || s.y < f.y - 12) { out = true; break; }
      for (const [ddx, ddz] of [[D, 0], [-D, 0], [0, D], [0, -D]]) {
        const nx = s.x + ddx, nz = s.z + ddz;
        // up to the highest reachable top: step (<= STEP) or jump (<= JUMPH, with headroom over the start)
        for (const t of tops(nx, nz)) {
          const rise = t - s.y;
          if (rise < -1e-6 || rise > JUMPH || !boxFree(nx, t, nz)) continue;
          if (rise > STEP && !sweepFree(s.x, s.z, s.y, t)) continue;
          const k = key(nx, nz, t); if (!seen.has(k)) { seen.add(k); queue.push({ x: nx, y: t, z: nz }); }
        }
        // a running jump across a gap, onto a surface no higher than a jump
        for (let dist = 1.5; dist <= 9; dist += 1.5) {
          const jx = s.x + ddx / D * dist, jz = s.z + ddz / D * dist;
          for (const t of tops(jx, jz)) {
            if (t - s.y > JUMPH - 0.6 || t < s.y - 12 || !boxFree(jx, t, jz) || !boxFree(s.x, s.y + Math.min(JUMPH, Math.max(1, t - s.y + 1)), s.z)) continue;
            const k = key(jx, jz, t); if (!seen.has(k)) { seen.add(k); queue.push({ x: jx, y: t, z: jz }); }
          }
        }
        // walk off an edge and drop
        if (boxFree(nx, s.y, nz)) {
          const t = landAt(nx, nz, s.y);
          if (t === -Infinity || t <= killY) continue;
          if (t < s.y - 1e-6 && sweepFree(nx, nz, s.y, t)) { const k = key(nx, nz, t); if (!seen.has(k)) { seen.add(k); queue.push({ x: nx, y: t, z: nz }); } }
        }
      }
    }
    if (!out) { console.log(`?? ${tag}: ${spots.length} spots in range, but no way out of there by walking or jumping (enclosed, or only a drop in)`); warn++; continue; }
    if (verbose) console.log(`ok ${tag}: ${spots.length} spots in range`);
  }
}
console.log(bad ? `\n${bad} fruit(s) cannot be collected, ${warn} to look at` : `\nall fruits can be collected${warn ? `, ${warn} to look at` : ''}`);
process.exitCode = bad ? 1 : 0;
function B0(id) { return buildWorld(id); }
