// Blocky R6-style avatars. Height 5.2 studs: legs 2, torso 2, head 1.2. Faces +z.
import * as THREE from 'three';

export const AVATARS = [
  { id: 'josh', name: 'Josh', shirt: 0x2f6fe0, pants: 0x2a3a5a, skin: 0xf2c9a0, hair: 0x2a1a10, style: 'short' },
  { id: 'jasper', name: 'Jasper', shirt: 0x2ec85a, pants: 0x3a3a3a, skin: 0xf2c9a0, hair: 0x5a3a1a, style: 'cap', cap: 0xd83a3a },
  { id: 'jeff', name: 'Jeff', shirt: 0xe8452c, pants: 0x22262e, skin: 0xe8b890, hair: 0x141414, style: 'spiky', glasses: true },
  { id: 'erin', name: 'Erin', shirt: 0x9a4ad8, pants: 0xff8ac0, skin: 0xf6d2b0, hair: 0x6a3a1a, style: 'long' },
  { id: 'noob', name: 'Noob', shirt: 0x2a6ae0, pants: 0x3aa83a, skin: 0xf5d23a, hair: null, style: 'none', armsSkin: true },
];

function faceTex(skin, glasses) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#' + new THREE.Color(skin).getHexString(); x.fillRect(0, 0, 128, 128);
  x.fillStyle = '#111';
  for (const ex of [44, 84]) { x.beginPath(); x.ellipse(ex, 52, 7, 11, 0, 0, Math.PI * 2); x.fill(); }
  x.fillStyle = '#fff'; for (const ex of [46, 86]) { x.beginPath(); x.arc(ex, 47, 3, 0, Math.PI * 2); x.fill(); }
  x.strokeStyle = '#111'; x.lineWidth = 6; x.lineCap = 'round';
  x.beginPath(); x.arc(64, 70, 22, 0.25 * Math.PI, 0.75 * Math.PI); x.stroke();
  if (glasses) {
    x.lineWidth = 4; x.strokeStyle = '#222';
    for (const ex of [44, 84]) x.strokeRect(ex - 15, 38, 30, 26);
    x.beginPath(); x.moveTo(59, 48); x.lineTo(69, 48); x.stroke();
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.6 });

export function makeAvatar(id) {
  const a = AVATARS.find((v) => v.id === id) || AVATARS[0];
  const root = new THREE.Group();
  const body = new THREE.Group(); root.add(body);
  const box = (w, h, d, m, x, y, z, parent = body) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = true; parent.add(b); return b; };
  const skin = mat(a.skin), shirt = mat(a.shirt), pants = mat(a.pants);
  // limbs pivot at the top
  const limb = (x, y, m, m2) => {
    const p = new THREE.Group(); p.position.set(x, y, 0); body.add(p);
    box(1, 2, 1, m, 0, -1, 0, p);
    if (m2) box(1.02, 0.7, 1.02, m2, 0, -0.35, 0, p);   // sleeve
    return p;
  };
  const legL = limb(-0.5, 2, pants), legR = limb(0.5, 2, pants);
  box(2, 2, 1, shirt, 0, 3, 0);
  const armL = limb(-1.5, 4, a.armsSkin ? skin : skin, a.armsSkin ? null : shirt), armR = limb(1.5, 4, skin, a.armsSkin ? null : shirt);
  if (a.armsSkin) { armL.children[0].material = skin; armR.children[0].material = skin; }
  const head = new THREE.Group(); head.position.set(0, 4.6, 0); body.add(head);
  const fm = new THREE.MeshStandardMaterial({ map: faceTex(a.skin, a.glasses), roughness: 0.6 });
  const hb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), [skin, skin, skin, skin, fm, skin]);
  hb.castShadow = true; head.add(hb);
  if (a.hair !== null) {
    const hm = mat(a.hair);
    if (a.style === 'short') { box(1.3, 0.35, 1.3, hm, 0, 0.62, 0, head); box(1.3, 0.8, 0.3, hm, 0, 0.3, -0.55, head); }
    if (a.style === 'spiky') { box(1.3, 0.3, 1.3, hm, 0, 0.62, 0, head); for (const [x, z] of [[-0.35, 0], [0.35, 0], [0, -0.3], [0, 0.3]]) { const s = box(0.35, 0.45, 0.35, hm, x, 0.9, z, head); s.rotation.z = x * 0.6; } box(1.3, 0.8, 0.3, hm, 0, 0.3, -0.55, head); }
    if (a.style === 'cap') { box(1.32, 0.4, 1.32, mat(a.cap), 0, 0.64, 0, head); box(1.2, 0.1, 0.6, mat(a.cap), 0, 0.5, 0.85, head); box(1.3, 0.5, 0.3, hm, 0, 0.25, -0.55, head); }
    if (a.style === 'long') { box(1.32, 0.35, 1.32, hm, 0, 0.62, 0, head); box(1.36, 1.9, 0.35, hm, 0, -0.1, -0.55, head); for (const sx of [-1, 1]) box(0.25, 1.4, 1.1, hm, sx * 0.66, 0.05, -0.1, head); }
  }
  root.userData = { body, legL, legR, armL, armR, head, phase: 0 };
  return root;
}

// state: { speed (0..1), air (bool), climbing (bool), emote ('wave'|'cheer'|'dance'|'heart'|'hi5'|'') }
export function animateAvatar(av, dt, st) {
  const u = av.userData;
  u.phase += dt * (st.climbing ? 9 : 11) * Math.max(0.2, st.speed);
  u.et = (u.et || 0) + dt;
  let la = 0, ra = 0, ll = 0, rl = 0, raz = 0, laz = 0, bob = 0, spin = 0;
  const e = st.speed > 0.15 || st.air || st.climbing ? '' : st.emote || '';
  if (st.climbing) { la = -2.6 + Math.sin(u.phase) * 0.6; ra = -2.6 - Math.sin(u.phase) * 0.6; ll = Math.sin(u.phase) * 0.5; rl = -ll; }
  else if (st.air) { la = -2.9; ra = -2.9; ll = 0.3; rl = -0.3; }
  else if (st.speed > 0.05) { const s = Math.sin(u.phase) * 0.9 * Math.min(1, st.speed); la = s; ra = -s; ll = -s; rl = s; }
  else if (e === 'wave') { ra = -2.9; raz = 0.5 + Math.sin(u.et * 12) * 0.45; }
  else if (e === 'cheer') { la = ra = -3; laz = -0.35; raz = 0.35; bob = Math.abs(Math.sin(u.et * 9)) * 0.7; }
  else if (e === 'dance') { const s = Math.sin(u.et * 8); la = -1.6 + s; ra = -1.6 - s; ll = s * 0.4; rl = -s * 0.4; bob = Math.abs(s) * 0.35; spin = Math.sin(u.et * 4) * 0.6; }
  else if (e === 'heart') { la = ra = -1.4; laz = 0.5; raz = -0.5; }
  else if (e === 'hi5') { ra = -2.6; raz = 0.2; }
  const k = Math.min(1, dt * 14);
  u.armL.rotation.x += (la - u.armL.rotation.x) * k;
  u.armR.rotation.x += (ra - u.armR.rotation.x) * k;
  u.armL.rotation.z += (laz - u.armL.rotation.z) * k;
  u.armR.rotation.z += (raz - u.armR.rotation.z) * k;
  u.legL.rotation.x += (ll - u.legL.rotation.x) * k;
  u.legR.rotation.x += (rl - u.legR.rotation.x) * k;
  u.body.position.y += (bob - u.body.position.y) * k;
  u.body.rotation.y += (spin - u.body.rotation.y) * k;
}
