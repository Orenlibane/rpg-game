import { TILE, TILE_SIZE, ENTITY } from './constants.js';

const cache = {};
const tileSeedCache = {};
const S = TILE_SIZE; // 32
const SRC = 8;       // Kenney tiles are 8x8
const COLS = 16;     // spritesheet is 16 columns

// ── Load Kenney Micro-Roguelike spritesheet ──────
const sheet = new Image();
sheet.src = 'assets/downloaded/kenney_micro-roguelike/Tilemap/colored_tilemap_packed.png';
let sheetReady = false;
sheet.onload = () => {
  sheetReady = true;
  // Invalidate all caches so sprites re-draw from sheet
  Object.keys(cache).forEach(k => delete cache[k]);
  Object.keys(tileSeedCache).forEach(k => delete tileSeedCache[k]);
};

// ── Tile index mapping ───────────────────────────
// Kenney Micro Roguelike colored_tilemap_packed.png
// 16 cols x 10 rows = 160 tiles, each 8x8 px
//
// These indices come from visual inspection of the
// upscaled labeled tilemap.

const TILE_MAP = {
  // ─ Environment ─
  void:        0,    // solid dark wall
  grass:       96,   // earthy ground (we tint green)
  dirt:        80,   // cobblestone/path
  hut:         36,   // wooden structure
  cave_ent:    33,   // archway opening
  cave_wall:   0,    // solid stone wall
  cave_floor:  64,   // grey stone floor
  stairs:      91,   // ladder / stairs down
  moss_wall:   1,    // wall variant (tinted green)
  moss_floor:  65,   // floor variant (tinted green)
  bone_wall:   2,    // wall variant (tinted bone)
  bone_floor:  66,   // floor variant (tinted bone)
  web_floor:   67,   // floor variant (with web overlay)
  lava_wall:   3,    // wall variant (tinted red)
  lava_floor:  109,  // fire/lava tile
  ice_wall:    32,   // wall variant (tinted blue)
  ice_floor:   95,   // blue tile (ice)
  portal:      125,  // blue eye/circle
  healer:      8,    // NPC figure
  merchant:    13,   // NPC figure

  // ─ Trees & nature ─
  tree_pine:   85,
  tree_round:  86,
  tree_branch: 87,

  // ─ Player classes ─
  warrior:     4,    // orange knight
  mage:        6,    // robed/armored figure
  archer:      14,   // character with ranged look

  // ─ Regular enemies ─
  goblin:      7,    // small creature
  orc:         11,   // large green-headed brute
  skeleton:    22,   // white/grey bones
  spider:      56,   // small red/brown creature
  troll:       12,   // large red creature
  dark_mage:   26,   // dark hooded figure
  bat:         10,   // small flying creature
  slime:       20,   // green blob
  wraith:      43,   // ghostly white figure
  goblin_sham: 23,   // green spellcaster
  mushroom:    54,   // mushroom on dark
  goblin_berk: 15,   // aggressive warrior

  // ─ Bosses ─
  goblin_warl: 60,   // large armored creature
  spider_queen:57,   // large spider variant
  lich:        61,   // dark undead sorcerer
  mycelium:    129,  // large green blob
  fire_elem:   138,  // fire creature
  frost_giant:  128, // large ice creature (tint blue)

  // ─ Items ─
  sword:       70,   // sword/blade
  axe:         71,   // diagonal axe
  staff:       134,  // orange staff/wand
  dagger:      74,   // small blade
  bow:         73,   // crossed weapons / bow shape
  shield:      29,   // grey shield/armor
  helmet:      40,   // helmet shape
  armor:       30,   // chest armor
  boots:       78,   // footwear
  gloves:      39,   // gauntlet
  cape:        31,   // cloth item
  potion_hp:   135,  // red potion bottle
  potion_mana: 69,   // green/blue potion
  potion_gen:  69,   // generic potion
  gold_coin:   89,   // gold circle
  key:         90,   // key shape
  chest:       93,   // treasure chest

  // ─ Projectiles ─
  fireball:    136,  // fire spark
  arrow:       74,   // small projectile
  ice_shard:   152,  // small blue item
  lightning:   88,   // bright yellow flash
};

// ── Core extraction ──────────────────────────────

function extractTile(tileIndex) {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  if (sheetReady) {
    const col = tileIndex % COLS;
    const row = Math.floor(tileIndex / COLS);
    g.drawImage(sheet,
      col * SRC, row * SRC, SRC, SRC,
      0, 0, S, S
    );
  }
  return c;
}

function extractTileTinted(tileIndex, tintColor, tintAlpha = 0.35) {
  const c = extractTile(tileIndex);
  const g = c.getContext('2d');
  g.globalCompositeOperation = 'source-atop';
  g.fillStyle = tintColor;
  g.globalAlpha = tintAlpha;
  g.fillRect(0, 0, S, S);
  g.globalAlpha = 1;
  g.globalCompositeOperation = 'source-over';
  return c;
}

// Draw a tile with a colored background behind it (for floors/grass)
function extractTileOnBg(tileIndex, bgColor, tintColor = null, tintAlpha = 0.3) {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  // Fill background
  g.fillStyle = bgColor;
  g.fillRect(0, 0, S, S);
  // Draw tile on top
  if (sheetReady) {
    const col = tileIndex % COLS;
    const row = Math.floor(tileIndex / COLS);
    g.drawImage(sheet,
      col * SRC, row * SRC, SRC, SRC,
      0, 0, S, S
    );
  }
  if (tintColor) {
    g.globalCompositeOperation = 'source-atop';
    g.fillStyle = tintColor;
    g.globalAlpha = tintAlpha;
    g.fillRect(0, 0, S, S);
    g.globalAlpha = 1;
    g.globalCompositeOperation = 'source-over';
  }
  return c;
}

// Compose multiple tiles on a background
function composeTiles(bgColor, ...layers) {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.fillStyle = bgColor;
  g.fillRect(0, 0, S, S);
  if (sheetReady) {
    for (const layer of layers) {
      const idx = typeof layer === 'number' ? layer : layer.idx;
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      if (layer.tint) {
        // Draw to temp canvas, tint, then composite
        const tmp = document.createElement('canvas');
        tmp.width = S; tmp.height = S;
        const tg = tmp.getContext('2d');
        tg.imageSmoothingEnabled = false;
        tg.drawImage(sheet, col * SRC, row * SRC, SRC, SRC, 0, 0, S, S);
        tg.globalCompositeOperation = 'source-atop';
        tg.fillStyle = layer.tint;
        tg.globalAlpha = layer.alpha || 0.35;
        tg.fillRect(0, 0, S, S);
        g.drawImage(tmp, 0, 0);
      } else {
        g.drawImage(sheet, col * SRC, row * SRC, SRC, SRC, 0, 0, S, S);
      }
    }
  }
  return c;
}

// ── Fallback (before sheet loads) ────────────────

function fallbackSquare(color) {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = color;
  g.fillRect(0, 0, S, S);
  return c;
}

// ── Tile Sprite Builders ─────────────────────────

function buildTileSprite(tileType) {
  if (!sheetReady) {
    // Return colored fallback until spritesheet loads
    const fallbacks = {
      [TILE.VOID]:      '#1a1a2a',
      [TILE.GRASS]:     '#2d5a1e',
      [TILE.DIRT]:      '#6b5230',
      [TILE.HUT]:       '#7a5a30',
      [TILE.CAVE_ENTRANCE]: '#505058',
      [TILE.CAVE_WALL]:  '#3a3a4a',
      [TILE.CAVE_FLOOR]: '#5a5a6a',
      [TILE.CAVE_STAIRS]:'#6a6a7a',
      [TILE.MOSS_WALL]:  '#2a4a2a',
      [TILE.MOSS_FLOOR]: '#3a5a3a',
      [TILE.BONE_WALL]:  '#4a4038',
      [TILE.BONE_FLOOR]: '#5a5048',
      [TILE.WEB_FLOOR]:  '#4a4a5a',
      [TILE.LAVA_WALL]:  '#5a2a1a',
      [TILE.LAVA_FLOOR]: '#8a3a1a',
      [TILE.ICE_WALL]:   '#3a4a6a',
      [TILE.ICE_FLOOR]:  '#5a7aaa',
      [TILE.PORTAL]:     '#4a2a8a',
      [TILE.HEALER]:     '#2a5a2a',
      [TILE.MERCHANT]:   '#6a5a2a',
    };
    return fallbackSquare(fallbacks[tileType] || '#1a1a2a');
  }

  switch (tileType) {
    case TILE.VOID:
      return extractTile(TILE_MAP.void);

    case TILE.GRASS: {
      // Green ground with a randomly placed tree for variety
      const c = document.createElement('canvas');
      c.width = S; c.height = S;
      const g = c.getContext('2d');
      g.imageSmoothingEnabled = false;
      g.fillStyle = '#2d5a1e';
      g.fillRect(0, 0, S, S);
      // Add subtle texture dots
      g.fillStyle = '#3a7028';
      for (let i = 0; i < 6; i++) {
        const x = Math.floor(Math.random() * 28) + 2;
        const y = Math.floor(Math.random() * 28) + 2;
        g.fillRect(x, y, 2, 2);
      }
      return c;
    }

    case TILE.DIRT:
      return extractTileOnBg(TILE_MAP.dirt, '#4a3a28');

    case TILE.HUT:
      return extractTileOnBg(TILE_MAP.hut, '#2d5a1e');

    case TILE.CAVE_ENTRANCE:
      return extractTileOnBg(TILE_MAP.cave_ent, '#2d5a1e');

    case TILE.CAVE_WALL:
      return extractTile(TILE_MAP.cave_wall);

    case TILE.CAVE_FLOOR:
      return extractTileOnBg(TILE_MAP.cave_floor, '#1a1a2a');

    case TILE.CAVE_STAIRS:
      return extractTileOnBg(TILE_MAP.stairs, '#1a1a2a');

    case TILE.MOSS_WALL:
      return extractTileTinted(TILE_MAP.moss_wall, '#2a6a1a', 0.4);

    case TILE.MOSS_FLOOR:
      return extractTileOnBg(TILE_MAP.moss_floor, '#1a2a1a', '#2a6a1a', 0.3);

    case TILE.BONE_WALL:
      return extractTileTinted(TILE_MAP.bone_wall, '#6a5a3a', 0.3);

    case TILE.BONE_FLOOR:
      return extractTileOnBg(TILE_MAP.bone_floor, '#1a1a1a', '#6a5a3a', 0.25);

    case TILE.WEB_FLOOR: {
      const c = extractTileOnBg(TILE_MAP.web_floor, '#1a1a2a');
      const g = c.getContext('2d');
      // Draw web strands
      g.strokeStyle = 'rgba(200,200,200,0.3)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(S, S);
      g.moveTo(S, 0); g.lineTo(0, S);
      g.moveTo(S/2, 0); g.lineTo(S/2, S);
      g.moveTo(0, S/2); g.lineTo(S, S/2);
      g.stroke();
      return c;
    }

    case TILE.LAVA_WALL:
      return extractTileTinted(TILE_MAP.lava_wall, '#8a2a0a', 0.45);

    case TILE.LAVA_FLOOR:
      return extractTileOnBg(TILE_MAP.lava_floor, '#1a0a0a');

    case TILE.ICE_WALL:
      return extractTileTinted(TILE_MAP.ice_wall, '#4a8aca', 0.45);

    case TILE.ICE_FLOOR:
      return extractTileOnBg(TILE_MAP.ice_floor, '#1a1a3a', '#4a8aca', 0.2);

    case TILE.PORTAL:
      return extractTileOnBg(TILE_MAP.portal, '#1a1a2a');

    case TILE.HEALER:
      return extractTileOnBg(TILE_MAP.healer, '#2d5a1e');

    case TILE.MERCHANT:
      return extractTileOnBg(TILE_MAP.merchant, '#2d5a1e');

    default:
      return extractTile(TILE_MAP.void);
  }
}

// ── Player Sprite Builders ───────────────────────

function buildPlayerSprite(playerClass) {
  if (!sheetReady) {
    const colors = { warrior: '#c08030', mage: '#4060c0', archer: '#30a040' };
    return fallbackSquare(colors[playerClass] || '#c08030');
  }
  switch (playerClass) {
    case 'mage':   return extractTile(TILE_MAP.mage);
    case 'archer': return extractTile(TILE_MAP.archer);
    default:       return extractTile(TILE_MAP.warrior);
  }
}

// ── Enemy Sprite Builders ────────────────────────

function buildEnemySprite(entityType) {
  if (!sheetReady) return fallbackSquare('#a03030');

  const mapping = {
    [ENTITY.GOBLIN]:           TILE_MAP.goblin,
    [ENTITY.ORC]:              TILE_MAP.orc,
    [ENTITY.SKELETON]:         TILE_MAP.skeleton,
    [ENTITY.SPIDER]:           TILE_MAP.spider,
    [ENTITY.TROLL]:            TILE_MAP.troll,
    [ENTITY.DARK_MAGE]:        TILE_MAP.dark_mage,
    [ENTITY.BAT]:              TILE_MAP.bat,
    [ENTITY.SLIME]:            TILE_MAP.slime,
    [ENTITY.WRAITH]:           TILE_MAP.wraith,
    [ENTITY.GOBLIN_SHAMAN]:    TILE_MAP.goblin_sham,
    [ENTITY.MUSHROOM]:         TILE_MAP.mushroom,
    [ENTITY.GOBLIN_BERSERKER]: TILE_MAP.goblin_berk,
    [ENTITY.GOBLIN_WARLORD]:   TILE_MAP.goblin_warl,
    [ENTITY.SPIDER_QUEEN]:     TILE_MAP.spider_queen,
    [ENTITY.LICH]:             TILE_MAP.lich,
    [ENTITY.MYCELIUM_LORD]:    TILE_MAP.mycelium,
    [ENTITY.FIRE_ELEMENTAL]:   TILE_MAP.fire_elem,
    [ENTITY.FROST_GIANT]:      TILE_MAP.frost_giant,
  };

  const idx = mapping[entityType];
  if (idx === undefined) return extractTile(TILE_MAP.goblin);

  // Tint frost giant blue
  if (entityType === ENTITY.FROST_GIANT) {
    return extractTileTinted(idx, '#6aaaee', 0.35);
  }

  return extractTile(idx);
}

// ── Projectile Sprites ───────────────────────────

function buildFireball() {
  if (!sheetReady) return fallbackSquare('#ff6600');
  return extractTile(TILE_MAP.fireball);
}

function buildArrow() {
  if (!sheetReady) return fallbackSquare('#c0a060');
  return extractTile(TILE_MAP.arrow);
}

function buildIceShard() {
  if (!sheetReady) return fallbackSquare('#60c0ff');
  return extractTileTinted(TILE_MAP.ice_shard, '#60c0ff', 0.4);
}

function buildLightning() {
  if (!sheetReady) return fallbackSquare('#ffff00');
  return extractTile(TILE_MAP.lightning);
}

// ── Item Sprites ─────────────────────────────────

function buildItemSprite(iconCode) {
  if (!sheetReady) return fallbackSquare('#aa8833');

  // Map icon codes to Kenney tile indices
  const code = iconCode.toUpperCase();

  // Weapons
  if (code === 'W1') return extractTile(TILE_MAP.sword);         // Rusty Sword
  if (code === 'W2') return extractTile(TILE_MAP.sword);         // Iron Sword
  if (code === 'W3') return extractTile(TILE_MAP.dagger);        // Steel Blade
  if (code === 'WS') return extractTile(TILE_MAP.staff);         // Fire Staff
  if (code === 'WA') return extractTile(TILE_MAP.axe);           // War Axe
  if (code === 'WD') return extractTile(TILE_MAP.dagger);        // Shadow Dagger
  if (code === 'WB') return extractTile(TILE_MAP.bow);           // Long Bow
  if (code === 'WC') return extractTile(TILE_MAP.axe);           // Bone Club
  if (code === 'WF') return extractTileTinted(TILE_MAP.staff, '#60c0ff', 0.3); // Frost Wand

  // Helmets
  if (code === 'H1' || code === 'H2' || code === 'H3')
    return extractTile(TILE_MAP.helmet);

  // Chest armor
  if (code === 'C1' || code === 'C2' || code === 'C3')
    return extractTile(TILE_MAP.armor);
  if (code === 'CR') return extractTileTinted(TILE_MAP.armor, '#4060c0', 0.3); // Mage Robe

  // Gloves
  if (code === 'G1' || code === 'G2' || code === 'G3')
    return extractTile(TILE_MAP.gloves);

  // Boots
  if (code === 'B1' || code === 'B2' || code === 'B3')
    return extractTile(TILE_MAP.boots);

  // Capes
  if (code === 'K1' || code === 'K2') return extractTile(TILE_MAP.cape);
  if (code === 'KF') return extractTileTinted(TILE_MAP.cape, '#ff6600', 0.3); // Fire Cloak

  // Potions
  if (code === 'PH' || code === 'PH+') return extractTile(TILE_MAP.potion_hp);    // Health potion
  if (code === 'PM') return extractTile(TILE_MAP.potion_mana);                      // Mana potion
  if (code === 'PA') return extractTileTinted(TILE_MAP.potion_mana, '#40aa40', 0.3);// Antidote
  if (code === 'PS') return extractTileTinted(TILE_MAP.potion_hp, '#ff4400', 0.2);  // Strength
  if (code === 'PD') return extractTileTinted(TILE_MAP.potion_hp, '#4488ff', 0.3);  // Shield
  if (code === 'PF') return extractTileTinted(TILE_MAP.potion_mana, '#ffaa00', 0.3);// Haste
  if (code === 'PR') return extractTileTinted(TILE_MAP.potion_mana, '#00cc66', 0.3);// Regen

  // Default: generic item
  return extractTile(TILE_MAP.gold_coin);
}

// ── Exported API (same interface as before) ──────

export function getTileSprite(tileType) {
  if (!tileSeedCache[tileType] || !sheetReady) {
    tileSeedCache[tileType] = buildTileSprite(tileType);
  }
  return tileSeedCache[tileType];
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
  const key = 'item_' + iconCode;
  if (!cache[key]) cache[key] = buildItemSprite(iconCode);
  return cache[key];
}
