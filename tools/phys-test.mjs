// Physics regression tests. Usage: node tools/phys-test.mjs
import { World, newPlayer, stepPlayer } from '../js/physics.js';

let fail = 0;
const ok = (name, cond, info = '') => { console.log((cond ? 'PASS ' : 'FAIL ') + name + (info ? '  ' + info : '')); if (!cond) fail++; };
const world = (parts) => new World({ parts, fruits: [], signs: [], def: { kill: -50 } });
const idle = { mx: 0, mz: 0, jump: false };

// a lift rising into a player who is still in the air must carry them up, not shove them sideways
for (const startT of [0, 0.02, 0.05, 0.1]) {
  const lift = { x: 0, y: 0.5, z: 0, sx: 4, sy: 1, sz: 4, kind: 'solid', move: { to: [0, 25, 0], period: 7 } };
  const W = world([{ x: 0, y: -0.5, z: 0, sx: 60, sy: 1, sz: 60, kind: 'solid' }, lift]);
  W.update(startT);
  const pl = newPlayer(0, lift.y1 + 0.01, 0);
  let top = 0;
  for (let i = 0; i < 60 * 4; i++) { W.update(1 / 60); stepPlayer(pl, W, idle, 1 / 60); top = Math.max(top, pl.y); }
  ok(`lift carries an airborne player (start ${startT}s)`, top > 24 && Math.abs(pl.x) < 0.01, `top=${top.toFixed(2)} x=${pl.x.toFixed(2)}`);
}
// a moving platform sliding sideways into a standing player still pushes them (walls stay solid)
{
  const W = world([{ x: 0, y: -0.5, z: 0, sx: 60, sy: 1, sz: 60, kind: 'solid' }]);
  const pl = newPlayer(0, 0, 0);
  for (let i = 0; i < 30; i++) { stepPlayer(pl, W, { mx: 1, mz: 0, jump: false }, 1 / 60); W.update(1 / 60); }
  ok('walking moves the player', pl.x > 7, `x=${pl.x.toFixed(2)}`);
}
// walls still block sideways movement
{
  const W = world([{ x: 0, y: -0.5, z: 0, sx: 60, sy: 1, sz: 60, kind: 'solid' }, { x: 5, y: 4, z: 0, sx: 2, sy: 8, sz: 10, kind: 'solid' }]);
  const pl = newPlayer(0, 0, 0);
  for (let i = 0; i < 60; i++) { stepPlayer(pl, W, { mx: 1, mz: 0, jump: false }, 1 / 60); W.update(1 / 60); }
  ok('wall blocks the player', Math.abs(pl.x - (4 - 0.9)) < 0.01, `x=${pl.x.toFixed(2)}`);
}
// a small ledge is stepped up onto
{
  const W = world([{ x: 0, y: -0.5, z: 0, sx: 60, sy: 1, sz: 60, kind: 'solid' }, { x: 13, y: 0.5, z: 0, sx: 20, sy: 1, sz: 10, kind: 'solid' }]);
  const pl = newPlayer(0, 0, 0);
  for (let i = 0; i < 40; i++) { stepPlayer(pl, W, { mx: 1, mz: 0, jump: false }, 1 / 60); W.update(1 / 60); }
  ok('steps up a 1-stud ledge', pl.y > 0.99, `y=${pl.y.toFixed(2)}`);
}
console.log(fail ? `${fail} FAILED` : 'all passed');
process.exit(fail ? 1 : 0);
