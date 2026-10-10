// Find the Fruits: fruit catalog + worlds. Pure data (no three.js) so tools/check.mjs can analyse it in Node.
// Units are Roblox studs: the player is 2 wide and 5 tall, walks 16 studs/s and jumps 6.4 studs high.

export const PHYS = { WALK: 16, JUMPV: 50, G: 196.2, TRAMPV: 95, CLIMB: 12, HW: 0.9, H: 5, STEP: 1.1 };

export const TIERS = [
  { id: 'easy', zh: '簡單', en: 'Easy', color: '#3fbf4a' },
  { id: 'medium', zh: '普通', en: 'Medium', color: '#f2c12e' },
  { id: 'hard', zh: '困難', en: 'Hard', color: '#f28a1d' },
  { id: 'insane', zh: '瘋狂', en: 'Insane', color: '#e8392c' },
  { id: 'impossible', zh: '不可能', en: 'Impossible', color: '#8a2be2' },
];

// shape: body builder in fruitmodel.js · c/c2: colours · acc: accessory
export const FRUITS = [
  // Fruit Plaza
  { id: 'apple', w: 'plaza', tier: 0, shape: 'apple', c: 0xe8322c, name: { zh: '蘋果', en: 'Apple' }, hint: { zh: '廣場中間的噴水池，往上看！', en: 'Look up at the fountain in the middle of the plaza!' } },
  { id: 'banana', w: 'plaza', tier: 0, shape: 'banana', c: 0xffd93b, name: { zh: '香蕉', en: 'Banana' }, hint: { zh: '躲在西邊那棵大樹後面。', en: 'Hiding behind the big tree to the west.' } },
  { id: 'blueberry', w: 'plaza', tier: 0, shape: 'berry', c: 0x3d5bd9, name: { zh: '藍莓', en: 'Blueberry' }, hint: { zh: '水果店的屋頂，旁邊有梯子可以爬。', en: 'On the fruit shop roof. There is a ladder on its side.' } },
  { id: 'cherry', w: 'plaza', tier: 1, shape: 'cherry', c: 0xd8102a, name: { zh: '櫻桃', en: 'Cherry' }, hint: { zh: '水果店裡面，最高的那層架子。', en: 'Inside the fruit shop, on the highest shelf.' } },
  { id: 'strawberry', w: 'plaza', tier: 1, shape: 'strawberry', c: 0xf0263f, name: { zh: '草莓', en: 'Strawberry' }, hint: { zh: '爬上鐘樓的螺旋樓梯，一路到頂。', en: 'Climb the spiral stairs of the clock tower all the way up.' } },
  { id: 'ninjagrape', w: 'plaza', tier: 2, shape: 'grape', c: 0x7b3fb5, acc: 'ninja', name: { zh: '忍者葡萄', en: 'Ninja Grape' }, hint: { zh: '樹籬花園沒有門……東邊有一塊樹籬顏色怪怪的。', en: 'The hedge garden has no door... one hedge on its east side looks a bit off.' } },
  { id: 'sunnyorange', w: 'plaza', tier: 2, shape: 'orange', c: 0xff8a1c, acc: 'shades', name: { zh: '太陽眼鏡橘子', en: 'Sunny Orange' }, hint: { zh: '沿著路燈頂端一路跳，到天空神殿傳送門的拱門上。', en: 'Hop across the tops of the street lamps onto the Sky Temple portal arch.' } },
  { id: 'goldenapple', w: 'plaza', tier: 4, shape: 'apple', c: 0xffc928, acc: 'crown', gold: true, name: { zh: '黃金蘋果', en: 'Golden Apple' }, hint: { zh: '金庫只會為找到其他 39 顆水果的人打開。', en: 'The vault only opens for someone who has found the other 39 fruits.' } },
  // Tropical Island
  { id: 'coconut', w: 'tropical', tier: 0, shape: 'coconut', c: 0x7a4a24, name: { zh: '椰子', en: 'Coconut' }, hint: { zh: '海灘上的椰子樹下。', en: 'Under a palm tree on the beach.' } },
  { id: 'mango', w: 'tropical', tier: 0, shape: 'mango', c: 0xffa62b, c2: 0xe8452c, name: { zh: '芒果', en: 'Mango' }, hint: { zh: '草屋裡的小桌子上。', en: 'On the little table inside the hut.' } },
  { id: 'lime', w: 'tropical', tier: 1, shape: 'lemon', c: 0x6ccf3a, name: { zh: '萊姆', en: 'Lime' }, hint: { zh: '寶藏屋上鎖了。鑰匙在海灘大石頭的後面。', en: 'The treasure house is locked. The key is behind the big rock on the beach.' } },
  { id: 'papaya', w: 'tropical', tier: 1, shape: 'papaya', c: 0xffa040, c2: 0x7fbf3a, name: { zh: '木瓜', en: 'Papaya' }, hint: { zh: '踩著懸崖上的岩架，爬到瀑布懸崖頂。', en: 'Climb the ledges up to the top of the waterfall cliff.' } },
  { id: 'piratepineapple', w: 'tropical', tier: 1, shape: 'pineapple', c: 0xf5c02c, acc: 'pirate', name: { zh: '海盜鳳梨', en: 'Pirate Pineapple' }, hint: { zh: '跳過海上的石頭到海盜船，爬上桅杆的瞭望台。', en: 'Jump across the rocks to the pirate ship and climb the mast to the crow\'s nest.' } },
  { id: 'kiwi', w: 'tropical', tier: 2, shape: 'kiwi', c: 0x8a6a3a, name: { zh: '奇異果', en: 'Kiwi' }, hint: { zh: '瀑布後面好像有回音……', en: 'There is an echo behind the waterfall...' } },
  { id: 'passionfruit', w: 'tropical', tier: 2, shape: 'round', c: 0x6a2a6a, c2: 0x3a1040, name: { zh: '熔岩百香果', en: 'Lava Passion Fruit' }, hint: { zh: '火山口中間的石柱上。小心岩漿！', en: 'On the pillar in the middle of the volcano crater. Mind the lava!' } },
  { id: 'rainbowdragon', w: 'tropical', tier: 3, shape: 'dragon', c: 0xff3fa4, rainbow: true, name: { zh: '彩虹火龍果', en: 'Rainbow Dragon Fruit' }, hint: { zh: '從火山口北邊的邊緣出發，跳上空中的跑酷跳台。', en: 'From the north rim of the volcano, take the parkour path into the sky.' } },
  // Frosty Peaks
  { id: 'pear', w: 'frosty', tier: 0, shape: 'pear', c: 0xc8d83a, name: { zh: '西洋梨', en: 'Pear' }, hint: { zh: '雪人旁邊。', en: 'Next to the snowman.' } },
  { id: 'plum', w: 'frosty', tier: 0, shape: 'round', c: 0x7a2a8a, acc: 'scarf', name: { zh: '圍巾李子', en: 'Cozy Plum' }, hint: { zh: '躲在冰屋裡取暖。', en: 'Keeping warm inside the igloo.' } },
  { id: 'penguinpeach', w: 'frosty', tier: 1, shape: 'peach', c: 0xffb38a, acc: 'beanie', name: { zh: '企鵝桃子', en: 'Penguin Peach' }, hint: { zh: '冰湖中間的冰山上。踩著漂浮的冰塊過去，別掉進冰水！', en: 'On the iceberg in the frozen lake. Ride the floating ice; do not touch the water!' } },
  { id: 'lychee', w: 'frosty', tier: 1, shape: 'bumpy', c: 0xe0405a, name: { zh: '荔枝', en: 'Lychee' }, hint: { zh: '東邊的滑溜冰台階，最上面的冰塔。', en: 'Up the slippery ice steps to the east, on the ice tower.' } },
  { id: 'cranberry', w: 'frosty', tier: 2, shape: 'berry', c: 0xb0102a, name: { zh: '蔓越莓', en: 'Cranberry' }, hint: { zh: '金庫要 4 位數密碼。四個告示牌 ❶❷❸❹ 藏在地圖各處。', en: 'The vault needs a 4-digit code. Four signs ❶❷❸❹ are hidden around the map.' } },
  { id: 'pomegranate', w: 'frosty', tier: 2, shape: 'pomegranate', c: 0xc0283a, name: { zh: '石榴', en: 'Pomegranate' }, hint: { zh: '大雪山的正面，有一面冰牆可以直接走過去。', en: 'On the front of the big mountain, one ice wall lets you walk right through.' } },
  { id: 'santapersimmon', w: 'frosty', tier: 2, shape: 'persimmon', c: 0xff7a1a, acc: 'santa', name: { zh: '聖誕柿子', en: 'Santa Persimmon' }, hint: { zh: '按下纜車旁的紅色按鈕，在神社的門關上前趕到山頂！', en: 'Press the red button by the lift, then reach the mountain-top shrine before its door closes!' } },
  { id: 'yetidurian', w: 'frosty', tier: 3, shape: 'durian', c: 0xb8b040, name: { zh: '雪怪榴槤', en: 'Yeti Durian' }, hint: { zh: '從山頂再往上，滑溜的冰塊跑酷。', en: 'Above the mountain top: a slippery ice parkour.' } },
  // Candy Kitchen
  { id: 'raspberry', w: 'candy', tier: 0, shape: 'bumpy', c: 0xe0306a, name: { zh: '覆盆子', en: 'Raspberry' }, hint: { zh: '在大杯子蛋糕上面。', en: 'On top of the giant cupcake.' } },
  { id: 'blackberry', w: 'candy', tier: 0, shape: 'bumpy', c: 0x30204a, name: { zh: '黑莓', en: 'Blackberry' }, hint: { zh: '大餐桌的下面。', en: 'Under the big dining table.' } },
  { id: 'fig', w: 'candy', tier: 1, shape: 'fig', c: 0x7a3a6a, name: { zh: '無花果', en: 'Fig' }, hint: { zh: '冰箱頂上。牆上的層架可以爬。', en: 'On top of the fridge. Climb the wall shelves.' } },
  { id: 'grapefruit', w: 'candy', tier: 1, shape: 'orange', c: 0xff7a6a, name: { zh: '葡萄柚', en: 'Grapefruit' }, hint: { zh: '在高高的櫥櫃上。果凍彈跳床會幫你！', en: 'On the high cabinet. The jelly trampolines will help!' } },
  { id: 'chefmelon', w: 'candy', tier: 2, shape: 'melon', c: 0x3a9a3a, acc: 'chef', name: { zh: '主廚西瓜', en: 'Chef Watermelon' }, hint: { zh: '食物櫃的門要按對順序的彩色按鈕。順序畫在冰箱旁的畫上。', en: 'The pantry needs the coloured buttons in the right order. A painting near the fridge shows it.' } },
  { id: 'avocado', w: 'candy', tier: 2, shape: 'avocado', c: 0x3a6a2a, name: { zh: '酪梨', en: 'Avocado' }, hint: { zh: '烤箱的門好像是假的……裡面很燙！', en: 'The oven door looks fake... and it is hot inside!' } },
  { id: 'apricot', w: 'candy', tier: 2, shape: 'peach', c: 0xffa040, acc: 'bow', name: { zh: '蝴蝶結杏桃', en: 'Bow Apricot' }, hint: { zh: '爬上烤箱頂的爐台，按下按鈕，在籠子關上前衝進去。', en: 'Climb onto the stovetop, press the button and dash into the cage before it shuts.' } },
  { id: 'sourlemon', w: 'candy', tier: 3, shape: 'lemon', c: 0xfff03a, acc: 'shades', name: { zh: '酸酸檸檬', en: 'Sour Lemon' }, hint: { zh: '從冰箱頂出發，踩著會消失的餅乾，跳到天花板的大吊燈。', en: 'From the fridge top, cross the vanishing cookies to the big ceiling lamp.' } },
  // Sky Temple
  { id: 'starfruit', w: 'sky', tier: 0, shape: 'star', c: 0xffe03a, name: { zh: '楊桃', en: 'Starfruit' }, hint: { zh: '出生島的花叢旁。', en: 'By the flowers on the spawn island.' } },
  { id: 'angelberry', w: 'sky', tier: 0, shape: 'berry', c: 0x5a8aff, acc: 'halo', name: { zh: '天使藍莓', en: 'Angel Blueberry' }, hint: { zh: '橋旁邊的小雲朵上。', en: 'On the little cloud next to the bridge.' } },
  { id: 'wingcherry', w: 'sky', tier: 1, shape: 'cherry', c: 0xff3a5a, acc: 'wings', name: { zh: '翅膀櫻桃', en: 'Winged Cherry' }, hint: { zh: '搭東邊的移動平台到漂浮小島。', en: 'Ride the moving platform to the floating island in the east.' } },
  { id: 'kingmango', w: 'sky', tier: 1, shape: 'mango', c: 0xffc02a, c2: 0xff7a2a, acc: 'crown', name: { zh: '國王芒果', en: 'King Mango' }, hint: { zh: '神殿金字塔的最頂端。', en: 'At the very top of the temple pyramid.' } },
  { id: 'ghostbanana', w: 'sky', tier: 2, shape: 'banana', c: 0xeaf4ff, ghost: true, name: { zh: '幽靈香蕉', en: 'Ghost Banana' }, hint: { zh: '神殿西邊有一條看不見的路。注意閃光！', en: 'An invisible path leads west from the temple. Watch for sparkles!' } },
  { id: 'spaceorange', w: 'sky', tier: 2, shape: 'orange', c: 0xff9a2a, acc: 'helmet', name: { zh: '太空橘子', en: 'Space Orange' }, hint: { zh: '北邊的橋上有旋轉棒，跳過它們！', en: 'The north bridge has spinning bars. Jump over them!' } },
  { id: 'thunderlemon', w: 'sky', tier: 3, shape: 'lemon', c: 0xffe82a, acc: 'bolt', name: { zh: '雷電檸檬', en: 'Thunder Lemon' }, hint: { zh: '西邊幽靈島往北，一路踩消失方塊到雷雲上。', en: 'From the ghost island, climb the vanishing blocks north to the storm cloud.' } },
  { id: 'galaxy', w: 'sky', tier: 4, shape: 'galaxy', c: 0x5a2aff, name: { zh: '銀河果', en: 'Galaxy Fruit' }, hint: { zh: '不可能之塔的頂端。沒有存檔點，祝你好運。', en: 'At the top of the Tower of Impossible. No checkpoints. Good luck.' } },
  // Fast Food Street (not fruits: cat 'food')
  { id: 'fries', w: 'fastfood', cat: 'food', tier: 0, shape: 'fries', c: 0xe8322c, name: { zh: '薯條', en: 'Fries' }, hint: { zh: '餐車窗口的檯子上。', en: 'On the counter of the food truck.' } },
  { id: 'burger', w: 'fastfood', cat: 'food', tier: 0, shape: 'burger', c: 0xd8902a, name: { zh: '漢堡', en: 'Burger' }, hint: { zh: '店外面的小餐桌上。', en: 'On the little table outside.' } },
  { id: 'soda', w: 'fastfood', cat: 'food', tier: 1, shape: 'soda', c: 0x3a7aff, name: { zh: '汽水', en: 'Soda' }, hint: { zh: '漢堡穀倉的屋頂，旁邊有梯子。', en: 'On the Burger Barn roof. There is a ladder on its side.' } },
  { id: 'hotdog', w: 'fastfood', cat: 'food', tier: 1, shape: 'hotdog', c: 0xd84a2a, name: { zh: '熱狗', en: 'Hot Dog' }, hint: { zh: '沿著熱狗小屋招牌柱的階梯繞上去。', en: 'Climb the steps around the Hot Dog Hut sign pole.' } },
  { id: 'donut', w: 'fastfood', cat: 'food', tier: 1, shape: 'donut', c: 0xff8ac0, name: { zh: '甜甜圈', en: 'Donut' }, hint: { zh: '甜甜圈屋的屋頂。旁邊的彈跳墊會幫你！', en: 'On the Donut Dome roof. The bounce pad next to it helps!' } },
  { id: 'pizza', w: 'fastfood', cat: 'food', tier: 2, shape: 'pizza', c: 0xffc83a, name: { zh: '披薩', en: 'Pizza' }, hint: { zh: '披薩夥伴後面的儲藏室沒有門……後牆一直飄出披薩香。', en: 'The storeroom behind Pizza Pals has no door... but its back wall smells of pizza.' } },
  { id: 'taco', w: 'fastfood', cat: 'food', tier: 2, shape: 'taco', c: 0xf5c040, name: { zh: '塔可', en: 'Taco' }, hint: { zh: '按下得來速的點餐按鈕，塔可鎮的車庫只開 4 秒！', en: 'Press the drive-thru button; the Taco Town garage opens for just 4 seconds!' } },
  { id: 'icecream', w: 'fastfood', cat: 'food', tier: 2, shape: 'icecream', c: 0xff9ac0, name: { zh: '冰淇淋', en: 'Ice Cream' }, hint: { zh: '爬上看板，搭移動平台到第二塊看板。', en: 'Climb onto the billboard and ride the moving platform to the second one.' } },
  { id: 'chicken', w: 'fastfood', cat: 'food', tier: 3, shape: 'drumstick', c: 0xd8862a, name: { zh: '炸雞腿', en: 'Fried Chicken' }, hint: { zh: '從漢堡穀倉屋頂，踩著會消失的方塊跳到咯咯雞小屋的高屋頂。', en: 'From the Burger Barn roof, cross the vanishing blocks to the tall Cluck Shack roof.' } },
  { id: 'goldenburger', w: 'fastfood', cat: 'food', tier: 4, shape: 'burger', c: 0xffc928, gold: true, acc: 'crown', name: { zh: '黃金漢堡', en: 'Golden Burger' }, hint: { zh: '霓虹塔的最頂端。沒有存檔點。', en: 'At the very top of the neon tower. No checkpoints.' } },
];
FRUITS.forEach((f) => { f.cat = f.cat || 'fruit'; });
export const CATS = [
  { id: 'fruit', icon: '🍎', zh: '水果', en: 'Fruits' },
  { id: 'food', icon: '🍔', zh: '速食', en: 'Fast food' },
];

export const FRUIT = Object.fromEntries(FRUITS.map((f) => [f.id, f]));

// ----------------------------------------------------------------------------------- level builder
const C = {
  grass: 0x6cc04a, hedge: 0x3d8b37, stone: 0xa7adb3, stone2: 0xc9ccd1, wood: 0x9b6a3c, wood2: 0x7a4f2a, white: 0xf2f2f2,
  red: 0xd9534f, brick: 0xb5523b, gold: 0xf2c12e, sand: 0xf0d58c, rock: 0x8f8a80, water: 0x3aa0e8, lava: 0xff5a1a,
  snow: 0xf4f8ff, ice: 0x9fd8f5, ice2: 0x6ab8e8, metal: 0x8a939c, pink: 0xff8ac0, cream: 0xfff1d6, mint: 0x8ff0c8,
  marble: 0xeee8f8, cloud: 0xffffff, purple: 0x7a4ad8, green: 0x2ec85a, yellow: 0xffd93b, blue: 0x3a7aff,
};
export const COLORS = C;

class Builder {
  constructor() { this.parts = []; this.fruits = []; this.signs = []; }
  add(o) { o.id = this.parts.length; this.parts.push(o); return o; }
  box(x, y, z, sx, sy, sz, color, o = {}) { return this.add({ x, y, z, sx, sy, sz, color, mat: 'plastic', kind: 'solid', ...o }); }
  // platform whose TOP is at `top` (thickness o.t, default 1)
  plat(x, top, z, sx, sz, color, o = {}) { const t = o.t || 1; return this.box(x, top - t / 2, z, sx, t, sz, color, o); }
  // column from o.base (default 0) up h studs
  col(x, z, sx, sz, h, color, o = {}) { const b = o.base || 0; return this.box(x, b + h / 2, z, sx, h, sz, color, o); }
  deco(x, y, z, sx, sy, sz, color, o = {}) { return this.box(x, y, z, sx, sy, sz, color, { kind: 'deco', ...o }); }
  fruit(id, x, y, z) { this.fruits.push({ id, x, y, z }); }
  check(x, top, z, s = 4) { return this.plat(x, top + 0.2, z, s, s, 0xffffff, { t: 0.2, mat: 'spawn', check: true }); }
  truss(x, z, base, h, o = {}) { return this.box(x, base + h / 2, z, 2, h, 2, C.metal, { kind: 'truss', mat: 'truss', ...o }); }
  // sign: face = direction the readable side looks at (n = -z, s = +z, e = +x, w = -x)
  sign(x, base, z, face, text, label, o = {}) {
    const ns = face === 'n' || face === 's';
    this.col(x, z, 0.4, 0.4, 2, C.wood2, { base, kind: 'deco' });
    const b = this.box(x, base + 3, z, ns ? 4 : 0.3, 2.4, ns ? 0.3 : 4, C.cream, { mat: 'sign', kind: 'deco', face, label, ...o });
    this.signs.push({ x, y: base + 2, z, text, part: b });
    return b;
  }
  // 4 walls + roof; door gap on one side ('n','s','e','w'); returns the door-gap box spec so a door can be placed
  house(cx, cz, w, d, h, color, roof, door = 's', o = {}) {
    const base = o.base || 0, dw = o.doorW || 5, dh = Math.min(o.doorH || 8, h), m = o.mat || 'plastic';
    const wall = (side) => {
      const ns = side === 'n' || side === 's';
      const len = ns ? w : d - 2, px = ns ? cx : cx + (side === 'e' ? w / 2 - 0.5 : -w / 2 + 0.5), pz = ns ? cz + (side === 's' ? d / 2 - 0.5 : -d / 2 + 0.5) : cz;
      if (side !== door) { this.col(px, pz, ns ? len : 1, ns ? 1 : len, h, color, { base, mat: m }); return; }
      const seg = (len - dw) / 2;
      for (const sgn of [-1, 1]) {
        const off = sgn * (dw / 2 + seg / 2);
        this.col(px + (ns ? off : 0), pz + (ns ? 0 : off), ns ? seg : 1, ns ? 1 : seg, h, color, { base, mat: m });
      }
      if (h > dh) this.col(px, pz, ns ? dw : 1, ns ? 1 : dw, h - dh, color, { base: base + dh, mat: m });
    };
    ['n', 's', 'e', 'w'].forEach(wall);
    this.plat(cx, base + h + 1, cz, w + 2, d + 2, roof, { mat: o.roofMat || 'plastic' });
    const ns = door === 'n' || door === 's';
    const gx = ns ? cx : cx + (door === 'e' ? w / 2 - 0.5 : -w / 2 + 0.5), gz = ns ? cz + (door === 's' ? d / 2 - 0.5 : -d / 2 + 0.5) : cz;
    return { x: gx, y: base + dh / 2, z: gz, sx: ns ? dw : 1, sy: dh, sz: ns ? 1 : dw };
  }
  door(g, color, need, o = {}) { return this.box(g.x, g.y, g.z, g.sx, g.sy, g.sz, color, { mat: 'glass', door: need, ...o }); }
  // portal arch facing +z (players walk north into it); target world, need = fruits required
  portal(x, z, target, need, color, base = 0) {
    this.col(x - 5.5, z, 2, 2, 13, C.stone2, { base });
    this.col(x + 5.5, z, 2, 2, 13, C.stone2, { base });
    this.plat(x, base + 15, z, 13, 2, C.stone2, { t: 2, portalLabel: target });
    this.box(x, base + 6.5, z, 9, 13, 0.6, color, { kind: 'trigger', mat: 'portal', portal: target });
    if (need > 0) this.box(x, base + 6.5, z + 2.2, 11, 13, 0.6, 0xbfe4ff, { mat: 'glass', door: { count: need }, gate: true });
  }
  tree(x, z, h, leaf = C.hedge, o = {}) {
    const b = o.base || 0;
    this.col(x, z, 2.5, 2.5, h, C.wood, { base: b, mat: 'wood' });
    this.box(x, b + h + 3, z, 11, 7, 11, leaf, { mat: 'grass', ...o.leaf });
  }
  palm(x, z, h) {
    this.col(x, z, 1.6, 1.6, h, 0xa47a4a, { mat: 'wood' });
    for (const [dx, dz, sx, sz] of [[3, 0, 6, 1.6], [-3, 0, 6, 1.6], [0, 3, 1.6, 6], [0, -3, 1.6, 6]]) this.deco(x + dx, h + 0.4, z + dz, sx, 0.4, sz, 0x3fae3a, { mat: 'grass' });
  }
  // rotating kill bar: arm from r0 to r1 around (cx, cz) at height y, angular speed w (rad/s)
  spin(cx, y, cz, r0, r1, w, o = {}) {
    this.col(cx, cz, 0.8, 0.8, 1.6, C.metal, { base: y - 0.8, kind: 'deco' });
    return this.box(cx, y, cz, r1 - r0, o.th || 1, o.th || 1, o.color || 0xff3030, { kind: 'spin', mat: 'neon', r0, r1, w, phase: o.phase || 0 });
  }
  result() { return { parts: this.parts, fruits: this.fruits, signs: this.signs }; }
}

const T = (zh, en) => ({ zh, en });

// ----------------------------------------------------------------------------------- worlds
export const WORLDS = [
  {
    id: 'plaza', name: T('水果廣場', 'Fruit Plaza'), color: '#6cc04a', need: 0,
    sky: [0x6ec3ff, 0xd8f1ff], fog: [0xd8f1ff, 160, 420], sun: 1.0, spawn: [0, 0.4, 40, 0], kill: -40,
    build(L) {
      L.plat(0, 0, 0, 190, 190, C.grass, { mat: 'grass', t: 4 });
      for (const [x, z, sx, sz] of [[0, -94, 190, 4], [0, 94, 190, 4], [-94, 0, 4, 190], [94, 0, 4, 190]]) L.col(x, z, sx, sz, 10, C.hedge, { mat: 'grass' });
      // paths
      L.deco(0, 0.03, 22, 8, 0.06, 30, C.stone2, { mat: 'stone' });
      L.deco(0, 0.03, -40, 8, 0.06, 50, C.stone2, { mat: 'stone' });
      L.deco(-12, 0.03, -52, 114, 0.06, 6, C.stone2, { mat: 'stone' });
      L.deco(26, 0.03, 10, 34, 0.06, 6, C.stone2, { mat: 'stone' });
      L.check(0, 0.2, 40, 8);
      L.sign(-7, 0, 44, 's', T('歡迎來到水果廣場！到處都藏著水果，總共 40 顆。按「📖 圖鑑」看提示。找到越多水果，就能打開更多傳送門！',
        'Welcome to Fruit Plaza! 40 fruits are hidden across the worlds. Open the 📖 Book for hints. Find more fruits to unlock more portals!'), '!');
      // fountain + apple
      L.col(0, -7.25, 16, 1.5, 2, C.stone2, { mat: 'stone' });
      L.col(0, 7.25, 16, 1.5, 2, C.stone2, { mat: 'stone' });
      L.col(-7.25, 0, 1.5, 13, 2, C.stone2, { mat: 'stone' });
      L.col(7.25, 0, 1.5, 13, 2, C.stone2, { mat: 'stone' });
      L.deco(0, 1.0, 0, 13, 0.3, 13, C.water, { mat: 'water' });
      L.col(0, 0, 2.5, 2.5, 6, C.stone2, { mat: 'stone' });
      L.plat(0, 6.6, 0, 4, 4, C.stone2, { t: 0.6, mat: 'stone' });
      L.fruit('apple', 0, 8.1, 0);
      // big tree + banana
      L.tree(-55, 15, 9);
      L.fruit('banana', -55, 1.4, 10.6);
      L.tree(-72, -20, 11); L.tree(70, 55, 10); L.tree(-30, 62, 8); L.tree(32, 66, 9); L.tree(-70, 50, 12);
      // fruit shop: blueberry on the roof (truss), cherry on the top shelf inside
      L.house(50, 10, 16, 14, 16, 0xffe2a8, C.red, 'w');
      L.deco(50, 12, 17.6, 10, 2.5, 0.3, C.red, { mat: 'sign', face: 's', label: 'FRUIT' });
      L.truss(59, 10, 0, 17);
      L.fruit('blueberry', 50, 18.6, 10);
      L.col(49, 10, 2, 8, 3, C.wood, { mat: 'wood' });
      L.plat(55.5, 3, 5.5, 3, 3, C.wood, { mat: 'wood' });
      L.plat(55.5, 6, 10, 3, 3, C.wood, { mat: 'wood' });
      L.plat(55.5, 9, 14.5, 3, 3, C.wood, { mat: 'wood' });
      L.fruit('cherry', 55.5, 10.6, 14.5);
      // clock tower + spiral stairs
      L.col(-45, -35, 8, 8, 34, C.brick, { mat: 'brick' });
      for (let i = 0; i < 20; i++) {
        const a = (i * 30 * Math.PI) / 180;
        L.plat(-45 + Math.cos(a) * 7.5, 1.6 * (i + 1), -35 + Math.sin(a) * 7.5, 3, 3, C.stone2, { mat: 'stone' });
      }
      for (const [dx, dz, f] of [[0, 4.05, 's'], [0, -4.05, 'n'], [4.05, 0, 'e'], [-4.05, 0, 'w']]) {
        L.deco(-45 + dx, 30, -35 + dz, f === 'e' || f === 'w' ? 0.1 : 5, 5, f === 'e' || f === 'w' ? 5 : 0.1, C.white, { mat: 'sign', face: f, label: 'clock' });
      }
      L.fruit('strawberry', -45, 35.6, -35);
      // hedge garden with a fake hedge (ninja grape)
      L.col(55, -25, 21.5, 1.5, 8, C.hedge, { mat: 'grass' });
      L.col(55, -5, 21.5, 1.5, 8, C.hedge, { mat: 'grass' });
      L.col(45, -15, 1.5, 18.5, 8, C.hedge, { mat: 'grass' });
      L.col(65, -21, 1.5, 6.5, 8, C.hedge, { mat: 'grass' });
      L.col(65, -14.5, 1.5, 5, 8, 0x46963f, { mat: 'grass', fake: true });
      L.col(65, -8.5, 1.5, 6.5, 8, C.hedge, { mat: 'grass' });
      L.col(55, -15, 3, 3, 1.5, C.stone2, { mat: 'stone' });
      L.fruit('ninjagrape', 55, 3.2, -15);
      L.sign(72, 0, -24, 'w', T('這個樹籬花園沒有門耶……', 'This hedge garden has no door...'), '?');
      // street lamps -> sky portal arch (sunny orange)
      for (const [x, z, top] of [[64, -44, 4], [59, -47.5, 7], [54, -51, 10], [49, -54.5, 13], [45, -58, 15]]) {
        L.col(x, z, 0.6, 0.6, top - 1, 0x404850, { mat: 'metal' });
        L.plat(x, top, z, 1.6, 1.6, 0xfff2a0, { mat: 'neon' });
      }
      // portals
      L.portal(-36, -62, 'tropical', 0, 0x2ad1c4);
      L.portal(-12, -62, 'frosty', 6, 0x9fd8f5);
      L.portal(12, -62, 'candy', 13, 0xff8ac0);
      L.portal(36, -62, 'sky', 20, 0xc6a8ff);
      L.portal(-60, -62, 'fastfood', 10, 0xffa030);
      L.fruit('sunnyorange', 36, 16.6, -62);
      // golden vault
      const g = L.house(0, -30, 10, 10, 8, C.gold, 0xd9a520, 's', { mat: 'metal' });
      L.door(g, 0xffe680, { count: 39, cat: 'fruit' }, { gold: true });
      L.col(0, -31, 2.5, 2.5, 1.5, C.white, { mat: 'stone' });
      L.fruit('goldenapple', 0, 3.2, -31);
      // decoration: benches, flower beds, fruit stands
      for (const [x, z] of [[-14, 18], [14, 18], [-14, -14], [14, -14]]) { L.col(x, z, 5, 1.6, 1.2, C.wood, { mat: 'wood' }); }
      for (const [x, z, c] of [[-24, 30, 0xff6f91], [24, 30, 0xffd93b], [-30, -8, 0xb07aff], [26, -22, 0xff8a3c]]) {
        L.col(x, z, 6, 6, 0.8, C.wood2, { mat: 'wood' });
        L.deco(x, 1.1, z, 5, 0.6, 5, c, { mat: 'grass' });
      }
    },
  },
  {
    id: 'tropical', name: T('熱帶島嶼', 'Tropical Island'), color: '#2ad1c4', need: 0,
    sky: [0x3ab8ff, 0xbff0ff], fog: [0xbff0ff, 180, 480], sun: 1.1, spawn: [0, 0.7, 66, 0], kill: -3, water: -2,
    build(L) {
      L.deco(0, -2.5, 0, 700, 1, 700, C.water, { mat: 'water', sea: true });
      L.plat(0, 0, 0, 120, 120, C.sand, { mat: 'sand', t: 6 });
      L.deco(-5, 0.03, -5, 80, 0.06, 70, C.grass, { mat: 'grass' });
      L.plat(0, 0.5, 74, 12, 28, C.wood, { mat: 'wood', t: 3 });
      L.check(0, 0.5, 64, 5);
      L.portal(0, 86, 'plaza', 0, 0x6cc04a, 0.5);
      L.sign(-5, 0.5, 62, 's', T('🏴‍☠️ 海盜把寶藏屋鎖起來了。鑰匙？據說就丟在海灘上的某處……', '🏴‍☠️ The pirates locked their treasure house. The key? Somewhere on the beach, they say...'), '☠');
      // coconut palm, more palms
      L.palm(-15, 40, 12); L.fruit('coconut', -12, 1.4, 40);
      for (const [x, z, h] of [[30, 52, 11], [-40, 25, 13], [50, 20, 10], [-52, -5, 12], [15, 10, 11]]) L.palm(x, z, h);
      // hut + mango
      L.house(22, 35, 10, 10, 6, 0xc89a5a, 0xd8b04a, 's', { mat: 'wood', roofMat: 'grass' });
      L.col(22, 32, 3, 3, 2.5, C.wood2, { mat: 'wood' });
      L.fruit('mango', 22, 4, 32);
      // key behind the big rock, locked treasure house (lime)
      L.col(-42, 48, 7, 7, 5, C.rock, { mat: 'stone' });
      L.box(-42, 1.5, 41, 1, 1, 1, C.gold, { kind: 'trigger', key: 'k1' });
      const g = L.house(45, -8, 10, 10, 7, C.stone, C.wood2, 'w', { mat: 'stone' });
      L.door(g, C.gold, { key: 'k1' }, { mat: 'metal' });
      L.fruit('lime', 45, 1.6, -8);
      // waterfall cliff: ledges up (papaya), hidden cave behind the waterfall (kiwi)
      L.col(-15, -50, 30, 20, 20, C.rock, { mat: 'stone' });
      L.col(3, -50, 6, 20, 12, C.rock, { mat: 'stone', base: 8 });
      L.col(8, -50, 4, 20, 20, C.rock, { mat: 'stone' });
      L.box(3, 4, -40.25, 6, 8, 0.5, C.rock, { mat: 'stone', fake: true });
      L.deco(3, 10, -39.5, 6, 20, 0.5, 0x8fd8ff, { mat: 'water', fall: true });
      L.deco(3, 0.05, -36, 10, 0.1, 6, C.water, { mat: 'water' });
      L.deco(-15, 20.05, -50, 30, 0.1, 20, C.grass, { mat: 'grass' });
      for (const [x, top] of [[-24, 4], [-17, 8], [-10, 12], [-17, 16]]) L.plat(x, top, -38.5, 5, 3, C.rock, { mat: 'stone' });
      L.fruit('papaya', -20, 21.6, -52);
      L.fruit('kiwi', 3, 1.4, -56);
      L.sign(13, 0, -36, 'w', T('嘩啦嘩啦……瀑布後面好像有回音？', 'Splash splash... is that an echo behind the waterfall?'), '?');
      // stepping stones -> pirate ship (crow's nest)
      for (const [x, top] of [[-65.5, 0.5], [-73, 1], [-80.5, 0.5], [-88, 1]]) L.plat(x, top, 0, 3, 3, C.rock, { mat: 'stone', t: 4 });
      L.col(-100, 0, 10, 30, 7, 0x6a3a1a, { mat: 'wood', base: -3 });
      L.col(-100, 12, 8, 4, 4, 0x8a5a2a, { mat: 'wood', base: 4 });
      L.truss(-100, 3, 4, 22);
      L.plat(-100, 26, -1, 6, 5, 0x8a5a2a, { mat: 'wood' });
      L.deco(-100, 16, -6, 9, 10, 0.3, 0xf4efe0, { mat: 'plastic' });
      L.deco(-100, 30, -1, 3, 2, 0.2, 0x202020, { mat: 'sign', face: 's', label: '☠' });
      L.fruit('piratepineapple', -100, 27.6, -1);
      // volcano (lava passion fruit) + checkpoint
      L.col(40, -35, 30, 30, 5, 0x6a5a50, { mat: 'stone' });
      L.col(40, -35, 24, 24, 5, 0x5a4a42, { mat: 'stone', base: 5 });
      L.col(40, -44, 20, 2, 5, 0x4a3a34, { mat: 'stone', base: 10 });
      L.col(40, -26, 20, 2, 5, 0x4a3a34, { mat: 'stone', base: 10 });
      L.col(31, -35, 2, 16, 5, 0x4a3a34, { mat: 'stone', base: 10 });
      L.col(49, -35, 2, 16, 5, 0x4a3a34, { mat: 'stone', base: 10 });
      L.plat(40, 10.3, -35, 16, 16, C.lava, { kind: 'kill', mat: 'lava', t: 0.3 });
      L.col(40, -35, 2, 2, 3.5, 0x4a3a34, { mat: 'stone', base: 10.3 });
      L.plat(35.5, 11.5, -35, 1.5, 1.5, 0x4a3a34, { mat: 'stone' });
      L.check(40, 10, -23.8, 2);
      L.fruit('passionfruit', 40, 15.4, -35);
      // sky parkour from the north rim (rainbow dragon fruit)
      L.plat(38, 18, -49.5, 2.5, 2.5, 0xff6a6a);
      L.plat(30, 21, -53, 2, 2, 0xffb03a);
      L.plat(24, 23, -53, 4, 4, 0xffe03a, { move: { to: [14, 23, -53], period: 5 } });
      L.plat(6.5, 26, -53, 2, 2, 0x5ad05a, { vanish: true });
      L.plat(0.5, 29, -51, 1.5, 1.5, 0x3ab0ff);
      L.plat(-6, 31.5, -49, 1.5, 1.5, 0x7a5aff);
      L.plat(-14, 33, -47, 6, 6, C.cloud, { mat: 'cloud' });
      L.fruit('rainbowdragon', -14, 34.7, -47);
    },
  },
  {
    id: 'frosty', name: T('冰雪山峰', 'Frosty Peaks'), color: '#9fd8f5', need: 6,
    sky: [0x9ab8d8, 0xeef4fb], fog: [0xeef4fb, 140, 380], sun: 0.9, spawn: [0, 0.4, 50, 0], kill: -40, snow: true,
    build(L) {
      L.plat(0, 0, 0, 150, 150, C.snow, { mat: 'snow', t: 4 });
      for (const [x, z, sx, sz] of [[0, -77, 154, 4], [0, 77, 154, 4], [-77, 0, 4, 154], [77, 0, 4, 154]]) L.col(x, z, sx, sz, 14, C.ice2, { mat: 'ice' });
      L.check(0, 0.2, 50, 6);
      L.portal(0, 70, 'plaza', 0, 0x6cc04a);
      // snowman + pear, code sign 3
      L.col(-14, 40, 4, 4, 3, C.white, { mat: 'snow' });
      L.col(-14, 40, 3, 3, 2.5, C.white, { mat: 'snow', base: 3 });
      L.col(-14, 40, 2.2, 2.2, 2, C.white, { mat: 'snow', base: 5.5 });
      L.deco(-14, 6.6, 41.4, 0.4, 0.4, 1.2, 0xff8a1a);
      L.deco(-14, 7.6, 40, 2.4, 0.4, 2.4, 0x202020);
      L.fruit('pear', -10, 1.4, 40);
      L.sign(-18, 0, 35, 's', T('❸ 密碼第三碼是 7', '❸ The 3rd digit of the code is 7'), '❸7');
      // igloo + plum, code sign 1 behind it
      L.house(22, 38, 10, 10, 5.5, C.white, C.ice, 's', { mat: 'snow', doorH: 5.5 });
      L.fruit('plum', 22, 1.4, 36);
      L.sign(22, 0, 31.5, 'n', T('❶ 密碼第一碼是 4', '❶ The 1st digit of the code is 4'), '❶4');
      // frozen lake: icy water kills; floes -> iceberg (penguin peach)
      L.plat(-45, 0.3, 0, 40, 40, 0x5ab0e0, { kind: 'kill', mat: 'water', t: 0.3 });
      L.plat(-28.5, 1.5, 0, 3, 3, C.ice, { surf: 'ice', mat: 'ice', t: 2 });
      L.plat(-34, 1.5, -7, 4, 4, C.ice, { surf: 'ice', mat: 'ice', t: 2, move: { to: [-34, 1.5, 7], period: 5 } });
      L.col(-43, 0, 7, 7, 5, C.ice2, { surf: 'ice', mat: 'ice' });
      for (const [dx, dz] of [[-2, 2], [2, 2.4]]) { L.deco(-43 + dx, 6, dz, 0.9, 2, 0.8, 0x202830); L.deco(-43 + dx, 5.8, dz + 0.42, 0.7, 1.4, 0.05, C.white); }
      L.fruit('penguinpeach', -43, 6.6, 0);
      // slippery ice steps -> ice tower (lychee) + code sign 2
      for (const [x, z, top] of [[36, 10, 2], [42, 6, 4], [48, 2, 6], [54, -2, 8], [60, -6, 10]]) L.plat(x, top, z, 4, 4, C.ice, { surf: 'ice', mat: 'ice', t: 1.5 });
      L.col(66, -11, 6, 6, 12, C.ice2, { surf: 'ice', mat: 'ice' });
      L.fruit('lychee', 66, 13.6, -11);
      L.sign(66, 12, -13.5, 's', T('❷ 密碼第二碼是 2', '❷ The 2nd digit of the code is 2'), '❷2');
      // keypad vault (cranberry)
      const g = L.house(45, -35, 10, 10, 7, C.stone, C.ice2, 'w', { mat: 'stone' });
      L.door(g, 0x9fd8f5, { flag: 'code' });
      L.plat(37, 0.3, -29, 2, 2, C.metal, { t: 0.3, mat: 'metal', keypad: { code: '4271', flag: 'code' } });
      L.deco(37, 1.6, -30.2, 1.4, 1.8, 0.3, 0x30363c, { mat: 'sign', face: 's', label: 'keypad' });
      L.fruit('cranberry', 45, 1.4, -35);
      L.sign(31, 0, -24, 's', T('金庫密碼有 4 碼。❶❷❸❹ 四個告示牌藏在冰雪山峰的各個角落。', 'The vault code has 4 digits. Signs ❶❷❸❹ are hidden all over Frosty Peaks.'), '🔒');
      // the big mountain with a fake ice wall (pomegranate) + code sign 4
      L.col(-23, -57.5, 34, 25, 25, 0xdde8f2, { mat: 'snow' });
      L.col(11, -57.5, 18, 25, 25, 0xdde8f2, { mat: 'snow' });
      L.col(-2, -57.5, 8, 25, 11, 0xdde8f2, { mat: 'snow', base: 14 });
      L.box(-2, 7, -45.25, 8, 14, 0.5, 0xdde8f2, { mat: 'snow', fake: true });
      L.plat(-2, 0.3, -56, 8, 20, 0x5ab0e0, { kind: 'kill', mat: 'water', t: 0.3 });
      for (const z of [-49.5, -55, -60.5]) L.plat(-2, 1.5, z, 2, 2, C.ice, { surf: 'ice', mat: 'ice', t: 1.5 });
      L.plat(-2, 1.5, -68, 8, 4, C.ice, { mat: 'ice', t: 1.5 });
      L.fruit('pomegranate', -2, 3.2, -68.5);
      L.sign(1.5, 1.5, -69.5, 's', T('❹ 密碼最後一碼是 1', '❹ The last digit of the code is 1'), '❹1');
      // lift + timed shrine on the mountain top (santa persimmon)
      L.plat(23.5, 1, -55, 4, 4, C.metal, { mat: 'metal', move: { to: [23.5, 25, -55], period: 7 } });
      L.plat(28, 0.3, -50, 2.5, 2.5, 0xff3030, { t: 0.3, mat: 'neon', button: { flag: 'shrine', timed: 20 } });
      L.sign(30, 0, -46, 's', T('紅色按鈕會打開山頂神社的門 20 秒！', 'The red button opens the mountain-top shrine for 20 seconds!'), '⏱');
      const s = L.house(8, -60, 8, 8, 6, 0xd03a3a, 0x3a2a2a, 's', { base: 25, doorH: 5 });
      L.door(s, 0xffd0a0, { flag: 'shrine' });
      L.fruit('santapersimmon', 8, 26.5, -60);
      L.check(-8, 25, -50, 4);
      // summit parkour (yeti durian)
      for (const [x, z, top, s2, o] of [[-14, -52, 28, 2, {}], [-20, -56, 31, 2, { vanish: true }], [-26, -52, 34, 1.5, {}], [-32, -56, 37, 2, {}],
        [-36, -62, 40, 1.5, {}], [-32, -66.5, 43, 2, { vanish: true }]]) L.plat(x, top, z, s2, s2, C.ice, { surf: 'ice', mat: 'ice', ...o });
      L.spin(-32, 38, -56, 0.5, 4, 2.2);
      L.plat(-24, 45, -64, 5, 5, C.snow, { mat: 'snow' });
      L.fruit('yetidurian', -24, 46.6, -64);
      // pine trees
      for (const [x, z] of [[-40, 50], [-55, 30], [50, 50], [60, 30], [-60, -30], [35, 24]]) L.tree(x, z, 6, 0x2a6a4a, { leaf: { color: 0x2f7a52 } });
    },
  },
  {
    id: 'candy', name: T('糖果廚房', 'Candy Kitchen'), color: '#ff8ac0', need: 13,
    sky: [0xffd6ec, 0xfff2f8], fog: [0xfff2f8, 200, 500], sun: 1.0, spawn: [0, 0.4, 40, 0], kill: -40, indoor: true,
    seqs: { s1: { order: ['blue', 'red', 'green', 'yellow'], flag: 'seq' } },
    build(L) {
      L.plat(0, 0, 0, 130, 130, 0xffffff, { mat: 'checker', t: 4 });
      for (const [x, z, sx, sz] of [[0, -66, 134, 2], [0, 66, 134, 2], [-66, 0, 2, 134], [66, 0, 2, 134]]) L.col(x, z, sx, sz, 70, 0xffe0ef, { mat: 'wall' });
      L.check(0, 0.2, 40, 6);
      L.portal(0, 60, 'plaza', 0, 0x6cc04a);
      // cupcake (raspberry)
      L.col(-15, 35, 6, 6, 4, 0xff8ac0, { mat: 'candy' });
      L.col(-15, 35, 7, 7, 2, 0xfff6fb, { mat: 'cloud', base: 4 });
      L.fruit('raspberry', -15, 7.6, 35);
      // dining table (blackberry underneath)
      for (const [x, z] of [[1.5, 11.5], [28.5, 11.5], [1.5, 28.5], [28.5, 28.5]]) L.col(x, z, 2, 2, 14, C.wood2, { mat: 'wood' });
      L.plat(15, 16, 20, 30, 20, C.wood, { t: 2, mat: 'wood' });
      L.col(10, 22, 6, 6, 0.6, C.white, { base: 16 });
      L.col(20, 18, 3, 3, 4, 0xff6a6a, { base: 16, mat: 'candy' });
      L.fruit('blackberry', 15, 1.4, 20);
      // fridge + wall shelves (fig), painting with the button order
      L.col(-50, -40, 14, 12, 40, 0xf4f8fb, { mat: 'metal' });
      L.deco(-42.9, 22, -37, 0.3, 6, 0.6, 0xb0b8c0);
      for (let i = 0; i < 7; i++) L.plat(-63, 5 * (i + 1), i % 2 ? -22 : -30, 4, 6, C.wood, { mat: 'wood' });
      L.check(-50, 40, -44, 3);
      L.fruit('fig', -50, 41.6, -40);
      L.deco(-42.8, 4, -43, 0.2, 3, 4, 0xfff6e0, { mat: 'sign', face: 'e', label: 'seq:s1' });
      L.signs.push({ x: -42, y: 2, z: -43, text: T('一幅畫：藍、紅、綠、黃。', 'A painting: blue, red, green, yellow.') });
      // jelly trampolines -> cabinet (grapefruit)
      L.plat(30, 1.5, -5, 5, 5, 0x5ae07a, { surf: 'tramp', mat: 'jelly', t: 1.5 });
      L.plat(42, 14, -5, 6, 8, C.wood, { mat: 'wood' });
      L.plat(42, 15, -5, 4, 4, 0xff5ab0, { surf: 'tramp', mat: 'jelly' });
      L.plat(57, 30, -5, 16, 20, C.wood, { t: 3, mat: 'wood' });
      L.fruit('grapefruit', 57, 31.6, -5);
      // pantry with a colour-sequence door (chef watermelon)
      const g = L.house(-35, 15, 12, 10, 10, 0xffb0d0, 0xff6aa0, 'e', { mat: 'candy' });
      L.door(g, 0xfff0a0, { flag: 'seq' });
      const cols = { red: 0xff3a3a, yellow: 0xffd92a, green: 0x2ec85a, blue: 0x3a7aff };
      Object.entries(cols).forEach(([name, c], i) => L.plat(-22, 0.3, 8 + i * 4, 2.5, 2.5, c, { t: 0.3, mat: 'neon', button: { seq: 's1', color: name } }));
      L.sign(-20, 0, 26, 's', T('食物櫃：按對順序就會開門。順序？找找那幅畫吧。', 'Pantry: press the buttons in the right order. The order? Find the painting.'), '🎨');
      L.fruit('chefmelon', -35, 1.8, 15);
      // oven: fake door, hot inside (avocado); stovetop with a timed cage (apricot)
      L.col(40, -52.5, 20, 1, 16, 0xe0e4e8, { mat: 'metal' });
      L.col(30.5, -45, 1, 16, 16, 0xe0e4e8, { mat: 'metal' });
      L.col(49.5, -45, 1, 16, 16, 0xe0e4e8, { mat: 'metal' });
      L.plat(40, 18, -45, 20, 16, 0xd0d4d8, { t: 2, mat: 'metal' });
      L.box(40, 8, -37.5, 18, 16, 1, 0x30363c, { mat: 'glass', fake: true, dark: true });
      L.plat(40, 1, -39, 18, 2, 0x50565c, { mat: 'metal' });
      L.plat(40, 0.3, -46, 18, 12, C.lava, { kind: 'kill', mat: 'lava', t: 0.3 });
      L.plat(36, 2, -44, 2, 2, 0x50565c, { mat: 'metal' });
      L.plat(42, 3, -47.5, 2, 2, 0x50565c, { mat: 'metal' });
      L.plat(40, 3, -51, 18, 2, 0x50565c, { mat: 'metal' });
      L.fruit('avocado', 40, 4.6, -51);
      L.truss(51, -45, 0, 18);
      for (const [x, z] of [[38, -46], [46, -48], [33, -41]]) L.plat(x, 18.2, z, 4, 4, 0xff3a1a, { kind: 'kill', mat: 'lava', t: 0.2 });
      L.spin(40, 19.2, -48, 0.4, 4.5, 2.4, { color: 0xc0c8d0 });
      L.plat(33, 18.3, -51, 2, 2, 0xff3030, { t: 0.3, mat: 'neon', button: { flag: 'stove', timed: 6 } });
      L.col(44, -43.25, 4.5, 0.5, 6, 0xbfe4ff, { mat: 'glass', base: 18 });
      L.col(44, -38.75, 4.5, 0.5, 6, 0xbfe4ff, { mat: 'glass', base: 18 });
      L.col(46.25, -41, 0.5, 4, 6, 0xbfe4ff, { mat: 'glass', base: 18 });
      L.plat(44, 24.5, -41, 5, 5, 0xbfe4ff, { mat: 'glass', t: 0.5 });
      L.box(41.75, 21, -41, 0.5, 6, 4, 0xffd0a0, { mat: 'glass', door: { flag: 'stove' } });
      L.fruit('apricot', 44, 19.6, -41);
      // vanishing cookies from the fridge to the ceiling lamp (sour lemon)
      L.plat(-38, 43, -35, 3, 3, 0xc88a4a, { vanish: true, mat: 'cookie' });
      L.plat(-31, 46, -31, 3, 3, 0xc88a4a, { vanish: true, mat: 'cookie' });
      L.plat(-22, 48, -26, 8, 3, 0x40444a, { surf: 'conv', conv: [0, 7], mat: 'conv' });
      L.plat(-12, 51, -20, 2, 2, 0xc88a4a, { vanish: true, mat: 'cookie' });
      L.plat(-6.5, 53, -15, 1.5, 1.5, 0xc88a4a, { mat: 'cookie' });
      L.plat(0, 55, -10, 6, 6, 0xfff2a0, { mat: 'neon' });
      L.deco(0, 62.5, -10, 0.4, 15, 0.4, 0x60646a);
      L.fruit('sourlemon', 0, 56.6, -10);
      // sprinkles / candy decorations
      for (const [x, z, c] of [[-40, 45, 0xff6a6a], [45, 40, 0x6aa0ff], [-55, 5, 0xffd92a], [55, 25, 0x8ff0c8]]) L.col(x, z, 4, 4, 3, c, { mat: 'candy' });
    },
  },
  {
    id: 'sky', name: T('天空神殿', 'Sky Temple'), color: '#c6a8ff', need: 20,
    sky: [0x6a7aff, 0xffd6f0], fog: [0xf6e6ff, 220, 600], sun: 1.0, spawn: [0, 0.4, 30, 0], kill: -45, clouds: true,
    build(L) {
      L.plat(0, 0, 40, 30, 30, C.grass, { mat: 'grass', t: 6 });
      L.check(0, 0.2, 30, 6);
      L.portal(0, 53, 'plaza', 0, 0x6cc04a, 0);
      for (const [x, z, c] of [[7, 45, 0xff6f91], [10, 48, 0xffd93b], [-9, 44, 0xb07aff]]) L.deco(x, 0.4, z, 2, 0.8, 2, c, { mat: 'grass' });
      L.fruit('starfruit', 9, 1.4, 45);
      L.plat(0, 0, 10, 4, 30, C.wood, { mat: 'wood' });
      L.plat(7, 2, 12, 5, 5, C.cloud, { mat: 'cloud' });
      L.fruit('angelberry', 7, 3.6, 12);
      // temple island + ziggurat (king mango)
      L.plat(0, 0, -20, 44, 30, C.marble, { mat: 'stone', t: 8 });
      L.col(0, -25, 24, 16, 4, C.marble, { mat: 'stone' });
      L.col(0, -26, 18, 12, 4, 0xe2dcf0, { mat: 'stone', base: 4 });
      L.col(0, -27, 12, 8, 4, 0xd6cfe8, { mat: 'stone', base: 8 });
      L.col(0, -27, 6, 4, 4, C.gold, { mat: 'metal', base: 12 });
      for (const [x, z] of [[-11, -7], [11, -7], [-20, -33], [20, -33]]) L.col(x, z, 2, 2, 9, C.white, { mat: 'stone' });
      L.fruit('kingmango', 0, 17.6, -27);
      // moving platform -> floating island (winged cherry)
      L.plat(25, 0, -20, 4, 4, C.gold, { move: { to: [37, 0, -20], period: 5 } });
      L.plat(46, 4, -20, 12, 12, C.grass, { mat: 'grass', t: 6 });
      L.fruit('wingcherry', 46, 5.6, -20);
      // invisible path -> ghost island (ghost banana)
      for (const [x, top, z] of [[-26.5, 1, -20], [-32.5, 1.5, -18], [-38.5, 2, -21], [-44.5, 2, -19], [-50, 2, -20]]) L.plat(x, top, z, 2.5, 2.5, 0xeaf4ff, { invis: true });
      L.plat(-60, 2, -20, 14, 14, 0xd8e0f0, { mat: 'cloud', t: 6 });
      L.check(-56, 2, -16, 3);
      L.fruit('ghostbanana', -60, 3.6, -20);
      L.sign(-19, 0, -12, 'w', T('相信你的腳。有些路是看不見的……', 'Trust your feet. Some paths cannot be seen...'), '👻');
      // vanishing blocks up to the storm cloud (thunder lemon)
      for (let i = 0; i < 8; i++) L.plat(i % 2 ? -56 : -61, 5 + 3 * i, -31 - 5 * i, 2, 2, 0xffe84a, { vanish: true, mat: 'neon' });
      L.plat(-60, 29, -75, 7, 7, 0x6a6a8a, { mat: 'cloud', t: 3 });
      L.fruit('thunderlemon', -60, 30.6, -75);
      // spinner bridge -> north island (space orange) + tower of impossible (galaxy)
      L.plat(0, 0, -50, 3, 30, C.wood, { mat: 'wood' });
      L.spin(0, 1.1, -42, -5, 5, 1.8, { th: 1.2 });
      L.spin(0, 1.1, -50, -5, 5, -2.2, { th: 1.2 });
      L.spin(0, 1.1, -58, -5, 5, 2.7, { th: 1.2 });
      L.plat(0, 0, -80, 30, 30, C.marble, { mat: 'stone', t: 8 });
      L.check(-10, 0, -68, 4);
      L.fruit('spaceorange', 8, 1.6, -70);
      L.col(0, -85, 6, 6, 52, 0x4a2a8a, { mat: 'stone' });
      for (let i = 0; i < 16; i++) {
        const a = (i * 42 * Math.PI) / 180 + Math.PI / 2, top = 3 * (i + 1);
        const o = { mat: 'neon' };
        if (i % 4 === 3) o.vanish = true;
        if (i % 5 === 2) { o.surf = 'ice'; o.mat = 'ice'; }
        const s2 = i < 4 ? 1.5 : 1;
        L.plat(Math.cos(a) * 7.5, top, -85 + Math.sin(a) * 7.5, s2, s2, [0xff5a9a, 0x5ab0ff, 0xffd84a, 0x7aff8a][i % 4], o);
      }
      L.spin(0, 19.6, -85, 3, 10, 1.4, { phase: 1 });
      L.spin(0, 37.6, -85, 3, 10, -1.7, { phase: 2 });
      L.fruit('galaxy', 0, 53.8, -85);
      // clouds (deco)
      for (const [x, y, z, s] of [[-40, -14, 30, 16], [50, -10, 30, 20], [30, -18, -60, 22], [-30, -20, -95, 18], [60, 8, -70, 14], [-80, 10, 10, 18]]) L.deco(x, y, z, s, s * 0.35, s * 0.7, C.cloud, { mat: 'cloud' });
    },
  },
  {
    id: 'fastfood', name: T('速食街', 'Fast Food Street'), color: '#ffa030', need: 10,
    sky: [0x5aa8ff, 0xffe6c8], fog: [0xffe6c8, 170, 450], sun: 1.0, spawn: [0, 0.4, 55, 0], kill: -40,
    build(L) {
      L.plat(0, 0, 0, 172, 172, 0x9aa0a8, { mat: 'stone', t: 4 });
      for (const [x, z, sx, sz] of [[0, -87, 176, 4], [0, 87, 176, 4], [-87, 0, 4, 176], [87, 0, 4, 176]]) L.col(x, z, sx, sz, 14, C.brick, { mat: 'brick' });
      L.deco(0, 0.03, 0, 16, 0.06, 172, 0x3a3e46, { mat: 'stone' });
      for (let z = -80; z <= 80; z += 12) L.deco(0, 0.07, z, 0.6, 0.06, 6, 0xffe03a);
      L.check(0, 0.2, 55, 6);
      L.portal(0, 76, 'plaza', 0, 0x6cc04a);
      L.sign(-6, 0, 60, 's', T('歡迎來到速食街！這裡藏的不是水果，是 10 種速食。', 'Welcome to Fast Food Street! What is hidden here is not fruit: 10 fast foods.'), '🍔');
      for (const z of [-60, -20, 20]) for (const x of [-10, 10]) { L.col(x, z, 0.6, 0.6, 9, 0x404850, { mat: 'metal' }); L.deco(x, 9.3, z, 1.6, 0.6, 1.6, 0xfff2a0, { mat: 'neon' }); }
      L.col(6, 20, 4, 8, 3, 0xe03a3a);  L.col(-6, -30, 4, 8, 3, 0x3a8aff);  L.col(6, -70, 4, 8, 3, 0x3ac06a);
      // food truck: fries on the counter
      L.col(-20, 40, 8, 14, 7, 0xffffff, { mat: 'metal' });
      L.deco(-15.9, 5.5, 40, 0.2, 2.5, 6, 0x30363c);
      L.plat(-15, 3, 40, 2, 4, C.wood, { mat: 'wood' });
      L.deco(-15.85, 8, 40, 0.3, 1.6, 8, 0xe8322c, { mat: 'sign', face: 'e', label: '🍟 FRY GUY' });
      L.fruit('fries', -14.8, 4.5, 40);
      // outdoor table: burger
      L.col(20, 45, 4, 4, 3, 0xffffff, { mat: 'plastic' });
      for (const [dx, dz] of [[-3.5, 0], [3.5, 0]]) L.col(20 + dx, 45 + dz, 1.5, 3, 1.5, 0xe03a3a);
      L.fruit('burger', 20, 4.6, 45);
      // Burger Barn: soda on the roof (truss); start of the chicken parkour
      L.house(25, 20, 18, 14, 10, 0xd8502a, 0x8a3a1a, 'w', { mat: 'wood' });
      L.deco(15.6, 12.5, 20, 0.3, 3, 12, 0xffd23a, { mat: 'sign', face: 'w', label: '🍔 BURGER BARN' });
      L.truss(35, 20, 0, 11);
      L.fruit('soda', 25, 12.7, 20);
      L.check(30, 11, 16, 3);
      // vanishing blocks + a spinner to the Cluck Shack roof (fried chicken)
      L.plat(39.5, 14, 22, 2, 2, 0xffb03a, { vanish: true, mat: 'neon' });
      L.plat(44.5, 17, 25, 2, 2, 0xffb03a, { vanish: true, mat: 'neon' });
      L.plat(49, 19.5, 22, 1.5, 1.5, 0xff6a3a);
      L.spin(49, 20.5, 22, 0.3, 3.5, 2.4);
      L.plat(53, 21, 25, 1.5, 1.5, 0xffb03a, { vanish: true, mat: 'neon' });
      L.col(60, 25, 10, 10, 22, 0xfff0d0, { mat: 'brick' });
      L.deco(60, 18, 30.2, 8, 3, 0.3, 0xd83a2a, { mat: 'sign', face: 's', label: '🍗 CLUCK SHACK' });
      L.fruit('chicken', 60, 23.7, 25);
      // Donut Dome + bounce pad
      L.col(40, 40, 12, 12, 12, 0xff8ac0, { mat: 'candy' });
      L.deco(40, 9, 46.2, 9, 3, 0.3, 0xfff0f6, { mat: 'sign', face: 's', label: '🍩 DONUT DOME' });
      L.plat(28, 1.5, 52, 5, 5, 0x5ae07a, { surf: 'tramp', mat: 'jelly', t: 1.5 });
      L.fruit('donut', 40, 13.8, 40);
      // Hot Dog Hut + spiral steps around the sign pole
      L.house(-42, 0, 10, 10, 7, 0xffe0a0, 0xd84a2a, 'e');
      L.col(-25, 0, 2, 2, 24, 0x404850, { mat: 'metal' });
      for (let i = 0; i < 12; i++) { const a = (i * 45 * Math.PI) / 180; L.plat(-25 + Math.cos(a) * 4.5, 2 * (i + 1), Math.sin(a) * 4.5, 2.5, 2.5, 0xffd23a); }
      L.plat(-25, 25, 0, 3, 3, 0xd84a2a);
      L.deco(-25, 29.5, -1.6, 8, 3, 0.3, 0xffd23a, { mat: 'sign', face: 's', label: '🌭 HOT DOG HUT' });
      L.fruit('hotdog', -25, 26.6, 0);
      // Pizza Pals + a doorless storeroom with a fake back wall (pizza)
      L.house(-30, -38, 16, 10, 9, 0xffe0b0, 0xd83a2a, 'e');
      L.deco(-21.6, 11, -38, 0.3, 3, 10, 0x2a9a3a, { mat: 'sign', face: 'e', label: '🍕 PIZZA PALS' });
      L.col(-30, -47.5, 8, 1, 8, 0xffe0b0);
      L.col(-33.5, -50, 1, 4, 8, 0xffe0b0);
      L.col(-26.5, -50, 1, 4, 8, 0xffe0b0);
      L.col(-30, -52.5, 8, 1, 8, 0xffe0b0, { fake: true });
      L.plat(-30, 9, -50, 8, 6, 0xd83a2a);
      L.fruit('pizza', -30, 1.6, -50);
      L.sign(-30, 0, -60, 's', T('儲藏室沒有門，可是後面一直飄出披薩的香味……', 'The storeroom has no door, but there is a smell of pizza coming from the back...'), '🍕');
      // Taco Town garage with a timed drive-thru button (taco)
      const g = L.house(30, -30, 12, 12, 8, 0xffc040, 0x2ab0a0, 'w');
      L.door(g, 0x60c0b0, { flag: 'taco' });
      L.deco(23.6, 10, -30, 0.3, 3, 10, 0x2ab0a0, { mat: 'sign', face: 'w', label: '🌮 TACO TOWN' });
      L.plat(50, 0.3, -52, 2.5, 2.5, 0xff3030, { t: 0.3, mat: 'neon', button: { flag: 'taco', timed: 4 } });
      L.sign(46, 0, -50, 's', T('得來速點餐按鈕：按下去，塔可鎮的車庫會打開 4 秒！', 'Drive-thru button: press it and the Taco Town garage opens for 4 seconds!'), '⏱');
      L.fruit('taco', 31, 1.7, -30);
      // billboards + moving platform (ice cream)
      L.col(52.5, -6, 0.6, 0.6, 9, 0x404850, { mat: 'metal' }); L.col(57.5, -6, 0.6, 0.6, 9, 0x404850, { mat: 'metal' });
      L.plat(55, 10, -6, 6, 3, 0x8a939c, { mat: 'metal' });
      L.truss(55, -3.5, 0, 10);
      L.deco(55, 15.5, -7.3, 6, 4, 0.3, 0xffe0f0, { mat: 'sign', face: 's', label: '🍦 SCOOP CITY' });
      L.plat(55, 11, -11, 3, 3, C.gold, { move: { to: [55, 11, -20], period: 5 } });
      L.col(52.5, -25, 0.6, 0.6, 12, 0x404850, { mat: 'metal' }); L.col(57.5, -25, 0.6, 0.6, 12, 0x404850, { mat: 'metal' });
      L.plat(55, 13, -25, 6, 3, 0x8a939c, { mat: 'metal' });
      L.deco(55, 18.5, -26.3, 6, 4, 0.3, 0x3a7aff, { mat: 'sign', face: 's', label: '🥤 FIZZ!' });
      L.fruit('icecream', 55, 14.7, -25);
      // the neon tower (golden burger)
      L.col(-55, 40, 4, 4, 50, 0x2a2a3a, { mat: 'metal' });
      for (const [dx, dz, f] of [[0, 2.05, 's'], [2.05, 0, 'e'], [-2.05, 0, 'w'], [0, -2.05, 'n']]) L.deco(-55 + dx, 44, 40 + dz, f === 'e' || f === 'w' ? 0.1 : 3.6, 8, f === 'e' || f === 'w' ? 3.6 : 0.1, 0xff3a8a, { mat: 'sign', face: f, label: '🍔' });
      for (let i = 0; i < 15; i++) {
        const a = (i * 50 * Math.PI) / 180 + Math.PI / 2, s2 = i < 3 ? 1.5 : 1, o = { mat: 'neon' };
        if (i % 4 === 3) o.vanish = true;
        L.plat(-55 + Math.cos(a) * 5.5, 3.2 * (i + 1), 40 + Math.sin(a) * 5.5, s2, s2, [0xff3a8a, 0xffd23a, 0x3ad0ff, 0x7aff6a][i % 4], o);
      }
      L.spin(-55, 17.2, 40, 2.2, 8, 1.5, { phase: 0.5 });
      L.spin(-55, 33.2, 40, 2.2, 8, -1.8, { phase: 2 });
      L.fruit('goldenburger', -55, 51.7, 40);
    },
  },
];

export const WORLD = Object.fromEntries(WORLDS.map((w) => [w.id, w]));

export function buildWorld(id) {
  const w = WORLD[id];
  const L = new Builder();
  w.build(L);
  return { ...L.result(), def: w };
}
