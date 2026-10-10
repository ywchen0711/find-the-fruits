// Procedural cartoon fruits with faces and accessories (three.js). makeFruit(meta) -> THREE.Group, ~1.1 studs radius.
import * as THREE from 'three';

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0, ...o });
const S = (r, w = 20, h = 14) => new THREE.SphereGeometry(r, w, h);
const BLACK = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.3 });
const WHITE = new THREE.MeshBasicMaterial({ color: 0xffffff });
const LEAF = std(0x3fae3a);
const STEM = std(0x6a4020);

function mesh(geo, mat, x = 0, y = 0, z = 0, parent) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (parent) parent.add(m);
  return m;
}

// vertical gradient via vertex colours (mango, papaya, peach blush, rainbow)
function gradient(geo, stops) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox, pos = geo.attributes.position, cols = [];
  const cs = stops.map((c) => new THREE.Color(c));
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y || 1);
    const f = t * (cs.length - 1), k = Math.min(cs.length - 2, Math.floor(f));
    tmp.copy(cs[k]).lerp(cs[k + 1], f - k);
    cols.push(tmp.r, tmp.g, tmp.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  return geo;
}

function lathe(profile, seg = 24) { return new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), seg); }

function leaf(parent, x, y, z, rz = -0.6, s = 1) {
  const l = mesh(S(0.32 * s, 10, 6), LEAF, x, y, z, parent);
  l.scale.set(1.4, 0.35, 0.8); l.rotation.z = rz;
  return l;
}
function stem(parent, y, h = 0.45) { const s = mesh(new THREE.CylinderGeometry(0.06, 0.08, h, 6), STEM, 0, y + h / 2 - 0.05, 0, parent); s.rotation.z = 0.15; return s; }

// eyes + smile on the +z side of a body of radius r centred at (0, cy, 0)
function face(parent, r, cy = 0, s = 1, zf = 1) {
  const g = new THREE.Group();
  const ez = r * 0.93 * zf;
  for (const sx of [-1, 1]) {
    const e = mesh(S(0.13 * s, 10, 8), BLACK, sx * 0.3 * s, cy + 0.14 * s, ez, g);
    e.scale.set(1, 1.25, 0.6);
    mesh(S(0.045 * s, 6, 4), WHITE, sx * 0.3 * s + 0.04 * s, cy + 0.2 * s, ez + 0.07 * s, g);
    const b = mesh(S(0.09 * s, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff7a8a, transparent: true, opacity: 0.55 }), sx * 0.5 * s, cy - 0.05 * s, ez - 0.08 * s, g);
    b.scale.set(1.3, 0.7, 0.4);
  }
  const m = mesh(new THREE.TorusGeometry(0.15 * s, 0.035 * s, 6, 12, Math.PI), BLACK, 0, cy - 0.06 * s, ez + 0.02, g);
  m.rotation.z = Math.PI;
  parent.add(g);
  g.userData.eyeY = cy + 0.14 * s; g.userData.ez = ez;
  return g;
}

// ------------------------------------------------------------------ bodies
function body(meta) {
  const g = new THREE.Group();
  const c = meta.c, c2 = meta.c2 || c;
  const mat = meta.gold ? std(c, { metalness: 0.85, roughness: 0.25, emissive: 0x3a2a00 })
    : meta.ghost ? std(c, { transparent: true, opacity: 0.6, emissive: 0x8aa0c0 })
      : std(c);
  let r = 1, cy = 0, fs = 1, top = 1;
  switch (meta.shape) {
    case 'apple': {
      const b = mesh(S(1), mat, 0, 0, 0, g); b.scale.set(1.05, 0.95, 1.05);
      stem(g, 0.85); leaf(g, 0.28, 1.08, 0); top = 1.05; break;
    }
    case 'banana': {
      const geo = new THREE.TorusGeometry(1.25, 0.42, 12, 24, 2.4);
      const b = mesh(geo, mat, 0, 1.25, 0, g); b.rotation.z = -Math.PI / 2 - 1.2;
      b.scale.set(1, 1, 0.9);
      for (const a of [-Math.PI / 2 - 1.2, -Math.PI / 2 + 1.2]) mesh(S(0.14, 8, 6), STEM, Math.cos(a) * 1.25 * 1.02, 1.25 + Math.sin(a) * 1.25 * 1.02, 0, g);
      r = 0.42; cy = 0.0; fs = 0.8; top = 0.6; g.userData.faceZ = 0.42; break;
    }
    case 'berry': {
      mesh(S(0.8), mat, 0, 0, 0, g);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; const k = mesh(new THREE.ConeGeometry(0.1, 0.22, 4), std(new THREE.Color(c).multiplyScalar(0.55)), Math.cos(a) * 0.14, 0.82, Math.sin(a) * 0.14, g); k.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); }
      r = 0.8; fs = 0.85; top = 0.85; break;
    }
    case 'cherry': {
      for (const sx of [-1, 1]) {
        mesh(S(0.62), mat, sx * 0.55, -0.25, 0, g);
        const st = mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.3, 5), STEM, sx * 0.3, 0.72, 0, g); st.rotation.z = sx * 0.42;
      }
      leaf(g, 0.3, 1.3, 0, -0.4);
      const f2 = face(g, 0.62, -0.25, 0.62); f2.position.x = 0.55;
      r = 0.62; cy = -0.25; fs = 0.62; top = 1.3; g.userData.faceX = -0.55; break;
    }
    case 'strawberry': {
      const geo = lathe([[0, -1.1], [0.35, -0.95], [0.75, -0.45], [0.95, 0.1], [0.9, 0.5], [0.6, 0.8], [0, 0.85]]);
      mesh(geo, mat, 0, 0, 0, g);
      const seedM = std(0xfff3a0);
      for (let i = 0; i < 22; i++) {
        const y = -0.85 + (i % 6) * 0.25, a = i * 2.4 + (i % 2) * 0.6;
        const rad = Math.max(0.2, 0.95 - Math.abs(y - 0.15) * 0.55);
        if (Math.abs(Math.sin(a)) > 0.75 && Math.cos(a) > 0 && y > -0.2) continue;   // keep the face clear
        mesh(S(0.05, 5, 4), seedM, Math.sin(a) * rad, y, Math.cos(a) * rad, g);
      }
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const l = mesh(new THREE.ConeGeometry(0.16, 0.6, 4), LEAF, Math.cos(a) * 0.35, 0.85, Math.sin(a) * 0.35, g); l.rotation.set(Math.sin(a) * 1.3, 0, -Math.cos(a) * 1.3); }
      r = 0.95; cy = 0.05; top = 0.95; break;
    }
    case 'grape': {
      const rows = [[0.55, 4], [0.1, 3], [-0.33, 2], [-0.72, 1]];
      rows.forEach(([y, n], ri) => {
        for (let i = 0; i < n; i++) for (const z of ri < 2 ? [-0.25, 0.25] : [0]) mesh(S(0.36, 14, 10), mat, (i - (n - 1) / 2) * 0.6, y, z, g);
      });
      stem(g, 0.85); leaf(g, 0.3, 1.1, 0);
      r = 0.62; cy = 0.1; fs = 0.9; top = 0.95; break;
    }
    case 'orange': case 'round': case 'persimmon': case 'pomegranate': case 'coconut': case 'peach': case 'kiwi': {
      const geo = S(1, 24, 16);
      if (meta.shape === 'peach') gradient(geo, [c, c, 0xff7a6a]);
      const m2 = meta.shape === 'peach' ? std(0xffffff, { vertexColors: true }) : mat;
      const b = mesh(geo, m2, 0, 0, 0, g);
      if (meta.shape === 'persimmon') b.scale.set(1.08, 0.8, 1.08);
      if (meta.shape === 'kiwi') { b.scale.set(1.12, 0.9, 0.95); b.material = std(c, { roughness: 0.95 }); }
      if (meta.shape === 'coconut') { b.material = std(c, { roughness: 0.95 }); for (const [x, z] of [[-0.2, 0.1], [0.2, 0.1], [0, -0.2]]) mesh(S(0.1, 6, 4), BLACK, x, 0.96, z, g); }
      if (meta.shape === 'orange') { stem(g, 0.9, 0.2); leaf(g, 0.25, 1.0, 0); }
      if (meta.shape === 'round') { stem(g, 0.9, 0.25); if (meta.c2) for (let i = 0; i < 14; i++) { const a = i * 2.39, y = Math.cos(i * 1.3) * 0.7, rr = Math.sqrt(1 - y * y); if (Math.cos(a) > 0.6 && y > -0.4) continue; mesh(S(0.07, 5, 4), std(meta.c2), Math.sin(a) * rr, y, Math.cos(a) * rr, g); } }
      if (meta.shape === 'persimmon') for (let i = 0; i < 4; i++) { const l = leaf(g, Math.cos(i * Math.PI / 2) * 0.32, 0.82, Math.sin(i * Math.PI / 2) * 0.32, 0, 1.1); l.rotation.y = -i * Math.PI / 2; }
      if (meta.shape === 'pomegranate') for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; const k = mesh(new THREE.ConeGeometry(0.1, 0.35, 4), std(new THREE.Color(c).multiplyScalar(0.7)), Math.cos(a) * 0.18, 1.08, Math.sin(a) * 0.18, g); k.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5); }
      if (meta.shape === 'peach') { const cr = mesh(new THREE.TorusGeometry(1.0, 0.03, 6, 24, Math.PI), std(0xd86a5a), 0, 0, 0, g); cr.rotation.y = Math.PI / 2; cr.rotation.x = -0.3; leaf(g, 0.25, 1.0, 0); stem(g, 0.9, 0.2); }
      top = meta.shape === 'persimmon' ? 0.8 : 1; cy = meta.shape === 'persimmon' ? -0.02 : 0; r = meta.shape === 'kiwi' ? 0.95 : 1; break;
    }
    case 'mango': case 'papaya': case 'lemon': case 'melon': {
      const geo = S(1, 24, 16);
      let m2 = mat;
      if (meta.shape === 'mango' || meta.shape === 'papaya') { gradient(geo, [c2, c, c]); m2 = std(0xffffff, { vertexColors: true }); }
      if (meta.shape === 'melon') { m2 = std(0xffffff, { map: stripeTex(c) }); }
      const b = mesh(geo, m2, 0, 0, 0, g);
      if (meta.shape === 'mango') { b.scale.set(1.12, 0.92, 0.85); b.rotation.z = 0.25; stem(g, 0.8, 0.2); leaf(g, 0.3, 0.95, 0); }
      if (meta.shape === 'papaya') { b.scale.set(0.85, 1.25, 0.85); stem(g, 1.15, 0.2); }
      if (meta.shape === 'lemon') { b.scale.set(1.25, 0.92, 0.92); for (const sx of [-1, 1]) mesh(S(0.18, 8, 6), mat, sx * 1.22, 0, 0, g); leaf(g, 0.2, 0.95, 0); }
      if (meta.shape === 'melon') { b.scale.set(1.3, 1.05, 1.05); }
      r = meta.shape === 'papaya' || meta.shape === 'mango' ? 0.88 : meta.shape === 'melon' ? 1.05 : 0.92; top = meta.shape === 'papaya' ? 1.25 : 1; break;
    }
    case 'pineapple': {
      const b = mesh(S(1, 24, 16), std(0xffffff, { map: pineTex(c) }), 0, 0, 0, g); b.scale.set(0.92, 1.18, 0.92);
      for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; const k = mesh(new THREE.ConeGeometry(0.16, 1.0 - (i % 3) * 0.15, 4), LEAF, Math.cos(a) * 0.15, 1.5, Math.sin(a) * 0.15, g); k.rotation.set(Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4); }
      r = 0.92; top = 1.25; break;
    }
    case 'dragon': {
      const geo = S(1, 24, 16);
      if (meta.rainbow) gradient(geo, [0xff3a3a, 0xffa03a, 0xffe83a, 0x3ad86a, 0x3a8aff, 0xa04aff]);
      const b = mesh(geo, meta.rainbow ? std(0xffffff, { vertexColors: true, emissive: 0x220022 }) : mat, 0, 0, 0, g); b.scale.set(0.95, 1.12, 0.95);
      for (let i = 0; i < 14; i++) {
        const y = -0.7 + (i % 5) * 0.38, a = i * 2.2 + 0.3; const rr = Math.sqrt(Math.max(0, 1 - (y / 1.12) ** 2)) * 0.95;
        if (Math.cos(a) > 0.55 && y > -0.4 && y < 0.6) continue;
        const k = mesh(new THREE.ConeGeometry(0.16, 0.5, 5), std(0x5ad04a), Math.sin(a) * rr, y, Math.cos(a) * rr, g);
        k.lookAt(Math.sin(a) * 3, y + 1.5, Math.cos(a) * 3); k.rotateX(Math.PI / 2);
      }
      r = 0.95; top = 1.2; break;
    }
    case 'pear': case 'fig': case 'avocado': {
      const prof = meta.shape === 'fig' ? [[0, -0.95], [0.6, -0.8], [0.95, -0.3], [0.85, 0.25], [0.45, 0.75], [0.15, 1.05], [0, 1.1]]
        : [[0, -1.0], [0.7, -0.85], [1.0, -0.35], [0.85, 0.2], [0.55, 0.6], [0.45, 0.95], [0.25, 1.2], [0, 1.25]];
      mesh(lathe(prof), meta.shape === 'avocado' ? std(c, { roughness: 0.9 }) : mat, 0, 0, 0, g);
      if (meta.shape !== 'avocado') { stem(g, 1.1, 0.3); if (meta.shape === 'pear') leaf(g, 0.25, 1.35, 0); }
      r = 0.95; cy = -0.25; top = 1.25; break;
    }
    case 'bumpy': case 'durian': {
      const core = mesh(S(0.85), mat, 0, 0, 0, g);
      const n = meta.shape === 'durian' ? 60 : 46;
      for (let i = 0; i < n; i++) {
        const y = 1 - (i / (n - 1)) * 2, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
        const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
        if (z > 0.55 && y > -0.45 && y < 0.6) continue;           // face patch
        if (meta.shape === 'durian') {
          const k = mesh(new THREE.ConeGeometry(0.12, 0.35, 5), std(new THREE.Color(c).multiplyScalar(0.8)), x * 0.92, y * 0.92, z * 0.92, g);
          k.lookAt(x * 3, y * 3, z * 3); k.rotateX(Math.PI / 2);
        } else mesh(S(0.2, 8, 6), mat, x * 0.85, y * 0.85, z * 0.85, g);
      }
      if (meta.shape === 'durian') core.scale.set(1, 1.1, 1);
      if (meta.shape === 'bumpy') leaf(g, 0.2, 1.0, 0);
      r = meta.shape === 'durian' ? 0.92 : 0.95; top = 1.05; break;
    }
    case 'star': {
      const sh = new THREE.Shape();
      for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 + Math.PI / 2, rr = i % 2 ? 0.55 : 1.15; i ? sh.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : sh.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.18, bevelSize: 0.14, bevelSegments: 3 });
      geo.translate(0, 0, -0.275);
      mesh(geo, mat, 0, 0, 0, g);
      r = 0.5; fs = 0.85; top = 1.15; g.userData.faceZ = 0.48; break;
    }
    case 'galaxy': {
      mesh(S(1, 32, 20), std(0xffffff, { map: galaxyTex(), emissive: 0x2a1060, emissiveIntensity: 0.6 }), 0, 0, 0, g);
      const ring = mesh(new THREE.TorusGeometry(1.55, 0.07, 8, 48), new THREE.MeshBasicMaterial({ color: 0xffd0ff }), 0, 0, 0, g);
      ring.rotation.x = 1.2; ring.userData.spin = 1;
      r = 1; top = 1; break;
    }
    default: mesh(S(1), mat, 0, 0, 0, g);
  }
  const fz = g.userData.faceZ;
  const f = face(g, fz !== undefined ? fz / 0.93 : r, cy, fs);
  if (g.userData.faceX !== undefined) f.position.x = g.userData.faceX;
  if (meta.shape === 'banana') f.position.y = 0.0;
  return { g, r, cy, top, face: f };
}

// ------------------------------------------------------------------ accessories
function accessory(meta, b) {
  const g = b.g, top = b.top, r = b.r, f = b.face;
  const eyeY = f.userData.eyeY, ez = f.userData.ez, fx = f.position.x;
  switch (meta.acc) {
    case 'shades': {
      const m = std(0x101018, { roughness: 0.1, metalness: 0.5 });
      for (const sx of [-1, 1]) { const l = mesh(new THREE.BoxGeometry(0.42, 0.26, 0.08), m, fx + sx * 0.3, eyeY, ez + 0.1, g); }
      mesh(new THREE.BoxGeometry(0.25, 0.05, 0.06), m, fx, eyeY + 0.06, ez + 0.1, g);
      break;
    }
    case 'ninja': {
      const band = mesh(new THREE.TorusGeometry(r * 1.0, 0.11, 6, 28), std(0x1a1a2a), 0, eyeY + 0.32, 0, g); band.rotation.x = Math.PI / 2;
      for (const s of [-1, 1]) { const t = mesh(new THREE.BoxGeometry(0.12, 0.5, 0.06), std(0x1a1a2a), 0.15 * s, eyeY + 0.1, -r - 0.05, g); t.rotation.z = s * 0.5; }
      break;
    }
    case 'pirate': {
      const hat = new THREE.Group(); hat.position.y = top + 0.05; g.add(hat);
      const hm = std(0x1a1a1a);
      mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.12, 20), hm, 0, 0, 0, hat);
      mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.45, 20), hm, 0, 0.25, 0, hat);
      mesh(new THREE.BoxGeometry(0.2, 0.2, 0.05), WHITE, 0, 0.27, 0.56, hat);
      const p = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 12), BLACK, fx + 0.3, eyeY, ez + 0.08, g); p.rotation.x = Math.PI / 2;
      const st = mesh(new THREE.BoxGeometry(1.6, 0.04, 0.04), BLACK, fx, eyeY + 0.2, ez - 0.02, g); st.rotation.z = -0.5;
      break;
    }
    case 'crown': {
      const cg = new THREE.Group(); cg.position.y = top - 0.05; g.add(cg);
      const gm = std(0xffd23a, { metalness: 0.8, roughness: 0.25 });
      mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 16, 1, true), gm, 0, 0.1, 0, cg).material.side = THREE.DoubleSide;
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; mesh(new THREE.ConeGeometry(0.1, 0.3, 4), gm, Math.cos(a) * 0.48, 0.38, Math.sin(a) * 0.48, cg); }
      mesh(S(0.08, 8, 6), std(0xff2a6a), 0, 0.12, 0.5, cg);
      break;
    }
    case 'chef': {
      mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.5, 18), std(0xffffff), 0, top + 0.2, 0, g);
      const p = mesh(S(0.55, 14, 10), std(0xffffff), 0, top + 0.6, 0, g); p.scale.set(1.15, 0.75, 1.15);
      break;
    }
    case 'halo': {
      const h = mesh(new THREE.TorusGeometry(0.5, 0.07, 8, 24), new THREE.MeshBasicMaterial({ color: 0xfff08a }), 0, top + 0.45, 0, g); h.rotation.x = Math.PI / 2;
      break;
    }
    case 'santa': {
      const s = new THREE.Group(); s.position.y = top - 0.1; g.add(s);
      mesh(new THREE.TorusGeometry(0.55, 0.13, 8, 20), std(0xffffff), 0, 0, 0, s).rotation.x = Math.PI / 2;
      const cone = mesh(new THREE.ConeGeometry(0.55, 1.0, 16), std(0xe02a2a), 0, 0.5, 0, s); cone.rotation.z = -0.25;
      mesh(S(0.16, 8, 6), std(0xffffff), 0.25, 0.95, 0, s);
      break;
    }
    case 'beanie': {
      const bg = mesh(S(0.7, 16, 8, ), std(0x2a6ae0), 0, top - 0.25, 0, g); bg.scale.set(1.05, 0.7, 1.05);
      mesh(S(0.18, 8, 6), std(0xffffff), 0, top + 0.25, 0, g);
      break;
    }
    case 'scarf': {
      const s = mesh(new THREE.TorusGeometry(r * 0.88, 0.15, 8, 24), std(0xe02a3a), 0, -r * 0.45, 0, g); s.rotation.x = Math.PI / 2;
      const t = mesh(new THREE.BoxGeometry(0.3, 0.7, 0.12), std(0xe02a3a), 0.35, -r * 0.8, r * 0.75, g); t.rotation.z = 0.2;
      break;
    }
    case 'wings': {
      for (const sx of [-1, 1]) {
        const w = mesh(S(0.55, 12, 8), std(0xffffff, { roughness: 0.8 }), sx * (r + 0.55), 0.2, -0.2, g);
        w.scale.set(1, 0.6, 0.18); w.rotation.z = sx * 0.4; w.userData.wing = sx;
      }
      break;
    }
    case 'helmet': {
      mesh(S(r * 1.45, 24, 16), new THREE.MeshStandardMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.25, roughness: 0.05, metalness: 0.2 }), 0, 0, 0, g);
      mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 6), std(0xaaaaaa), 0.3, r * 1.45 + 0.25, 0, g);
      mesh(S(0.09, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3a3a }), 0.3, r * 1.45 + 0.58, 0, g);
      break;
    }
    case 'bolt': {
      const sh = new THREE.Shape(); [[0, 0.6], [0.35, 0.6], [0.1, 0.1], [0.38, 0.1], [-0.15, -0.6], [0.02, -0.1], [-0.25, -0.1]].forEach(([x, y], i) => (i ? sh.lineTo(x, y) : sh.moveTo(x, y)));
      const b2 = mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: false }), new THREE.MeshBasicMaterial({ color: 0xfff23a }), 0, top + 0.7, -0.06, g);
      b2.userData.bolt = 1;
      break;
    }
    case 'bow': {
      const bm = std(0xff4a9a);
      for (const sx of [-1, 1]) { const l = mesh(new THREE.ConeGeometry(0.22, 0.45, 8), bm, sx * 0.24, top + 0.08, 0, g); l.rotation.z = sx * Math.PI / 2; }
      mesh(S(0.1, 8, 6), bm, 0, top + 0.08, 0, g);
      break;
    }
    default: break;
  }
}

// ------------------------------------------------------------------ textures
function canvas(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function stripeTex(c) {
  const base = '#' + new THREE.Color(c).getHexString();
  return canvas(128, 64, (x, w, h) => {
    x.fillStyle = '#7ad04a'; x.fillRect(0, 0, w, h);
    x.fillStyle = base;
    for (let i = 0; i < 8; i++) { x.beginPath(); for (let y = 0; y <= h; y += 4) x.lineTo(i * 16 + 4 + Math.sin(y * 0.3 + i) * 2, y); for (let y = h; y >= 0; y -= 4) x.lineTo(i * 16 + 11 + Math.sin(y * 0.3 + i) * 2, y); x.fill(); }
  });
}
function pineTex(c) {
  const base = '#' + new THREE.Color(c).getHexString();
  const t = canvas(64, 64, (x, w, h) => {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    x.strokeStyle = 'rgba(120,70,10,.7)'; x.lineWidth = 2;
    for (let i = -64; i < 128; i += 12) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 64, 64); x.stroke(); x.beginPath(); x.moveTo(i + 64, 0); x.lineTo(i, 64); x.stroke(); }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 2);
  return t;
}
function galaxyTex() {
  return canvas(256, 128, (x, w, h) => {
    const gr = x.createLinearGradient(0, 0, w, h);
    gr.addColorStop(0, '#1a0a4a'); gr.addColorStop(0.5, '#5a1aa0'); gr.addColorStop(1, '#0a2a6a');
    x.fillStyle = gr; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 14; i++) { const rg = x.createRadialGradient(Math.random() * w, Math.random() * h, 0, Math.random() * w, Math.random() * h, 40); rg.addColorStop(0, 'rgba(255,120,220,.35)'); rg.addColorStop(1, 'rgba(255,120,220,0)'); x.fillStyle = rg; x.fillRect(0, 0, w, h); }
    for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`; const s = Math.random() < 0.1 ? 2 : 1; x.fillRect(Math.random() * w, Math.random() * h, s, s); }
  });
}

export function makeFruit(meta) {
  const b = body(meta);
  accessory(meta, b);
  const root = new THREE.Group();
  root.add(b.g);
  b.g.position.y = -b.cy * 0.3;
  root.userData.model = b.g;
  b.g.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  return root;
}

// a little animation: wings flap, galaxy ring spins, bolt flickers
export function animateFruit(root, t) {
  root.userData.model.traverse((m) => {
    if (m.userData.wing) m.rotation.z = m.userData.wing * (0.4 + Math.sin(t * 10) * 0.35);
    if (m.userData.spin) m.rotation.z = t * 0.8;
    if (m.userData.bolt) m.visible = Math.sin(t * 7) > -0.6;
  });
}
