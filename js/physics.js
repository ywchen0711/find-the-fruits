// Player physics + world runtime state (moving parts, vanishing blocks, doors, flags). No three.js here,
// so tools/phys-test.mjs can drive it in Node.
import { PHYS } from './data.js?v=3';

const { WALK, JUMPV, G, TRAMPV, CLIMB, HW, H, STEP } = PHYS;
const EPS = 1e-6;

export class World {
  constructor(built, foundCount = () => 0) {
    this.def = built.def;
    this.parts = built.parts;
    this.fruits = built.fruits;
    this.signs = built.signs;
    this.t = 0;
    this.flags = {};           // flag -> true or seconds left (timed)
    this.keys = new Set();
    this.opened = new Set();   // key doors that were unlocked
    this.seq = {};             // sequence group -> progress
    this.foundCount = foundCount;
    for (const p of this.parts) {
      p.cx = p.x; p.cy = p.y; p.cz = p.z; p.dx = 0; p.dy = 0; p.dz = 0;
      p.vt = 0; p.gone = 0;
      p.collide = !(p.kind === 'deco' || p.kind === 'trigger' || p.kind === 'spin' || p.fake);
      this.bounds(p);
    }
    this.solids = this.parts.filter((p) => p.collide);
    this.kills = this.parts.filter((p) => p.kind === 'kill');
    this.spins = this.parts.filter((p) => p.kind === 'spin');
    this.trusses = this.parts.filter((p) => p.kind === 'truss');
    this.movers = this.parts.filter((p) => p.move || p.vanish);
    this.triggers = this.parts.filter((p) => p.kind === 'trigger' || p.check || p.button || p.keypad || p.door);
  }
  bounds(p) {
    p.x0 = p.cx - p.sx / 2; p.x1 = p.cx + p.sx / 2;
    p.y0 = p.cy - p.sy / 2; p.y1 = p.cy + p.sy / 2;
    p.z0 = p.cz - p.sz / 2; p.z1 = p.cz + p.sz / 2;
  }
  update(dt) {
    this.t += dt;
    for (const p of this.movers) {
      if (p.move) {
        const m = p.move, s = 0.5 - 0.5 * Math.cos((2 * Math.PI * (this.t + (m.phase || 0))) / m.period);
        // move.to is the platform TOP at the far end (like plat()), so its centre is to[1] - sy/2
        const nx = p.x + (m.to[0] - p.x) * s, cy = p.y + (m.to[1] - p.sy / 2 - p.y) * s, nz = p.z + (m.to[2] - p.z) * s;
        p.dx = nx - p.cx; p.dy = cy - p.cy; p.dz = nz - p.cz;
        p.cx = nx; p.cy = cy; p.cz = nz;
        this.bounds(p);
      }
      if (p.vanish) {
        if (p.vt > 0) { p.vt -= dt; if (p.vt <= 0) { p.vt = 0; p.gone = 3; } }
        else if (p.gone > 0) { p.gone -= dt; if (p.gone < 0) p.gone = 0; }
      }
    }
    for (const k of Object.keys(this.flags)) {
      const v = this.flags[k];
      if (typeof v === 'number') { this.flags[k] = v - dt; if (this.flags[k] <= 0) delete this.flags[k]; }
    }
  }
  isOpen(p) {
    const d = p.door;
    if (!d) return false;
    if (d.count != null) return this.foundCount(d.cat) >= d.count;
    if (d.flag) return !!this.flags[d.flag];
    if (d.key) return this.opened.has(p.id);
    return false;
  }
  solidNow(p) {
    if (p.door && this.isOpen(p)) return false;
    if (p.vanish && p.gone > 0) return false;
    return true;
  }
  spinHit(p, x, y, z) {
    const a = (p.phase || 0) + p.w * this.t, c = Math.cos(a), s = Math.sin(a);
    const dx = x - p.cx, dz = z - p.cz;
    const u = dx * c + dz * s, v = -dx * s + dz * c, th = p.sy / 2;
    if (y + H < p.cy - th || y > p.cy + th) return false;
    return u > p.r0 - HW && u < p.r1 + HW && Math.abs(v) < th + HW * 0.8;
  }
}

export function newPlayer(x, y, z, yaw = 0) {
  return { x, y, z, vx: 0, vy: 0, vz: 0, yaw, ground: null, coyote: 0, climbing: false, touch: [], dead: false, air: 0 };
}

const over = (pl, p, e = 0) =>
  pl.x + HW + e > p.x0 + EPS && pl.x - HW - e < p.x1 - EPS &&
  pl.y + H + e > p.y0 + EPS && pl.y - e < p.y1 - EPS &&
  pl.z + HW + e > p.z0 + EPS && pl.z - HW - e < p.z1 - EPS;

function blockedAt(pl, W, y) {
  const save = pl.y; pl.y = y;
  let hit = false;
  for (const p of W.solids) if (W.solidNow(p) && over(pl, p)) { hit = true; break; }
  pl.y = save;
  return hit;
}

// one physics step. inp = { mx, mz: desired move direction in world space (length <= 1), jump: held }
// returns a list of events: 'jump', 'land', 'bounce', 'kill', 'vanish' (part)
export function stepPlayer(pl, W, inp, dt) {
  const ev = [];
  if (pl.dead) return ev;
  // ride moving platforms
  const g = pl.ground;
  if (g && g.move && W.solidNow(g)) { pl.x += g.dx; pl.y += g.dy; pl.z += g.dz; }
  const n = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = dt / n;
  for (let i = 0; i < n && !pl.dead; i++) sub(pl, W, inp, h, ev);
  // touching parts (for triggers), expanded a little so solid doors / buttons count
  pl.touch = [];
  for (const p of W.triggers) if (over(pl, p, 0.25)) pl.touch.push(p);
  if (pl.ground && !pl.touch.includes(pl.ground)) pl.touch.push(pl.ground);
  return ev;
}

function sub(pl, W, inp, h, ev) {
  const g = pl.ground;
  const surf = g && g.surf;
  let tvx = inp.mx * WALK, tvz = inp.mz * WALK;
  if (surf === 'conv' && g.conv) { tvx += g.conv[0]; tvz += g.conv[1]; }
  const acc = !g ? 90 : surf === 'ice' ? 9 : 160;
  const ax = tvx - pl.vx, az = tvz - pl.vz, am = Math.hypot(ax, az), lim = acc * h;
  if (am > lim) { pl.vx += (ax / am) * lim; pl.vz += (az / am) * lim; } else { pl.vx = tvx; pl.vz = tvz; }

  // truss climbing: touching a truss and pushing any direction
  pl.climbing = false;
  if (Math.hypot(inp.mx, inp.mz) > 0.2) {
    for (const p of W.trusses) {
      if (pl.y < p.y1 - 0.05 && pl.y + H > p.y0 && over(pl, p, 0.35)) { pl.climbing = true; break; }
    }
  }
  if (pl.climbing) pl.vy = CLIMB;
  else pl.vy = Math.max(pl.vy - G * h, -150);

  if (inp.jump && (g || pl.coyote > 0 || pl.climbing) && pl.vy <= CLIMB + 0.01) {
    pl.vy = JUMPV; pl.coyote = 0; pl.ground = null; pl.climbing = false;
    ev.push('jump');
  }

  const wasGround = !!pl.ground;
  moveAxis(pl, W, 'x', pl.vx * h, wasGround);
  moveAxis(pl, W, 'z', pl.vz * h, wasGround);
  const landed = moveAxis(pl, W, 'y', pl.vy * h, wasGround);
  if (landed) {
    if (!pl.ground && pl.air > 0.15) ev.push('land');
    pl.ground = landed; pl.coyote = 0.1; pl.air = 0;
    if (landed.vanish && landed.vt === 0 && landed.gone === 0) { landed.vt = 0.6; ev.push('vanish'); }
    if (landed.surf === 'tramp') { pl.vy = TRAMPV; pl.ground = null; ev.push('bounce'); }
  } else {
    if (pl.ground) pl.coyote = 0.1;
    pl.ground = null; pl.coyote -= h; pl.air += h;
  }

  // hazards
  for (const p of W.kills) if (over(pl, p, 0.06)) { pl.dead = true; ev.push('kill'); return; }
  for (const p of W.spins) if (W.spinHit(p, pl.x, pl.y, pl.z)) { pl.dead = true; ev.push('kill'); return; }
  if (pl.y < W.def.kill || (W.def.water !== undefined && pl.y < W.def.water - 0.8)) { pl.dead = true; ev.push(W.def.water !== undefined && pl.y < W.def.water ? 'splash' : 'kill'); }
}

// move along one axis and resolve; for 'y' returns the part landed on
function moveAxis(pl, W, ax, d, wasGround) {
  if (ax !== 'y' && d === 0) return null;            // no sideways move: overlaps (a lift rising into you) are settled by the y pass
  pl[ax] += d;
  let landed = null;
  for (const p of W.solids) {
    if (!W.solidNow(p) || !over(pl, p)) continue;
    if (ax === 'y') {
      if (d <= 0) { pl.y = p.y1; pl.vy = 0; landed = p; }
      else { pl.y = p.y0 - H; if (pl.vy > 0) pl.vy = 0; }
    } else {
      const rise = p.y1 - pl.y;
      if ((wasGround || p.move) && rise > 0 && rise <= STEP && !blockedAt(pl, W, p.y1 + 0.001)) { pl.y = p.y1 + 0.001; continue; }
      if (ax === 'x') { pl.x = d > 0 ? p.x0 - HW : p.x1 + HW; pl.vx = 0; }
      else { pl.z = d > 0 ? p.z0 - HW : p.z1 + HW; pl.vz = 0; }
    }
  }
  return landed;
}
