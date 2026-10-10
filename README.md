# Find the Fruits! 尋找水果

A Roblox-style 3D treasure hunt in the browser (three.js, no build step).
Explore six worlds, find **40 hidden fruits and 10 fast foods**, and collect a badge for every one.

**Play:** https://ywchen0711.github.io/find-the-fruits/

## Worlds
| World | Unlocks at | Highlights |
|---|---|---|
| 水果廣場 Fruit Plaza | – | fountain, fruit shop with ladder, clock-tower spiral, hedge garden with a fake hedge, lamp-post parkour, golden vault (opens at 39 fruits) |
| 熱帶島嶼 Tropical Island | 0 | treasure key + locked house, cave behind the waterfall, pirate ship crow's nest, volcano crater over lava, sky parkour |
| 冰雪山峰 Frosty Peaks | 6 | floating ice floes, slippery ice steps, keypad vault (code on 4 hidden signs), fake ice wall, lift + timed shrine door, summit parkour |
| 糖果廚房 Candy Kitchen | 13 | fridge shelves, jelly trampolines, colour-sequence pantry, fake oven door, timed cage on the stovetop with a spinning spatula, vanishing cookies + conveyor |
| 天空神殿 Sky Temple | 20 | moving platform, ziggurat, invisible path, spinner bridge, vanishing blocks to a storm cloud, the Tower of Impossible |
| 速食街 Fast Food Street | 10 | not fruit but fast food: food truck, Burger Barn roof, Hot Dog Hut sign pole, Donut Dome bounce pad, Pizza Pals storeroom with a fake wall, timed Taco Town drive-thru, billboards on a moving platform, rooftop parkour, the neon tower (shop names are made up, no real brands) |

Fruits are graded **Easy · Medium · Hard · Insane · Impossible**. The 📖 Fruit Book shows every fruit's tier and a hint.
Progress is saved in `localStorage`. Chinese / English, keyboard + mouse or touch (stick + jump button).

## Controls
WASD / arrows move · Space jump · drag to look · wheel zoom · Q/E turn · F follow camera · B book · R reset.
On screen: ⟲ ⟳ turn the camera (hold), ＋ － zoom, 🎥 follow camera on/off (the camera swings behind you as you walk).

## Code
- `js/data.js` – fruit catalog and the five worlds, built from boxes in studs (pure data)
- `js/physics.js` – player AABB physics with Roblox numbers (walk 16, jump 6.4 studs), moving / vanishing parts, doors, flags
- `js/main.js` – rendering, input, camera, triggers and UI · `js/fruitmodel.js` – procedural fruits with faces and accessories · `js/avatar.js` – blocky avatars · `js/audio.js` – synth sounds + music
- `tools/phys-test.mjs` – physics regression tests (lifts, walls, steps)
- `tools/check.mjs` – proves every fruit is reachable: a jump graph between surfaces, calibrated against the real physics (`node tools/check.mjs`)
