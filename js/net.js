// Playing together: everyone in the same room and the same world sees each other move, wave, chat and find fruits.
// Built on Supabase Realtime (the same project the site's cloud saves use), so there is no game server:
//   ftf:<room>:<world>  — positions (broadcast, ~8 a second while moving) and events (emotes, chat, fruits, high-fives)
//   ftf:<room>:lobby    — presence: who is in the room and which world they are in
// A room is 'public' (everyone) or a private 4-letter code. Each player moves their own avatar; the others only show it.
// supabase-js loads only when someone plays online, so a blocked CDN never stops the game itself
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';

const SB_URL = 'https://usoavddhglpbdpwwxium.supabase.co';
const SB_KEY = 'sb_publishable_HbbsnjG0GTwzfRgKyx1Aqg__JUOb24B';   // publishable: safe in the browser
const STALE = 9000;                                                 // forget a player we haven't heard from in 9 s

let sb = null, ch = null, lobby = null, joins = 0;
const me = { id: Math.random().toString(36).slice(2, 10), name: 'Player', avatar: 'josh' };
export const net = {
  room: null, world: null, status: 'off',             // off | connecting | on | error
  peers: new Map(),                                   // id -> { id, name, avatar, s: latest state, t: last heard }
  roster: [],                                         // everyone in the room: [{ id, name, avatar, world }]
  onEvent: null, onRoster: null, onStatus: null,
  sent: 0, got: 0,                                    // message counters (for the test tools)
};
export const myId = () => me.id;
export function setMe(o) { Object.assign(me, o); if (lobby && net.status === 'on') lobby.track({ name: me.name, avatar: me.avatar, world: net.world }).catch(() => {}); }
const status = (s) => { net.status = s; if (net.onStatus) net.onStatus(s); };
let lib = null;
async function client() {
  if (!lib) lib = import(SB_LIB);
  const { createClient } = await lib;
  if (!sb) sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false }, realtime: { params: { eventsPerSecond: 30 } } });
  return sb;
}

// join a room (public or a code) and a world; joining a new world leaves the old one
export async function join(room, world) {
  if (!room) { leave(); return; }
  if (room === net.room && world === net.world && ch) return;
  const sameRoom = room === net.room && lobby;
  const ticket = ++joins;
  let c;
  try { c = await client(); } catch (e) { lib = null; status('error'); return; }
  if (ticket !== joins) return;                      // a newer join started while the library loaded
  if (ch) { const old = ch; ch = null; c.removeChannel(old); }
  net.peers.clear();
  net.room = room; net.world = world;
  status('connecting');
  if (!sameRoom) {
    if (lobby) { c.removeChannel(lobby); lobby = null; }
    lobby = c.channel(`ftf:${room}:lobby`, { config: { presence: { key: me.id } } });
    lobby.on('presence', { event: 'sync' }, () => {
      const st = lobby.presenceState();
      net.roster = Object.entries(st).map(([id, metas]) => ({ id, ...(metas[metas.length - 1] || {}) }));
      if (net.onRoster) net.onRoster(net.roster);
    }).subscribe((s) => { if (s === 'SUBSCRIBED') lobby.track({ name: me.name, avatar: me.avatar, world }).catch(() => {}); });
  } else lobby.track({ name: me.name, avatar: me.avatar, world }).catch(() => {});
  const mine = c.channel(`ftf:${room}:${world}`, { config: { broadcast: { self: false }, presence: { key: me.id } } });
  ch = mine;
  mine.on('broadcast', { event: 's' }, ({ payload: p }) => {
    if (!p || p.id === me.id || ch !== mine) return;
    net.got++;
    let peer = net.peers.get(p.id);
    if (!peer) { peer = { id: p.id, name: p.n, avatar: p.a }; net.peers.set(p.id, peer); }
    peer.name = p.n; peer.avatar = p.a; peer.s = p; peer.t = Date.now();
  }).on('broadcast', { event: 'e' }, ({ payload: p }) => {
    if (!p || p.id === me.id || ch !== mine) return;
    if (net.onEvent) net.onEvent(p);
  }).on('presence', { event: 'leave' }, ({ key }) => {
    if (ch === mine) net.peers.delete(key);
  }).subscribe((s) => {
    if (ch !== mine) return;
    if (s === 'SUBSCRIBED') { status('on'); mine.track({ n: me.name }).catch(() => {}); lastSent = 0; }
    else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') status('error');
  });
}
export function leave() {
  joins++;
  const c = sb;
  if (c && ch) c.removeChannel(ch); if (c && lobby) c.removeChannel(lobby);
  ch = null; lobby = null; net.room = null; net.peers.clear(); net.roster = []; status('off');
  if (net.onRoster) net.onRoster([]);
}
// my state, sent ~8 times a second while moving and every 1.5 s while still
let lastSent = 0, lastKey = '';
export function sendState(s, now = performance.now()) {
  if (!ch || net.status !== 'on') return;
  const key = [s.x, s.y, s.z].map((v) => v.toFixed(1)).join(',') + (s.e || '') + Math.round(s.yaw * 10);
  const gap = key === lastKey ? 1500 : 120;
  if (now - lastSent < gap) return;
  lastSent = now; lastKey = key; net.sent++;
  ch.send({ type: 'broadcast', event: 's', payload: { id: me.id, n: me.name, a: me.avatar, x: +s.x.toFixed(2), y: +s.y.toFixed(2), z: +s.z.toFixed(2), yaw: +s.yaw.toFixed(2), sp: +s.speed.toFixed(2), air: s.air ? 1 : 0, cl: s.climbing ? 1 : 0, e: s.e || '' } }).catch(() => {});
}
// an event for everyone in this world: { k: 'emote'|'say'|'found'|'hi5'|'hi5ok', ... }
export function emit(e) {
  if (!ch || net.status !== 'on') return;
  ch.send({ type: 'broadcast', event: 'e', payload: { id: me.id, n: me.name, ...e } }).catch(() => {});
}
// players we haven't heard from for a while have left
export function prune(now = Date.now()) { for (const [id, p] of net.peers) if (now - (p.t || 0) > STALE) net.peers.delete(id); }
// a fresh private room code: four letters that can't be confused (no I, O, L)
export function newCode() { const A = 'ABCDEFGHJKMNPQRSTUVWXYZ'; let s = ''; for (let i = 0; i < 4; i++) s += A[Math.floor(Math.random() * A.length)]; return s; }
export const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
// names other people will see: short, no links
export const cleanName = (s) => String(s || '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[<>{}]/g, '').trim().slice(0, 12) || 'Player';
