// Reachability check: builds a jump graph between standable surfaces of every world and verifies that each
// fruit can be reached from the spawn. Prints, per fruit, the tightest jump on its easiest route (1.00 = limit).
// Walls are not modelled (only jump distance / height), so this proves "not impossible", not "well hidden".
// Usage: node tools/check.mjs [--verbose]
import { WORLDS, FRUITS, PHYS, TIERS, buildWorld } from '../js/data.js';
import { World, newPlayer, stepPlayer } from '../js/physics.js';

const { WALK, JUMPV, G, TRAMPV, HW, H } = PHYS;
const verbose = process.argv.includes('--verbose');
const hmax = (v) => (v * v) / (2 * G);
function reach(dh, v) {
  const disc = v * v - 2 * G * dh;
  if (disc < 0) return -1;
  const t = (v + Math.sqrt(disc)) / G;
  return WALK * t * 0.9 + 2 * HW * 0.9;
}

// --- 1. calibrate against the real physics: run off a ledge and jump at the edge, measure the gap cleared
function physJump(dh) {
  const parts = [
    { x: 0, y: -0.5, z: 0, sx: 40, sy: 1, sz: 4, kind: 'solid' },                    // run-up, top 0, x -20..20
    { x: 60 + 20, y: dh - 0.5, z: 0, sx: 40, sy: 1, sz: 4, kind: 'solid' },           // landing far away (we only measure the arc)
  ];
  const W = new World({ parts, fruits: [], signs: [], def: { kill: -50 } });
  const pl = newPlayer(10, 0, 0);
  let t = 0, jumped = false, x0 = 0;
  while (t < 3) {
    const atEdge = pl.x + HW >= 20 - 0.05;
    const ev = stepPlayer(pl, W, { mx: 1, mz: 0, jump: atEdge && !jumped }, 1 / 60);
    if (ev.includes('jump') && !jumped) { jumped = true; x0 = pl.x; }
    W.update(1 / 60); t += 1 / 60;
    if (jumped && pl.vy < 0 && pl.y <= dh) return pl.x - x0 + 2 * HW;    // edge-to-edge gap this jump clears
  }
  return NaN;
}
console.log('calibration (gap cleared at dh): physics vs checker');
for (const dh of [-6, -2, 0, 3, 5, 6]) console.log(`  dh ${String(dh).padStart(2)}: physics ${physJump(dh).toFixed(2)}  checker ${reach(dh, JUMPV).toFixed(2)}`);
console.log(`  max jump height ${hmax(JUMPV).toFixed(2)} studs, trampoline ${hmax(TRAMPV).toFixed(2)}\n`);

// --- 2. per world graph
let bad = 0;
const allPlaced = new Set();
for (const wdef of WORLDS) {
  const B = buildWorld(wdef.id);
  const W = new World(B);
  const nodes = [];
  for (const p of W.parts) {
    if (!p.collide || p.kind === 'kill' || p.door) continue;
    let x0 = p.x0, x1 = p.x1, z0 = p.z0, z1 = p.z1, top = p.y1, lo = p.y1, hi = p.y1;
    if (p.move) {
      const to = p.move.to;
      x0 = Math.min(x0, to[0] - p.sx / 2); x1 = Math.max(x1, to[0] + p.sx / 2);
      z0 = Math.min(z0, to[2] - p.sz / 2); z1 = Math.max(z1, to[2] + p.sz / 2);
      lo = Math.min(top, to[1]); hi = Math.max(top, to[1]);
    }
    if (p.kind === 'truss') lo = p.y0;
    nodes.push({ p, x0, x1, z0, z1, lo, hi, v: p.surf === 'tramp' ? TRAMPV : JUMPV });
  }
  // sanity: nothing NaN, fruits not inside solids, spawn standing on something
  for (const p of W.parts) if ([p.x, p.y, p.z, p.sx, p.sy, p.sz].some((v) => !Number.isFinite(v))) { console.log('NaN part', wdef.id, p); bad++; }
  const inside = (x, y, z, r = 0) => W.solids.some((p) => !p.door && x + r > p.x0 && x - r < p.x1 && y + r > p.y0 && y - r < p.y1 && z + r > p.z0 && z - r < p.z1);
  const [sx, sy, sz] = wdef.spawn;
  const startNodes = nodes.filter((n) => sx >= n.x0 && sx <= n.x1 && sz >= n.z0 && sz <= n.z1 && Math.abs(n.hi - sy) < 0.35);
  if (!startNodes.length) { console.log(`!! ${wdef.id}: spawn is not on a surface`); bad++; }
  // minimax Dijkstra on "tightness"
  const tight = new Array(nodes.length).fill(Infinity), prev = new Array(nodes.length).fill(-1);
  startNodes.forEach((n) => { tight[nodes.indexOf(n)] = 0; });
  const done = new Array(nodes.length).fill(false);
  for (;;) {
    let i = -1;
    for (let k = 0; k < nodes.length; k++) if (!done[k] && tight[k] < Infinity && (i < 0 || tight[k] < tight[i])) i = k;
    if (i < 0) break;
    done[i] = true;
    const A = nodes[i];
    for (let j = 0; j < nodes.length; j++) {
      if (done[j]) continue;
      const Bn = nodes[j];
      const dh = Bn.lo - A.hi;
      const hm = hmax(A.v);
      if (dh > hm - 0.25) continue;
      const gx = Math.max(0, Bn.x0 - A.x1, A.x0 - Bn.x1), gz = Math.max(0, Bn.z0 - A.z1, A.z0 - Bn.z1);
      const gap = Math.hypot(gx, gz);
      const r = reach(dh, A.v);
      if (gap > r) continue;
      const t = Math.max(tight[i], gap / r, Math.max(0, dh) / hm);
      if (t < tight[j]) { tight[j] = t; prev[j] = i; }
    }
  }
  console.log(`== ${wdef.id}: ${W.parts.length} parts, ${nodes.length} surfaces, ${B.fruits.length} fruits`);
  for (const f of B.fruits) {
    allPlaced.add(f.id);
    const meta = FRUITS.find((m) => m.id === f.id);
    if (!meta) { console.log(`  !! unknown fruit ${f.id}`); bad++; continue; }
    if (meta.w !== wdef.id) { console.log(`  !! ${f.id} is in ${wdef.id} but the catalog says ${meta.w}`); bad++; }
    if (inside(f.x, f.y, f.z, 0.6)) { console.log(`  !! ${f.id} is inside a solid part`); bad++; }
    let best = Infinity, bi = -1;
    nodes.forEach((n, k) => {
      if (tight[k] === Infinity) return;
      const gx = Math.max(0, n.x0 - f.x, f.x - n.x1), gz = Math.max(0, n.z0 - f.z, f.z - n.z1);
      if (Math.hypot(gx, gz) > HW + 0.9) return;
      if (f.y < n.lo - 1 || f.y > n.hi + H + hmax(n.v) * 0.8) return;
      const px = Math.min(Math.max(f.x, n.x0), n.x1), pz = Math.min(Math.max(f.z, n.z0), n.z1);
      if (W.parts.some((q) => q !== n.p && q.collide && px > q.x0 && px < q.x1 && pz > q.z0 && pz < q.z1 && n.hi + 0.1 > q.y0 && n.hi + 0.1 < q.y1)) return;   // standing spot covered (lava, water, a block)
      if (tight[k] < best) { best = tight[k]; bi = k; }
    });
    const tier = TIERS[meta.tier].en.padEnd(10);
    if (bi < 0) { console.log(`  !! ${f.id.padEnd(16)} ${tier} UNREACHABLE`); bad++; continue; }
    let steps = 0; for (let k = bi; prev[k] >= 0; k = prev[k]) steps++;
    console.log(`  ok ${f.id.padEnd(16)} ${tier} tightest ${best.toFixed(2)}  jumps ${steps}`);
    if (verbose) {
      const path = []; for (let k = bi; k >= 0; k = prev[k]) { const n = nodes[k]; path.unshift(`(${n.p.x.toFixed(1)},${n.hi.toFixed(1)},${n.p.z.toFixed(1)})`); }
      console.log('     ' + path.join(' > '));
    }
  }
  // keys / buttons / keypads must be reachable too
  for (const p of W.parts) {
    if (!(p.key || p.button || p.keypad)) continue;
    const ok = nodes.some((n, k) => tight[k] < Infinity && Math.max(0, n.x0 - p.x1, p.x0 - n.x1) <= HW && Math.max(0, n.z0 - p.z1, p.z0 - n.z1) <= HW && p.y1 >= n.lo - 1 && p.y0 <= n.hi + H);
    if (!ok) { console.log(`  !! trigger ${JSON.stringify(p.key || p.button || p.keypad)} unreachable`); bad++; }
  }
}
for (const f of FRUITS) if (!allPlaced.has(f.id)) { console.log(`!! ${f.id} is not placed in any world`); bad++; }
console.log(`\n${FRUITS.length} fruits, ${bad ? bad + ' PROBLEMS' : 'all reachable'}`);
process.exit(bad ? 1 : 0);
