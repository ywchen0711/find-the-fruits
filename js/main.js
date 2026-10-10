import * as THREE from 'three';
import { WORLDS, WORLD, FRUITS, FRUIT, TIERS, CATS, buildWorld } from './data.js?v=2';
import { World, newPlayer, stepPlayer } from './physics.js?v=2';
import { makeFruit, animateFruit } from './fruitmodel.js?v=2';
import { makeAvatar, animateAvatar, AVATARS } from './avatar.js?v=2';
import { sfx, music } from './audio.js?v=2';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const isTouch = matchMedia('(pointer: coarse)').matches || params.has('touch');

// ------------------------------------------------------------------ save + text
const SAVE_KEY = 'ftf_save_v1';
function loadSave() {
  const d = { found: {}, avatar: 'josh', lang: /^zh/i.test(navigator.language || '') ? 'zh' : 'en', sound: true, music: true, seen: {} };
  try { return { ...d, ...JSON.parse(localStorage.getItem(SAVE_KEY) || '{}') }; } catch (e) { return d; }
}
const save = loadSave();
if (params.get('found') === 'all') FRUITS.forEach((f) => { if (f.id !== 'goldenapple') save.found[f.id] = Date.now(); });
const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* private mode */ } };
// the lobby opens games with ?lang=zh|en: that choice wins and is remembered
const qLang = (typeof location !== 'undefined' && (location.search.match(/[?&]lang=(zh|en)(?![a-z])/) || [])[1]);
if (qLang) { save.lang = qLang; persist(); }
const foundCount = (cat) => FRUITS.filter((f) => save.found[f.id] && (!cat || f.cat === cat)).length;
const catTotal = (cat) => FRUITS.filter((f) => f.cat === cat).length;
if (save.follow === undefined) save.follow = true;

const STR = {
  zh: {
    title: '尋找水果！', sub: '六個世界，藏著 40 顆水果和 10 種速食。你能全部找到嗎？', play: '開始探險', choose: '選擇角色', progress: '收集進度',
    book: '水果圖鑑', hint: '💡 提示', found: '已找到', missing: '還沒找到', badge: '獲得徽章！', badgeOf: (n) => `${n} 發現者`,
    youFound: (n) => `找到了 ${n}！`, already: (n) => `${n} 已經找到過了`, unlocked: (w) => `🔓 ${w} 的傳送門打開了！`,
    need: (n, m, c) => `🔒 需要 ${n} 個${c === 'fruit' ? '水果' : '寶物'}才能進去（你有 ${m} 個）`, locked: '🔒 門鎖住了', gotKey: '🔑 拿到寶藏鑰匙了！', usedKey: '🔑 用鑰匙打開了門！',
    needKey: '🔒 這扇門需要鑰匙', check: '✅ 存檔點', codeOk: '🔓 密碼正確！', codeBad: '❌ 密碼錯誤', seqOk: '🎨 順序正確，門打開了！', seqBad: '❌ 順序錯了，從頭再來！',
    seqGood: (n, m) => `✔ ${n}/${m}`, timer: (s) => `⏱ 門會在 ${s} 秒後關上！`, worldDone: (w) => `🏆 ${w} 全部找到了！`, allDone: '🏆🏆 40 顆水果和 10 種速食全部找到了！你是尋寶大師！',
    pcControls: 'WASD / 方向鍵 移動 · 空白鍵 跳 · 拖曳滑鼠或 Q / E 轉視角 · 滾輪縮放 · F 跟隨視角 · B 圖鑑 · R 重生',
    touchControls: '左手搖桿移動 · 右邊畫面拖曳或按 ⟲ ⟳ 轉視角 · ＋－ 縮放 · ⤒ 跳',
    keypad: '輸入 4 位數密碼', enter: '確定', clear: '清除', close: '關閉', all: '全部', go: '傳送過去', lockedW: (n) => `🔒 需要 ${n} 顆`,
    help: '怎麼玩', tiers: '難度', helpBody: [
      '在每個世界探索，找出藏起來的水果。碰到水果就收集起來，還會得到一個徽章！速食街藏的不是水果，是 10 種速食。',
      '轉視角：拖曳畫面、按 Q / E，或按右下角的 ⟲ ⟳（按住會一直轉）；＋－ 縮放。🎥 跟隨視角打開時，走路時鏡頭會自動轉到角色後面。',
      '有的水果就在眼前（簡單），有的要爬梯子、跑酷（普通、困難），有的要解謎：找鑰匙、輸入密碼、按對按鈕順序、跑過限時的門，或是發現能穿過去的假牆和看不見的路。',
      '瘋狂和不可能的水果要很困難的跑酷：會消失的方塊、移動平台、旋轉棒、滑溜的冰……掉下去就回到存檔點（白色的發光地板）。',
      '找到越多水果，水果廣場就會開啟越多傳送門。打開 📖 圖鑑可以看每顆水果的提示。',
    ],
    reset: '重生', home: '回水果廣場', soundL: '音效', musicL: '音樂', wipe: '清除存檔', wipeQ: '確定要清除所有進度嗎？', oof: '噢！',
    worldCount: (n, m) => `這個世界 ${n}/${m}`, follow: (on) => `🎥 跟隨視角：${on ? '開' : '關'}`,
  },
  en: {
    title: 'Find the Fruits!', sub: 'Six worlds hiding 40 fruits and 10 fast foods. Can you find them all?', play: 'Start exploring', choose: 'Choose your avatar', progress: 'Progress',
    book: 'Fruit Book', hint: '💡 Hint', found: 'Found', missing: 'Not found yet', badge: 'Badge awarded!', badgeOf: (n) => `${n} Finder`,
    youFound: (n) => `You found the ${n}!`, already: (n) => `You already found the ${n}`, unlocked: (w) => `🔓 The ${w} portal is open!`,
    need: (n, m, c) => `🔒 You need ${n} ${c === 'fruit' ? 'fruits' : 'finds'} to enter (you have ${m})`, locked: '🔒 The door is locked', gotKey: '🔑 You got the treasure key!', usedKey: '🔑 The key opened the door!',
    needKey: '🔒 This door needs a key', check: '✅ Checkpoint', codeOk: '🔓 Correct code!', codeBad: '❌ Wrong code', seqOk: '🎨 Right order, the door opens!', seqBad: '❌ Wrong order, start again!',
    seqGood: (n, m) => `✔ ${n}/${m}`, timer: (s) => `⏱ The door closes in ${s} seconds!`, worldDone: (w) => `🏆 Everything in ${w} found!`, allDone: '🏆🏆 All 40 fruits and 10 fast foods found! You are a Treasure Master!',
    pcControls: 'WASD / arrows to move · Space to jump · drag the mouse or Q / E to look · wheel to zoom · F follow camera · B book · R reset',
    touchControls: 'Left stick to move · drag on the right or press ⟲ ⟳ to look · ＋－ to zoom · ⤒ to jump',
    keypad: 'Enter the 4-digit code', enter: 'Enter', clear: 'Clear', close: 'Close', all: 'All', go: 'Teleport', lockedW: (n) => `🔒 needs ${n}`,
    help: 'How to play', tiers: 'Difficulty', helpBody: [
      'Explore each world and find the hidden fruits. Touch a fruit to collect it and earn its badge! Fast Food Street hides 10 fast foods instead.',
      'Turning the camera: drag the screen, press Q / E, or use ⟲ ⟳ at the bottom right (hold to keep turning); ＋ － zooms. With 🎥 follow camera on, the camera swings behind you as you walk.',
      'Some fruits sit in plain sight (Easy). Others need climbing and parkour (Medium, Hard), or a puzzle: find a key, crack a code, press buttons in the right order, beat a timed door, or discover fake walls and invisible paths.',
      'Insane and Impossible fruits need tough parkour: vanishing blocks, moving platforms, spinning bars, slippery ice... If you fall, you go back to your last checkpoint (the white glowing pads).',
      'The more fruits you find, the more portals open in Fruit Plaza. Open the 📖 Book for a hint for every fruit.',
    ],
    reset: 'Reset', home: 'Back to Fruit Plaza', soundL: 'Sound', musicL: 'Music', wipe: 'Erase save', wipeQ: 'Erase all your progress?', oof: 'Oof!',
    worldCount: (n, m) => `This world ${n}/${m}`, follow: (on) => `🎥 Follow camera: ${on ? 'on' : 'off'}`,
  },
};
const tr = () => STR[save.lang];
const nm = (o) => o[save.lang] || o.en;

// ------------------------------------------------------------------ renderer / scene
const canvasEl = $('cv');
const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isTouch ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, 1, 0.2, 1500);
const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8a80, 1.5);
scene.add(hemi);
const sun = new THREE.DirectionalLight(0xfff6e8, 2.1);
sun.castShadow = true;
sun.shadow.mapSize.set(isTouch ? 1024 : 2048, isTouch ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 70, bottom: -70, near: 1, far: 400 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.04;
scene.add(sun, sun.target);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// ------------------------------------------------------------------ textures
function ctex(w, h, draw, repeat = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}
const rnd = (a, b) => a + Math.random() * (b - a);
function speckle(x, w, h, n, colors, size = [1, 3]) { for (let i = 0; i < n; i++) { x.fillStyle = colors[i % colors.length]; const s = rnd(size[0], size[1]); x.fillRect(rnd(0, w), rnd(0, h), s, s); } }
const TEX = {
  studs: () => ctex(64, 64, (x) => {
    x.fillStyle = '#ececec'; x.fillRect(0, 0, 64, 64);
    for (const [cx, cy] of [[16, 16], [48, 16], [16, 48], [48, 48]]) {
      x.fillStyle = 'rgba(0,0,0,.16)'; x.beginPath(); x.arc(cx + 1.5, cy + 2, 9, 0, 7); x.fill();
      x.fillStyle = '#f8f8f8'; x.beginPath(); x.arc(cx, cy, 9, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(cx - 2.5, cy - 2.5, 4, 0, 7); x.fill();
    }
    x.strokeStyle = 'rgba(0,0,0,.08)'; x.strokeRect(0.5, 0.5, 63, 63);
  }),
  plastic: () => ctex(64, 64, (x) => { x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 64, 64); speckle(x, 64, 64, 120, ['rgba(0,0,0,.03)', 'rgba(255,255,255,.05)'], [1, 2]); x.strokeStyle = 'rgba(0,0,0,.07)'; x.strokeRect(0.5, 0.5, 63, 63); }),
  grass: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#e4e4e4'; x.fillRect(0, 0, w, h); speckle(x, w, h, 900, ['rgba(0,40,0,.10)', 'rgba(255,255,200,.12)', 'rgba(0,30,0,.07)'], [1, 4]); }),
  sand: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#ececec'; x.fillRect(0, 0, w, h); speckle(x, w, h, 1400, ['rgba(120,80,20,.12)', 'rgba(255,255,255,.3)'], [1, 2]); }),
  snow: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#f4f4f4'; x.fillRect(0, 0, w, h); speckle(x, w, h, 500, ['rgba(120,150,200,.08)', 'rgba(255,255,255,.9)'], [1, 3]); }),
  wood: () => ctex(128, 128, (x, w, h) => {
    x.fillStyle = '#e0e0e0'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) { x.fillStyle = `rgba(60,30,0,${0.05 + (i % 2) * 0.05})`; x.fillRect(0, i * 32, w, 32); x.fillStyle = 'rgba(40,20,0,.25)'; x.fillRect(0, i * 32, w, 2); }
    for (let i = 0; i < 40; i++) { x.strokeStyle = 'rgba(60,30,0,.08)'; x.beginPath(); const y = rnd(0, h); x.moveTo(0, y); x.bezierCurveTo(40, y + rnd(-4, 4), 80, y + rnd(-4, 4), w, y); x.stroke(); }
  }),
  brick: () => ctex(128, 128, (x, w, h) => {
    x.fillStyle = '#d8d0c8'; x.fillRect(0, 0, w, h);
    for (let r = 0; r < 8; r++) for (let c = -1; c < 4; c++) { const ox = (r % 2) * 16; x.fillStyle = `rgba(${rnd(200, 255)},${rnd(200, 240)},${rnd(190, 230)},1)`; x.fillRect(c * 32 + ox + 2, r * 16 + 2, 28, 12); }
  }),
  stone: () => ctex(128, 128, (x, w, h) => {
    x.fillStyle = '#c8c8c8'; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 26; i++) { const g = rnd(215, 245); x.fillStyle = `rgb(${g},${g},${g})`; x.beginPath(); x.ellipse(rnd(0, w), rnd(0, h), rnd(10, 22), rnd(8, 16), rnd(0, 3), 0, 7); x.fill(); }
    speckle(x, w, h, 400, ['rgba(0,0,0,.06)'], [1, 2]);
  }),
  metal: () => ctex(64, 64, (x, w, h) => { x.fillStyle = '#e6e6e6'; x.fillRect(0, 0, w, h); for (let i = 0; i < 64; i++) { x.fillStyle = `rgba(0,0,0,${rnd(0, 0.05)})`; x.fillRect(0, i, w, 1); } }),
  checker: () => ctex(64, 64, (x) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#ffc6de'; x.fillRect(0, 0, 32, 32); x.fillRect(32, 32, 32, 32); }),
  wall: () => ctex(64, 64, (x) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, 64, 64); x.fillStyle = 'rgba(255,150,200,.35)'; x.fillRect(0, 0, 16, 64); x.fillRect(32, 0, 8, 64); x.fillStyle = 'rgba(255,255,255,.8)'; for (let y = 6; y < 64; y += 16) { x.beginPath(); x.arc(48, y, 3, 0, 7); x.fill(); } }),
  candy: () => ctex(64, 64, (x) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, 64, 64); x.fillStyle = 'rgba(255,255,255,.0)'; x.strokeStyle = 'rgba(255,255,255,.65)'; x.lineWidth = 9; for (let i = -64; i < 128; i += 22) { x.beginPath(); x.moveTo(i, 64); x.lineTo(i + 64, 0); x.stroke(); } x.fillStyle = 'rgba(0,0,0,.06)'; x.fillRect(0, 0, 64, 64); }),
  cloud: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#f2f2f2'; x.fillRect(0, 0, w, h); for (let i = 0; i < 30; i++) { const g = x.createRadialGradient(rnd(0, w), rnd(0, h), 0, rnd(0, w), rnd(0, h), 30); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); } }),
  ice: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#e8f4ff'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 1.5; for (let i = 0; i < 14; i++) { x.beginPath(); const a = rnd(0, w), b = rnd(0, h); x.moveTo(a, b); x.lineTo(a + rnd(-30, 30), b + rnd(-30, 30)); x.lineTo(a + rnd(-40, 40), b + rnd(-40, 40)); x.stroke(); } }),
  water: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#d8ecff'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 2; for (let i = 0; i < 18; i++) { const a = rnd(0, w), b = rnd(0, h); x.beginPath(); x.arc(a, b, rnd(6, 14), 0.2 * Math.PI, 0.8 * Math.PI); x.stroke(); } }),
  lava: () => ctex(128, 128, (x, w, h) => { x.fillStyle = '#ff7a1a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 24; i++) { const g = x.createRadialGradient(rnd(0, w), rnd(0, h), 0, rnd(0, w), rnd(0, h), rnd(10, 26)); g.addColorStop(0, 'rgba(255,240,120,.9)'); g.addColorStop(1, 'rgba(255,60,0,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); } }),
  truss: () => ctex(64, 64, (x) => { x.clearRect(0, 0, 64, 64); x.strokeStyle = '#f0f0f0'; x.lineWidth = 7; x.strokeRect(4, 4, 56, 56); x.lineWidth = 5; x.beginPath(); x.moveTo(4, 4); x.lineTo(60, 60); x.moveTo(60, 4); x.lineTo(4, 60); x.stroke(); }),
  spawn: () => ctex(128, 128, (x) => { x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#2ec85a'; x.lineWidth = 10; x.beginPath(); x.arc(64, 64, 38, 0, 7); x.stroke(); x.fillStyle = '#2ec85a'; x.beginPath(); x.moveTo(64, 40); x.lineTo(84, 76); x.lineTo(44, 76); x.fill(); }, false),
  jelly: () => ctex(64, 64, (x) => { x.fillStyle = '#f0f0f0'; x.fillRect(0, 0, 64, 64); x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.ellipse(20, 18, 10, 5, -0.5, 0, 7); x.fill(); }),
  cookie: () => ctex(64, 64, (x) => { x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#4a2a14'; for (let i = 0; i < 7; i++) { x.beginPath(); x.arc(rnd(4, 60), rnd(4, 60), rnd(3, 5), 0, 7); x.fill(); } speckle(x, 64, 64, 80, ['rgba(80,40,0,.15)'], [1, 2]); }),
  conv: () => ctex(64, 64, (x) => { x.fillStyle = '#d0d0d0'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#ffd23a'; for (const y of [8, 40]) { x.beginPath(); x.moveTo(12, y + 14); x.lineTo(32, y); x.lineTo(52, y + 14); x.lineTo(52, y + 22); x.lineTo(32, y + 8); x.lineTo(12, y + 22); x.fill(); } }),
  portal: () => ctex(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,.15)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(64, 64, 12 + i * 11, i, i + 3.5); x.stroke(); } }, false),
};
const texCache = {};
const tex = (n) => texCache[n] || (texCache[n] = TEX[n]());

const MATDEF = {
  plastic: { tile: 2, top: 'studs', side: 'plastic', rough: 0.55 },
  grass: { tile: 8, tex: 'grass', rough: 0.95 }, sand: { tile: 8, tex: 'sand', rough: 1 }, snow: { tile: 8, tex: 'snow', rough: 0.9 },
  wood: { tile: 4, tex: 'wood', rough: 0.8 }, brick: { tile: 4, tex: 'brick', rough: 0.9 }, stone: { tile: 6, tex: 'stone', rough: 0.9 },
  metal: { tile: 4, tex: 'metal', rough: 0.35, metal: 0.4 }, checker: { tile: 8, tex: 'checker', rough: 0.35 }, wall: { tile: 10, tex: 'wall', rough: 0.9 },
  candy: { tile: 3, tex: 'candy', rough: 0.3 }, cloud: { tile: 6, tex: 'cloud', rough: 1 }, ice: { tile: 4, tex: 'ice', rough: 0.12, metal: 0.1, opacity: 0.9 },
  water: { tile: 10, tex: 'water', rough: 0.1, opacity: 0.78 }, lava: { tile: 6, tex: 'lava', glow: 1 },
  neon: { basic: true }, glass: { rough: 0.05, opacity: 0.42 }, truss: { tile: 2, tex: 'truss', alphaTest: 0.5, rough: 0.4, metal: 0.4, double: true },
  spawn: { fit: true, tex: 'spawn', rough: 0.5, glow: 0.25 }, jelly: { tile: 4, tex: 'jelly', opacity: 0.85, rough: 0.1, glow: 0.2 },
  cookie: { tile: 3, tex: 'cookie', rough: 0.9 }, conv: { tile: 2, tex: 'conv', rough: 0.6 }, portal: { fit: true, tex: 'portal', basic: true, opacity: 0.8 },
};
const matCache = {};
function makeMat(name, color, texName) {
  const d = MATDEF[name] || MATDEF.plastic;
  const o = {};
  if (d.basic) {
    const m = new THREE.MeshBasicMaterial({ color, map: texName ? tex(texName) : null, transparent: !!d.opacity, opacity: d.opacity || 1, depthWrite: !d.opacity });
    if (d.opacity) m.side = THREE.DoubleSide;
    return m;
  }
  Object.assign(o, { color, roughness: d.rough ?? 0.6, metalness: d.metal || 0 });
  if (texName) o.map = tex(texName);
  if (d.opacity) { o.transparent = true; o.opacity = d.opacity; o.depthWrite = name !== 'glass' && name !== 'water'; }
  if (d.alphaTest) { o.alphaTest = d.alphaTest; o.transparent = false; }
  if (d.double) o.side = THREE.DoubleSide;
  if (d.glow) { o.emissive = new THREE.Color(color); o.emissiveIntensity = d.glow; if (texName) o.emissiveMap = tex(texName); }
  return new THREE.MeshStandardMaterial(o);
}
function getMat(name, color, texName) {
  const k = `${name}|${color}|${texName}`;
  return matCache[k] || (matCache[k] = makeMat(name, color, texName));
}
function partMaterial(p) {
  let name = p.mat in MATDEF ? p.mat : 'plastic';
  if (p.fall) name = 'water';
  const d = MATDEF[name];
  if (name === 'plastic') { const side = getMat('plastic', p.color, 'plastic'), top = getMat('plastic', p.color, 'studs'); return [side, side, top, side, side, side]; }
  return getMat(name, p.color, d.tex);
}
function boxGeo(sx, sy, sz, tile) {
  const g = new THREE.BoxGeometry(sx, sy, sz);
  if (tile) {
    const uv = g.attributes.uv;
    for (let f = 0; f < 6; f++) {
      const [us, vs] = f < 2 ? [sz, sy] : f < 4 ? [sx, sz] : [sx, sy];
      for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, (uv.getX(i) * us) / tile, (uv.getY(i) * vs) / tile); }
    }
  }
  return g;
}

// sign / painting / clock faces drawn on a canvas
const FACE_INDEX = { e: 0, w: 1, s: 4, n: 5 };
function labelTexture(p, def) {
  const ns = p.face === 'n' || p.face === 's';
  const fw = ns ? p.sx : p.sz, fh = p.sy;
  const W = 256, H = Math.max(32, Math.round((256 * fh) / fw));
  return ctex(W, H, (x) => {
    const col = '#' + new THREE.Color(p.color).getHexString();
    x.fillStyle = col; x.fillRect(0, 0, W, H);
    const lum = new THREE.Color(p.color); const dark = lum.r * 0.3 + lum.g * 0.59 + lum.b * 0.11 < 0.45;
    x.strokeStyle = dark ? 'rgba(255,255,255,.3)' : 'rgba(80,50,20,.55)'; x.lineWidth = 8; x.strokeRect(4, 4, W - 8, H - 8);
    const lab = p.label || '';
    if (lab === 'clock') {
      x.fillStyle = '#fff'; x.beginPath(); x.arc(W / 2, H / 2, W * 0.42, 0, 7); x.fill();
      x.strokeStyle = '#333'; x.lineWidth = 8; x.stroke();
      x.lineCap = 'round'; x.beginPath(); x.moveTo(W / 2, H / 2); x.lineTo(W / 2, H / 2 - W * 0.3); x.moveTo(W / 2, H / 2); x.lineTo(W / 2 + W * 0.2, H / 2 + 10); x.stroke();
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; x.fillStyle = '#333'; x.fillRect(W / 2 + Math.cos(a) * W * 0.36 - 4, H / 2 + Math.sin(a) * W * 0.36 - 4, 8, 8); }
    } else if (lab === 'keypad') {
      x.fillStyle = '#20242a'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#7aff9a'; x.fillRect(W * 0.15, H * 0.08, W * 0.7, H * 0.14);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { x.fillStyle = '#c8ccd2'; x.fillRect(W * 0.15 + c * W * 0.25, H * 0.3 + r * H * 0.17, W * 0.18, H * 0.12); }
    } else if (lab.startsWith('seq:')) {
      x.fillStyle = '#6a4020'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff8e8'; x.fillRect(16, 16, W - 32, H - 32);
      const order = def.seqs[lab.slice(4)].order, cols = { red: '#ff3a3a', yellow: '#ffd92a', green: '#2ec85a', blue: '#3a7aff' };
      const s = (W - 64) / order.length;
      order.forEach((c, i) => { x.fillStyle = cols[c]; x.fillRect(32 + i * s + 6, H / 2 - s / 2 + 6, s - 12, s - 12); x.fillStyle = '#333'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText(String(i + 1), 32 + i * s + s / 2, H / 2 + s / 2 + 22); });
    } else {
      x.fillStyle = dark ? '#ffffff' : '#3a2410';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      let size = Math.min(H * 0.7, (W * 1.6) / Math.max(1, [...lab].length));
      x.font = `900 ${size}px "Nunito", "Noto Sans TC", sans-serif`;
      x.fillText(lab, W / 2, H / 2 + size * 0.04);
    }
  }, false);
}

function textSprite(lines, { scale = 1, bg = 'rgba(20,24,40,.72)', color = '#fff' } = {}) {
  const c = document.createElement('canvas'), x = c.getContext('2d');
  const fs = 44, pad = 18;
  x.font = `900 ${fs}px "Nunito", "Noto Sans TC", sans-serif`;
  const w = Math.max(...lines.map((l) => x.measureText(l).width)) + pad * 2, h = lines.length * fs * 1.2 + pad * 1.4;
  c.width = Math.ceil(w); c.height = Math.ceil(h);
  x.font = `900 ${fs}px "Nunito", "Noto Sans TC", sans-serif`;
  x.fillStyle = bg; const r = 22;
  x.beginPath(); x.roundRect ? x.roundRect(0, 0, c.width, c.height, r) : x.rect(0, 0, c.width, c.height); x.fill();
  x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
  lines.forEach((l, i) => x.fillText(l, c.width / 2, pad * 0.7 + fs * 0.6 + i * fs * 1.2));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthWrite: false }));
  s.scale.set((c.width / 60) * scale, (c.height / 60) * scale, 1);
  return s;
}

// ------------------------------------------------------------------ game state
const G = {
  wid: null, W: null, group: null, meshes: new Map(), spins: [], fruitObjs: [], keyObjs: [], labels: [], sparkles: [], fx: [],
  pl: null, cp: null, av: null, deadT: 0, prevTouch: new Set(), msgT: {}, modal: null, started: false, snow: null, t: 0,
  lockedMsgT: 0, sign: null,
};

function disposeGroup(g) {
  g.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    if (o.material && o.userData.ownMat) [].concat(o.material).forEach((m) => { if (m.map && o.userData.ownTex) m.map.dispose(); m.dispose(); });
  });
}

function skyTexture(def) {
  return ctex(16, 256, (x, w, h) => {
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#' + new THREE.Color(def.sky[0]).getHexString());
    g.addColorStop(0.62, '#' + new THREE.Color(def.sky[1]).getHexString());
    g.addColorStop(1, '#' + new THREE.Color(def.sky[1]).getHexString());
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }, false);
}

function loadWorld(id, at) {
  if (G.group) { scene.remove(G.group); disposeGroup(G.group); }
  const built = buildWorld(id);
  const W = new World(built, foundCount);
  const def = W.def;
  G.wid = id; G.W = W; G.meshes.clear(); G.spins = []; G.fruitObjs = []; G.keyObjs = []; G.labels = []; G.sparkles = []; G.prevTouch = new Set();
  const group = new THREE.Group(); G.group = group; scene.add(group);
  scene.background = skyTexture(def);
  scene.fog = new THREE.Fog(def.fog[0], def.fog[1], def.fog[2]);
  hemi.intensity = 1.5 * def.sun; sun.intensity = 2.1 * def.sun;
  hemi.groundColor.set(def.indoor ? 0xffd0e8 : 0x8a8a80);

  for (const p of W.parts) {
    if (p.kind === 'spin') {
      const pivot = new THREE.Group(); pivot.position.set(p.cx, p.cy, p.cz);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(p.r1 - p.r0, p.sy, p.sz), getMat('neon', p.color));
      bar.position.x = (p.r0 + p.r1) / 2; bar.castShadow = true;
      pivot.add(bar); group.add(pivot); G.spins.push({ p, pivot });
      continue;
    }
    if (p.kind === 'trigger' && p.key) {
      const k = keyModel(); k.position.set(p.x, p.y, p.z); group.add(k); G.keyObjs.push({ p, obj: k });
      continue;
    }
    const d = MATDEF[p.fall ? 'water' : p.mat] || MATDEF.plastic;
    const geo = boxGeo(p.sx, p.sy, p.sz, d.fit ? 0 : d.tile || 2);
    let material = partMaterial(p);
    const m = new THREE.Mesh(geo, material);
    if (p.mat === 'sign' && p.face) {
      const base = getMat('plastic', p.color, 'plastic');
      const arr = [base, base, base, base, base, base];
      arr[FACE_INDEX[p.face]] = new THREE.MeshStandardMaterial({ map: labelTexture(p, def), roughness: 0.7 });
      m.material = arr; m.userData.ownMat = true; m.userData.ownTex = true;
    }
    if (p.invis) { m.material = new THREE.MeshStandardMaterial({ color: 0xeaf4ff, transparent: true, opacity: 0.035, depthWrite: false }); m.userData.ownMat = true; }
    if (p.vanish || p.door || p.button) { m.material = [].concat(m.material).map((x) => x.clone()); if (m.material.length === 1) m.material = m.material[0]; m.userData.ownMat = true; }
    if (p.fall || p.sea) m.material = getMat(p.fall ? 'fallwater' : 'water', p.color, 'water');
    if (p.dark) { m.material = new THREE.MeshStandardMaterial({ color: 0x262c34, transparent: true, opacity: 0.96, roughness: 0.1, metalness: 0.3 }); m.userData.ownMat = true; }
    m.position.set(p.cx, p.cy, p.cz);
    const big = p.sx > 60 || p.sz > 60;
    m.castShadow = !big && p.kind !== 'deco' && !p.invis && p.mat !== 'glass' && p.mat !== 'water' && p.mat !== 'portal';
    m.receiveShadow = !p.invis && p.mat !== 'neon' && p.mat !== 'portal';
    group.add(m);
    G.meshes.set(p.id, m);
    if (p.portalLabel) {
      const wd = WORLD[p.portalLabel];
      const s = textSprite([nm(wd.name)], { scale: 1.3, bg: wd.color + 'dd' });
      s.position.set(p.x, p.y + 3.2, p.z); group.add(s);
      G.labels.push({ s, kind: 'portal', wd });
    }
    if (p.door && p.door.count) {
      const s = textSprite([`🔒 ${p.door.count} ${p.door.cat === 'fruit' ? '🍎' : '⭐'}`], { scale: 1.1 });
      s.position.set(p.x, p.y + (p.gate ? 0 : 1), p.z + p.sz / 2 + 0.5); group.add(s);
      G.labels.push({ s, kind: 'gate', p });
    }
  }
  // water material variant for the waterfall (its own texture that scrolls fast)
  // fruits
  for (const f of built.fruits) {
    const meta = FRUIT[f.id];
    const holder = new THREE.Group(); holder.position.set(f.x, f.y, f.z);
    const model = makeFruit(meta);
    holder.add(model);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: new THREE.Color(TIERS[meta.tier].color), transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(4.2, 4.2, 1); holder.add(glow);
    group.add(holder);
    const o = { f, meta, holder, model, glow, ghost: false };
    G.fruitObjs.push(o);
    if (save.found[f.id]) ghostFruit(o);
  }
  // falling snow
  if (G.snow) { scene.remove(G.snow); G.snow.geometry.dispose(); G.snow = null; }
  if (def.snow) {
    const n = 1500, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { pos[i * 3] = rnd(-60, 60); pos[i * 3 + 1] = rnd(0, 60); pos[i * 3 + 2] = rnd(-60, 60); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    G.snow = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.9, depthWrite: false }));
    scene.add(G.snow);
  }
  // player
  const sp = at || def.spawn;
  G.cp = { x: sp[0], y: sp[1], z: sp[2], yaw: sp[3] || 0 };
  spawnPlayer();
  cam.yaw = G.cp.yaw; cam.pitch = 0.32;
  updateLabels();
  updateHUD();
  music.play(id);
}

let _glow = null;
function glowTex() {
  return _glow || (_glow = ctex(64, 64, (x) => { const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.4, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); }, false));
}
function keyModel() {
  const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({ color: 0xffd23a, metalness: 0.8, roughness: 0.25, emissive: 0x4a3000 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.14, 8, 18), m); ring.position.y = 0.7; g.add(ring);
  const sh = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.3, 0.2), m); sh.position.y = -0.2; g.add(sh);
  for (const y of [-0.7, -0.4]) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.2), m); t.position.set(0.2, y, 0); g.add(t); }
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffe080, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.scale.set(3, 3, 1); g.add(glow);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}
function ghostFruit(o) {
  if (o.ghost) return;
  o.ghost = true;
  o.model.traverse((m) => { if (m.isMesh) { m.material = m.material.clone(); m.material.transparent = true; m.material.opacity = 0.32; m.material.depthWrite = false; m.castShadow = false; } });
  o.glow.material.opacity = 0.15;
}
function updateLabels() {
  const n = foundCount();
  for (const l of G.labels) {
    if (l.kind === 'portal') {
      const need = l.wd.need, open = n >= need;
      const lines = [nm(l.wd.name)];
      if (l.wd.id !== 'plaza') lines.push(open ? `${worldFound(l.wd.id)}/${worldTotal(l.wd.id)} ${l.wd.id === 'fastfood' ? '🍔' : '🍎'}` : `🔒 ${need} ⭐`);
      const s2 = textSprite(lines, { scale: 1.3, bg: l.wd.color + 'dd' });
      l.s.material.map.dispose(); l.s.material.map = s2.material.map; l.s.scale.copy(s2.scale);
    }
  }
}
const worldTotal = (wid) => FRUITS.filter((f) => f.w === wid).length;
const worldFound = (wid) => FRUITS.filter((f) => f.w === wid && save.found[f.id]).length;

// ------------------------------------------------------------------ player
function spawnPlayer() {
  if (G.av) G.group.remove(G.av);
  G.pl = newPlayer(G.cp.x, G.cp.y + 0.05, G.cp.z, G.cp.yaw + Math.PI);
  G.av = makeAvatar(save.avatar);
  G.av.rotation.y = G.pl.yaw;
  G.group.add(G.av);
  G.deadT = 0;
}
function die(kind) {
  sfx.play(kind === 'splash' ? 'splash' : 'oof');
  G.deadT = 1.3;
  G.av.visible = false;
  const cols = AVATARS.find((a) => a.id === save.avatar) || AVATARS[0];
  [cols.skin, cols.shirt, cols.shirt, cols.pants, cols.pants, cols.skin].forEach((c, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(i ? 1 : 1.2, i ? 1.6 : 1.2, 1), new THREE.MeshStandardMaterial({ color: c }));
    m.position.set(G.pl.x, G.pl.y + 1 + i * 0.6, G.pl.z);
    G.group.add(m);
    G.fx.push({ m, v: new THREE.Vector3(rnd(-8, 8), rnd(6, 16), rnd(-8, 8)), r: new THREE.Vector3(rnd(-6, 6), rnd(-6, 6), rnd(-6, 6)), life: 1.3, grav: true });
  });
  if (kind === 'splash') splashFx(G.pl.x, G.W.def.water, G.pl.z);
  msg(tr().oof, 900);
}
function splashFx(x, y, z) {
  for (let i = 0; i < 20; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.25, 6, 4), new THREE.MeshBasicMaterial({ color: 0xbfe8ff }));
    m.position.set(x, y, z); G.group.add(m);
    G.fx.push({ m, v: new THREE.Vector3(rnd(-5, 5), rnd(8, 18), rnd(-5, 5)), life: 1, grav: true });
  }
}
function confetti(x, y, z, color) {
  const cols = [0xff5a7a, 0xffd23a, 0x3ad86a, 0x3a9aff, 0xb05aff, color];
  for (let i = 0; i < 46; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.22), new THREE.MeshBasicMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide }));
    m.position.set(x, y, z); G.group.add(m);
    const a = Math.random() * Math.PI * 2, s = rnd(4, 12);
    G.fx.push({ m, v: new THREE.Vector3(Math.cos(a) * s, rnd(8, 20), Math.sin(a) * s), r: new THREE.Vector3(rnd(-9, 9), rnd(-9, 9), 0), life: 2.2, grav: 0.35 });
  }
}

// ------------------------------------------------------------------ input
const keys = new Set();
const touch = { mx: 0, mz: 0, jump: false, stickId: null, ox: 0, oy: 0, lookId: null, lx: 0, ly: 0 };
const cam = { yaw: 0, pitch: 0.32, dist: 16, tx: 0, ty: 0, tz: 0, spin: 0, zoom: 0 };
window.addEventListener('keydown', (e) => {
  if (G.modal === 'keypad') { keypadKey(e.key); e.preventDefault(); return; }
  if (e.key === 'Escape') { closeModals(); return; }
  if (G.modal) return;
  keys.add(e.code);
  const ks = keySeen[e.code] || (keySeen[e.code] = { rep: false });
  ks.t = performance.now(); if (e.repeat) ks.rep = true;
  if (e.code === 'KeyB') openBook();
  if (e.code === 'KeyF') toggleFollow();
  if (e.code === 'KeyR' && G.started && !G.deadT) { G.pl.dead = true; die('kill'); }
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
});
window.addEventListener('keyup', (e) => {
  keys.delete(e.code); delete keySeen[e.code];
  if (e.key === 'Meta') resetInput();      // macOS sends no keyup for other keys while ⌘ is held
});
// a key whose keyup never arrived must not keep the player walking forever:
// - lost focus / hidden page / page left: forget everything
// - a held key keeps sending repeat keydowns; when they stop, the key was released
const keySeen = {};
function resetInput() {
  keys.clear();
  for (const k of Object.keys(keySeen)) delete keySeen[k];
  touch.stickId = null; touch.lookId = null; touch.mx = touch.mz = 0; touch.jump = false;
  const st = document.getElementById('stick'); if (st) st.style.display = 'none';
  const jb2 = document.getElementById('bJump'); if (jb2) jb2.classList.remove('on');
  cam.spin = 0; cam.zoom = 0;
  document.querySelectorAll('#camctl button.on').forEach((b) => b.classList.remove('on'));
  drag = null;
}
window.addEventListener('blur', resetInput);
document.addEventListener('visibilitychange', () => { if (document.hidden) resetInput(); });
window.addEventListener('pagehide', resetInput);
function pruneKeys() {
  const now = performance.now();
  for (const code of [...keys]) {
    const k = keySeen[code];
    if (!k) continue;
    if ((k.rep && now - k.t > 600) || (!k.rep && now - k.t > 1500)) { keys.delete(code); delete keySeen[code]; }
  }
}

let drag = null;
canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
canvasEl.addEventListener('pointerdown', (e) => {
  sfx.unlock();
  if (e.pointerType === 'touch') {
    if (e.clientX < window.innerWidth * 0.42 && touch.stickId === null) { touch.stickId = e.pointerId; touch.ox = e.clientX; touch.oy = e.clientY; showStick(e.clientX, e.clientY, 0, 0); }
    else if (touch.lookId === null) { touch.lookId = e.pointerId; touch.lx = e.clientX; touch.ly = e.clientY; }
    try { canvasEl.setPointerCapture(e.pointerId); } catch (er) { /* the pointer is already gone */ }
    return;
  }
  drag = { x: e.clientX, y: e.clientY };
  try { canvasEl.setPointerCapture(e.pointerId); } catch (er) { /* the pointer is already gone */ }
});
canvasEl.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') {
    if (e.pointerId === touch.stickId) {
      let dx = e.clientX - touch.ox, dy = e.clientY - touch.oy; const d = Math.hypot(dx, dy), R = 55;
      if (d > R) { dx = (dx / d) * R; dy = (dy / d) * R; }
      touch.mx = dx / R; touch.mz = dy / R; showStick(touch.ox, touch.oy, dx, dy);
    } else if (e.pointerId === touch.lookId) {
      cam.yaw -= (e.clientX - touch.lx) * 0.008; cam.pitch = clampPitch(cam.pitch + (e.clientY - touch.ly) * 0.006);
      touch.lx = e.clientX; touch.ly = e.clientY;
    }
    return;
  }
  if (!drag) return;
  cam.yaw -= (e.clientX - drag.x) * 0.006; cam.pitch = clampPitch(cam.pitch + (e.clientY - drag.y) * 0.005);
  drag.x = e.clientX; drag.y = e.clientY;
});
const endPointer = (e) => {
  if (e.pointerId === touch.stickId) { touch.stickId = null; touch.mx = touch.mz = 0; $('stick').style.display = 'none'; }
  if (e.pointerId === touch.lookId) touch.lookId = null;
  drag = null;
};
canvasEl.addEventListener('pointerup', endPointer);
canvasEl.addEventListener('pointercancel', endPointer);
canvasEl.addEventListener('lostpointercapture', endPointer);
// backup: the finger may be lifted over something else (a window that just opened); end it wherever it lands
window.addEventListener('pointerup', (e) => { if (e.pointerId === touch.stickId || e.pointerId === touch.lookId) endPointer(e); }, true);
window.addEventListener('pointercancel', (e) => { if (e.pointerId === touch.stickId || e.pointerId === touch.lookId) endPointer(e); }, true);
// and when no finger is on the screen at all, nothing can still be held
for (const ev of ['touchend', 'touchcancel']) window.addEventListener(ev, (e) => { if (!e.touches || e.touches.length === 0) resetInput(); }, true);
canvasEl.addEventListener('wheel', (e) => { cam.dist = Math.min(40, Math.max(5, cam.dist * (e.deltaY > 0 ? 1.1 : 0.9))); e.preventDefault(); }, { passive: false });
const clampPitch = (p) => Math.min(1.35, Math.max(-0.35, p));
function showStick(x, y, dx, dy) { const s = $('stick'); s.style.display = 'block'; s.style.left = x - 60 + 'px'; s.style.top = y - 60 + 'px'; $('knob').style.transform = `translate(${dx}px, ${dy}px)`; }
const jb = $('bJump');
jb.addEventListener('pointerdown', (e) => { e.preventDefault(); sfx.unlock(); touch.jump = true; jb.classList.add('on'); });
for (const ev of ['pointerup', 'pointercancel', 'pointerleave', 'lostpointercapture']) jb.addEventListener(ev, () => { touch.jump = false; jb.classList.remove('on'); });

function inputVector() {
  pruneKeys();
  let f = 0, r = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1;
  if (touch.stickId !== null) { f = -touch.mz; r = touch.mx; }
  const fx = -Math.sin(cam.yaw), fz = -Math.cos(cam.yaw), rx = Math.cos(cam.yaw), rz = -Math.sin(cam.yaw);
  let mx = fx * f + rx * r, mz = fz * f + rz * r;
  const m = Math.hypot(mx, mz);
  if (m > 1) { mx /= m; mz /= m; }
  return { mx, mz, jump: keys.has('Space') || touch.jump };
}

// ------------------------------------------------------------------ triggers
function onEnter(p) {
  const W = G.W, t = tr();
  if (p.check) {
    const top = p.y1;
    if (Math.hypot(G.cp.x - p.x, G.cp.z - p.z) > 0.5 || Math.abs(G.cp.y - top) > 0.5) {
      G.cp = { x: p.x, y: top, z: p.z, yaw: cam.yaw };
      sfx.play('check'); msg(t.check, 1200);
      const m = G.meshes.get(p.id); if (m) { m.userData.flash = 1; }
    }
  }
  if (p.button) {
    const b = p.button;
    sfx.play('click');
    if (b.seq) {
      const sq = W.def.seqs[b.seq];
      if (W.flags[sq.flag]) return;
      const prog = W.seq[b.seq] || 0;
      if (sq.order[prog] === b.color) {
        W.seq[b.seq] = prog + 1;
        const m = G.meshes.get(p.id); if (m) m.userData.lit = true;
        if (prog + 1 === sq.order.length) { W.flags[sq.flag] = true; sfx.play('door'); msg(t.seqOk, 2500); }
        else { sfx.play('good'); msg(t.seqGood(prog + 1, sq.order.length), 900); }
      } else {
        W.seq[b.seq] = sq.order[0] === b.color ? 1 : 0;
        for (const q of W.parts) if (q.button && q.button.seq === b.seq) { const m = G.meshes.get(q.id); if (m) m.userData.lit = q === p && W.seq[b.seq] === 1; }
        sfx.play('bad'); msg(t.seqBad, 1500);
      }
    } else if (b.timed) {
      W.flags[b.flag] = b.timed; sfx.play('door'); msg(t.timer(b.timed), 2200);
    } else { W.flags[b.flag] = true; sfx.play('door'); }
  }
  if (p.keypad && !W.flags[p.keypad.flag]) openKeypad(p);
  if (p.key && !W.keys.has(p.key)) {
    W.keys.add(p.key); sfx.play('key'); msg(t.gotKey, 2200);
    const k = G.keyObjs.find((o) => o.p === p); if (k) k.obj.visible = false;
    updateHUD();
  }
  if (p.door && !W.isOpen(p)) {
    if (p.door.key && W.keys.has(p.door.key)) { W.opened.add(p.id); W.keys.delete(p.door.key); sfx.play('door'); msg(t.usedKey, 2000); updateHUD(); }
    else if (G.t - G.lockedMsgT > 2.5) {
      G.lockedMsgT = G.t;
      msg(p.door.count ? t.need(p.door.count, foundCount(p.door.cat), p.door.cat) : p.door.key ? t.needKey : t.locked, 2200);
      sfx.play('bad');
    }
  }
  if (p.portal) travel(p.portal);
}

function collectFruit(o) {
  const t = tr(), meta = o.meta;
  if (save.found[meta.id]) {
    if (G.t - (G.msgT[meta.id] || -9) > 4) { msg(t.already(nm(meta.name)), 1500); G.msgT[meta.id] = G.t; }
    return;
  }
  const before = foundCount();
  save.found[meta.id] = Date.now(); persist();
  sfx.play('collect'); setTimeout(() => sfx.play('badge'), 500);
  confetti(o.holder.position.x, o.holder.position.y, o.holder.position.z, meta.c);
  ghostFruit(o);
  banner(meta);
  badgeToast(meta);
  const after = foundCount();
  for (const w of WORLDS) if (w.need > before && w.need <= after) setTimeout(() => msg(t.unlocked(nm(w.name)), 3500), 2600);
  if (worldFound(meta.w) === worldTotal(meta.w)) setTimeout(() => msg(t.worldDone(nm(WORLD[meta.w].name)), 3500), 4000);
  if (after === FRUITS.length) setTimeout(() => msg(t.allDone, 6000), 5500);
  updateLabels(); updateHUD();
}

function travel(id) {
  if (G.traveling) return;
  G.traveling = true;
  sfx.play('portal');
  const from = G.wid;
  fade(() => {
    let at = null;
    if (id === 'plaza' && from !== 'plaza') {
      const b = buildWorld('plaza').parts.find((p) => p.portal === from);
      if (b) at = [b.x, 0, b.z + 10, 0];
    }
    loadWorld(id, at);
    worldCard();
    G.traveling = false;
  });
}

// ------------------------------------------------------------------ main loop
let last = performance.now(), acc = 0;
const STEP = 1 / 60;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(0.1, (now - last) / 1000); last = now;
  if (dt < 0) dt = 0;
  if (G.W) tick(dt);
  renderer.render(scene, camera);
}

function tick(dt) {
  const W = G.W, pl = G.pl;
  const paused = !G.started || G.modal === 'book' || G.modal === 'keypad' || G.modal === 'help';
  G.t += dt;
  if (!paused) {
    acc += dt;
    let n = 0;
    while (acc >= STEP && n < 6) {
      acc -= STEP; n++;
      W.update(STEP);
      if (G.deadT > 0) continue;
      const inp = inputVector();
      const ev = stepPlayer(pl, W, inp, STEP);
      if (ev.includes('jump')) sfx.play('jump');
      if (ev.includes('bounce')) sfx.play('bounce');
      if (ev.includes('vanish')) sfx.play('vanish');
      if (pl.dead) { die(ev.includes('splash') ? 'splash' : 'kill'); break; }
      const nowT = new Set();
      for (const p of pl.touch) { nowT.add(p.id); if (!G.prevTouch.has(p.id)) onEnter(p); }
      G.prevTouch = nowT;
      for (const o of G.fruitObjs) {
        const f = o.f;
        const dx = Math.max(0, Math.abs(f.x - pl.x) - 0.9), dz = Math.max(0, Math.abs(f.z - pl.z) - 0.9), dy = Math.max(0, pl.y - f.y, f.y - (pl.y + 5));
        if (Math.hypot(dx, dy, dz) < 1.15) collectFruit(o);
      }
      // facing
      const sp = Math.hypot(inp.mx, inp.mz);
      if (sp > 0.1) { const target = Math.atan2(inp.mx, inp.mz); let d = target - pl.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); pl.yaw += d * Math.min(1, STEP * 14); }
      G.lastInp = inp;
    }
    if (G.deadT > 0) { G.deadT -= dt; if (G.deadT <= 0) { spawnPlayer(); G.prevTouch = new Set(); } }
  }
  // visuals
  const t = G.t;
  for (const p of W.movers) {
    const m = G.meshes.get(p.id); if (!m) continue;
    m.position.set(p.cx, p.cy, p.cz);
    if (p.vanish) { const mats = [].concat(m.material); const op = p.gone > 0 ? 0.12 : p.vt > 0 ? 0.55 + 0.45 * Math.sin(t * 45) : 1; mats.forEach((mm) => { mm.transparent = op < 1; mm.opacity = op; mm.depthWrite = op >= 1; }); }
  }
  for (const s of G.spins) s.pivot.rotation.y = -((s.p.phase || 0) + s.p.w * W.t);
  for (const p of W.triggers) {
    const m = G.meshes.get(p.id); if (!m) continue;
    if (p.door) m.visible = !W.isOpen(p);
    if (p.button) {
      const on = p.button.seq ? m.userData.lit : !!W.flags[p.button.flag];
      const blink = p.button.timed && on ? 0.5 + 0.5 * Math.sin(t * 12) : on ? 1 : 0;
      m.scale.y = on ? 0.5 : 1;
      [].concat(m.material).forEach((mm) => { if (mm.color) mm.color.setHex(p.color).lerp(new THREE.Color(0xffffff), blink * 0.55); });
    }
    if (p.check && m.userData.flash) { m.userData.flash = Math.max(0, m.userData.flash - dt); }
  }
  for (const l of G.labels) if (l.kind === 'gate') l.s.visible = !W.isOpen(l.p);
  for (const k of G.keyObjs) { k.obj.rotation.y = t * 2; k.obj.position.y = k.p.y + Math.sin(t * 2.5) * 0.25; }
  for (const o of G.fruitObjs) {
    o.model.rotation.y = t * 1.2;
    o.model.position.y = Math.sin(t * 2 + o.f.x) * 0.22;
    animateFruit(o.model, t);
  }
  // animated textures
  if (texCache.water) { texCache.water.offset.x = t * 0.02; texCache.water.offset.y = t * 0.015; }
  if (texCache.lava) { texCache.lava.offset.x = t * 0.04; texCache.lava.offset.y = Math.sin(t * 0.5) * 0.1; }
  if (texCache.conv) texCache.conv.offset.y = -t * 1.6;
  if (texCache.portal) texCache.portal.rotation = t * 0.8, texCache.portal.center.set(0.5, 0.5);
  if (fallTex) fallTex.offset.y = t * 1.2;
  // invisible path sparkles
  sparkles(dt);
  // fx
  for (let i = G.fx.length - 1; i >= 0; i--) {
    const f = G.fx[i];
    f.life -= dt;
    if (f.grav) f.v.y -= 40 * dt * (f.grav === true ? 1 : f.grav);
    f.m.position.addScaledVector(f.v, dt);
    if (f.r) { f.m.rotation.x += f.r.x * dt; f.m.rotation.y += f.r.y * dt; f.m.rotation.z += f.r.z * dt; }
    if (f.life <= 0) { G.group.remove(f.m); f.m.geometry.dispose(); f.m.material.dispose(); G.fx.splice(i, 1); }
  }
  // avatar
  if (G.av && G.deadT <= 0) {
    G.av.position.set(pl.x, pl.y, pl.z);
    G.av.rotation.y = pl.yaw;
    const hs = Math.hypot(pl.vx, pl.vz) / 16;
    animateAvatar(G.av, dt, { speed: hs, air: !pl.ground && !pl.climbing && pl.air > 0.08, climbing: pl.climbing });
  }
  // snow follows the camera
  if (G.snow) {
    const a = G.snow.geometry.attributes.position;
    for (let i = 0; i < a.count; i++) {
      let y = a.getY(i) - dt * 6; if (y < pl.y - 10) y += 60;
      a.setY(i, y); a.setX(i, a.getX(i) + Math.sin(t + i) * dt * 0.8);
    }
    a.needsUpdate = true;
    G.snow.position.set(Math.round(pl.x / 120) * 120, 0, Math.round(pl.z / 120) * 120);
  }
  updateCamera(dt);
  sun.position.set(pl.x + 40, pl.y + 80, pl.z + 25); sun.target.position.set(pl.x, pl.y, pl.z);
  // HUD bits that change every frame
  const timed = Object.values(W.flags).filter((v) => typeof v === 'number');
  const tm = $('timer');
  if (timed.length) { const s = Math.ceil(Math.max(...timed)); tm.hidden = false; tm.textContent = '⏱ ' + s; if (s !== G.lastTick) { G.lastTick = s; sfx.play('tick'); } } else tm.hidden = true;
  nearSign();
}

let fallTex = null;
let sparkT = 0;
function sparkles(dt) {
  sparkT -= dt;
  if (sparkT > 0) return;
  sparkT = 0.18;
  const pl = G.pl;
  const inv = G.W.parts.filter((p) => p.invis && Math.hypot(p.x - pl.x, p.z - pl.z) < 45);
  if (!inv.length) return;
  const p = inv[Math.floor(Math.random() * inv.length)];
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.position.set(p.x + rnd(-p.sx / 2, p.sx / 2), p.y1 + 0.15, p.z + rnd(-p.sz / 2, p.sz / 2));
  s.scale.set(0.9, 0.9, 1);
  G.group.add(s);
  G.fx.push({ m: s, v: new THREE.Vector3(0, 0.6, 0), life: 0.7 });
}

const _v = new THREE.Vector3();
function updateCamera(dt) {
  const pl = G.pl;
  const k = Math.min(1, dt * 12);
  cam.tx += (pl.x - cam.tx) * k; cam.ty += (pl.y + 4.3 - cam.ty) * Math.min(1, dt * 9); cam.tz += (pl.z - cam.tz) * k;
  if (Math.abs(cam.tx - pl.x) > 20 || Math.abs(cam.tz - pl.z) > 20) { cam.tx = pl.x; cam.ty = pl.y + 4.3; cam.tz = pl.z; }
  if (keys.has('KeyQ') || keys.has('Comma')) cam.yaw += dt * 2.2;
  if (keys.has('KeyE') || keys.has('Period')) cam.yaw -= dt * 2.2;
  cam.yaw += cam.spin * dt * 2.4;
  if (cam.zoom) cam.dist = Math.min(40, Math.max(5, cam.dist * (1 + cam.zoom * dt * 1.5)));
  // follow camera: while walking, swing gently around behind the avatar (like Roblox's Follow mode)
  const li = G.lastInp;
  if (save.follow && !drag && touch.lookId === null && !cam.spin && li && G.deadT <= 0 && !G.pl.climbing) {
    const m = Math.hypot(li.mx, li.mz);
    if (m > 0.3) {
      const d0 = Math.atan2(Math.sin(G.pl.yaw + Math.PI - cam.yaw), Math.cos(G.pl.yaw + Math.PI - cam.yaw));
      if (Math.abs(d0) < 2.0) cam.yaw += d0 * Math.min(1, dt * 0.9 * m);
    }
  }
  const dir = _v.set(Math.sin(cam.yaw) * Math.cos(cam.pitch), Math.sin(cam.pitch), Math.cos(cam.yaw) * Math.cos(cam.pitch));
  // pull the camera in front of walls
  let d = cam.dist;
  const W = G.W;
  for (let s = 0.8; s <= cam.dist; s += 0.5) {
    const x = cam.tx + dir.x * s, y = cam.ty + dir.y * s, z = cam.tz + dir.z * s;
    let hit = false;
    for (const p of W.solids) {
      if (p.invis || p.mat === 'glass' || p.kind === 'truss' || !W.solidNow(p)) continue;
      if (x > p.x0 - 0.3 && x < p.x1 + 0.3 && y > p.y0 - 0.3 && y < p.y1 + 0.3 && z > p.z0 - 0.3 && z < p.z1 + 0.3) { hit = true; break; }
    }
    if (hit) { d = Math.max(0.8, s - 0.5); break; }
  }
  cam.cur = cam.cur === undefined ? d : d < cam.cur ? d : cam.cur + (d - cam.cur) * Math.min(1, dt * 4);
  camera.position.set(cam.tx + dir.x * cam.cur, cam.ty + dir.y * cam.cur, cam.tz + dir.z * cam.cur);
  camera.lookAt(cam.tx, cam.ty, cam.tz);
  if (G.av) G.av.visible = G.deadT <= 0 && cam.cur > 2.2;
}

function nearSign() {
  const pl = G.pl;
  let best = null, bd = 7.5;
  for (const s of G.W.signs) { const d = Math.hypot(s.x - pl.x, s.y - pl.y - 1, s.z - pl.z); if (d < bd) { bd = d; best = s; } }
  if (best !== G.sign) {
    G.sign = best;
    const el = $('signbox');
    if (best) { el.textContent = nm(best.text); el.hidden = false; } else el.hidden = true;
  }
}

// ------------------------------------------------------------------ UI
function msg(text, ms = 1800) {
  const el = $('msg');
  el.textContent = text; el.classList.add('on');
  clearTimeout(msg._t); msg._t = setTimeout(() => el.classList.remove('on'), ms);
}
function banner(meta) {
  const el = $('banner'), tier = TIERS[meta.tier];
  el.innerHTML = `<img src="${fruitIcon(meta.id)}" alt=""><div><b>${tr().youFound(nm(meta.name))}</b><span class="chip" style="background:${tier.color}">${nm(tier)}</span></div>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  clearTimeout(banner._t); banner._t = setTimeout(() => el.classList.remove('on'), 3200);
}
function badgeToast(meta) {
  const el = document.createElement('div'); el.className = 'toast';
  const tier = TIERS[meta.tier];
  el.innerHTML = `<img src="${fruitIcon(meta.id)}" alt=""><div><small>${tr().badge}</small><b>${tr().badgeOf(nm(meta.name))}</b><span class="chip" style="background:${tier.color}">${nm(tier)}</span></div>`;
  $('toasts').appendChild(el);
  setTimeout(() => el.classList.add('on'), 30);
  setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.remove(), 500); }, 5200);
}
function fade(mid) {
  const f = $('fade'); f.classList.add('on');
  setTimeout(() => { mid(); setTimeout(() => f.classList.remove('on'), 120); }, 380);
}
function worldCard() {
  const el = $('wcard'), def = WORLD[G.wid];
  el.innerHTML = `<b style="color:${def.color}">${nm(def.name)}</b><span>${worldFound(G.wid)} / ${worldTotal(G.wid)} 🍎</span>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
}
function updateHUD() {
  if (!G.wid) return;
  const def = WORLD[G.wid];
  $('wname').textContent = nm(def.name);
  $('wname').style.color = def.color;
  $('count').innerHTML = CATS.map((c) => `${c.icon} <b>${foundCount(c.id)}</b>/${catTotal(c.id)}`).join(' &nbsp;') + `<br><small>${tr().worldCount(worldFound(G.wid), worldTotal(G.wid))}</small>`;
  $('keyicon').hidden = !(G.W && G.W.keys.size);
}

// fruit icons rendered once with a small offscreen renderer
let iconR = null, iconScene = null, iconCam = null;
const iconCache = {};
function fruitIcon(id) {
  if (iconCache[id]) return iconCache[id];
  if (!iconR) {
    iconR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    iconR.setSize(128, 128, false);
    iconScene = new THREE.Scene();
    iconScene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, 2.0));
    const d = new THREE.DirectionalLight(0xffffff, 1.8); d.position.set(2, 3, 4); iconScene.add(d);
    iconCam = new THREE.PerspectiveCamera(32, 1, 0.1, 50); iconCam.position.set(0, 0.6, 7); iconCam.lookAt(0, 0.25, 0);
  }
  const m = makeFruit(FRUIT[id]);
  m.rotation.y = -0.35;
  iconScene.add(m);
  iconR.render(iconScene, iconCam);
  const url = iconR.domElement.toDataURL('image/png');
  iconScene.remove(m);
  m.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
  iconCache[id] = url;
  return url;
}
let avatarIcons = {};
function avatarIcon(id) {
  if (avatarIcons[id]) return avatarIcons[id];
  fruitIcon('apple');
  const a = makeAvatar(id); a.rotation.y = 0.45; a.position.y = -2.6;
  const c = iconCam.position.clone();
  iconCam.position.set(0, 0.4, 9.5); iconCam.lookAt(0, 0, 0);
  iconScene.add(a); iconR.render(iconScene, iconCam);
  avatarIcons[id] = iconR.domElement.toDataURL('image/png');
  iconScene.remove(a); iconCam.position.copy(c); iconCam.lookAt(0, 0.25, 0);
  return avatarIcons[id];
}

// --- book
let bookTab = 'plaza';
function openBook() {
  if (!G.started) return;
  G.modal = 'book'; $('book').hidden = false; resetInput();
  if (G.wid) bookTab = G.wid;
  renderBook();
}
function renderBook() {
  const t = tr(), n = foundCount();
  $('bookTitle').textContent = `📖 ${t.book}`;
  $('bookProg').innerHTML = `${t.progress}: <b>${n}</b> / ${FRUITS.length}` + `<span class="bar"><i style="width:${(n / FRUITS.length) * 100}%"></i></span>` + CATS.map((c) => `<span>${c.icon} ${foundCount(c.id)}/${catTotal(c.id)}</span>`).join(' ');
  $('bookTabs').innerHTML = WORLDS.map((w) => `<button data-w="${w.id}" class="${w.id === bookTab ? 'sel' : ''}" style="--c:${w.color}">${nm(w.name)} <small>${worldFound(w.id)}/${worldTotal(w.id)}</small></button>`).join('');
  const w = WORLD[bookTab];
  const open = n >= w.need;
  const list = FRUITS.filter((f) => f.w === bookTab);
  $('bookGo').innerHTML = bookTab === G.wid ? '' : open ? `<button id="goBtn">🌀 ${t.go}: ${nm(w.name)}</button>` : `<span class="lockw">${t.lockedW(w.need)}</span>`;
  $('bookGrid').innerHTML = list.map((f) => {
    const got = !!save.found[f.id], tier = TIERS[f.tier];
    return `<div class="card ${got ? 'got' : ''}" data-id="${f.id}">
      <div class="ic"><img src="${fruitIcon(f.id)}" alt="">${got ? '<i>✔</i>' : '<i class="q">?</i>'}</div>
      <b>${got ? nm(f.name) : '???'}</b>
      <span class="chip" style="background:${tier.color}">${nm(tier)}</span>
      ${got ? `<small class="when">${t.found} ${new Date(save.found[f.id]).toLocaleDateString()}</small>` : `<button class="hintb">${t.hint}</button><p class="hint" hidden>${nm(f.hint)}</p>`}
    </div>`;
  }).join('');
  $('bookTabs').querySelectorAll('button').forEach((b) => b.onclick = () => { bookTab = b.dataset.w; renderBook(); sfx.play('click'); });
  $('bookGrid').querySelectorAll('.hintb').forEach((b) => b.onclick = () => { b.hidden = true; b.nextElementSibling.hidden = false; sfx.play('click'); });
  const gb = $('goBtn'); if (gb) gb.onclick = () => { closeModals(); travel(bookTab); };
  $('tierLegend').innerHTML = `${t.tiers}: ` + TIERS.map((x) => `<span class="chip" style="background:${x.color}">${nm(x)}</span>`).join('');
}

// --- keypad
let kpPart = null, kpVal = '';
function openKeypad(p) {
  kpPart = p; kpVal = ''; G.modal = 'keypad'; $('keypad').hidden = false;
  resetInput();
  $('kpTitle').textContent = tr().keypad; $('kpEnter').textContent = tr().enter; $('kpClear').textContent = tr().clear;
  renderKp();
}
function renderKp(bad) { const d = $('kpDisp'); d.textContent = (kpVal + '____').slice(0, 4).split('').join(' '); d.classList.toggle('bad', !!bad); }
function keypadKey(k) {
  if (/^[0-9]$/.test(k) && kpVal.length < 4) { kpVal += k; sfx.play('click'); renderKp(); }
  else if (k === 'Backspace') { kpVal = kpVal.slice(0, -1); renderKp(); }
  else if (k === 'Enter') kpSubmit();
  else if (k === 'Escape') closeModals();
}
function kpSubmit() {
  if (kpVal === kpPart.keypad.code) { G.W.flags[kpPart.keypad.flag] = true; sfx.play('door'); msg(tr().codeOk, 2200); closeModals(); }
  else { sfx.play('bad'); msg(tr().codeBad, 1400); kpVal = ''; renderKp(true); }
}
const kpGrid = $('kpKeys');
['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⏎'].forEach((k) => {
  const b = document.createElement('button'); b.textContent = k;
  b.onclick = () => (k === 'C' ? (kpVal = '', renderKp()) : k === '⏎' ? kpSubmit() : keypadKey(k));
  kpGrid.appendChild(b);
});
$('kpEnter').onclick = kpSubmit;
$('kpClear').onclick = () => { kpVal = ''; renderKp(); };

function closeModals() {
  for (const id of ['book', 'keypad', 'help']) $(id).hidden = true;
  if (G.modal === 'keypad') G.prevTouch = new Set(G.pl.touch.map((p) => p.id));   // don't reopen while still standing on it
  G.modal = null;
  resetInput();
}
document.querySelectorAll('.closeX').forEach((b) => b.onclick = () => { closeModals(); sfx.play('click'); });
for (const id of ['book', 'keypad', 'help']) $(id).addEventListener('pointerdown', (e) => { if (e.target.id === id) closeModals(); });

// --- help / start / buttons
function renderHelp() {
  const t = tr();
  $('helpTitle').textContent = t.help;
  $('helpBody').innerHTML = t.helpBody.map((p) => `<p>${p}</p>`).join('') +
    `<p class="ctl">${isTouch ? t.touchControls : t.pcControls}</p>` +
    `<p>${t.tiers}: ${TIERS.map((x) => `<span class="chip" style="background:${x.color}">${nm(x)}</span>`).join(' ')}</p>` +
    `<p><button id="wipe" class="ghost">${t.wipe}</button></p>`;
  $('wipe').onclick = () => { if (confirm(t.wipeQ)) { save.found = {}; persist(); location.reload(); } };
}
function renderStart() {
  const t = tr();
  document.documentElement.lang = save.lang === 'zh' ? 'zh-Hant' : 'en';
  $('sTitle').textContent = t.title; $('sSub').textContent = t.sub; $('sChoose').textContent = t.choose;
  $('sPlay').textContent = '▶ ' + t.play;
  $('sCtl').textContent = isTouch ? t.touchControls : t.pcControls;
  const n = foundCount();
  $('sProg').innerHTML = `${t.progress}: <b>${n}</b> / ${FRUITS.length}<span class="bar"><i style="width:${(n / FRUITS.length) * 100}%"></i></span>`;
  $('sAvatars').innerHTML = AVATARS.map((a) => `<button data-a="${a.id}" class="${a.id === save.avatar ? 'sel' : ''}"><img src="${avatarIcon(a.id)}" alt=""><span>${a.name}</span></button>`).join('');
  $('sAvatars').querySelectorAll('button').forEach((b) => b.onclick = () => { save.avatar = b.dataset.a; persist(); sfx.unlock(); sfx.play('click'); renderStart(); });
  $('sFruits').innerHTML = ['apple', 'banana', 'piratepineapple', 'burger', 'rainbowdragon', 'donut', 'kingmango', 'galaxy'].map((id) => `<img src="${fruitIcon(id)}" alt="">`).join('');
  $('bLang').textContent = save.lang === 'zh' ? 'EN' : '中';
  for (const [id, k] of [['bBook', 'book'], ['bHome', 'home'], ['bReset', 'reset'], ['bHelp', 'help']]) $(id).title = t[k];
}
$('sPlay').onclick = startGame;
function startGame() {
  sfx.unlock();
  $('start').hidden = true; G.started = true;
  if (!G.wid) { loadWorld('plaza'); }
  worldCard();
  music.play(G.wid);
}
$('bBook').onclick = () => { sfx.play('click'); openBook(); };
$('bHome').onclick = () => { sfx.play('click'); if (G.started && G.wid !== 'plaza') travel('plaza'); else if (G.started) { G.cp = { x: WORLD.plaza.spawn[0], y: WORLD.plaza.spawn[1], z: WORLD.plaza.spawn[2], yaw: 0 }; spawnPlayer(); } };
$('bReset').onclick = () => { if (G.started && !G.deadT) { G.pl.dead = true; die('kill'); } };
$('bHelp').onclick = () => { sfx.play('click'); renderHelp(); G.modal = 'help'; $('help').hidden = false; resetInput(); };
$('bSound').onclick = () => { save.sound = !save.sound; persist(); applySound(); };
// on-screen camera buttons: hold to keep turning / zooming
for (const [id, k, v] of [['camL', 'spin', 1], ['camR', 'spin', -1], ['zoomIn', 'zoom', -1], ['zoomOut', 'zoom', 1]]) {
  const b = $(id);
  b.addEventListener('pointerdown', (e) => { e.preventDefault(); sfx.unlock(); cam[k] = v; b.classList.add('on'); try { b.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ } });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) b.addEventListener(ev, () => { cam[k] = 0; b.classList.remove('on'); });
}
function toggleFollow() { save.follow = !save.follow; persist(); paintFollow(); msg(tr().follow(save.follow), 1400); }
function paintFollow() { $('camFollow').classList.toggle('off', !save.follow); $('camFollow').title = tr().follow(save.follow); }
$('camFollow').onclick = () => { sfx.play('click'); toggleFollow(); };
paintFollow();
$('bMusic').onclick = () => { save.music = !save.music; persist(); applySound(); };
$('bLang').onclick = () => {
  save.lang = save.lang === 'zh' ? 'en' : 'zh'; persist();
  renderStart(); updateHUD(); updateLabels(); if (G.modal === 'book') renderBook(); if (G.modal === 'help') renderHelp();
  G.sign = undefined;
};
function applySound() {
  sfx.on = save.sound; music.on = save.music && save.sound;
  $('bSound').textContent = save.sound ? '🔊' : '🔇';
  $('bMusic').textContent = save.music ? '🎵' : '🎵̸';
  $('bMusic').classList.toggle('off', !save.music);
}
document.body.classList.toggle('touch', isTouch);
applySound();

// fast waterfall: give the 'fallwater' material its own scrolling copy of the water texture
MATDEF.fallwater = { tile: 4, tex: 'water', rough: 0.1, opacity: 0.7 };
{
  const base = tex('water'); fallTex = base.clone(); fallTex.needsUpdate = true;
  matCache[`fallwater|${0x8fd8ff}|water`] = new THREE.MeshStandardMaterial({ color: 0x8fd8ff, map: fallTex, transparent: true, opacity: 0.72, roughness: 0.1, depthWrite: false });
}

// ------------------------------------------------------------------ boot
loadWorld(params.get('world') && WORLD[params.get('world')] ? params.get('world') : 'plaza',
  params.get('at') ? params.get('at').split(',').map(Number).concat([Number(params.get('yaw') || 0)]).slice(0, 4) : null);
renderStart();
if (params.has('play')) startGame();
if (params.has('clean')) document.body.classList.add('clean');
if (params.has('book')) openBook();
if (params.has('cam')) { const [y, p, d] = params.get('cam').split(',').map(Number); cam.yaw = y; cam.pitch = p; cam.dist = d; }
requestAnimationFrame(frame);
window.FTF = { G, cam, save, travel, loadWorld, collectFruit, openBook, inputVector, keys, touch, startGame, stepTest: (dt) => tick(dt) };
