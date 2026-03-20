import { TILE, TILE_SIZE, ENTITY } from './constants.js?v=38';
import { gameSettings } from './engine.js?v=38';

const cache = {};
const tileSeedCache = {};
const S = TILE_SIZE; // 48
const SC = S / 32;   // scale factor for 32-based coords

// ── Knight sprite (for warrior) ─────────────────

const knightImg = new Image();
knightImg.src = 'assets/knight/rotations/south.png';
let knightReady = false;
knightImg.onload = () => {
  knightReady = true;
  delete cache['player_warrior'];
};

// ── Sprite Sheets ───────────────────────────────

const jrpgSheet = new Image();
jrpgSheet.src = 'assets/sprites/jrpg_monsters.png';
let jrpgReady = false;
jrpgSheet.onload = () => {
  jrpgReady = true;
  // Invalidate all enemy caches so they redraw with sheet sprites
  for (const key of Object.keys(cache)) {
    if (key !== 'player_warrior' && key !== 'player_mage' && key !== 'player_archer' &&
        !key.startsWith('item_') && !key.startsWith('fireball') && !key.startsWith('arrow') &&
        !key.startsWith('iceShard') && !key.startsWith('lightning') &&
        !key.startsWith('chest')) {
      delete cache[key];
    }
  }
};

const basicSheet = new Image();
basicSheet.src = 'assets/sprites/basic_monsters.png';
let basicReady = false;
basicSheet.onload = () => { basicReady = true; };

const housesSheet = new Image();
housesSheet.src = 'assets/sprites/houses.png';
let housesReady = false;
housesSheet.onload = () => {
  housesReady = true;
  // Invalidate village tile caches
  for (const key of Object.keys(tileSeedCache)) {
    if (key.startsWith(TILE.HUT + '_') || key.startsWith(TILE.HEALER + '_') ||
        key.startsWith(TILE.MERCHANT + '_') || key.startsWith(TILE.BLACKSMITH + '_')) {
      delete tileSeedCache[key];
    }
  }
};

// JRPG monster sheet: 8 cols x 7 rows, 98x98px cells
const JRPG_CELL = 98;
// Entity → { col, row } in the JRPG sheet
const JRPG_MAP = {
  [ENTITY.GOBLIN]:           { col: 3, row: 0 },
  [ENTITY.ORC]:              { col: 7, row: 0 },
  [ENTITY.SKELETON]:         { col: 5, row: 1 },
  [ENTITY.SPIDER]:           { col: 3, row: 6 },
  [ENTITY.TROLL]:            { col: 4, row: 0 },
  [ENTITY.DARK_MAGE]:        { col: 1, row: 0 },
  [ENTITY.BAT]:              { col: 7, row: 3 },
  [ENTITY.SLIME]:            { col: 4, row: 3 },
  [ENTITY.WRAITH]:           { col: 3, row: 2 },
  [ENTITY.GOBLIN_SHAMAN]:    { col: 4, row: 1 },
  [ENTITY.MUSHROOM]:         { col: 2, row: 1 },
  [ENTITY.GOBLIN_BERSERKER]: { col: 2, row: 0 },
  [ENTITY.GOBLIN_WARLORD]:   { col: 0, row: 0 },
  [ENTITY.SPIDER_QUEEN]:     { col: 7, row: 2 },
  [ENTITY.LICH]:             { col: 6, row: 2 },
  [ENTITY.MYCELIUM_LORD]:    { col: 1, row: 4 },
  [ENTITY.FIRE_ELEMENTAL]:   { col: 1, row: 2 },
  [ENTITY.FROST_GIANT]:      { col: 2, row: 4 },
  // New monsters
  'goblin_scout':    { col: 6, row: 0 },
  'goblin_chief':    { col: 5, row: 0 },
  'cave_crawler':    { col: 2, row: 3 },
  'venom_spitter':   { col: 2, row: 6 },
  'cocoon_horror':   { col: 7, row: 2 },
  'zombie':          { col: 3, row: 1 },
  'bone_archer':     { col: 0, row: 1 },
  'phantom':         { col: 4, row: 2 },
  'death_knight':    { col: 6, row: 1 },
  'necromancer':     { col: 1, row: 3 },
  'spore_walker':    { col: 0, row: 6 },
  'toxic_toad':      { col: 1, row: 6 },
  'vine_lurker':     { col: 7, row: 1 },
  'moss_golem':      { col: 1, row: 4 },
  'fire_imp':        { col: 2, row: 2 },
  'lava_hound':      { col: 0, row: 2 },
  'ash_wraith':      { col: 5, row: 3 },
  'magma_golem':     { col: 1, row: 5 },
  'infernal_mage':   { col: 5, row: 0 },
  'ember_bat':       { col: 7, row: 4 },
  'ice_spider':      { col: 6, row: 4 },
  'frost_wraith':    { col: 5, row: 2 },
  'frozen_sentinel': { col: 4, row: 4 },
  'snow_wolf':       { col: 5, row: 4 },
  'ice_mage':        { col: 4, row: 4 },
  'shadow_stalker':  { col: 3, row: 1 },
  'crystal_golem':   { col: 6, row: 1 },
  'demon_lord':      { col: 0, row: 5 },
  'dragon_whelp':    { col: 0, row: 3 },
  'ancient_wyrm':    { col: 2, row: 5 },
  // Wave 2 monsters
  'blood_bat':       { col: 7, row: 3 },  // reuse bat sprite (red tint)
  'plague_rat':      { col: 3, row: 3 },
  'sand_scorpion':   { col: 6, row: 3 },
  'bone_sentinel':   { col: 1, row: 1 },
  'dark_acolyte':    { col: 3, row: 5 },
  'swamp_hag':       { col: 4, row: 5 },
  'thunder_lizard':  { col: 5, row: 5 },
  'stone_gargoyle':  { col: 6, row: 5 },
  'corpse_eater':    { col: 7, row: 5 },
  'void_touched':    { col: 3, row: 4 },
  'flame_dancer':    { col: 0, row: 4 },
  'glacial_beetle':  { col: 4, row: 6 },
  'iron_revenant':   { col: 5, row: 6 },
  'myconid_sprout':  { col: 6, row: 6 },
  'wailing_banshee': { col: 7, row: 6 },
  'obsidian_drake':  { col: 0, row: 3 },  // reuse dragon whelp (dark variant)
  'vile_shaman':     { col: 4, row: 1 },  // reuse goblin shaman sprite
  'blood_golem':     { col: 1, row: 5 },  // reuse magma golem position
  'frost_archer':    { col: 0, row: 1 },  // reuse bone archer sprite
  'abyssal_watcher': { col: 3, row: 2 },  // reuse wraith sprite
  // Mimics
  'mimic':            { col: 6, row: 3 },  // reuse scorpion (chest-like)
  'greater_mimic':    { col: 5, row: 5 },  // reuse thunder lizard
  'ancient_mimic':    { col: 7, row: 5 },  // reuse corpse eater (menacing)
  // Guardians
  'guardian_hoarder':  { col: 0, row: 5 },  // reuse demon lord (massive)
  'guardian_sentinel': { col: 2, row: 5 },  // reuse ancient wyrm
  'guardian_keeper':   { col: 6, row: 2 },  // reuse lich (arcane)
  // Void Emperor
  'void_emperor':     { col: 3, row: 5 },  // reuse dark acolyte
  // Kobold
  'kobold':           { col: 0, row: 3 },  // unused slot
};

// Houses sheet: 12 cols at x=48+col*150, variable row heights
// Each entry: { x, y, w, h } = crop rectangle for first frame of the building type
const HOUSE_CROPS = {
  hut:      { x: 48, y: 37, w: 58, h: 73 },    // Brown peaked cottage
  healer:   { x: 48, y: 637, w: 58, h: 80 },   // Blue stone building
  merchant: { x: 48, y: 1097, w: 58, h: 55 },  // Green shop front
};

// Draw a sprite from a sheet onto a fresh 48x48 canvas
function drawFromSheet(sheet, sx, sy, sw, sh) {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  // Scale source region to fill the 48x48 canvas
  g.drawImage(sheet, sx, sy, sw, sh, 0, 0, S, S);
  return c;
}

// ── Torch animation ─────────────────────────────

let torchFrame = 0;
setInterval(() => {
  if (!gameSettings.torchFlicker) return;
  torchFrame = (torchFrame + 1) % 4;
  // Invalidate torch tile caches so they redraw
  for (const key of Object.keys(tileSeedCache)) {
    if (key.startsWith('torch_')) delete tileSeedCache[key];
  }
}, 150);

export function getTorchFrame() { return torchFrame; }

// ── Utility ─────────────────────────────────────

function makeCanvas() {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  // Pre-scale context so all 32-based coords work at any tile size
  const g = c.getContext('2d');
  g.scale(SC, SC);
  return c;
}

function fillRect(g, x, y, w, h, color) {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
}

function px(g, x, y, color) {
  g.fillStyle = color;
  g.fillRect(x * 2, y * 2, 2, 2);
}

// Draw a simple 16x16 pixel-art sprite (each "pixel" scaled via context transform)
function drawPixels(g, pixels, palette) {
  for (let y = 0; y < pixels.length; y++) {
    const row = pixels[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (color) px(g, x, y, color);
    }
  }
}

// ── Tile Sprite Builders ─────────────────────────

function buildTileSprite(tileType, variant) {
  variant = variant || 0;
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (tileType) {
    case TILE.VOID:
      fillRect(g, 0, 0, 32, 32, '#1a1a2a');
      break;

    case TILE.GRASS:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      g.fillStyle = '#3a7028';
      for (let i = 0; i < 8; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      g.fillStyle = '#245216';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      // Tile variation: flowers, pebbles, tall grass
      if (variant === 1) {
        g.fillStyle = '#e0e040'; g.fillRect(10, 8, 2, 2);
        g.fillStyle = '#e06060'; g.fillRect(22, 18, 2, 2);
      } else if (variant === 2) {
        g.fillStyle = '#1e4a16'; g.fillRect(6, 14, 3, 5);
        g.fillStyle = '#1e4a16'; g.fillRect(20, 6, 2, 6);
        g.fillStyle = '#1e4a16'; g.fillRect(14, 22, 3, 4);
      }
      break;

    case TILE.DIRT:
      fillRect(g, 0, 0, 32, 32, '#6b5230');
      g.fillStyle = '#7a6038';
      for (let i = 0; i < 6; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 3);
      }
      g.fillStyle = '#5a4228';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      // Tile variation: pebbles, cracks
      if (variant === 1) {
        g.fillStyle = '#8a7a60'; g.fillRect(8, 12, 3, 2);
        g.fillStyle = '#8a7a60'; g.fillRect(22, 22, 2, 2);
      } else if (variant === 2) {
        g.strokeStyle = '#4a3220'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(6, 10); g.lineTo(14, 16); g.stroke();
        g.beginPath(); g.moveTo(20, 8); g.lineTo(26, 14); g.stroke();
      }
      break;

    case TILE.HUT:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      if (housesReady) {
        const crop = HOUSE_CROPS.hut;
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.imageSmoothingEnabled = false;
        // Center the house sprite on the grass tile
        const scale = Math.min(S / crop.w, S / crop.h);
        const dw = crop.w * scale, dh = crop.h * scale;
        const dx = (S - dw) / 2, dy = S - dh;
        g.drawImage(housesSheet, crop.x, crop.y, crop.w, crop.h, dx, dy, dw, dh);
        g.restore();
      } else {
        // Fallback hand-drawn hut
        fillRect(g, 4, 8, 24, 20, '#5a3a1a');
        fillRect(g, 6, 10, 20, 16, '#7a5a30');
        fillRect(g, 2, 4, 28, 6, '#8a4a1a');
        fillRect(g, 6, 2, 20, 4, '#9a5a2a');
        fillRect(g, 12, 18, 8, 10, '#3a2010');
        fillRect(g, 20, 14, 4, 4, '#a0c8e0');
      }
      break;

    case TILE.CAVE_ENTRANCE:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Dark cave opening
      fillRect(g, 4, 4, 24, 24, '#3a3a4a');
      fillRect(g, 6, 6, 20, 20, '#1a1a2a');
      fillRect(g, 8, 4, 16, 2, '#4a4a5a');
      // Archway
      fillRect(g, 4, 4, 4, 24, '#5a5a6a');
      fillRect(g, 24, 4, 4, 24, '#5a5a6a');
      fillRect(g, 4, 4, 24, 4, '#6a6a7a');
      break;

    case TILE.CAVE_WALL:
      fillRect(g, 0, 0, 32, 32, '#3a3a4a');
      g.fillStyle = '#44445a';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#2e2e3e';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 3, 3);
      }
      // Tile variation: cracks, mineral veins
      if (variant === 1) {
        g.strokeStyle = '#50506a'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(4, 8); g.lineTo(16, 14); g.lineTo(18, 26); g.stroke();
      } else if (variant === 2) {
        g.fillStyle = '#5a5a7a'; g.fillRect(12, 6, 6, 3);
        g.fillStyle = '#5a5a7a'; g.fillRect(20, 20, 4, 3);
      }
      break;

    case TILE.CAVE_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      g.fillStyle = '#323246';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      g.fillStyle = '#222234';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      // Tile variation: pebbles, small puddle, scratch marks
      if (variant === 1) {
        g.fillStyle = '#3a3a50'; g.fillRect(8, 20, 3, 2);
        g.fillStyle = '#3a3a50'; g.fillRect(22, 10, 2, 2);
        g.fillStyle = '#3a3a50'; g.fillRect(14, 26, 2, 2);
      } else if (variant === 2) {
        g.fillStyle = '#252540'; g.fillRect(10, 14, 6, 4);
        g.fillStyle = '#2a2a48'; g.fillRect(11, 15, 4, 2);
      }
      break;

    case TILE.CAVE_STAIRS:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      // Stairs going down
      fillRect(g, 6, 6, 20, 4, '#6a6a7a');
      fillRect(g, 8, 12, 18, 4, '#5a5a6a');
      fillRect(g, 10, 18, 16, 4, '#4a4a5a');
      fillRect(g, 12, 24, 14, 4, '#3a3a4a');
      // Highlight
      fillRect(g, 6, 6, 20, 2, '#8a8a9a');
      fillRect(g, 8, 12, 18, 2, '#7a7a8a');
      break;

    case TILE.UP_STAIRS:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      // Stairs going up (reversed — wider at bottom)
      fillRect(g, 12, 6, 14, 4, '#3a3a4a');
      fillRect(g, 10, 12, 16, 4, '#4a4a5a');
      fillRect(g, 8, 18, 18, 4, '#5a5a6a');
      fillRect(g, 6, 24, 20, 4, '#6a6a7a');
      // Highlight
      fillRect(g, 8, 18, 18, 2, '#7a7a8a');
      fillRect(g, 6, 24, 20, 2, '#8a8a9a');
      // Up arrow indicator
      fillRect(g, 15, 2, 2, 4, '#aaaacc');
      fillRect(g, 13, 4, 6, 2, '#aaaacc');
      break;

    case TILE.MOSS_WALL:
      fillRect(g, 0, 0, 32, 32, '#2a4a2a');
      g.fillStyle = '#3a5a3a';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#1e3a1e';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 3, 3);
      }
      break;

    case TILE.MOSS_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#1e3a1e');
      g.fillStyle = '#2a4a2a';
      for (let i = 0; i < 6; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      if (variant === 1) {
        g.fillStyle = '#164a16'; g.fillRect(6, 10, 4, 3);
        g.fillStyle = '#164a16'; g.fillRect(22, 24, 3, 2);
      } else if (variant === 2) {
        g.fillStyle = '#3a5a20'; g.fillRect(14, 8, 2, 2);
        g.fillStyle = '#3a5a20'; g.fillRect(8, 22, 2, 2);
      }
      break;

    case TILE.BONE_WALL:
      fillRect(g, 0, 0, 32, 32, '#4a4038');
      g.fillStyle = '#5a5048';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      // Bone accents
      g.fillStyle = '#8a7a6a';
      g.fillRect(8, 14, 6, 2);
      g.fillRect(20, 8, 4, 2);
      break;

    case TILE.BONE_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#2a2420');
      g.fillStyle = '#3a3430';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Small bone fragments - vary by variant
      if (variant === 0) {
        g.fillStyle = '#6a5a4a'; g.fillRect(10, 20, 4, 2); g.fillRect(22, 10, 3, 2);
      } else if (variant === 1) {
        g.fillStyle = '#7a6a5a'; g.fillRect(6, 14, 5, 2); g.fillRect(18, 24, 4, 2);
        g.fillStyle = '#5a4a3a'; g.fillRect(24, 6, 3, 2);
      } else {
        g.fillStyle = '#6a5a4a'; g.fillRect(14, 10, 3, 2);
        g.fillStyle = '#584838'; g.fillRect(8, 24, 6, 2);
      }
      break;

    case TILE.WEB_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      g.fillStyle = '#323246';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Web strands
      g.strokeStyle = 'rgba(200,200,200,0.25)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(32, 32);
      g.moveTo(32, 0); g.lineTo(0, 32);
      g.moveTo(16, 0); g.lineTo(16, 32);
      g.moveTo(0, 16); g.lineTo(32, 16);
      g.stroke();
      break;

    case TILE.LAVA_WALL:
      fillRect(g, 0, 0, 32, 32, '#5a2a1a');
      g.fillStyle = '#6a3a2a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#8a3a0a';
      g.fillRect(10, 16, 4, 3);
      g.fillRect(22, 6, 3, 3);
      break;

    case TILE.LAVA_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#3a1a0a');
      g.fillStyle = '#5a2a1a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Lava glow spots - vary
      if (variant === 0) {
        g.fillStyle = '#aa4a1a'; g.fillRect(8, 12, 3, 2); g.fillRect(20, 22, 4, 2);
      } else if (variant === 1) {
        g.fillStyle = '#cc5a2a'; g.fillRect(14, 8, 4, 3);
        g.fillStyle = '#aa4a1a'; g.fillRect(6, 24, 3, 2);
      } else {
        g.fillStyle = '#aa4a1a'; g.fillRect(22, 10, 3, 3);
        g.fillStyle = '#cc6030'; g.fillRect(10, 20, 5, 3);
      }
      break;

    case TILE.ICE_WALL:
      fillRect(g, 0, 0, 32, 32, '#3a4a6a');
      g.fillStyle = '#4a5a7a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#6a8aaa';
      g.fillRect(6, 10, 3, 2);
      g.fillRect(22, 20, 4, 2);
      break;

    case TILE.ICE_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#2a3a5a');
      g.fillStyle = '#3a4a6a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Ice shine - vary
      if (variant === 0) {
        g.fillStyle = '#5a7aaa'; g.fillRect(14, 8, 2, 2); g.fillRect(6, 22, 2, 2);
      } else if (variant === 1) {
        g.fillStyle = '#6a8aba'; g.fillRect(8, 14, 2, 2);
        g.fillStyle = '#5a7aaa'; g.fillRect(22, 8, 3, 2);
      } else {
        g.strokeStyle = '#4a6a9a'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(6, 6); g.lineTo(12, 12); g.stroke();
        g.beginPath(); g.moveTo(20, 18); g.lineTo(28, 26); g.stroke();
      }
      break;

    // ── New Environment Tiles ──────────────────────
    case TILE.VILLAGE_WALL:
      fillRect(g, 0, 0, 32, 32, '#6a4a2a');
      // Vertical wood planks
      g.fillStyle = '#8a6a3a';
      for (let px = 0; px < 32; px += 6) {
        g.fillRect(px, 0, 4, 32);
      }
      // Nail details
      g.fillStyle = '#4a3a1a';
      g.fillRect(3, 6, 2, 2); g.fillRect(15, 14, 2, 2); g.fillRect(27, 22, 2, 2);
      // Horizontal brace
      g.fillStyle = '#5a3a1a';
      g.fillRect(0, 14, 32, 3);
      break;

    case TILE.VILLAGE_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#9a8060');
      // Pebble accents
      g.fillStyle = '#8a7050';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 3, 2);
      }
      if (variant === 0) {
        g.fillStyle = '#b09070'; g.fillRect(10, 10, 4, 3); g.fillRect(22, 20, 3, 3);
      } else if (variant === 1) {
        g.fillStyle = '#7a6040'; g.fillRect(6, 16, 3, 2); g.fillRect(20, 8, 4, 2);
      } else {
        g.fillStyle = '#a88a68'; g.fillRect(14, 14, 5, 3);
      }
      break;

    case TILE.CHARRED_WALL:
      fillRect(g, 0, 0, 32, 32, '#2a2020');
      g.fillStyle = '#3a2a2a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 5, 4);
      }
      // Ember-glow cracks
      g.fillStyle = '#6a2a0a';
      g.fillRect(8, 12, 1, 8); g.fillRect(20, 6, 1, 10);
      g.fillStyle = '#8a3a0a';
      g.fillRect(14, 20, 6, 1); g.fillRect(4, 8, 4, 1);
      break;

    case TILE.CHARRED_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#3a3030');
      g.fillStyle = '#4a3a3a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      if (variant === 0) {
        g.fillStyle = '#5a2a1a'; g.fillRect(10, 14, 6, 4);
      } else if (variant === 1) {
        g.fillStyle = '#6a3020'; g.fillRect(18, 8, 4, 3);
        g.fillStyle = '#4a2010'; g.fillRect(6, 22, 5, 3);
      } else {
        g.fillStyle = '#5a3020'; g.fillRect(12, 10, 3, 2); g.fillRect(22, 22, 4, 2);
      }
      break;

    case TILE.SWAMP_WALL:
      fillRect(g, 0, 0, 32, 32, '#2a3a1a');
      // Root/vine tangles
      g.fillStyle = '#3a4a2a';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 5);
      }
      g.fillStyle = '#1a2a10';
      g.fillRect(6, 4, 2, 12); g.fillRect(18, 10, 2, 14); g.fillRect(26, 2, 2, 10);
      break;

    case TILE.SWAMP_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#3a3020');
      g.fillStyle = '#4a4030';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      if (variant === 0) {
        g.fillStyle = '#4a4a30'; g.fillRect(8, 12, 8, 6);
      } else if (variant === 1) {
        g.fillStyle = '#3a4020'; g.fillRect(16, 6, 6, 4);
        g.fillStyle = '#4a4a28'; g.fillRect(4, 20, 5, 4);
      } else {
        g.fillStyle = '#3a3818'; g.fillRect(10, 18, 4, 3); g.fillRect(22, 8, 3, 3);
      }
      break;

    case TILE.SHADOW_WALL:
      fillRect(g, 0, 0, 32, 32, '#1a1020');
      g.fillStyle = '#2a1a30';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 5, 4);
      }
      // Purple veins
      g.fillStyle = '#3a1a4a';
      g.fillRect(6, 8, 1, 16); g.fillRect(20, 4, 1, 12);
      g.fillStyle = '#4a2060';
      g.fillRect(12, 20, 8, 1); g.fillRect(2, 14, 6, 1);
      break;

    case TILE.SHADOW_FLOOR:
      fillRect(g, 0, 0, 32, 32, '#2a1a30');
      g.fillStyle = '#3a2a40';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      if (variant === 0) {
        // Faint arcane rune
        g.fillStyle = '#3a2a4a'; g.fillRect(12, 10, 8, 1); g.fillRect(16, 8, 1, 6);
      } else if (variant === 1) {
        g.fillStyle = '#4a2a5a'; g.fillRect(8, 14, 4, 1); g.fillRect(20, 20, 5, 1);
      } else {
        g.fillStyle = '#3a2a4a'; g.fillRect(14, 14, 3, 3);
      }
      break;

    case TILE.PORTAL:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      // Swirling portal
      g.fillStyle = '#6a3aaa';
      g.beginPath();
      g.arc(16, 16, 10, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#8a4aea';
      g.beginPath();
      g.arc(16, 16, 7, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#ba7aff';
      g.beginPath();
      g.arc(16, 16, 4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#eeccff';
      g.beginPath();
      g.arc(16, 16, 2, 0, Math.PI * 2);
      g.fill();
      break;

    case TILE.HEALER:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      if (housesReady) {
        const crop = HOUSE_CROPS.healer;
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.imageSmoothingEnabled = false;
        const scale = Math.min(S / crop.w, S / crop.h);
        const dw = crop.w * scale, dh = crop.h * scale;
        const dx = (S - dw) / 2, dy = S - dh;
        g.drawImage(housesSheet, crop.x, crop.y, crop.w, crop.h, dx, dy, dw, dh);
        g.restore();
        // Red cross overlay to indicate healer
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillStyle = '#e04040';
        g.fillRect(S - 14, 2, 10, 3);
        g.fillRect(S - 10, 0, 3, 8);
        g.restore();
      } else {
        drawPixels(g, [
          '................',
          '......0000......',
          '.....0cccc0.....',
          '.....0ceec0.....',
          '.....0cccc0.....',
          '......0000......',
          '.....0GGGG0.....',
          '....0GGGGGG0....',
          '....0GG00GG0....',
          '....0GGGGGG0....',
          '.....0GGGG0.....',
          '.....0G00G0.....',
          '......0..0......',
          '......0..0......',
          '.....00..00.....',
          '................',
        ], { '0': '#1a1a1a', 'c': '#e8c8a0', 'e': '#2a2a2a', 'G': '#2a8a3a' });
        fillRect(g, 14, 16, 4, 2, '#e04040');
        fillRect(g, 15, 15, 2, 4, '#e04040');
      }
      break;

    case TILE.MERCHANT:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      if (housesReady) {
        const crop = HOUSE_CROPS.merchant;
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.imageSmoothingEnabled = false;
        const scale = Math.min(S / crop.w, S / crop.h);
        const dw = crop.w * scale, dh = crop.h * scale;
        const dx = (S - dw) / 2, dy = S - dh;
        g.drawImage(housesSheet, crop.x, crop.y, crop.w, crop.h, dx, dy, dw, dh);
        g.restore();
        // Gold coin icon to indicate merchant
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillStyle = '#e0c040';
        g.beginPath();
        g.arc(S - 8, 8, 5, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#f0d860';
        g.beginPath();
        g.arc(S - 8, 8, 3, 0, Math.PI * 2);
        g.fill();
        g.restore();
      } else {
        drawPixels(g, [
          '................',
          '......0000......',
          '.....0cccc0.....',
          '.....0ceec0.....',
          '.....0cccc0.....',
          '......0000......',
          '.....0BBBB0.....',
          '....0BBBBBB0....',
          '....0BB00BB0....',
          '....0BBBBBB0....',
          '.....0BBBB0.....',
          '.....0B00B0.....',
          '......0..0......',
          '......0..0......',
          '.....00..00.....',
          '................',
        ], { '0': '#1a1a1a', 'c': '#e8c8a0', 'e': '#2a2a2a', 'B': '#8a6a2a' });
        fillRect(g, 22, 18, 4, 4, '#e0c040');
        fillRect(g, 23, 19, 2, 2, '#f0d860');
      }
      break;

    case TILE.BLACKSMITH:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      if (housesReady) {
        const crop = HOUSE_CROPS.healer;
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.imageSmoothingEnabled = false;
        const scale = Math.min(S / crop.w, S / crop.h);
        const dw = crop.w * scale, dh = crop.h * scale;
        const dx = (S - dw) / 2, dy = S - dh;
        g.drawImage(housesSheet, crop.x, crop.y, crop.w, crop.h, dx, dy, dw, dh);
        g.restore();
        // Anvil icon overlay
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.fillStyle = '#808090';
        g.fillRect(S - 16, 1, 12, 4);
        g.fillRect(S - 14, 5, 8, 3);
        g.fillStyle = '#6a4a2a';
        g.fillRect(S - 11, 8, 2, 4);
        g.restore();
      } else {
        drawPixels(g, [
          '................',
          '......0000......',
          '.....0cccc0.....',
          '.....0ceec0.....',
          '.....0cccc0.....',
          '......0000......',
          '.....0AAAA0.....',
          '....0AAAAAA0....',
          '....0AA00AA0....',
          '....0AAAAAA0....',
          '.....0AAAA0.....',
          '.....0A00A0.....',
          '......0..0......',
          '......0..0......',
          '.....00..00.....',
          '................',
        ], { '0': '#1a1a1a', 'c': '#e8c8a0', 'e': '#2a2a2a', 'A': '#808090' });
        // Anvil on the side
        fillRect(g, 20, 14, 6, 3, '#808090');
        fillRect(g, 21, 17, 4, 2, '#6a6a7a');
      }
      break;

    case TILE.QUEST_BOARD:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Wooden board
      fillRect(g, 6, 4, 20, 18, '#5a3a1a');
      fillRect(g, 7, 5, 18, 16, '#7a5a2a');
      // Posts
      fillRect(g, 10, 20, 3, 10, '#4a2a0a');
      fillRect(g, 19, 20, 3, 10, '#4a2a0a');
      // Paper/quests pinned
      fillRect(g, 9, 7, 6, 5, '#e0d8c0');
      fillRect(g, 17, 7, 6, 5, '#e0d8c0');
      fillRect(g, 13, 13, 6, 5, '#e8e0c8');
      // Pin dots
      fillRect(g, 11, 7, 2, 1, '#c04040');
      fillRect(g, 19, 7, 2, 1, '#c04040');
      fillRect(g, 15, 13, 2, 1, '#c04040');
      break;

    case TILE.PILLAR:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      fillRect(g, 10, 2, 12, 28, '#6a6a7a');
      fillRect(g, 8, 0, 16, 4, '#7a7a8a');
      fillRect(g, 8, 28, 16, 4, '#7a7a8a');
      fillRect(g, 12, 4, 8, 24, '#7e7e8e');
      if (variant === 1) { fillRect(g, 13, 10, 2, 2, '#8e8e9e'); }
      break;

    case TILE.WATER:
      fillRect(g, 0, 0, 32, 32, '#1a3050');
      fillRect(g, 0, 0, 32, 32, '#1e3a5a');
      g.fillStyle = '#2a4a6a';
      g.fillRect(2, 8 + variant * 2, 6, 2);
      g.fillRect(12, 14 + variant, 8, 2);
      g.fillRect(24, 10 + variant * 2, 5, 2);
      g.fillStyle = '#3a5a8a';
      g.fillRect(6, 20, 20, 2);
      g.fillRect(4, 26 - variant, 10, 2);
      if (variant === 2) { g.fillStyle = '#4a7aba'; g.fillRect(16, 6, 4, 2); }
      break;

    case TILE.CARPET:
      fillRect(g, 0, 0, 32, 32, '#6a2020');
      fillRect(g, 2, 2, 28, 28, '#8a3030');
      fillRect(g, 0, 0, 32, 2, '#aa8030');
      fillRect(g, 0, 30, 32, 2, '#aa8030');
      fillRect(g, 0, 0, 2, 32, '#aa8030');
      fillRect(g, 30, 0, 2, 32, '#aa8030');
      if (variant === 0) { fillRect(g, 14, 14, 4, 4, '#7a2828'); }
      if (variant === 1) { fillRect(g, 6, 6, 3, 3, '#7a2828'); fillRect(g, 23, 23, 3, 3, '#7a2828'); }
      if (variant === 2) { fillRect(g, 14, 6, 4, 3, '#7a2828'); fillRect(g, 14, 23, 4, 3, '#7a2828'); }
      break;

    case TILE.RUBBLE:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      g.fillStyle = '#4a4a5a';
      g.fillRect(4, 20, 6, 4);
      g.fillRect(18, 14, 5, 3);
      g.fillRect(10, 26, 4, 3);
      g.fillStyle = '#3a3a4a';
      g.fillRect(22, 22, 6, 5);
      g.fillRect(8, 8, 3, 3);
      if (variant === 1) { g.fillStyle = '#555565'; g.fillRect(14, 18, 3, 3); }
      if (variant === 2) { g.fillStyle = '#4a4a5a'; g.fillRect(2, 12, 4, 3); g.fillRect(26, 6, 3, 4); }
      break;

    case TILE.BARREL:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      fillRect(g, 9, 8, 14, 20, '#6a4a1a');
      fillRect(g, 10, 9, 12, 18, '#7a5a2a');
      fillRect(g, 8, 6, 16, 4, '#5a3a10');
      fillRect(g, 9, 12, 14, 2, '#8a8a8a');
      fillRect(g, 9, 22, 14, 2, '#8a8a8a');
      fillRect(g, 13, 9, 6, 2, '#8a6a2a');
      break;

    case TILE.BOOKSHELF:
      fillRect(g, 0, 0, 32, 32, '#3a2008');
      fillRect(g, 2, 2, 28, 28, '#5a3a1a');
      fillRect(g, 2, 10, 28, 2, '#3a2008');
      fillRect(g, 2, 20, 28, 2, '#3a2008');
      { const bc = ['#a03030','#3030a0','#30a030','#a0a030','#8030a0'];
        for (let row = 0; row < 3; row++) {
          const by = 3 + row * 10;
          for (let b = 0; b < 5; b++) {
            g.fillStyle = bc[(b + variant + row) % bc.length];
            g.fillRect(4 + b * 5, by, 3, 6);
          }
        }
      }
      break;

    case TILE.WEAPON_RACK:
      fillRect(g, 0, 0, 32, 32, '#3a3020');
      fillRect(g, 2, 2, 28, 28, '#4a3a28');
      fillRect(g, 4, 14, 24, 3, '#6a6a6a');
      fillRect(g, 8, 4, 2, 24, '#a0a0b0');
      fillRect(g, 6, 16, 6, 2, '#8a6a2a');
      fillRect(g, 20, 4, 2, 24, '#a0a0b0');
      fillRect(g, 18, 6, 6, 4, '#7a7a8a');
      if (variant === 1) { fillRect(g, 14, 6, 2, 20, '#90909a'); fillRect(g, 12, 16, 6, 2, '#8a6a2a'); }
      break;

    case TILE.SARCOPHAGUS:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      fillRect(g, 6, 4, 20, 24, '#5a5a6a');
      fillRect(g, 8, 6, 16, 20, '#6a6a7a');
      fillRect(g, 10, 8, 12, 6, '#7a7a8a');
      fillRect(g, 14, 10, 4, 2, '#8a8a9a');
      fillRect(g, 15, 9, 2, 4, '#8a8a9a');
      if (variant === 1) { fillRect(g, 10, 18, 12, 2, '#5a5a6a'); }
      if (variant === 2) { fillRect(g, 12, 16, 8, 4, '#7a7a8a'); }
      break;

    case TILE.FOUNTAIN:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      // Basin
      fillRect(g, 6, 14, 20, 14, '#6a6a7a');
      fillRect(g, 8, 16, 16, 10, '#3a6a9a');
      // Column
      fillRect(g, 14, 4, 4, 14, '#7a7a8a');
      // Top basin
      fillRect(g, 10, 2, 12, 4, '#8a8a9a');
      fillRect(g, 12, 3, 8, 2, '#4a8aba');
      // Water sparkle
      if (variant === 0) { fillRect(g, 11, 20, 2, 2, '#6aafda'); }
      if (variant === 1) { fillRect(g, 19, 18, 2, 2, '#6aafda'); }
      if (variant === 2) { fillRect(g, 15, 22, 2, 2, '#6aafda'); }
      break;

    case TILE.DUNGEON_MERCHANT:
      fillRect(g, 0, 0, 32, 32, '#2a2a3a');
      drawPixels(g, [
        '................',
        '......0000......',
        '.....044440.....',
        '.....04ee40.....',
        '.....044440.....',
        '......0000......',
        '.....033330.....',
        '....03333330....',
        '....03300330....',
        '....03333330....',
        '.....033330.....',
        '.....030030.....',
        '......0..0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', '3': '#3a3050', '4': '#4a4060', 'e': '#aaaa40' });
      fillRect(g, 22, 18, 4, 4, '#e0c040');
      fillRect(g, 23, 19, 2, 2, '#f0d860');
      break;

    case TILE.FISHING_SPOT:
      fillRect(g, 0, 0, 32, 32, '#1a3050');
      // Water ripples
      g.fillStyle = '#2a4a6a';
      g.fillRect(2, 8, 6, 2);
      g.fillRect(14, 4, 8, 2);
      g.fillRect(24, 10, 5, 2);
      // Wooden dock
      fillRect(g, 10, 20, 12, 12, '#6a4a1a');
      fillRect(g, 11, 21, 10, 10, '#8a6a2a');
      // Fishing pole
      g.strokeStyle = '#5a3a0a';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(14, 22);
      g.lineTo(8, 6);
      g.stroke();
      // Line + bobber
      g.strokeStyle = '#ccc';
      g.beginPath();
      g.moveTo(8, 6);
      g.lineTo(6, 12);
      g.stroke();
      g.fillStyle = '#e04040';
      g.beginPath();
      g.arc(6, 12, 2, 0, Math.PI * 2);
      g.fill();
      break;

    case TILE.ARENA:
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Stone arena base
      fillRect(g, 6, 4, 20, 18, '#5a5a6a');
      fillRect(g, 7, 5, 18, 16, '#3a3a4a');
      // Crossed swords
      g.strokeStyle = '#c0c0d0';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(10, 16); g.lineTo(22, 6);
      g.moveTo(22, 16); g.lineTo(10, 6);
      g.stroke();
      // Hilts
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(9, 14); g.lineTo(12, 17);
      g.moveTo(21, 14); g.lineTo(18, 17);
      g.stroke();
      break;

    case TILE.FLOOR_WARP: {
      // Green grass base
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Stone plinth
      fillRect(g, 8, 10, 16, 14, '#5a5a6a');
      fillRect(g, 9, 11, 14, 12, '#3a3a4a');
      // Swirling portal circle
      g.strokeStyle = '#44aaff';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(16, 17, 7, 0, Math.PI * 2);
      g.stroke();
      g.strokeStyle = '#88ddff';
      g.lineWidth = 1;
      g.beginPath();
      g.arc(16, 17, 4, 0, Math.PI * 1.3);
      g.stroke();
      // Glow dot in center
      g.fillStyle = '#aaeeff';
      g.beginPath();
      g.arc(16, 17, 2, 0, Math.PI * 2);
      g.fill();
      // Up-arrow above plinth
      g.fillStyle = '#44aaff';
      g.beginPath();
      g.moveTo(16, 3); g.lineTo(21, 8); g.lineTo(11, 8);
      g.closePath();
      g.fill();
      break;
    }

    // ── Village buildings ─────────────────────────
    case TILE.LIBRARY: {
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Stone base
      fillRect(g, 4, 20, 24, 10, '#5a5040');
      // Book-shaped building
      fillRect(g, 6, 10, 20, 12, '#7a6040');
      fillRect(g, 7, 11, 18, 10, '#8a7050');
      // Door
      fillRect(g, 14, 16, 4, 6, '#3a2a10');
      // Windows
      fillRect(g, 8, 12, 4, 4, '#a0c0e0');
      fillRect(g, 20, 12, 4, 4, '#a0c0e0');
      // Roof
      fillRect(g, 5, 6, 22, 4, '#6a5030');
      // Book icon on roof
      fillRect(g, 12, 3, 8, 5, '#c0a060');
      fillRect(g, 13, 4, 6, 3, '#e8d080');
      break;
    }
    case TILE.TAVERN: {
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Stone base
      fillRect(g, 4, 18, 24, 12, '#604030');
      // Main building
      fillRect(g, 5, 10, 22, 10, '#804a2a');
      fillRect(g, 6, 11, 20, 8, '#9a5a30');
      // Door
      fillRect(g, 14, 16, 4, 6, '#3a1a10');
      // Windows - warm glow
      fillRect(g, 7, 12, 5, 4, '#e0b040');
      fillRect(g, 20, 12, 5, 4, '#e0b040');
      // Sign
      fillRect(g, 10, 6, 12, 5, '#7a5020');
      fillRect(g, 11, 7, 10, 3, '#c08030');
      // Roof
      g.fillStyle = '#5a3a20';
      g.beginPath();
      g.moveTo(3 * SC, 10 * SC); g.lineTo(16 * SC, 2 * SC); g.lineTo(29 * SC, 10 * SC);
      g.closePath(); g.fill();
      break;
    }
    case TILE.TRAINING_GROUNDS: {
      fillRect(g, 0, 0, 32, 32, '#3a5a28');
      // Sand floor
      fillRect(g, 4, 18, 24, 12, '#c0a060');
      // Weapon rack
      fillRect(g, 6, 10, 4, 12, '#5a4020');
      fillRect(g, 7, 8, 2, 14, '#8a7040');
      // Sword 1
      fillRect(g, 8, 10, 1, 8, '#a0b0c0');
      fillRect(g, 7, 10, 3, 1, '#c0d0e0');
      // Dummy target
      fillRect(g, 20, 10, 6, 12, '#7a5030');
      fillRect(g, 21, 9, 4, 3, '#a07050');
      // Training circle on ground
      g.strokeStyle = '#a08040';
      g.lineWidth = 1;
      g.beginPath();
      g.arc(16 * SC, 22 * SC, 7 * SC, 0, Math.PI * 2);
      g.stroke();
      // Crossed swords icon above
      g.strokeStyle = '#c0d0e0';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(11 * SC, 4 * SC); g.lineTo(21 * SC, 14 * SC);
      g.stroke();
      g.beginPath();
      g.moveTo(21 * SC, 4 * SC); g.lineTo(11 * SC, 14 * SC);
      g.stroke();
      break;
    }
    case TILE.SHRINE: {
      fillRect(g, 0, 0, 32, 32, '#2d5a1e');
      // Stone platform
      fillRect(g, 6, 24, 20, 6, '#6a6a7a');
      fillRect(g, 8, 22, 16, 2, '#5a5a6a');
      // Pillars
      fillRect(g, 8, 10, 3, 14, '#8a8a9a');
      fillRect(g, 21, 10, 3, 14, '#8a8a9a');
      // Roof
      fillRect(g, 5, 8, 22, 3, '#5a5a6a');
      g.fillStyle = '#4a4a5a';
      g.beginPath();
      g.moveTo(4 * SC, 8 * SC); g.lineTo(16 * SC, 2 * SC); g.lineTo(28 * SC, 8 * SC);
      g.closePath(); g.fill();
      // Sacred flame (center)
      fillRect(g, 14, 16, 4, 6, '#c08020');
      g.fillStyle = '#e0c040';
      g.beginPath();
      g.arc(16 * SC, 16 * SC, 3 * SC, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#ffe080';
      g.beginPath();
      g.arc(16 * SC, 16 * SC, 1.5 * SC, 0, Math.PI * 2);
      g.fill();
      break;
    }
    case TILE.MINI_DUNGEON: {
      fillRect(g, 0, 0, 32, 32, '#1a1a2a');
      // Portal frame
      fillRect(g, 8, 4, 16, 24, '#3a2a50');
      fillRect(g, 9, 5, 14, 22, '#2a1a3a');
      // Portal inner glow
      g.fillStyle = '#8040c0';
      g.beginPath();
      g.ellipse(16 * SC, 16 * SC, 6 * SC, 10 * SC, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#c060e0';
      g.beginPath();
      g.ellipse(16 * SC, 16 * SC, 3 * SC, 6 * SC, 0, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#f0c0ff';
      g.beginPath();
      g.arc(16 * SC, 16 * SC, 1.5 * SC, 0, Math.PI * 2);
      g.fill();
      // Gold frame top
      fillRect(g, 12, 2, 8, 3, '#c0a020');
      // ⚡ lightning bolts
      g.fillStyle = '#ffe040';
      g.font = `${10 * SC}px serif`;
      g.textAlign = 'center';
      g.fillText('⚡', 16 * SC, 30 * SC);
      break;
    }
    case TILE.BEACH_ENTRANCE: {
      // Sandy path leading to the beach - golden sand with footprints
      fillRect(g, 0, 0, 32, 32, '#c8a458');
      // Path texture
      for (let i = 0; i < 8; i++) {
        const px = 2 + (i * 4) % 28, py = 2 + Math.floor(i / 7) * 10 + (i % 3) * 3;
        fillRect(g, px, py, 3, 2, '#b89040');
      }
      // Arrow pointing right
      g.fillStyle = '#8a6820';
      g.font = 'bold 18px sans-serif';
      g.textAlign = 'center';
      g.fillText('→', 16, 20);
      g.textAlign = 'start';
      // "BEACH" label
      g.fillStyle = '#5a3a10';
      g.font = '6px monospace';
      g.textAlign = 'center';
      g.fillText('BEACH', 16, 29);
      g.textAlign = 'start';
      break;
    }
    case TILE.TOWN_ENTRANCE: {
      // Stone gateway leading to town
      fillRect(g, 0, 0, 32, 32, '#8a7a60');
      // Stone arch
      fillRect(g, 2, 4, 5, 24, '#6a5a48');  // left pillar
      fillRect(g, 25, 4, 5, 24, '#6a5a48'); // right pillar
      fillRect(g, 2, 4, 28, 5, '#6a5a48');  // arch top
      // Archway opening
      fillRect(g, 7, 9, 18, 19, '#c8b890');
      // Inner path
      fillRect(g, 11, 9, 10, 19, '#a09070');
      // Town label
      g.fillStyle = '#3a2a18';
      g.font = 'bold 6px monospace';
      g.textAlign = 'center';
      g.fillText('TOWN', 16, 8);
      g.textAlign = 'start';
      break;
    }
    case TILE.BEACH_SAND: {
      // Sandy beach ground
      const sandSeed = (tileX * 7 + tileY * 13) % 6;
      const sandColors = ['#d4b86a', '#c8a858', '#dcc070', '#c4a048', '#cbb060', '#d0b462'];
      fillRect(g, 0, 0, 32, 32, sandColors[sandSeed]);
      // Sand texture dots
      g.fillStyle = sandColors[(sandSeed + 3) % 6];
      for (let i = 0; i < 12; i++) {
        const dx = (i * 7 + tileX * 3) % 28 + 2;
        const dy = (i * 11 + tileY * 5) % 28 + 2;
        fillRect(g, dx, dy, 2, 1, sandColors[(sandSeed + 2) % 6]);
      }
      break;
    }
    case TILE.BEACH_WALL: {
      // Rocky shore / boulders
      fillRect(g, 0, 0, 32, 32, '#7a6a54');
      // Rock faces
      fillRect(g, 2, 2, 14, 12, '#8a7a64');
      fillRect(g, 18, 4, 12, 10, '#8a7a64');
      fillRect(g, 5, 16, 10, 12, '#8a7a64');
      fillRect(g, 20, 18, 10, 10, '#8a7a64');
      // Highlights
      fillRect(g, 2, 2, 14, 2, '#a09080');
      fillRect(g, 18, 4, 12, 2, '#a09080');
      // Shadow
      fillRect(g, 2, 12, 14, 2, '#6a5a44');
      fillRect(g, 18, 12, 12, 2, '#6a5a44');
      break;
    }
    case TILE.VILLAGE_CAVE_EXIT: {
      fillRect(g, 0, 0, 32, 32, '#1a1410');
      // Cave floor
      fillRect(g, 4, 20, 24, 10, '#3a3028');
      // Arrow up (exit indicator)
      g.fillStyle = '#80e0c0';
      g.beginPath();
      g.moveTo(16 * SC, 4 * SC); g.lineTo(24 * SC, 16 * SC); g.lineTo(19 * SC, 16 * SC);
      g.lineTo(19 * SC, 26 * SC); g.lineTo(13 * SC, 26 * SC); g.lineTo(13 * SC, 16 * SC);
      g.lineTo(8 * SC, 16 * SC);
      g.closePath(); g.fill();
      // Text
      g.fillStyle = '#60c0a0';
      g.font = `${8 * SC}px monospace`;
      g.textAlign = 'center';
      g.fillText('EXIT', 16 * SC, 31 * SC);
      break;
    }

    default:
      fillRect(g, 0, 0, 32, 32, '#1a1a2a');
      break;
  }

  return c;
}

// ── Player Sprite Builders ───────────────────────

function buildPlayerSprite(playerClass) {
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (playerClass) {
    case 'warrior':
      if (knightReady) {
        g.imageSmoothingEnabled = false;
        g.drawImage(knightImg, 0, 0, 48, 48, 0, 0, 32, 32);
      } else {
        // Fallback until image loads
        drawPixels(g, [
          '......0000......',
          '.....088880.....',
          '....08888880....',
          '....08cccc80....',
          '....0ceec0c0....',
          '....0cccc0c0....',
          '.....0cc0.......',
          '..s..0BB0.......',
          '..s.0BBBB0......',
          '..s.0B00B0......',
          '..s.0BBBB0......',
          '.....0BB0.......',
          '.....0BB0.......',
          '......00........',
          '.....0..0.......',
          '....00..00......',
        ], { '0': '#1a1a1a', '8': '#8a8a9a', 'c': '#e8c8a0', 'e': '#2a4a8a', 'B': '#3060c0', 's': '#a0a0b0' });
        fillRect(g, 4, 14, 2, 10, '#c0c0d0');
        fillRect(g, 2, 18, 6, 2, '#8a6a2a');
      }
      break;

    case 'mage':
      drawPixels(g, [
        '.....00000......',
        '....0PPPPP0.....',
        '....0P000P0.....',
        '....0cccc0......',
        '....0ceec0......',
        '....0cccc0......',
        '.....0PP0.......',
        '....0PPPP0......',
        '...0PPPPPP0.....',
        '...0PP00PP0.....',
        '...0PPPPPP0.....',
        '....0PPPP0......',
        '.....0PP0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'P': '#6030a0', 'c': '#e8c8a0', 'e': '#2a2a2a' });
      // Staff
      fillRect(g, 24, 6, 2, 18, '#8a6a2a');
      fillRect(g, 22, 4, 6, 4, '#a040e0');
      fillRect(g, 24, 5, 2, 2, '#e0a0ff');
      break;

    case 'archer':
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0cccc0.....',
        '.....0ceec0.....',
        '.....0cccc0.....',
        '......0000......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#2a7030', 'c': '#e8c8a0', 'e': '#2a6a2a' });
      // Bow
      g.strokeStyle = '#8a6a2a';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(26, 16, 8, -1.2, 1.2);
      g.stroke();
      // Bowstring
      g.strokeStyle = '#c0c0c0';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(26, 8);
      g.lineTo(26, 24);
      g.stroke();
      break;

    default:
      fillRect(g, 0, 0, 32, 32, '#c08030');
      break;
  }

  return c;
}

// ── Enemy Sprite Builders ────────────────────────

function buildEnemySprite(entityType) {
  // Try sprite sheet first
  if (jrpgReady && JRPG_MAP[entityType]) {
    const { col, row } = JRPG_MAP[entityType];
    return drawFromSheet(jrpgSheet, col * JRPG_CELL, row * JRPG_CELL, JRPG_CELL, JRPG_CELL);
  }

  // Fallback to hand-drawn pixel art
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (entityType) {
    case ENTITY.GOBLIN:
      drawPixels(g, [
        '................',
        '................',
        '..0..0000..0....',
        '..0.0GGGG0.0....',
        '..000GGGG000....',
        '....0GrrG0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#cc2020' });
      break;

    case ENTITY.ORC:
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '...0GrrrrG0.....',
        '...0GGTTGG0.....',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '..0GGG00GGG0....',
        '..0GGGGGGGG0....',
        '...0GGGGGG0.....',
        '....0GGGG0......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#3a6a1a', 'r': '#cc2020', 'T': '#e8e8c0' });
      break;

    case ENTITY.SKELETON:
      drawPixels(g, [
        '................',
        '......000.......',
        '.....0WWW0......',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '....0.W0W.0.....',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '......0W0.......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'W': '#d0d0c0' });
      break;

    case ENTITY.SPIDER:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '.0..........0...',
        '..0..0000..0....',
        '...00BBBB00.....',
        '.0.0BBBBBB0.0...',
        '..00BrrrrrB00...',
        '...0BBBBBB0.....',
        '.0.0BBBBBB0.0...',
        '..0..0000..0....',
        '.0..........0...',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#6a3a2a', 'r': '#cc2020' });
      break;

    case ENTITY.TROLL:
      drawPixels(g, [
        '....00000.......',
        '...0TTTTT0......',
        '..0TTTTTTT0.....',
        '..0TrrTrrT0.....',
        '..0TTTTTTT0.....',
        '..0TTTTTTT0.....',
        '...0TTTTT0......',
        '..0TTTTTTT0.....',
        '.0TTTTTTTTT0....',
        '.0TTT000TTT0....',
        '.0TTTTTTTTT0....',
        '..0TTTTTTT0.....',
        '...0TTTTT0......',
        '....0T.T0.......',
        '...00..00.......',
        '...00..00.......',
      ], { '0': '#1a1a1a', 'T': '#5a7a3a', 'r': '#aa2020' });
      break;

    case ENTITY.DARK_MAGE:
      drawPixels(g, [
        '.....00000......',
        '....0DDDDD0.....',
        '....0D000D0.....',
        '....0cccc0......',
        '....0c00c0......',
        '....0cccc0......',
        '.....0DD0.......',
        '....0DDDD0......',
        '...0DDDDDD0.....',
        '...0DD00DD0.....',
        '...0DDDDDD0.....',
        '....0DDDD0......',
        '.....0DD0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'D': '#3a1a4a', 'c': '#8a8a9a' });
      // Dark orb
      fillRect(g, 24, 8, 4, 4, '#8a2aaa');
      fillRect(g, 25, 9, 2, 2, '#c060e0');
      break;

    case ENTITY.BAT:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '................',
        '0..........0....',
        '.0........0.....',
        '..00.0000.00....',
        '..0.0BBBB0.0....',
        '....0BrrB0......',
        '....0BBBB0......',
        '.....0..0.......',
        '................',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#4a3a4a', 'r': '#cc2020' });
      break;

    case ENTITY.SLIME:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '................',
        '.....0000.......',
        '....0SSSS0......',
        '...0SSSSSS0.....',
        '...0S0SS0S0.....',
        '...0SSSSSS0.....',
        '..0SSSSSSSS0....',
        '..0SSSSSSSS0....',
        '..0SSSSSSSS0....',
        '...00000000.....',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'S': '#40aa40' });
      // Shine
      fillRect(g, 14, 10, 2, 2, '#80ee80');
      break;

    case ENTITY.WRAITH:
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0WWWW0......',
        '...0WWWWWW0.....',
        '...0W0WW0W0.....',
        '...0WWWWWW0.....',
        '....0WWWW0......',
        '...0WWWWWW0.....',
        '..0WWWWWWWW0....',
        '..0WW0000WW0....',
        '..0WWWWWWWW0....',
        '...0WWWWWW0.....',
        '....0W00W0......',
        '.....0..0.......',
        '......00........',
        '................',
      ], { '0': '#1a1a1a', 'W': '#8a8aaa' });
      // Ghost glow
      g.fillStyle = 'rgba(160,160,200,0.3)';
      g.beginPath();
      g.arc(16, 14, 10, 0, Math.PI * 2);
      g.fill();
      break;

    case ENTITY.GOBLIN_SHAMAN:
      drawPixels(g, [
        '.....00000......',
        '....0PPPPP0.....',
        '....0P000P0.....',
        '....0GGGG0......',
        '....0GrrG0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#cc2020', 'P': '#8a4a8a' });
      // Staff
      fillRect(g, 24, 6, 2, 16, '#6a4a2a');
      fillRect(g, 23, 4, 4, 4, '#aa40aa');
      break;

    case ENTITY.MUSHROOM:
      drawPixels(g, [
        '................',
        '................',
        '.....00000......',
        '....0MMMMM0.....',
        '...0MMwwwMM0....',
        '...0MwMMMwM0....',
        '...0MMMMMMM0....',
        '....0000000.....',
        '......0SS0......',
        '......0SS0......',
        '......0SS0......',
        '.....0SSSS0.....',
        '.....0SSSS0.....',
        '......0000......',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'M': '#aa3030', 'w': '#e0e0c0', 'S': '#c0b090' });
      break;

    case ENTITY.GOBLIN_BERSERKER:
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0GGGG0.....',
        '.....0GrrG0.....',
        '.....0GGGG0.....',
        '......0GG0......',
        '.A...0GGGG0.....',
        '.A..0GGGGGG0....',
        '.A..0GG00GG0....',
        '.A..0GGGGGG0....',
        '.....0GGGG0.....',
        '......0GG0......',
        '......0..0......',
        '.....00..00.....',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'G': '#5a9a2a', 'r': '#ff3030', 'A': '#8a8a9a' });
      // Axe blade
      fillRect(g, 0, 10, 4, 6, '#a0a0b0');
      break;

    // Bosses
    case ENTITY.GOBLIN_WARLORD:
      drawPixels(g, [
        '....000000......',
        '...08888880.....',
        '...0888888000...',
        '..0GGGGGGGG0....',
        '..0GGrrrrGG0....',
        '..0GGTTTTGG0....',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '.0GGGGGGGGGG0...',
        '.0GGG0000GGG0...',
        '.0GGGGGGGGGG0...',
        '..0GGGGGGGG0....',
        '...0GG00GG0.....',
        '....0G..G0......',
        '...00....00.....',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#ff2020', 'T': '#e8e8c0', '8': '#8a8a9a' });
      break;

    case ENTITY.SPIDER_QUEEN:
      drawPixels(g, [
        '0..............0',
        '.0............0.',
        '..0..00000..0...',
        '...00BBBBB00....',
        '.0.0BBBBBBB0.0..',
        '..00BrrrrrB00...',
        '...0BBBBBBB0....',
        '.0.0BBBBBBB0.0..',
        '..0.0BBBBB0.0...',
        '.0...00000...0..',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#8a3a5a', 'r': '#ee2020' });
      // Crown
      fillRect(g, 10, 2, 2, 4, '#e0c040');
      fillRect(g, 14, 0, 2, 4, '#e0c040');
      fillRect(g, 18, 2, 2, 4, '#e0c040');
      break;

    case ENTITY.LICH:
      drawPixels(g, [
        '.....00000......',
        '....0DDDDD0.....',
        '....0D000D0.....',
        '...0WWWWWW0.....',
        '...0W0WW0W0.....',
        '...0WWWWWW0.....',
        '....0WWWW0......',
        '...0DDDDDD0.....',
        '..0DDDDDDDD0....',
        '..0DDD00DDD0....',
        '..0DDDDDDDD0....',
        '...0DDDDDD0.....',
        '....0DD00D0.....',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'D': '#2a1a3a', 'W': '#c0c0a0' });
      // Green eyes
      fillRect(g, 10, 8, 2, 2, '#40ff40');
      fillRect(g, 16, 8, 2, 2, '#40ff40');
      // Staff
      fillRect(g, 26, 4, 2, 20, '#4a3a2a');
      fillRect(g, 24, 2, 6, 4, '#40aa40');
      break;

    case ENTITY.MYCELIUM_LORD:
      drawPixels(g, [
        '....000000......',
        '...0MMMMMM0.....',
        '..0MMwwwwMM0....',
        '..0MwMMMMwM0....',
        '..0MMMMMMMM0....',
        '..0MMMMMMMM0....',
        '...00000000.....',
        '.....0SS0.......',
        '....0SSSS0......',
        '...0SSSSSS0.....',
        '...0SSSSSS0.....',
        '...0SSSSSS0.....',
        '....0SSSS0......',
        '....0SSSS0......',
        '.....0000.......',
        '................',
      ], { '0': '#1a1a1a', 'M': '#8a2a2a', 'w': '#e0e0c0', 'S': '#8a7a50' });
      break;

    case ENTITY.FIRE_ELEMENTAL:
      drawPixels(g, [
        '......00........',
        '.....0FF0.......',
        '....0FFFF0......',
        '...0FFFFFF0.....',
        '...0FYrrYF0.....',
        '...0FFFFFF0.....',
        '....0FFFF0......',
        '...0FFFFFF0.....',
        '..0FFFFFFFF0....',
        '..0FFF00FFF0....',
        '..0FFFFFFFF0....',
        '...0FFFFFF0.....',
        '....0FFFF0......',
        '.....0FF0.......',
        '......00........',
        '................',
      ], { '0': '#1a1a1a', 'F': '#e06020', 'Y': '#ffcc00', 'r': '#ff2020' });
      // Flame glow
      g.fillStyle = 'rgba(255,100,0,0.2)';
      g.beginPath();
      g.arc(16, 16, 12, 0, Math.PI * 2);
      g.fill();
      break;

    case ENTITY.FROST_GIANT:
      drawPixels(g, [
        '...0000000......',
        '..0IIIIIII0.....',
        '..0IIIIIII0.....',
        '.0IIIIIIIII0....',
        '.0IIrrIrrII0....',
        '.0IIIIIIIII0....',
        '.0IIIIIIIII0....',
        '..0IIIIIII0.....',
        '.0IIIIIIIII0....',
        '0IIIIIIIIIII0...',
        '0IIII000IIII0...',
        '0IIIIIIIIIII0...',
        '.0IIIIIIIII0....',
        '..0II0.0II0.....',
        '..00.....00.....',
        '..00.....00.....',
      ], { '0': '#1a1a1a', 'I': '#6a9acc', 'r': '#2040aa' });
      break;

    // ── Goblin Cave theme ──────────────────────────

    case 'goblin_scout':
      drawPixels(g, [
        '................',
        '................',
        '..0..0000..0....',
        '..0.0gggg0.0....',
        '..000gggg000....',
        '....0grrg0......',
        '....0gggg0......',
        '.....0gg0.......',
        '....0gggg0......',
        '....0g00g0......',
        '....0gggg0......',
        '.....0gg0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'g': '#6aaa3a', 'r': '#cc2020' });
      // Torch in hand
      fillRect(g, 24, 8, 2, 12, '#6a4a1a');
      fillRect(g, 23, 4, 4, 5, '#ff8800');
      fillRect(g, 24, 3, 2, 3, '#ffcc00');
      // Torch glow
      g.fillStyle = 'rgba(255,150,0,0.15)';
      g.beginPath();
      g.arc(25, 6, 6, 0, Math.PI * 2);
      g.fill();
      break;

    case 'goblin_chief':
      drawPixels(g, [
        '.....gYgYg......',
        '.....YYYYY......',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '...0GrrrrG0.....',
        '...0GGTTGG0.....',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '..0GGG00GGG0....',
        '..0GGGGGGGG0....',
        '...0GGGGGG0.....',
        '....0GGGG0......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#cc2020', 'T': '#e8e8c0', 'Y': '#e0c040', 'g': '#cc9a20' });
      // Scepter
      fillRect(g, 24, 8, 2, 14, '#8a6a2a');
      fillRect(g, 22, 6, 6, 4, '#e0c040');
      fillRect(g, 24, 7, 2, 2, '#ff4040');
      break;

    // ── Spider Cavern theme ────────────────────────

    case 'cave_crawler':
      drawPixels(g, [
        '................',
        '................',
        '................',
        '0..............0',
        '.0.0......0.0...',
        '..00.0000.00....',
        '..0.0CCCC0.0....',
        '....0CrrC0......',
        '..0.0CCCC0.0....',
        '..00.0000.00....',
        '.0.0......0.0...',
        '0..............0',
        '....0CCCC0......',
        '...0CCCCCC0.....',
        '....000000......',
        '................',
      ], { '0': '#1a1a1a', 'C': '#b87030', 'r': '#ee4020' });
      break;

    case 'venom_spitter':
      drawPixels(g, [
        '................',
        '................',
        '................',
        '.0..........0...',
        '..0..0000..0....',
        '...00PPPP00.....',
        '.0.0PPPPPP0.0...',
        '..00PrrrrrP00...',
        '...0PPPPPP0.....',
        '.0.0PPPPPP0.0...',
        '..0..0000..0....',
        '.0..........0...',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'P': '#7a2a8a', 'r': '#40ff40' });
      // Venom drip
      fillRect(g, 14, 18, 2, 3, '#40ff40');
      fillRect(g, 15, 22, 1, 2, '#30cc30');
      // Toxic glow
      g.fillStyle = 'rgba(80,255,80,0.15)';
      g.beginPath();
      g.arc(16, 14, 10, 0, Math.PI * 2);
      g.fill();
      break;

    case 'cocoon_horror':
      drawPixels(g, [
        '................',
        '.....0cccc0.....',
        '....0cccccc0....',
        '...0cccccccc0...',
        '...0ccWWWWcc0...',
        '...0cWW00WWc0...',
        '...0ccWWWWcc0...',
        '...0cccccccc0...',
        '...0cccccccc0...',
        '....0cccccc0....',
        '....0cccccc0....',
        '.....0cccc0.....',
        '.....0cccc0.....',
        '......0000......',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'c': '#b0a878', 'W': '#c8c0a0' });
      // Arm reaching out
      fillRect(g, 20, 6, 6, 2, '#8a7a6a');
      fillRect(g, 24, 4, 4, 2, '#8a7a6a');
      fillRect(g, 26, 2, 2, 4, '#8a7a6a');
      // Red eyes peeking
      fillRect(g, 12, 10, 2, 2, '#ff2020');
      fillRect(g, 18, 10, 2, 2, '#ff2020');
      break;

    // ── Crypt theme ────────────────────────────────

    case 'zombie':
      drawPixels(g, [
        '................',
        '......000.......',
        '.....0ZZZ0......',
        '....0ZZZZZ0.....',
        '....0ZrZrZ0.....',
        '....0ZZZZZ0.....',
        '.....0ZZZ0......',
        '....0ZZZZZ0.....',
        '...0ZZZZZZZ0....',
        '...0ZZZ0ZZZ0....',
        '...0ZZZZZZZ0....',
        '....0ZZZZZ0.....',
        '.....0ZZZ0......',
        '.....0Z.Z0......',
        '....00...00.....',
        '................',
      ], { '0': '#1a1a1a', 'Z': '#6a7a5a', 'r': '#aa3030' });
      // Tattered flesh accents
      fillRect(g, 8, 16, 2, 3, '#8a4a4a');
      fillRect(g, 22, 14, 2, 4, '#8a4a4a');
      break;

    case 'bone_archer':
      drawPixels(g, [
        '................',
        '......000.......',
        '.....0WWW0......',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '....0.W0W.0.....',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '......0W0.......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'W': '#d0d0c0' });
      // Bow
      g.strokeStyle = '#8a6a2a';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(26, 16, 8, -1.2, 1.2);
      g.stroke();
      // Bowstring
      g.strokeStyle = '#c0c0c0';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(26, 8);
      g.lineTo(26, 24);
      g.stroke();
      // Arrow nocked
      fillRect(g, 16, 15, 12, 2, '#8a6a2a');
      fillRect(g, 26, 14, 3, 4, '#a0a0b0');
      break;

    case 'phantom':
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0pppp0......',
        '...0pppppp0.....',
        '...0p0pp0p0.....',
        '...0pppppp0.....',
        '....0pppp0......',
        '...0pppppp0.....',
        '..0pppppppp0....',
        '..0pp0000pp0....',
        '..0pppppppp0....',
        '...0pppppp0.....',
        '....0p00p0......',
        '.....0..0.......',
        '......00........',
        '................',
      ], { '0': 'rgba(100,120,180,0.6)', 'p': 'rgba(160,180,220,0.45)' });
      // Ghostly glow
      g.fillStyle = 'rgba(140,160,220,0.2)';
      g.beginPath();
      g.arc(16, 14, 12, 0, Math.PI * 2);
      g.fill();
      // Glowing eyes
      fillRect(g, 10, 8, 2, 2, '#aaccff');
      fillRect(g, 16, 8, 2, 2, '#aaccff');
      break;

    case 'death_knight':
      drawPixels(g, [
        '......0000......',
        '.....0AAAA0.....',
        '....0AAAAAA0....',
        '....0ArrrrA0....',
        '....0AAAAAA0....',
        '.....0AAAA0.....',
        '....0DDDDDD0....',
        '...0DDDDDDDD0...',
        '...0DDD00DDD0...',
        '...0DDDDDDDD0...',
        '....0DDDDDD0....',
        '.....0DDDD0.....',
        '......0DD0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', 'A': '#5a4a6a', 'D': '#3a2a4a', 'r': '#cc20cc' });
      // Dark sword
      fillRect(g, 2, 6, 2, 16, '#6a5a7a');
      fillRect(g, 0, 14, 6, 2, '#5a4a6a');
      fillRect(g, 2, 4, 2, 4, '#8a2aaa');
      // Shield
      fillRect(g, 24, 10, 6, 8, '#4a3a5a');
      fillRect(g, 25, 11, 4, 6, '#5a4a6a');
      fillRect(g, 26, 13, 2, 2, '#cc20cc');
      break;

    case 'necromancer':
      drawPixels(g, [
        '.....00000......',
        '....0DDDDD0.....',
        '....0D000D0.....',
        '....0cccc0......',
        '....0c00c0......',
        '....0cccc0......',
        '.....0DD0.......',
        '....0DDDD0......',
        '...0DDDDDD0.....',
        '...0DD00DD0.....',
        '...0DDDDDD0.....',
        '....0DDDD0......',
        '.....0DD0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'D': '#2a1a2a', 'c': '#7a7a6a' });
      // Skull staff
      fillRect(g, 24, 4, 2, 20, '#5a4a3a');
      fillRect(g, 22, 2, 6, 5, '#d0d0b0');
      fillRect(g, 23, 3, 1, 1, '#1a1a1a');
      fillRect(g, 26, 3, 1, 1, '#1a1a1a');
      fillRect(g, 23, 5, 4, 1, '#1a1a1a');
      // Green necro glow
      g.fillStyle = 'rgba(0,200,60,0.2)';
      g.beginPath();
      g.arc(25, 5, 6, 0, Math.PI * 2);
      g.fill();
      break;

    // ── Mushroom Grotto theme ──────────────────────

    case 'spore_walker':
      drawPixels(g, [
        '................',
        '................',
        '.....00000......',
        '....0MMMMM0.....',
        '...0MMwwwMM0....',
        '...0MwMMMwM0....',
        '...0MMMMMMM0....',
        '....0000000.....',
        '......0SS0......',
        '.....0SSSS0.....',
        '.....0S00S0.....',
        '.....0SSSS0.....',
        '......0SS0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', 'M': '#cc7030', 'w': '#e8d8a0', 'S': '#a09060' });
      // Spore puffs
      g.fillStyle = 'rgba(200,180,80,0.25)';
      g.beginPath();
      g.arc(8, 6, 3, 0, Math.PI * 2);
      g.fill();
      g.beginPath();
      g.arc(22, 4, 2, 0, Math.PI * 2);
      g.fill();
      break;

    case 'toxic_toad':
      drawPixels(g, [
        '................',
        '................',
        '................',
        '..00......00....',
        '.0TT0....0TT0...',
        '.0ee0....0ee0...',
        '..0TTTTTTTT0....',
        '.0TTTTTTTTTT0...',
        '0TTTTTTTTTTTT0..',
        '0TTTTTTTTTTTT0..',
        '0TwTTTTTTTwTT0..',
        '.0TTTTTTTTTT0...',
        '..0TTTTTTTT0....',
        '..0T00TT00T0....',
        '..00..00..00....',
        '................',
      ], { '0': '#1a1a1a', 'T': '#3a8a2a', 'e': '#ffff40', 'w': '#2a6a1a' });
      // Poison drip
      fillRect(g, 12, 22, 2, 3, '#80ff40');
      break;

    case 'vine_lurker':
      drawPixels(g, [
        '..0.......0.....',
        '.0V0.....0V0....',
        '.0VV0...0VV0....',
        '..0VV0.0VV0.....',
        '...0VVVVV0......',
        '..0VVVVVVV0.....',
        '..0VV0r0VV0.....',
        '..0VVVVVVV0.....',
        '..0VVVVVVV0.....',
        '...0VVVVV0......',
        '..0VV0.0VV0.....',
        '.0VV0...0VV0....',
        '.0V0.....0V0....',
        '..0.......0.....',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'V': '#2a6a1a', 'r': '#cc2020' });
      // Thorns
      fillRect(g, 6, 8, 2, 2, '#4a2a0a');
      fillRect(g, 22, 10, 2, 2, '#4a2a0a');
      fillRect(g, 10, 14, 2, 2, '#4a2a0a');
      break;

    case 'moss_golem':
      drawPixels(g, [
        '................',
        '....000000......',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '..0GGrrGrrG0....',
        '..0GGGGGGGG0....',
        '..0GGGGGGGG0....',
        '...0GGGGGG0.....',
        '..0SSSSSSSS0....',
        '.0SSSSSSSSSS0...',
        '.0SSS0000SSS0...',
        '.0SSSSSSSSSS0...',
        '..0SSSSSSSS0....',
        '..0SS0..0SS0....',
        '..00......00....',
        '..00......00....',
      ], { '0': '#1a1a1a', 'G': '#3a7a2a', 'S': '#6a6a5a', 'r': '#80ff40' });
      // Moss patches
      fillRect(g, 6, 18, 3, 2, '#2a5a1a');
      fillRect(g, 20, 20, 4, 2, '#2a5a1a');
      fillRect(g, 12, 22, 3, 2, '#2a5a1a');
      break;

    // ── Scorched Depths theme ──────────────────────

    case 'fire_imp':
      drawPixels(g, [
        '................',
        '.0..........0...',
        '.00..0000..00...',
        '..0.0RRRR0.0...',
        '....0RRRR0......',
        '....0RrrR0......',
        '....0RRRR0......',
        '.....0RR0.......',
        '....0RRRR0......',
        '....0R00R0......',
        '....0RRRR0......',
        '.....0RR0.......',
        '......00........',
        '.....0..0.......',
        '....0....0......',
        '................',
      ], { '0': '#1a1a1a', 'R': '#cc3020', 'r': '#ff8800' });
      // Wings
      fillRect(g, 2, 4, 4, 6, '#aa2010');
      fillRect(g, 24, 4, 4, 6, '#aa2010');
      // Tail
      fillRect(g, 14, 26, 2, 4, '#aa2010');
      fillRect(g, 16, 28, 2, 2, '#cc3020');
      break;

    case 'lava_hound':
      drawPixels(g, [
        '................',
        '................',
        '.....00..........',
        '....0RR0..000...',
        '...0RRRR00RRR0..',
        '...0RrrR0RRRRR0.',
        '...0RRRRRRRRRR0.',
        '....0RRRRRRRR0..',
        '....0RRRRRRRR0..',
        '....0RRRRRRRR0..',
        '....0R00R00RR0..',
        '....00..0..000..',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'R': '#cc4010', 'r': '#ff8800' });
      // Lava cracks glow
      fillRect(g, 12, 16, 2, 2, '#ffcc00');
      fillRect(g, 18, 14, 2, 2, '#ffcc00');
      fillRect(g, 14, 18, 3, 1, '#ff8800');
      // Heat glow
      g.fillStyle = 'rgba(255,80,0,0.15)';
      g.beginPath();
      g.arc(16, 14, 10, 0, Math.PI * 2);
      g.fill();
      break;

    case 'ash_wraith':
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0AAAA0......',
        '...0AAAAAA0.....',
        '...0A0AA0A0.....',
        '...0AAAAAA0.....',
        '....0AAAA0......',
        '...0AAAAAA0.....',
        '..0AAAAAAAA0....',
        '..0AA0000AA0....',
        '..0AAAAAAAA0....',
        '...0AAAAAA0.....',
        '....0A00A0......',
        '.....0..0.......',
        '......00........',
        '................',
      ], { '0': '#2a2a2a', 'A': '#6a6a6a' });
      // Fire eyes
      fillRect(g, 10, 8, 2, 2, '#ff4400');
      fillRect(g, 16, 8, 2, 2, '#ff4400');
      // Ashen glow
      g.fillStyle = 'rgba(200,100,20,0.15)';
      g.beginPath();
      g.arc(16, 14, 10, 0, Math.PI * 2);
      g.fill();
      break;

    case 'magma_golem':
      drawPixels(g, [
        '....000000......',
        '...0SSSSSS0.....',
        '..0SSSSSSSS0....',
        '..0SSrrSSrrS0...',
        '..0SSSSSSSS0....',
        '..0SSSSSSSS0....',
        '...0SSSSSS0.....',
        '..0SSSSSSSS0....',
        '.0SSSSSSSSSS0...',
        '.0SSS0000SSS0...',
        '.0SSSSSSSSSS0...',
        '..0SSSSSSSS0....',
        '...0SSSSSS0.....',
        '...0SS0.0SS0....',
        '..00.....00.....',
        '..00.....00.....',
      ], { '0': '#1a1a1a', 'S': '#5a4a3a', 'r': '#ff4400' });
      // Lava crack lines
      fillRect(g, 8, 12, 2, 6, '#ff6600');
      fillRect(g, 14, 10, 4, 2, '#ff8800');
      fillRect(g, 20, 14, 2, 4, '#ff6600');
      fillRect(g, 10, 20, 6, 2, '#ffaa00');
      // Heat glow
      g.fillStyle = 'rgba(255,100,0,0.15)';
      g.beginPath();
      g.arc(16, 16, 14, 0, Math.PI * 2);
      g.fill();
      break;

    case 'infernal_mage':
      drawPixels(g, [
        '....000000......',
        '...0RRRRRR0.....',
        '...0R0000R0.....',
        '...0cccccc0.....',
        '...0c0cc0c0.....',
        '...0cccccc0.....',
        '....0cccc0......',
        '...0RRRRRR0.....',
        '..0RRRRRRRR0....',
        '..0RRR00RRR0....',
        '..0RRRRRRRR0....',
        '...0RRRRRR0.....',
        '....0RRRR0......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'R': '#8a1a1a', 'c': '#cc4040' });
      // Fire staff
      fillRect(g, 24, 6, 2, 18, '#4a2a0a');
      fillRect(g, 22, 2, 6, 6, '#ff4400');
      fillRect(g, 24, 3, 2, 3, '#ffcc00');
      // Staff glow
      g.fillStyle = 'rgba(255,100,0,0.2)';
      g.beginPath();
      g.arc(25, 5, 5, 0, Math.PI * 2);
      g.fill();
      break;

    case 'ember_bat':
      drawPixels(g, [
        '................',
        '................',
        '................',
        '................',
        '0..........0....',
        '.0........0.....',
        '..00.0000.00....',
        '..0.0RRRR0.0....',
        '....0RrrR0......',
        '....0RRRR0......',
        '.....0..0.......',
        '................',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'R': '#cc4020', 'r': '#ff8800' });
      // Wing fire tips
      fillRect(g, 0, 8, 2, 2, '#ff6600');
      fillRect(g, 26, 8, 2, 2, '#ff6600');
      // Fire glow
      g.fillStyle = 'rgba(255,100,0,0.15)';
      g.beginPath();
      g.arc(16, 14, 8, 0, Math.PI * 2);
      g.fill();
      break;

    // ── Frozen Halls theme ─────────────────────────

    case 'ice_spider':
      drawPixels(g, [
        '................',
        '................',
        '................',
        '.0..........0...',
        '..0..0000..0....',
        '...00IIII00.....',
        '.0.0IIIIII0.0...',
        '..00IwwwwI00....',
        '...0IIIIII0.....',
        '.0.0IIIIII0.0...',
        '..0..0000..0....',
        '.0..........0...',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'I': '#8ab8e0', 'w': '#d0e8ff' });
      // Ice shine
      fillRect(g, 14, 12, 2, 2, '#e0f0ff');
      break;

    case 'frost_wraith':
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0IIII0......',
        '...0IIIIII0.....',
        '...0I0II0I0.....',
        '...0IIIIII0.....',
        '....0IIII0......',
        '...0IIIIII0.....',
        '..0IIIIIIII0....',
        '..0II0000II0....',
        '..0IIIIIIII0....',
        '...0IIIIII0.....',
        '....0I00I0......',
        '.....0..0.......',
        '......00........',
        '................',
      ], { '0': 'rgba(80,120,180,0.6)', 'I': 'rgba(160,200,240,0.45)' });
      // Ice glow
      g.fillStyle = 'rgba(100,180,255,0.2)';
      g.beginPath();
      g.arc(16, 14, 12, 0, Math.PI * 2);
      g.fill();
      // Cold eyes
      fillRect(g, 10, 8, 2, 2, '#80ccff');
      fillRect(g, 16, 8, 2, 2, '#80ccff');
      break;

    case 'frozen_sentinel':
      drawPixels(g, [
        '......0000......',
        '.....0IIII0.....',
        '....0IIIIII0....',
        '....0IrrrrI0....',
        '....0IIIIII0....',
        '.....0IIII0.....',
        '....0AAAAAA0....',
        '...0AAAAAAAA0...',
        '...0AAA00AAA0...',
        '...0AAAAAAAA0...',
        '....0AAAAAA0....',
        '.....0AAAA0.....',
        '......0AA0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', 'I': '#6a9acc', 'A': '#4a6a8a', 'r': '#3060cc' });
      // Ice sword
      fillRect(g, 2, 6, 2, 16, '#8ab8e0');
      fillRect(g, 0, 14, 6, 2, '#6a9acc');
      fillRect(g, 2, 4, 2, 4, '#d0e8ff');
      // Ice shield
      fillRect(g, 24, 10, 6, 8, '#6a9acc');
      fillRect(g, 25, 11, 4, 6, '#8ab8e0');
      break;

    case 'snow_wolf':
      drawPixels(g, [
        '................',
        '................',
        '..00............',
        '.0WW0...000.....',
        '.0WW00.0WWW0....',
        '..0We0.0WWWWW0..',
        '..0WW00WWWWWW0..',
        '...0WWWWWWWWW0..',
        '...0WWWWWWWWW0..',
        '...0WWWWWWWWW0..',
        '...0WW0WW0WWW0..',
        '...00..00..000..',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'W': '#d8d8e8', 'e': '#3060aa' });
      // Frosty breath
      g.fillStyle = 'rgba(160,200,255,0.2)';
      g.beginPath();
      g.arc(4, 12, 4, 0, Math.PI * 2);
      g.fill();
      break;

    case 'ice_mage':
      drawPixels(g, [
        '.....00000......',
        '....0IIIII0.....',
        '....0I000I0.....',
        '....0cccc0......',
        '....0c00c0......',
        '....0cccc0......',
        '.....0II0.......',
        '....0IIII0......',
        '...0IIIIII0.....',
        '...0II00II0.....',
        '...0IIIIII0.....',
        '....0IIII0......',
        '.....0II0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'I': '#3060aa', 'c': '#a0b8d0' });
      // Ice staff
      fillRect(g, 24, 6, 2, 18, '#6a8aaa');
      fillRect(g, 22, 2, 6, 6, '#80ccff');
      fillRect(g, 24, 3, 2, 3, '#d0e8ff');
      // Ice staff glow
      g.fillStyle = 'rgba(100,180,255,0.2)';
      g.beginPath();
      g.arc(25, 5, 5, 0, Math.PI * 2);
      g.fill();
      break;

    // ── Deep / Universal (high floors) ─────────────

    case 'shadow_stalker':
      drawPixels(g, [
        '................',
        '......000.......',
        '.....0SSS0......',
        '....0SSSSS0.....',
        '....0S0S0S0.....',
        '....0SSSSS0.....',
        '.....0SSS0......',
        '....0SSSSS0.....',
        '...0SSSSSSS0....',
        '...0SSS0SSS0....',
        '...0SSSSSSS0....',
        '....0SSSSS0.....',
        '.....0SSS0......',
        '.....0S.S0......',
        '....00...00.....',
        '................',
      ], { '0': '#0a0a0a', 'S': '#1a1a2a' });
      // Faint red eyes
      fillRect(g, 10, 8, 2, 2, '#aa2040');
      fillRect(g, 16, 8, 2, 2, '#aa2040');
      // Shadow aura
      g.fillStyle = 'rgba(10,10,30,0.3)';
      g.beginPath();
      g.arc(16, 14, 12, 0, Math.PI * 2);
      g.fill();
      break;

    case 'crystal_golem':
      drawPixels(g, [
        '....000000......',
        '...0CCCCCC0.....',
        '..0CCCCCCCC0....',
        '..0CChhCChhC0...',
        '..0CCCCCCCC0....',
        '..0CCCCCCCC0....',
        '...0CCCCCC0.....',
        '..0CCCCCCCC0....',
        '.0CCCCCCCCCC0...',
        '.0CCC0000CCC0...',
        '.0CCCCCCCCCC0...',
        '..0CCCCCCCC0....',
        '...0CCCCCC0.....',
        '...0CC0.0CC0....',
        '..00.....00.....',
        '..00.....00.....',
      ], { '0': '#1a1a1a', 'C': '#8ab0d8', 'h': '#d0e8ff' });
      // Crystal shine
      fillRect(g, 10, 6, 2, 2, '#ffffff');
      fillRect(g, 20, 10, 2, 2, '#e0f0ff');
      fillRect(g, 8, 18, 2, 2, '#d0e0ff');
      // Crystal glow
      g.fillStyle = 'rgba(140,180,220,0.15)';
      g.beginPath();
      g.arc(16, 16, 14, 0, Math.PI * 2);
      g.fill();
      break;

    case 'demon_lord':
      drawPixels(g, [
        '..h0....0h......',
        '..h0....0h......',
        '..0RRRRRR0......',
        '.0RRRRRRRR0.....',
        '.0RRrrrrRR0.....',
        '.0RRRRRRRRR0....',
        '..0RRRRRR0......',
        '.0RRRRRRRR0.....',
        '0RRRRRRRRRR0....',
        '0RRRR00RRRR0....',
        '0RRRRRRRRRR0....',
        '.0RRRRRRRR0.....',
        '..0RRRRRR0......',
        '..0RR0.0RR0.....',
        '.00......00.....',
        '.00......00.....',
      ], { '0': '#1a1a1a', 'R': '#aa2020', 'r': '#ff6600', 'h': '#cc1010' });
      // Horns accents
      fillRect(g, 4, 0, 2, 4, '#cc1010');
      fillRect(g, 18, 0, 2, 4, '#cc1010');
      // Demonic glow
      g.fillStyle = 'rgba(255,40,0,0.2)';
      g.beginPath();
      g.arc(16, 16, 14, 0, Math.PI * 2);
      g.fill();
      // Fire eyes
      fillRect(g, 8, 8, 2, 2, '#ffcc00');
      fillRect(g, 16, 8, 2, 2, '#ffcc00');
      break;

    case 'dragon_whelp':
      drawPixels(g, [
        '................',
        '..00............',
        '.0GG0..000......',
        '.0GG0.0GGG0.....',
        '..0G00GGGGG0....',
        '..0GrrGGGGG0....',
        '...0GGGGGGG0....',
        '...0GGGGGGG0....',
        '.WW0GGGGGGG0WW..',
        '.W0GGGGGGGGG0W..',
        '..0GGGGGGGGG0...',
        '...0GGGGGGG0....',
        '...0G00G00G0....',
        '...00..0..00....',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'G': '#2a8a3a', 'r': '#ff8800', 'W': '#3a6a2a' });
      // Small flame breath
      fillRect(g, 2, 6, 3, 2, '#ff6600');
      fillRect(g, 0, 7, 2, 1, '#ffcc00');
      break;

    case 'ancient_wyrm':
      drawPixels(g, [
        '..hh........hh..',
        '..hh........hh..',
        '..0RRRRRRRRRR0..',
        '.0RRRRRRRRRRRR0.',
        '.0RRrrRRRRrrRR0.',
        '.0RRRRRRRRRRRR0.',
        '.0RRRRRmmRRRRR0.',
        '..0RRRRRRRRRR0..',
        '...0RRRRRRRR0...',
        '....0RRRRRR0....',
        '.....0RRRR0.....',
        '......0RR0......',
        '.......00.......',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'R': '#8a2020', 'r': '#ff4400', 'h': '#aa1010', 'm': '#e8e0c0' });
      // Horns
      fillRect(g, 4, 0, 2, 4, '#aa1010');
      fillRect(g, 26, 0, 2, 4, '#aa1010');
      // Flame breath
      fillRect(g, 12, 24, 8, 3, '#ff6600');
      fillRect(g, 14, 26, 4, 3, '#ffaa00');
      fillRect(g, 15, 28, 2, 2, '#ffcc00');
      // Dragon fire glow
      g.fillStyle = 'rgba(255,60,0,0.2)';
      g.beginPath();
      g.arc(16, 10, 14, 0, Math.PI * 2);
      g.fill();
      // Glowing eyes
      fillRect(g, 6, 8, 3, 2, '#ff4400');
      fillRect(g, 22, 8, 3, 2, '#ff4400');
      break;

    case ENTITY.VOID_EMPEROR:
      // Dark void entity with glowing purple aura
      g.fillStyle = 'rgba(80,0,120,0.3)';
      g.beginPath();
      g.arc(16, 16, 15, 0, Math.PI * 2);
      g.fill();
      // Body - dark void
      fillRect(g, 8, 4, 16, 22, '#1a0030');
      fillRect(g, 10, 6, 12, 18, '#2a0050');
      // Crown
      fillRect(g, 10, 2, 2, 4, '#8040c0');
      fillRect(g, 14, 1, 4, 3, '#a060e0');
      fillRect(g, 20, 2, 2, 4, '#8040c0');
      // Eyes - glowing void
      fillRect(g, 11, 10, 3, 2, '#c060ff');
      fillRect(g, 18, 10, 3, 2, '#c060ff');
      // Shadow tendrils
      fillRect(g, 4, 14, 4, 2, '#3a0060');
      fillRect(g, 24, 14, 4, 2, '#3a0060');
      fillRect(g, 2, 18, 4, 2, '#2a0040');
      fillRect(g, 26, 18, 4, 2, '#2a0040');
      break;

    default:
      // Generic enemy
      fillRect(g, 0, 0, 32, 32, '#a03030');
      fillRect(g, 8, 8, 16, 16, '#c04040');
      break;
  }

  // Disable scaling for non-builder callers getting context later
  return c;
}

// ── Item Sprites ─────────────────────────────────

function buildItemSprite(iconCode) {
  const c = makeCanvas();
  const g = c.getContext('2d');
  const code = iconCode.toUpperCase();

  // Weapons
  if (code === 'W1' || code === 'W2' || code === 'W3') {
    // Sword
    const colors = { W1: '#9a9a9a', W2: '#b0b0c0', W3: '#d0d0e0' };
    const bladeColor = colors[code] || '#a0a0a0';
    fillRect(g, 14, 2, 4, 20, bladeColor);
    fillRect(g, 15, 2, 2, 2, '#e0e0ff');
    fillRect(g, 8, 22, 16, 3, '#8a6a2a');
    fillRect(g, 14, 24, 4, 6, '#6a4a1a');
    return c;
  }

  if (code === 'WS' || code === 'WF') {
    // Staff
    const orbColor = code === 'WS' ? '#e04020' : '#60c0ff';
    fillRect(g, 15, 4, 2, 22, '#8a6a2a');
    g.fillStyle = orbColor;
    g.beginPath();
    g.arc(16, 6, 4, 0, Math.PI * 2);
    g.fill();
    fillRect(g, 15, 5, 2, 2, '#ffffff80');
    return c;
  }

  if (code === 'WA' || code === 'WC') {
    // Axe / Club
    fillRect(g, 14, 6, 3, 20, '#8a6a2a');
    if (code === 'WA') {
      fillRect(g, 8, 4, 10, 8, '#a0a0b0');
      fillRect(g, 9, 5, 8, 6, '#b0b0c0');
    } else {
      fillRect(g, 10, 4, 8, 8, '#6a5a4a');
    }
    return c;
  }

  if (code === 'WD') {
    // Dagger
    fillRect(g, 14, 6, 3, 14, '#a0a0b0');
    fillRect(g, 15, 6, 1, 2, '#d0d0e0');
    fillRect(g, 10, 20, 12, 3, '#8a6a2a');
    fillRect(g, 14, 22, 3, 6, '#6a4a1a');
    return c;
  }

  if (code === 'WB') {
    // Bow
    g.strokeStyle = '#8a6a2a';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(16, 16, 10, -1.4, 1.4);
    g.stroke();
    g.strokeStyle = '#c0c0c0';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(20, 6);
    g.lineTo(20, 26);
    g.stroke();
    return c;
  }

  // Helmets
  if (code === 'H1' || code === 'H2' || code === 'H3') {
    const colors = { H1: '#8a6a3a', H2: '#8a8a9a', H3: '#c0c0b0' };
    const col = colors[code];
    fillRect(g, 6, 8, 20, 16, col);
    fillRect(g, 8, 6, 16, 4, col);
    fillRect(g, 10, 16, 12, 6, '#1a1a2a');
    if (code === 'H3') {
      fillRect(g, 8, 6, 16, 2, '#e0c040');
    }
    return c;
  }

  // Chest armor
  if (code === 'C1' || code === 'C2' || code === 'C3' || code === 'CR') {
    const colors = { C1: '#8a6a3a', C2: '#7a7a8a', C3: '#9a9aaa', CR: '#4060a0' };
    const col = colors[code];
    fillRect(g, 6, 4, 20, 22, col);
    fillRect(g, 10, 4, 12, 4, col);
    fillRect(g, 14, 8, 4, 14, '#00000030');
    fillRect(g, 4, 8, 4, 12, col);
    fillRect(g, 24, 8, 4, 12, col);
    return c;
  }

  // Gloves
  if (code === 'G1' || code === 'G2' || code === 'G3') {
    const colors = { G1: '#8a6a3a', G2: '#7a7a8a', G3: '#8a8a9a' };
    const col = colors[code];
    fillRect(g, 8, 6, 16, 20, col);
    fillRect(g, 6, 10, 4, 8, col);
    fillRect(g, 22, 10, 4, 8, col);
    fillRect(g, 10, 4, 4, 4, col);
    fillRect(g, 14, 4, 4, 4, col);
    fillRect(g, 18, 4, 4, 4, col);
    return c;
  }

  // Boots
  if (code === 'B1' || code === 'B2' || code === 'B3') {
    const colors = { B1: '#a08060', B2: '#8a6a3a', B3: '#7a7a8a' };
    const col = colors[code];
    fillRect(g, 6, 6, 8, 18, col);
    fillRect(g, 18, 6, 8, 18, col);
    fillRect(g, 4, 22, 12, 4, col);
    fillRect(g, 16, 22, 12, 4, col);
    return c;
  }

  // Capes
  if (code === 'K1' || code === 'K2' || code === 'KF') {
    const colors = { K1: '#6a5a4a', K2: '#3a3a5a', KF: '#8a3a1a' };
    const col = colors[code];
    fillRect(g, 6, 2, 20, 4, col);
    fillRect(g, 4, 6, 24, 20, col);
    // Clasp
    fillRect(g, 14, 2, 4, 4, '#e0c040');
    return c;
  }

  // Potions
  if (code.startsWith('P')) {
    const potionColors = {
      PH: '#cc3030', 'PH+': '#ee2020',
      PM: '#3040cc', PA: '#30aa30',
      PS: '#cc6030', PD: '#3060cc',
      PF: '#ccaa20', PR: '#20aa60',
    };
    const pCol = potionColors[code] || '#aa8833';
    // Bottle
    fillRect(g, 12, 4, 8, 4, '#c0c0c0');
    fillRect(g, 13, 2, 6, 4, '#c0c0c0');
    fillRect(g, 8, 8, 16, 18, pCol);
    fillRect(g, 10, 10, 12, 14, pCol);
    fillRect(g, 8, 24, 16, 4, pCol);
    // Shine
    fillRect(g, 10, 10, 3, 4, '#ffffff40');
    return c;
  }

  // ── Materials / Ingredients ───────────────────
  if (code === 'MB') {
    // Bone Fragment — broken bone piece
    fillRect(g, 10, 6, 4, 20, '#e0d8c0');
    fillRect(g, 14, 8, 4, 16, '#d8d0b0');
    fillRect(g, 18, 10, 3, 8, '#e0d8c0');
    // Jagged break at top
    fillRect(g, 10, 4, 2, 4, '#c8c0a0');
    fillRect(g, 14, 6, 2, 4, '#c8c0a0');
    // Dark crack lines
    fillRect(g, 12, 10, 1, 8, '#8a8060');
    fillRect(g, 16, 12, 1, 6, '#8a8060');
    return c;
  }

  if (code === 'MS') {
    // Spider Silk — bundled silk threads
    g.strokeStyle = '#d0d0e0';
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(8, 8); g.quadraticCurveTo(16, 20, 24, 8); g.stroke();
    g.beginPath(); g.moveTo(6, 14); g.quadraticCurveTo(16, 26, 26, 14); g.stroke();
    g.beginPath(); g.moveTo(10, 20); g.quadraticCurveTo(16, 30, 22, 20); g.stroke();
    // Shimmer
    g.strokeStyle = '#ffffff60';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(12, 10); g.lineTo(20, 10); g.stroke();
    g.beginPath(); g.moveTo(10, 16); g.lineTo(22, 16); g.stroke();
    return c;
  }

  if (code === 'MI') {
    // Iron Ore — rough rock chunk with metallic veins
    fillRect(g, 8, 10, 16, 14, '#5a5a5a');
    fillRect(g, 10, 8, 12, 2, '#4a4a4a');
    fillRect(g, 10, 24, 12, 2, '#4a4a4a');
    // Metallic silver veins
    fillRect(g, 10, 12, 3, 2, '#b0b0c0');
    fillRect(g, 16, 16, 4, 2, '#c0c0d0');
    fillRect(g, 12, 20, 3, 2, '#b0b0c0');
    // Dark shading
    fillRect(g, 20, 14, 2, 8, '#3a3a3a');
    return c;
  }

  if (code === 'MD') {
    // Dark Essence — swirling purple-black wisp
    g.fillStyle = '#2a1040';
    g.beginPath(); g.arc(16, 16, 8, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#5a2080';
    g.beginPath(); g.arc(16, 16, 5, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#8040c0';
    g.beginPath(); g.arc(14, 14, 2, 0, Math.PI * 2); g.fill();
    // Wispy tendrils
    g.strokeStyle = '#5a2080';
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(10, 10); g.quadraticCurveTo(6, 16, 10, 22); g.stroke();
    g.beginPath(); g.moveTo(22, 10); g.quadraticCurveTo(26, 16, 22, 22); g.stroke();
    return c;
  }

  if (code === 'MR') {
    // Dragon Scale — shimmering colored scale
    g.fillStyle = '#2a6030';
    g.beginPath();
    g.moveTo(16, 4); g.lineTo(26, 16); g.lineTo(16, 28); g.lineTo(6, 16);
    g.closePath(); g.fill();
    g.fillStyle = '#3a8040';
    g.beginPath();
    g.moveTo(16, 6); g.lineTo(24, 16); g.lineTo(16, 26); g.lineTo(8, 16);
    g.closePath(); g.fill();
    // Scale ridges
    g.strokeStyle = '#4aa050';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(10, 16); g.lineTo(22, 16); g.stroke();
    g.beginPath(); g.moveTo(16, 8); g.lineTo(16, 24); g.stroke();
    // Shimmer
    fillRect(g, 13, 12, 3, 3, '#60c06060');
    return c;
  }

  if (code === 'MC') {
    // Crystal Shard — glowing geometric crystal
    g.fillStyle = '#4060c0';
    g.beginPath();
    g.moveTo(16, 2); g.lineTo(22, 12); g.lineTo(20, 28); g.lineTo(12, 28); g.lineTo(10, 12);
    g.closePath(); g.fill();
    g.fillStyle = '#6080e0';
    g.beginPath();
    g.moveTo(16, 4); g.lineTo(20, 12); g.lineTo(18, 26); g.lineTo(14, 26); g.lineTo(12, 12);
    g.closePath(); g.fill();
    // Inner glow
    fillRect(g, 14, 10, 4, 8, '#80a0ff40');
    // Bright edge
    fillRect(g, 15, 4, 2, 6, '#a0c0ff60');
    return c;
  }

  if (code === 'MN') {
    // Den Core — pulsing organic core
    g.fillStyle = '#4a2020';
    g.beginPath(); g.arc(16, 16, 10, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#8a3030';
    g.beginPath(); g.arc(16, 16, 7, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#cc4040';
    g.beginPath(); g.arc(16, 16, 4, 0, Math.PI * 2); g.fill();
    // Pulse lines
    g.strokeStyle = '#cc404060';
    g.lineWidth = 1;
    g.beginPath(); g.arc(16, 16, 12, 0, Math.PI * 2); g.stroke();
    // Inner glow
    fillRect(g, 14, 14, 4, 4, '#ff606060');
    return c;
  }

  if (code === 'MG') {
    // Guardian Relic — golden ancient artifact
    fillRect(g, 10, 6, 12, 4, '#c0a030');
    fillRect(g, 12, 10, 8, 14, '#c0a030');
    fillRect(g, 10, 24, 12, 4, '#c0a030');
    // Central gem
    g.fillStyle = '#40a0e0';
    g.beginPath(); g.arc(16, 16, 3, 0, Math.PI * 2); g.fill();
    fillRect(g, 15, 15, 2, 2, '#80d0ff');
    // Gold trim
    fillRect(g, 10, 6, 12, 1, '#e0c040');
    fillRect(g, 10, 27, 12, 1, '#e0c040');
    // Ornate details
    fillRect(g, 14, 10, 1, 4, '#a08020');
    fillRect(g, 17, 10, 1, 4, '#a08020');
    fillRect(g, 14, 20, 1, 4, '#a08020');
    fillRect(g, 17, 20, 1, 4, '#a08020');
    return c;
  }

  if (code === 'PT') {
    // Portal Scroll — proper rolled parchment with curl ends
    // Main parchment body
    fillRect(g, 11, 9, 10, 14, '#e8d8a0');       // cream body
    fillRect(g, 12, 9, 8, 14, '#f0e4b0');         // lighter center highlight
    // Rolled-up top end — thick cylinder look
    fillRect(g, 9, 6, 14, 4, '#c8b870');          // top roll shadow
    fillRect(g, 10, 6, 12, 3, '#deca80');         // top roll
    fillRect(g, 11, 6, 10, 2, '#eed890');         // top roll highlight
    // Rolled-up bottom end
    fillRect(g, 9, 22, 14, 4, '#c8b870');         // bottom roll shadow
    fillRect(g, 10, 22, 12, 3, '#deca80');        // bottom roll
    fillRect(g, 11, 23, 10, 2, '#eed890');        // bottom roll highlight
    // Parchment edge shadows (left/right of body)
    fillRect(g, 11, 10, 1, 12, '#c8b870');        // left edge shadow
    fillRect(g, 20, 10, 1, 12, '#c8b870');        // right edge shadow
    // Tiny curl detail — top end curve hint
    fillRect(g, 10, 8, 2, 1, '#b8a860');
    fillRect(g, 20, 8, 2, 1, '#b8a860');
    fillRect(g, 10, 24, 2, 1, '#b8a860');
    fillRect(g, 20, 24, 2, 1, '#b8a860');
    // Ink lines (text on parchment)
    fillRect(g, 13, 12, 6, 1, '#6a5820');
    fillRect(g, 13, 15, 6, 1, '#6a5820');
    fillRect(g, 13, 18, 4, 1, '#6a5820');
    // Magic portal glow (blue-purple, overlaid)
    g.fillStyle = 'rgba(60, 100, 240, 0.18)';
    g.beginPath(); g.arc(16, 16, 5, 0, Math.PI * 2); g.fill();
    // Tiny sparkle dots
    fillRect(g, 14, 11, 1, 1, '#80b0ff');
    fillRect(g, 18, 17, 1, 1, '#a080ff');
    return c;
  }

  // Default
  fillRect(g, 8, 8, 16, 16, '#aa8833');
  return c;
}

// ── Projectile Sprites ───────────────────────────

function buildFireball() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.fillStyle = '#ff6600';
  g.beginPath();
  g.arc(16, 16, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffcc00';
  g.beginPath();
  g.arc(16, 16, 5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(16, 16, 2, 0, Math.PI * 2);
  g.fill();
  return c;
}

function buildArrow() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  fillRect(g, 6, 15, 20, 2, '#8a6a2a');
  // Arrowhead
  fillRect(g, 24, 13, 4, 6, '#a0a0b0');
  fillRect(g, 26, 14, 2, 4, '#c0c0d0');
  // Fletching
  fillRect(g, 4, 12, 4, 3, '#aa4040');
  fillRect(g, 4, 17, 4, 3, '#aa4040');
  return c;
}

function buildIceShard() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.fillStyle = '#60c0ff';
  g.beginPath();
  g.moveTo(16, 4);
  g.lineTo(24, 16);
  g.lineTo(16, 28);
  g.lineTo(8, 16);
  g.closePath();
  g.fill();
  g.fillStyle = '#a0e0ff';
  g.beginPath();
  g.moveTo(16, 8);
  g.lineTo(20, 16);
  g.lineTo(16, 24);
  g.lineTo(12, 16);
  g.closePath();
  g.fill();
  fillRect(g, 15, 14, 2, 2, '#ffffff');
  return c;
}

function buildLightning() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.strokeStyle = '#ffff40';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(12, 2);
  g.lineTo(18, 12);
  g.lineTo(12, 14);
  g.lineTo(20, 30);
  g.stroke();
  g.strokeStyle = '#ffffff';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(12, 2);
  g.lineTo(18, 12);
  g.lineTo(12, 14);
  g.lineTo(20, 30);
  g.stroke();
  return c;
}

// ── Chest Sprites ────────────────────────────────

function buildChestClosed() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  drawPixels(g, [
    '................',
    '................',
    '................',
    '................',
    '...0000000000...',
    '..0BBBBBBBBBB0..',
    '..0BBBBBBBBBB0..',
    '..0BBBBggBBBB0..',
    '..0BBBBggBBBB0..',
    '..0BBBBBBBBBB0..',
    '..0WWWWWWWWWW0..',
    '..0WWWWWWWWWW0..',
    '..0WWWWWWWWWW0..',
    '..00000000000...',
    '................',
    '................',
  ], { '0': '#1a1a1a', 'B': '#8a5a1a', 'W': '#6a4a18', 'g': '#e0c040' });
  return c;
}

function buildChestOpen() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  drawPixels(g, [
    '................',
    '..0000000000....',
    '..0BBBBBBBBBB0..',
    '..0BBBBBBBBBB0..',
    '..0BBBBBBBBBB0..',
    '..00000000000...',
    '..0WWWWWWWWWW0..',
    '..0WggWggWggW0..',
    '..0WggWggWggW0..',
    '..0WWWWWWWWWW0..',
    '..0WWWWWWWWWW0..',
    '..0WWWWWWWWWW0..',
    '..00000000000...',
    '................',
    '................',
    '................',
  ], { '0': '#1a1a1a', 'B': '#8a5a1a', 'W': '#6a4a18', 'g': '#e0c040' });
  // Sparkle
  fillRect(g, 12, 14, 2, 2, '#ffffaa');
  fillRect(g, 18, 16, 2, 2, '#ffffaa');
  return c;
}

// ── Torch Sprite ─────────────────────────────────

function buildTorchSprite(frame) {
  const c = makeCanvas();
  const g = c.getContext('2d');

  // Wooden handle
  fillRect(g, 13, 14, 6, 16, '#6a4a1a');
  fillRect(g, 14, 14, 4, 16, '#8a5a2a');

  // Flame - varies by frame
  const flameColors = ['#ff6600', '#ff8800', '#ffaa00', '#ff7700'];
  const innerColors = ['#ffcc00', '#ffdd30', '#ffee60', '#ffcc20'];
  const tipColors   = ['#ffffaa', '#ffffff', '#ffffcc', '#ffffaa'];

  const baseColor = flameColors[frame];
  const innerColor = innerColors[frame];
  const tipColor = tipColors[frame];

  // Flame height/width wobble
  const hOff = (frame === 1 || frame === 3) ? -2 : 0;
  const wOff = (frame === 0 || frame === 2) ? 1 : -1;

  // Outer flame
  fillRect(g, 11 - wOff, 6 + hOff, 10 + wOff * 2, 10, baseColor);
  fillRect(g, 13, 4 + hOff, 6, 4, baseColor);
  fillRect(g, 14, 2 + hOff, 4, 4, baseColor);

  // Inner flame
  fillRect(g, 13, 8 + hOff, 6, 6, innerColor);
  fillRect(g, 14, 6 + hOff, 4, 4, innerColor);

  // Tip
  fillRect(g, 15, 4 + hOff, 2, 3, tipColor);

  // Glow effect
  g.fillStyle = 'rgba(255, 150, 0, 0.15)';
  g.beginPath();
  g.arc(16, 12, 14, 0, Math.PI * 2);
  g.fill();

  return c;
}

// ── Exported API ─────────────────────────────────

// Simple hash for tile position → variant
function tileHash(x, y) {
  return ((x * 374761 + y * 668265) & 0x7fffffff) % 3;
}

export function getTileSprite(tileType, tx, ty) {
  const variant = (tx !== undefined && ty !== undefined) ? tileHash(tx, ty) : 0;
  const key = tileType + '_' + variant;
  if (!tileSeedCache[key]) {
    tileSeedCache[key] = buildTileSprite(tileType, variant);
  }
  return tileSeedCache[key];
}

export function getPlayerSprite(playerClass) {
  const key = 'player_' + (playerClass || 'warrior');
  if (!cache[key]) {
    cache[key] = buildPlayerSprite(playerClass);
  }
  return cache[key];
}

export function getEnemySprite(entityType) {
  if (!cache[entityType]) {
    cache[entityType] = buildEnemySprite(entityType);
  }
  return cache[entityType];
}

export function getFireballSprite() {
  if (!cache.fireball) cache.fireball = buildFireball();
  return cache.fireball;
}

export function getArrowSprite() {
  if (!cache.arrow) cache.arrow = buildArrow();
  return cache.arrow;
}

export function getIceShardSprite() {
  if (!cache.iceShard) cache.iceShard = buildIceShard();
  return cache.iceShard;
}

export function getLightningSprite() {
  if (!cache.lightning) cache.lightning = buildLightning();
  return cache.lightning;
}

export function getItemSprite(iconCode) {
  if (!iconCode) iconCode = '??';
  const key = 'item_' + iconCode;
  if (!cache[key]) cache[key] = buildItemSprite(iconCode);
  return cache[key];
}

export function getChestClosedSprite() {
  if (!cache.chestClosed) cache.chestClosed = buildChestClosed();
  return cache.chestClosed;
}

export function getChestOpenSprite() {
  if (!cache.chestOpen) cache.chestOpen = buildChestOpen();
  return cache.chestOpen;
}

export function getTorchSprite() {
  const frame = gameSettings.torchFlicker ? torchFrame : 0;
  const key = 'torch_' + frame;
  if (!tileSeedCache[key]) {
    tileSeedCache[key] = buildTorchSprite(frame);
  }
  return tileSeedCache[key];
}

// Clear player sprite cache (called when hero color changes)
export function clearPlayerSpriteCache() {
  for (const key of Object.keys(cache)) {
    if (key.startsWith('player_')) delete cache[key];
  }
}
window.__clearPlayerSpriteCache = clearPlayerSpriteCache;
