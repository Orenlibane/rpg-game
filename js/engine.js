import {
  TILE, TILE_PROPS, ENTITY, BASE_STATS, ITEMS, ITEM_TYPE, EQUIP_SLOT,
  LOOT_TABLES, BACKPACK_SIZE,
  CLASS_STATS, PLAYER_CLASS, BESTIARY_INFO,
  FLOOR_THEME, FLOOR_THEMES, BOSS_FOR_THEME, SPELLS,
  FIRE_SPELL_COST, FIRE_SPELL_RANGE, FIRE_SPELL_POWER, BOW_RANGE,
  ITEMS_PER_FLOOR_MIN, ITEMS_PER_FLOOR_MAX,
  GOBLIN_SIGHT_RANGE, ORC_SIGHT_RANGE,
  GOLD_REWARDS, HEALER_COST, SHOP_INVENTORY, DUNGEON_SHOP_INVENTORY,
  ATTR_BONUSES, FEATURE_INFO, QUEST_POOL, SKILL_TREES, ACHIEVEMENTS,
  BOSS_SKILLS, ITEM_SETS, PRESTIGE,
  FISH_LOOT, ARENA_CONFIG,
} from './constants.js?v=17';
import { t } from './i18n.js';
import { generateVillage, generateDungeon, generateArenaMap } from './mapgen.js?v=17';
import { computeFOV } from './fov.js?v=17';

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

const ELITE_PREFIXES = ['Savage', 'Frenzied', 'Ancient', 'Corrupted', 'Enraged', 'Cursed', 'Venomous', 'Spectral', 'Blazing', 'Frozen'];

// ── Game State ─────────────────────────────────

export const state = {
  phase: 'class_select',  // 'class_select' | 'playing'
  mode: 'village',        // 'village' | 'dungeon'
  floor: 0,               // 0 = village, 1+ = dungeon floor
  playerClass: null,
  map: null,
  mapW: 0,
  mapH: 0,
  player: null,
  enemies: [],
  items: [],              // items on ground: { x, y, item }
  visibility: null,       // current FOV
  revealed: null,         // tiles ever seen
  turnCount: 0,
  messages: [],
  gameOver: false,
  pendingLevelUp: false,
  villageData: null,
  stairsPos: null,
  bestiary: {},           // { [entityType]: { kills: 0 } }
  armory: {},             // { [itemId]: { count: 0 } } — discovered items
  quests: [],             // active quests: { ...questDef, progress: 0, completed: false }
  completedQuestIds: [],  // ids of completed quests (never offer again)
  projectiles: [],        // visual-only: { x, y, type }
  showBestiary: false,
  showArmory: false,
  showQuestBoard: false,
  showMinimap: false,
  showHealer: false,
  showShop: false,
  isDungeonShop: false,
  floorTheme: null,       // current floor theme key
  throwMode: false,       // true when player is aiming a throw
  portalPos: null,        // { x, y } if portal exists on current floor
  lastDungeonFloor: 0,    // for continuing from village
  chests: [],             // { x, y, items: [...], gold, opened }
  showChest: false,       // true when chest overlay is visible
  activeChest: null,      // reference to the chest being viewed
  showSettings: false,
  showCharSheet: false,
  showSkillTree: false,
  showAchievements: false,
  godMode: false,         // unkillable when true
  bossSkills: {},         // { town_portal: true, gold_magnet: true, ... }
  prestigeLevel: 0,       // 0-5, persists across restarts
  showPrestige: false,    // true when prestige overlay is visible
  // Fishing system
  showFishing: false,
  fishingPhase: 'idle',   // 'idle' | 'waiting' | 'bite' | 'caught' | 'missed'
  fishingTimer: null,
  fishingCatch: null,
  // Arena system
  showArena: false,
  arenaWave: 0,
  arenaBestWave: 0,
  arenaEnemiesRemaining: 0,
  arenaRewards: { gold: 0, items: [] },
  arenaWaveCleared: false,
  // Achievement system
  achievements: {},       // { [achievementId]: timestamp }
  achievementToast: null, // { id, name, icon, timer } for popup display
  stats: {                // cumulative stats for achievement tracking
    totalKills: 0,
    totalGoldEarned: 0,
    chestsOpened: 0,
    highestFloor: 0,
    itemsBought: 0,
    deaths: 0,
    fishCaught: 0,
    arenaBestWave: 0,
  },
};

// ── Game Settings (persisted separately) ────

export const gameSettings = {
  tileSize: 48,
  showDamageNumbers: true,
  torchFlicker: true,
  showEnemyHpBars: true,
  autoPickup: true,
  language: 'en',
};

export const damageNumbers = [];

const SETTINGS_KEY = 'rpg_settings';

export function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
  } catch (_) {}
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.assign(gameSettings, saved);
    }
  } catch (_) {}
}

export function updateSetting(key, value) {
  gameSettings[key] = value;
  saveSettings();
}

// Load saved settings on startup
loadSettings();

export function spawnDamageNumber(x, y, amount, color = '#fff') {
  if (!gameSettings.showDamageNumbers) return;
  damageNumbers.push({ x, y, text: String(amount), color, age: 0, maxAge: 60 });
}

// ── Logging ──────────────────────────────────

export function log(text, type = 'info') {
  state.messages.push({ text, type });
  if (state.messages.length > 100) state.messages.shift();
}

// ── Entity Factory ───────────────────────────

function createEntity(type, x, y) {
  const base = { ...BASE_STATS[type] };
  return {
    type, x, y, ...base,
    gold: 0,
    statPoints: 0,
    effects: [],  // active potion effects: { name, turns, stat, amount }
    attrs: { str: 1, agi: 1, int: 1, vit: 1, cha: 1 },
    equipment: {
      [EQUIP_SLOT.WEAPON]: null,
      [EQUIP_SLOT.HELMET]: null,
      [EQUIP_SLOT.CHEST]: null,
      [EQUIP_SLOT.GLOVES]: null,
      [EQUIP_SLOT.BOOTS]: null,
      [EQUIP_SLOT.CAPE]: null,
    },
    inventory: [],
    skills: {},          // { skillId: rank }
    skillCooldowns: {},  // { skillId: turnsRemaining }
    skillPoints: 0,
    invisible: 0,        // turns of invisibility remaining
  };
}

// ── Class Selection ──────────────────────────

export function selectClass(cls) {
  state.playerClass = cls;
  state.phase = 'playing';
  initVillage();
  // Give starting gear based on class
  giveStartingGear(cls);
}

function giveStartingGear(cls) {
  const p = state.player;
  const equip = (id) => {
    const item = { ...ITEMS[id] };
    p.equipment[item.slot] = item;
    registerArmoryItem(id);
  };
  switch (cls) {
    case PLAYER_CLASS.WARRIOR:
      equip('rusty_sword');
      equip('leather_tunic');
      equip('leather_boots');
      p.inventory.push({ ...ITEMS.minor_health_pot, count: 2 });
      registerArmoryItem('minor_health_pot');
      break;
    case PLAYER_CLASS.MAGE:
      equip('worn_staff');
      equip('sandals');
      p.inventory.push({ ...ITEMS.mana_potion, count: 2 });
      registerArmoryItem('mana_potion');
      break;
    case PLAYER_CLASS.ARCHER:
      equip('short_bow');
      equip('leather_cap');
      equip('sandals');
      p.inventory.push({ ...ITEMS.minor_health_pot, count: 1 });
      registerArmoryItem('minor_health_pot');
      break;
  }
  log(t('log.starting_gear'), 'item');
}

// ── Init ─────────────────────────────────────

export function initVillage() {
  const village = generateVillage();
  state.villageData = village;
  state.mode = 'village';
  state.floor = 0;
  state.map = village.map;
  state.mapW = village.map[0].length;
  state.mapH = village.map.length;
  state.enemies = [];
  state.items = [];
  state.gameOver = false;
  state.turnCount = 0;
  state.messages = [];
  state.projectiles = [];
  state.floorTheme = null;

  if (!state.player) {
    state.player = createEntity(ENTITY.PLAYER, village.playerStart.x, village.playerStart.y);
    // Apply class stats and attributes
    if (state.playerClass && CLASS_STATS[state.playerClass]) {
      const cls = CLASS_STATS[state.playerClass];
      state.player.basePower = cls.power;
      state.player.baseArmor = cls.armor;
      state.player.baseMaxHp = cls.maxHp;
      state.player.baseMaxMana = cls.maxMana;
      state.player.power = cls.power;
      state.player.armor = cls.armor;
      state.player.maxMana = cls.maxMana;
      state.player.mana = cls.mana;
      if (cls.attrs) {
        state.player.attrs = { ...cls.attrs };
      }
      recalcDerivedStats();
      state.player.hp = state.player.maxHp;
      state.player.mana = state.player.maxMana;
    }
  } else {
    state.player.x = village.playerStart.x;
    state.player.y = village.playerStart.y;
    // Heal on return to village
    state.player.hp = state.player.maxHp;
    state.player.mana = state.player.maxMana;
  }

  // If returning from dungeon via portal, place a return portal near player
  if (state.lastDungeonFloor > 0) {
    const px = state.player.x + 1;
    const py = state.player.y;
    if (px < state.mapW && state.map[py][px] === TILE.GRASS) {
      state.map[py][px] = TILE.PORTAL;
      state.portalPos = { x: px, y: py };
    } else {
      // Try other adjacent positions
      const offsets = [[-1,0],[0,-1],[0,1],[1,1],[-1,-1]];
      for (const [ox, oy] of offsets) {
        const tx = state.player.x + ox, ty = state.player.y + oy;
        if (tx >= 0 && tx < state.mapW && ty >= 0 && ty < state.mapH && state.map[ty][tx] === TILE.GRASS) {
          state.map[ty][tx] = TILE.PORTAL;
          state.portalPos = { x: tx, y: ty };
          break;
        }
      }
    }
  } else {
    state.portalPos = null;
  }

  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log(t('log.arrive_village'), 'info');
  if (state.lastDungeonFloor > 0) {
    log(t('log.portal_nearby', { floor: state.lastDungeonFloor }), 'level');
  }
  log(t('log.visit_npcs'), 'info');
}

function pickFloorTheme(floor) {
  const eligible = Object.entries(FLOOR_THEMES).filter(
    ([, t]) => floor >= t.minFloor && floor <= t.maxFloor
  );
  if (eligible.length === 0) {
    // Fallback: pick any theme
    const all = Object.keys(FLOOR_THEMES);
    return all[randInt(0, all.length - 1)];
  }
  return eligible[randInt(0, eligible.length - 1)][0];
}

function weightedRandomPick(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [type, w] of entries) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return entries[entries.length - 1][0];
}

export function enterDungeon(floor = 1) {
  // Pick a random theme appropriate for this floor
  const themeKey = pickFloorTheme(floor);
  const theme = FLOOR_THEMES[themeKey];
  state.floorTheme = themeKey;

  const dungeon = generateDungeon(floor, themeKey);
  state.mode = 'dungeon';
  state.floor = floor;
  state.map = dungeon.map;
  if (floor > state.stats.highestFloor) state.stats.highestFloor = floor;
  // Quest: reach floor
  updateQuestProgress('reach', floor);
  checkAchievements();
  state.mapW = dungeon.map[0].length;
  state.mapH = dungeon.map.length;
  state.stairsPos = dungeon.stairsPos;
  state.projectiles = [];

  state.player.x = dungeon.playerStart.x;
  state.player.y = dungeon.playerStart.y;

  const floorRooms = dungeon.rooms;

  // Spawn enemies using theme spawn weights
  state.enemies = [];
  const enemyCount = 8 + floor * 3 + randInt(0, 5);
  for (let i = 0; i < enemyCount; i++) {
    const type = weightedRandomPick(theme.spawnWeights);
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const ex = randInt(room.x + 1, room.x + room.w - 2);
    const ey = randInt(room.y + 1, room.y + room.h - 2);
    if (!isOccupied(ex, ey) && canWalk(ex, ey)) {
      const enemy = createEntity(type, ex, ey);
      // Scale stats by floor
      enemy.maxHp += floor * 2;
      enemy.hp = enemy.maxHp;
      enemy.power += Math.floor(floor / 2);

      // Elite chance: 10% per enemy, increases slightly with floor
      if (Math.random() < 0.08 + floor * 0.01) {
        enemy.isElite = true;
        enemy.elitePrefix = ELITE_PREFIXES[randInt(0, ELITE_PREFIXES.length - 1)];
        enemy.maxHp = Math.floor(enemy.maxHp * 2);
        enemy.hp = enemy.maxHp;
        enemy.power = Math.floor(enemy.power * 1.5);
        enemy.armor = (enemy.armor || 0) + 1;
      }

      state.enemies.push(enemy);
    }
  }

  // Spawn miniboss on every floor (named enemy, stronger than elite)
  if (floorRooms.length > 2) {
    const mbType = weightedRandomPick(theme.spawnWeights);
    const mbRoomIdx = randInt(1, floorRooms.length - 2);
    const mbRoom = floorRooms[mbRoomIdx];
    const mbx = mbRoom.cx;
    const mby = mbRoom.cy;
    if (!isOccupied(mbx, mby) && canWalk(mbx, mby)) {
      const miniboss = createEntity(mbType, mbx, mby);
      miniboss.isMiniboss = true;
      miniboss.elitePrefix = ELITE_PREFIXES[randInt(0, ELITE_PREFIXES.length - 1)];
      miniboss.maxHp = Math.floor((miniboss.maxHp + floor * 2) * 1.6);
      miniboss.hp = miniboss.maxHp;
      miniboss.power = Math.floor((miniboss.power + Math.floor(floor / 3)) * 1.3);
      miniboss.armor = (miniboss.armor || 0) + 1;
      state.enemies.push(miniboss);
      log(t('log.miniboss_guards', { prefix: miniboss.elitePrefix, name: getEnemyName(miniboss) }), 'combat');
    }
  }

  // Spawn boss every 5 floors
  if (floor % 5 === 0 && BOSS_FOR_THEME[themeKey]) {
    const bossType = BOSS_FOR_THEME[themeKey];
    // Place boss in a non-start room
    const bossRoomIdx = floorRooms.length > 2 ? randInt(1, floorRooms.length - 2) : 1;
    const bossRoom = floorRooms[bossRoomIdx];
    const bx = bossRoom.cx;
    const by = bossRoom.cy;
    const boss = createEntity(bossType, bx, by);
    boss.isBoss = true;
    // Extra scaling for bosses
    boss.maxHp += floor * 3;
    boss.hp = boss.maxHp;
    boss.power += Math.floor(floor / 3);
    state.enemies.push(boss);
    log(t('log.boss_lurks', { name: getEnemyName(boss) }), 'combat');
  }

  // Apply prestige scaling to all enemies
  if (state.prestigeLevel > 0) {
    const hpMult = 1 + (PRESTIGE.ENEMY_SCALING.hpMultiplier * state.prestigeLevel);
    const powMult = 1 + (PRESTIGE.ENEMY_SCALING.powerMultiplier * state.prestigeLevel);
    for (const e of state.enemies) {
      e.maxHp = Math.floor(e.maxHp * hpMult);
      e.hp = e.maxHp;
      e.power = Math.floor(e.power * powMult);
    }
  }

  // Spawn ground items (tier-appropriate)
  state.items = [];
  const numItems = randInt(ITEMS_PER_FLOOR_MIN, ITEMS_PER_FLOOR_MAX);
  const allItemIds = Object.keys(ITEMS);
  // Filter items to appropriate tier for this floor
  const tierMax = Math.min(3, 1 + Math.floor(floor / 2));
  const eligibleItems = allItemIds.filter(id => (ITEMS[id].tier || 0) <= tierMax || ITEMS[id].type === ITEM_TYPE.CONSUMABLE);
  const isSpecialTile = (x, y) => {
    const tile = state.map[y] && state.map[y][x];
    return tile === TILE.CAVE_STAIRS || tile === TILE.PORTAL || tile === TILE.CAVE_ENTRANCE ||
           tile === TILE.DUNGEON_MERCHANT || tile === TILE.FOUNTAIN || tile === TILE.SARCOPHAGUS;
  };
  for (let i = 0; i < numItems; i++) {
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const ix = randInt(room.x + 1, room.x + room.w - 2);
    const iy = randInt(room.y + 1, room.y + room.h - 2);
    if (isSpecialTile(ix, iy) || !canWalk(ix, iy)) continue; // don't place items on stairs/portals/decorations
    const pool = eligibleItems.length > 0 ? eligibleItems : allItemIds;
    const itemId = pool[randInt(0, pool.length - 1)];
    state.items.push({ x: ix, y: iy, item: { ...ITEMS[itemId] } });
  }

  // Spawn chests (2-4 per floor)
  state.chests = [];
  state.showChest = false;
  state.activeChest = null;
  const numChests = randInt(2, 4);
  for (let i = 0; i < numChests; i++) {
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const cx = randInt(room.x + 1, room.x + room.w - 2);
    const cy = randInt(room.y + 1, room.y + room.h - 2);
    if (isOccupied(cx, cy) || isSpecialTile(cx, cy)) continue;
    const tileThere = state.map[cy] && state.map[cy][cx];
    if (tileThere && !TILE_PROPS[tileThere]?.walkable) continue;
    // Generate chest contents
    const chestItems = [];
    const chestItemCount = randInt(1, 3);
    for (let j = 0; j < chestItemCount; j++) {
      const pool = eligibleItems.length > 0 ? eligibleItems : allItemIds;
      const itemId = pool[randInt(0, pool.length - 1)];
      chestItems.push({ ...ITEMS[itemId] });
    }
    const chestGold = randInt(5, 10 + floor * 5);
    state.chests.push({ x: cx, y: cy, items: chestItems, gold: chestGold, opened: false });
  }

  // Extra chests in treasure rooms
  for (const room of floorRooms) {
    if (room.type === 'treasure_room') {
      const extraChests = randInt(2, 3);
      for (let i = 0; i < extraChests; i++) {
        const cx = randInt(room.x + 1, room.x + room.w - 2);
        const cy = randInt(room.y + 1, room.y + room.h - 2);
        if (isOccupied(cx, cy) || isSpecialTile(cx, cy)) continue;
        const tileThere = state.map[cy] && state.map[cy][cx];
        if (tileThere && !TILE_PROPS[tileThere]?.walkable) continue;
        const chestItems = [];
        const chestItemCount = randInt(2, 4);
        for (let j = 0; j < chestItemCount; j++) {
          const pool = eligibleItems.length > 0 ? eligibleItems : allItemIds;
          const itemId = pool[randInt(0, pool.length - 1)];
          chestItems.push({ ...ITEMS[itemId] });
        }
        const chestGold = randInt(10, 20 + floor * 8);
        state.chests.push({ x: cx, y: cy, items: chestItems, gold: chestGold, opened: false });
      }
    }
  }

  // Place portal every 5 floors (in second room)
  state.portalPos = null;
  if (floor % 5 === 0 && floorRooms.length > 1) {
    const portalRoom = floorRooms[0]; // same room as player start
    const px = portalRoom.cx + 1;
    const py = portalRoom.cy;
    state.map[py][px] = TILE.PORTAL;
    state.portalPos = { x: px, y: py };
    log(t('log.portal_appeared'), 'level');
  }

  // Dungeon merchant: ~25% chance per floor
  state.isDungeonShop = false;
  if (Math.random() < 0.25 && floorRooms.length > 2) {
    const merchantRoomIdx = randInt(1, floorRooms.length - 2);
    const merchantRoom = floorRooms[merchantRoomIdx];
    const mx = merchantRoom.cx;
    const my = merchantRoom.cy + 1;
    if (my > merchantRoom.y && my < merchantRoom.y + merchantRoom.h - 1 &&
        !isOccupied(mx, my) && !isSpecialTile(mx, my)) {
      const tileThere = state.map[my] && state.map[my][mx];
      if (tileThere && TILE_PROPS[tileThere]?.walkable) {
        state.map[my][mx] = TILE.DUNGEON_MERCHANT;
        log(t('log.wandering_merchant'), 'info');
      }
    }
  }

  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();

  // Cartographer boss skill: reveal entire map
  if (state.bossSkills.cartographer) {
    for (let y = 0; y < state.mapH; y++)
      for (let x = 0; x < state.mapW; x++)
        state.revealed[y][x] = 1;
    log(t('log.cartographer'), 'info');
  }

  log(t('log.enter_floor', { theme: theme.name, floor: floor }), 'info');
}

// ── FOV ──────────────────────────────────────

function updateFOV() {
  const radius = state.mode === 'village' ? 20 : state.mode === 'arena' ? 20 : 7;
  state.visibility = computeFOV(state.map, state.player.x, state.player.y, radius);

  for (let y = 0; y < state.mapH; y++) {
    for (let x = 0; x < state.mapW; x++) {
      if (state.visibility[y][x]) state.revealed[y][x] = 1;
    }
  }
}

// Check if player should die; returns true if player actually dies
function checkPlayerDeath(deathMsg) {
  if (state.player.hp > 0) return false;
  state.player.hp = 0;
  if (state.godMode) { state.player.hp = 1; return false; }
  // Arena death: return to village with 1 HP, no game over
  if (state.mode === 'arena') {
    state.player.hp = 1;
    log(t('log.arena_death'), 'combat');
    leaveArena();
    return true; // signal combat end
  }
  // Second Life boss skill
  if (state.bossSkills.second_life) {
    state.player.hp = Math.floor(state.player.maxHp * 0.5);
    state.bossSkills.second_life = false;
    log(t('log.second_life'), 'level');
    return false;
  }
  log(deathMsg || t('log.you_died'), 'combat');
  state.gameOver = true;
  return true;
}

// ── Helpers ──────────────────────────────────

function isOccupied(x, y) {
  if (state.player && state.player.x === x && state.player.y === y) return true;
  return state.enemies.some(e => e.x === x && e.y === y && e.hp > 0);
}

function canWalk(x, y) {
  if (x < 0 || x >= state.mapW || y < 0 || y >= state.mapH) return false;
  const tile = state.map[y][x];
  return TILE_PROPS[tile] ? TILE_PROPS[tile].walkable : false;
}

function enemyAt(x, y) {
  return state.enemies.find(e => e.x === x && e.y === y && e.hp > 0);
}

const ENEMY_NAMES = {
  [ENTITY.GOBLIN]:           'Goblin',
  [ENTITY.ORC]:              'Orc',
  [ENTITY.SKELETON]:         'Skeleton',
  [ENTITY.SPIDER]:           'Cave Spider',
  [ENTITY.TROLL]:            'Troll',
  [ENTITY.DARK_MAGE]:        'Dark Mage',
  [ENTITY.BAT]:              'Cave Bat',
  [ENTITY.SLIME]:            'Slime',
  [ENTITY.WRAITH]:           'Wraith',
  [ENTITY.GOBLIN_SHAMAN]:    'Goblin Shaman',
  [ENTITY.MUSHROOM]:         'Fungal Guardian',
  [ENTITY.GOBLIN_BERSERKER]: 'Goblin Berserker',
  [ENTITY.GOBLIN_WARLORD]:   'Goblin Warlord',
  [ENTITY.SPIDER_QUEEN]:     'Spider Queen',
  [ENTITY.LICH]:             'Lich',
  [ENTITY.MYCELIUM_LORD]:    'Mycelium Lord',
  [ENTITY.FIRE_ELEMENTAL]:   'Fire Elemental',
  [ENTITY.FROST_GIANT]:      'Frost Giant',
  [ENTITY.GOBLIN_SCOUT]:     'Goblin Scout',
  [ENTITY.GOBLIN_CHIEF]:     'Goblin Chief',
  [ENTITY.CAVE_CRAWLER]:     'Cave Crawler',
  [ENTITY.VENOM_SPITTER]:    'Venom Spitter',
  [ENTITY.COCOON_HORROR]:    'Cocoon Horror',
  [ENTITY.ZOMBIE]:           'Zombie',
  [ENTITY.BONE_ARCHER]:      'Bone Archer',
  [ENTITY.PHANTOM]:          'Phantom',
  [ENTITY.DEATH_KNIGHT]:     'Death Knight',
  [ENTITY.NECROMANCER]:      'Necromancer',
  [ENTITY.SPORE_WALKER]:     'Spore Walker',
  [ENTITY.TOXIC_TOAD]:       'Toxic Toad',
  [ENTITY.VINE_LURKER]:      'Vine Lurker',
  [ENTITY.MOSS_GOLEM]:       'Moss Golem',
  [ENTITY.FIRE_IMP]:         'Fire Imp',
  [ENTITY.LAVA_HOUND]:       'Lava Hound',
  [ENTITY.ASH_WRAITH]:       'Ash Wraith',
  [ENTITY.MAGMA_GOLEM]:      'Magma Golem',
  [ENTITY.INFERNAL_MAGE]:    'Infernal Mage',
  [ENTITY.EMBER_BAT]:        'Ember Bat',
  [ENTITY.ICE_SPIDER]:       'Ice Spider',
  [ENTITY.FROST_WRAITH]:     'Frost Wraith',
  [ENTITY.FROZEN_SENTINEL]:  'Frozen Sentinel',
  [ENTITY.SNOW_WOLF]:        'Snow Wolf',
  [ENTITY.ICE_MAGE]:         'Ice Mage',
  [ENTITY.SHADOW_STALKER]:   'Shadow Stalker',
  [ENTITY.CRYSTAL_GOLEM]:    'Crystal Golem',
  [ENTITY.DEMON_LORD]:       'Demon Lord',
  [ENTITY.DRAGON_WHELP]:     'Dragon Whelp',
  [ENTITY.ANCIENT_WYRM]:     'Ancient Wyrm',
};

export function getEnemyName(entity) {
  const base = ENEMY_NAMES[entity.type] || 'Enemy';
  if (entity.elitePrefix) return entity.elitePrefix + ' ' + base;
  return base;
}

function getEnemyNameLower(entity) {
  return 'the ' + getEnemyName(entity).toLowerCase();
}

// ── Bestiary ─────────────────────────────────

function recordKill(entityType, enemy) {
  if (!state.bestiary[entityType]) {
    state.bestiary[entityType] = { kills: 0 };
  }
  state.bestiary[entityType].kills++;
  state.stats.totalKills++;
  // Quest progress
  updateQuestProgress('kill', entityType);
  updateQuestProgress('kill_any', null);
  // Achievement: elite/miniboss/boss kills
  if (enemy && enemy.isElite) unlockAchievement('elite_hunter');
  if (enemy && enemy.isMiniboss) unlockAchievement('boss_slayer');
  if (enemy && (entityType === 'ancient_wyrm' || entityType === 'dragon_whelp')) unlockAchievement('dragon_slayer');
  // Boss QoL skill rewards
  if (enemy && enemy.isBoss) {
    grantBossSkills(state.floor);
  }
  checkAchievements();
}

function grantBossSkills(floor) {
  for (const skill of Object.values(BOSS_SKILLS)) {
    if (floor >= skill.floor && !state.bossSkills[skill.id]) {
      state.bossSkills[skill.id] = true;
      log(t('log.boss_reward', { name: skill.name, desc: skill.desc }), 'level');
    }
  }
}

export function getBestiaryEntries() {
  const entries = [];
  for (const [type, info] of Object.entries(BESTIARY_INFO)) {
    const kills = state.bestiary[type] ? state.bestiary[type].kills : 0;
    entries.push({ type, ...info, kills, discovered: kills > 0 || state.godMode });
  }
  return entries;
}

export function toggleBestiary() {
  state.showBestiary = !state.showBestiary;
}

// ── Armory (Item Codex) ─────────────────────

function registerArmoryItem(itemId) {
  if (!itemId) return;
  if (!state.armory[itemId]) {
    state.armory[itemId] = { count: 0 };
  }
  state.armory[itemId].count++;
}

export function getArmoryEntries() {
  const entries = [];
  for (const [id, itemDef] of Object.entries(ITEMS)) {
    const record = state.armory[id];
    entries.push({
      id,
      ...itemDef,
      timesFound: record ? record.count : 0,
      discovered: (record ? true : false) || state.godMode,
    });
  }
  return entries;
}

export function toggleArmory() {
  state.showArmory = !state.showArmory;
}

export function toggleMinimap() {
  state.showMinimap = !state.showMinimap;
}

// ── Quest Board System ──────────────────────

export function toggleQuestBoard() {
  state.showQuestBoard = !state.showQuestBoard;
}

export function closeQuestBoard() {
  state.showQuestBoard = false;
}

// ── Fishing System ──────────────────────────────

export function closeFishing() {
  if (state.fishingTimer) clearTimeout(state.fishingTimer);
  state.showFishing = false;
  state.fishingPhase = 'idle';
  state.fishingTimer = null;
  state.fishingCatch = null;
}

function rollFishLoot() {
  const totalWeight = FISH_LOOT.reduce((s, f) => s + f.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const fish of FISH_LOOT) {
    roll -= fish.weight;
    if (roll <= 0) return fish;
  }
  return FISH_LOOT[0];
}

export function castLine() {
  if (state.fishingPhase !== 'idle' && state.fishingPhase !== 'caught' && state.fishingPhase !== 'missed') return;
  state.fishingPhase = 'waiting';
  state.fishingCatch = null;
  log(t('log.cast_line'), 'info');

  const waitTime = 2000 + Math.random() * 3000; // 2-5 seconds
  state.fishingTimer = setTimeout(() => {
    state.fishingPhase = 'bite';
    state.fishingTimer = setTimeout(() => {
      // 1.5s window expired
      if (state.fishingPhase === 'bite') {
        state.fishingPhase = 'missed';
        log(t('log.fish_escaped'), 'combat');
      }
    }, 1500);
  }, waitTime);
}

export function reelIn() {
  if (state.fishingPhase !== 'bite') return;
  if (state.fishingTimer) clearTimeout(state.fishingTimer);
  state.fishingTimer = null;

  const catch_ = rollFishLoot();
  state.fishingCatch = catch_;
  state.fishingPhase = 'caught';
  state.stats.fishCaught++;
  log(t('log.fish_caught', { name: catch_.name }), 'item');

  // Apply catch rewards
  if (catch_.type === 'consumable') {
    if (catch_.healAmount > 0) {
      const healed = Math.min(catch_.healAmount, state.player.maxHp - state.player.hp);
      state.player.hp += healed;
      if (healed > 0) log(t('log.fish_healed', { n: healed }), 'heal');
    }
    if (catch_.effect) {
      state.player.effects.push({
        name: catch_.effect.name,
        stat: catch_.effect.stat,
        amount: catch_.effect.amount,
        turns: catch_.effect.turns,
      });
      log(t('log.fish_effect', { name: catch_.effect.name, amount: catch_.effect.amount, stat: catch_.effect.stat, turns: catch_.effect.turns }), 'level');
    }
  } else if (catch_.type === 'junk') {
    state.player.gold += catch_.sellValue;
    state.stats.totalGoldEarned += catch_.sellValue;
    log(t('log.fish_sold', { n: catch_.sellValue }), 'info');
  } else if (catch_.type === 'gold') {
    state.player.gold += catch_.goldValue;
    state.stats.totalGoldEarned += catch_.goldValue;
  } else if (catch_.type === 'equipment') {
    // Trident of the Deep
    const item = { ...ITEMS.trident_deep };
    if (state.player.inventory.length < BACKPACK_SIZE) {
      state.player.inventory.push(item);
      registerArmoryItem('trident_deep');
      log(t('log.trident_found'), 'level');
    } else {
      log(t('log.trident_lost'), 'combat');
    }
  }

  checkAchievements();
}

// ── Arena System ────────────────────────────────

export function closeArena() {
  state.showArena = false;
}

export function enterArena() {
  state.showArena = false;
  state.mode = 'arena';
  state.arenaWave = 0;
  state.arenaRewards = { gold: 0, items: [] };
  state.arenaWaveCleared = false;

  // Generate arena map
  const { map, playerStart } = generateArenaMap();
  state.map = map;
  state.mapW = ARENA_CONFIG.MAP_SIZE;
  state.mapH = ARENA_CONFIG.MAP_SIZE;
  state.player.x = playerStart.x;
  state.player.y = playerStart.y;
  state.enemies = [];
  state.items = [];
  state.chests = [];
  state.visibility = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));

  log(t('log.enter_arena'), 'level');
  startArenaWave();
}

function getArenaPool(wave) {
  if (wave <= 3) return ARENA_CONFIG.ARENA_SPAWN_POOLS.weak;
  if (wave <= 6) return ARENA_CONFIG.ARENA_SPAWN_POOLS.medium;
  return ARENA_CONFIG.ARENA_SPAWN_POOLS.strong;
}

function getArenaEnemyCount(wave) {
  if (wave <= 3) return randInt(2, 3);
  if (wave <= 6) return randInt(3, 4);
  return randInt(4, 5);
}

function getArenaEliteCount(wave) {
  if (wave <= 3) return 0;
  if (wave <= 6) return 1;
  return Math.min(wave - 5, 3);
}

function startArenaWave() {
  state.arenaWave++;
  state.arenaWaveCleared = false;
  const wave = state.arenaWave;

  const pool = getArenaPool(wave);
  const count = getArenaEnemyCount(wave);
  const eliteCount = getArenaEliteCount(wave);
  const isMiniboss = wave >= 10 && wave % 5 === 0;

  log(t('log.arena_wave', { n: wave }), 'level');

  // Spawn enemies on edges of arena
  const spawnPositions = [];
  for (let x = 1; x < ARENA_CONFIG.MAP_SIZE - 1; x++) {
    spawnPositions.push({ x, y: 1 });
    spawnPositions.push({ x, y: ARENA_CONFIG.MAP_SIZE - 2 });
  }
  for (let y = 2; y < ARENA_CONFIG.MAP_SIZE - 2; y++) {
    spawnPositions.push({ x: 1, y });
    spawnPositions.push({ x: ARENA_CONFIG.MAP_SIZE - 2, y });
  }
  // Shuffle spawn positions
  spawnPositions.sort(() => Math.random() - 0.5);

  let spawned = 0;
  for (let i = 0; i < count && i < spawnPositions.length; i++) {
    const pos = spawnPositions[i];
    if (isOccupied(pos.x, pos.y)) continue;

    const type = pool[randInt(0, pool.length - 1)];
    const enemy = createEntity(type, pos.x, pos.y);

    // Scale stats by wave
    enemy.maxHp += wave * 2;
    enemy.hp = enemy.maxHp;
    enemy.power += Math.floor(wave / 2);

    // Mark as elite
    if (spawned < eliteCount) {
      enemy.isElite = true;
      enemy.name = ELITE_PREFIXES[randInt(0, ELITE_PREFIXES.length - 1)] + ' ' + enemy.name;
      enemy.maxHp = Math.floor(enemy.maxHp * 1.5);
      enemy.hp = enemy.maxHp;
      enemy.power += 2;
    }

    // Miniboss on milestone waves
    if (isMiniboss && spawned === 0) {
      enemy.isMiniboss = true;
      enemy.name = 'Arena Champion ' + enemy.name;
      enemy.maxHp = Math.floor(enemy.maxHp * 2.5);
      enemy.hp = enemy.maxHp;
      enemy.power += 5;
    }

    state.enemies.push(enemy);
    spawned++;
  }

  state.arenaEnemiesRemaining = spawned;
  updateFOV();
}

export function checkArenaWaveCleared() {
  if (state.mode !== 'arena') return;
  const alive = state.enemies.filter(e => e.hp > 0).length;
  state.arenaEnemiesRemaining = alive;
  if (alive > 0) return;

  state.arenaWaveCleared = true;
  const wave = state.arenaWave;

  // Calculate rewards
  const waveGold = ARENA_CONFIG.REWARDS.goldPerWave(wave);
  state.arenaRewards.gold += waveGold;
  state.player.gold += waveGold;
  state.stats.totalGoldEarned += waveGold;
  log(t('log.wave_cleared', { n: wave, gold: waveGold }), 'level');

  // Milestone bonuses
  if (wave === 5) {
    state.arenaRewards.gold += ARENA_CONFIG.REWARDS.wave5Bonus;
    state.player.gold += ARENA_CONFIG.REWARDS.wave5Bonus;
    state.stats.totalGoldEarned += ARENA_CONFIG.REWARDS.wave5Bonus;
    // Random tier 2 item
    const tier2Items = Object.entries(ITEMS).filter(([, v]) => v.tier === 2 && v.type === ITEM_TYPE.WEAPON || v.tier === 2 && v.type === ITEM_TYPE.ARMOR);
    if (tier2Items.length > 0) {
      const [itemId, itemDef] = tier2Items[randInt(0, tier2Items.length - 1)];
      const item = { ...itemDef };
      if (state.player.inventory.length < BACKPACK_SIZE) {
        state.player.inventory.push(item);
        registerArmoryItem(itemId);
        state.arenaRewards.items.push(item.name);
        log(t('log.bonus_item', { name: item.name }), 'item');
      }
    }
    log(t('log.wave5_bonus', { n: ARENA_CONFIG.REWARDS.wave5Bonus }), 'level');
  }
  if (wave === 10) {
    state.arenaRewards.gold += ARENA_CONFIG.REWARDS.wave10Bonus;
    state.player.gold += ARENA_CONFIG.REWARDS.wave10Bonus;
    state.stats.totalGoldEarned += ARENA_CONFIG.REWARDS.wave10Bonus;
    // Random tier 3 item
    const tier3Items = Object.entries(ITEMS).filter(([, v]) => v.tier === 3 && (v.type === ITEM_TYPE.WEAPON || v.type === ITEM_TYPE.ARMOR));
    if (tier3Items.length > 0) {
      const [itemId, itemDef] = tier3Items[randInt(0, tier3Items.length - 1)];
      const item = { ...itemDef };
      if (state.player.inventory.length < BACKPACK_SIZE) {
        state.player.inventory.push(item);
        registerArmoryItem(itemId);
        state.arenaRewards.items.push(item.name);
        log(t('log.bonus_item', { name: item.name }), 'item');
      }
    }
    log(t('log.wave10_bonus', { n: ARENA_CONFIG.REWARDS.wave10Bonus }), 'level');
  }
  if (wave >= 15) {
    state.arenaRewards.gold += ARENA_CONFIG.REWARDS.wave15PlusBonus;
    state.player.gold += ARENA_CONFIG.REWARDS.wave15PlusBonus;
    state.stats.totalGoldEarned += ARENA_CONFIG.REWARDS.wave15PlusBonus;
  }

  // Track best wave
  if (wave > state.arenaBestWave) {
    state.arenaBestWave = wave;
    state.stats.arenaBestWave = wave;
  }

  checkAchievements();
}

export function nextArenaWave() {
  if (!state.arenaWaveCleared) return;
  // Heal 10% between waves
  const healAmount = Math.floor(state.player.maxHp * ARENA_CONFIG.WAVE_HEAL_PERCENT / 100);
  const healed = Math.min(healAmount, state.player.maxHp - state.player.hp);
  if (healed > 0) {
    state.player.hp += healed;
    log(t('log.healed_between', { n: healed }), 'heal');
  }
  startArenaWave();
  updateFOV();
}

export function leaveArena() {
  const totalGold = state.arenaRewards.gold;
  const totalItems = state.arenaRewards.items;
  log(t('log.leave_arena', { n: state.arenaWave }), 'info');
  if (totalGold > 0) log(t('log.arena_earnings', { n: totalGold }), 'level');
  if (totalItems.length > 0) log(t('log.arena_items', { items: totalItems.join(', ') }), 'item');

  state.mode = 'village';
  state.arenaWave = 0;
  state.arenaEnemiesRemaining = 0;
  state.arenaRewards = { gold: 0, items: [] };
  state.arenaWaveCleared = false;
  state.enemies = [];
  initVillage();
}

export function getAvailableQuests() {
  // Return 3 quests that are not already active or completed
  const activeIds = state.quests.map(q => q.id);
  const pool = QUEST_POOL.filter(q =>
    !activeIds.includes(q.id) && !state.completedQuestIds.includes(q.id)
  );
  // Shuffle and pick up to 3
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

export function getActiveQuests() {
  return state.quests;
}

export function acceptQuest(questId) {
  const def = QUEST_POOL.find(q => q.id === questId);
  if (!def) return;
  if (state.quests.find(q => q.id === questId)) return;
  if (state.quests.length >= 5) {
    log(t('log.quest_limit'), 'info');
    return;
  }
  state.quests.push({ ...def, progress: 0, completed: false });
  log(t('log.quest_accepted', { name: def.name }), 'level');
}

export function abandonQuest(questId) {
  const idx = state.quests.findIndex(q => q.id === questId);
  if (idx !== -1) {
    log(t('log.quest_abandoned', { name: state.quests[idx].name }), 'info');
    state.quests.splice(idx, 1);
  }
}

export function turnInQuest(questId) {
  const idx = state.quests.findIndex(q => q.id === questId && q.completed);
  if (idx === -1) return;
  const quest = state.quests[idx];
  state.player.gold += quest.goldReward;
  grantXP(quest.xpReward);
  if (quest.itemReward) {
    const item = { ...ITEMS[quest.itemReward] };
    if (item.stackable) item.count = 1;
    if (state.player.inventory.length < BACKPACK_SIZE) {
      state.player.inventory.push(item);
      registerArmoryItem(quest.itemReward);
      log(t('log.received_item', { name: item.name }), 'item');
    } else {
      log(t('log.backpack_full_reward'), 'info');
    }
  }
  log(t('log.quest_complete', { name: quest.name, gold: quest.goldReward }), 'level');
  state.completedQuestIds.push(quest.id);
  state.quests.splice(idx, 1);
}

function updateQuestProgress(type, target) {
  for (const quest of state.quests) {
    if (quest.completed) continue;
    if (quest.type === type) {
      if (type === 'kill' && quest.target === target) {
        quest.progress++;
      } else if (type === 'kill_any') {
        quest.progress++;
      } else if (type === 'reach' && target >= quest.amount) {
        quest.progress = quest.amount;
      } else if (type === 'collect') {
        quest.progress = state.player.gold;
      }
      if (quest.progress >= quest.amount) {
        quest.completed = true;
        log(t('log.quest_ready', { name: quest.name }), 'level');
      }
    }
  }
}

// ── Settings ────────────────────────────────

export function toggleSettings() {
  state.showSettings = !state.showSettings;
  if (state.showSettings) window.dispatchEvent(new Event('settingsOpened'));
}

export function closeSettings() {
  state.showSettings = false;
}

// ── Character Sheet ────────────────────────

export function toggleCharSheet() {
  state.showCharSheet = !state.showCharSheet;
}

export function closeCharSheet() {
  state.showCharSheet = false;
}

export function toggleSkillTree() {
  state.showSkillTree = !state.showSkillTree;
}

export function closeSkillTree() {
  state.showSkillTree = false;
}

// ── Skill Helpers ──────────────────────────────

export function getSkillRank(skillId) {
  return (state.player && state.player.skills && state.player.skills[skillId]) || 0;
}

function findSkillDef(skillId) {
  const tree = SKILL_TREES[state.playerClass];
  if (!tree) return null;
  for (const branch of Object.values(tree)) {
    for (const skill of branch.skills) {
      if (skill.id === skillId) return skill;
    }
  }
  return null;
}

export function canLearnSkill(skillId) {
  const p = state.player;
  if (!p || p.skillPoints <= 0) return false;
  const tree = SKILL_TREES[state.playerClass];
  if (!tree) return false;
  const def = findSkillDef(skillId);
  if (!def) return false;
  const currentRank = getSkillRank(skillId);
  if (currentRank >= def.maxRank) return false;
  // Check prerequisite
  if (def.requires && getSkillRank(def.requires) < 1) return false;
  return true;
}

export function learnSkill(skillId) {
  if (!canLearnSkill(skillId)) return false;
  const p = state.player;
  if (!p.skills) p.skills = {};
  p.skills[skillId] = (p.skills[skillId] || 0) + 1;
  p.skillPoints--;
  const def = findSkillDef(skillId);
  const rank = p.skills[skillId];
  log(t('log.learned_skill', { name: def.name, rank: rank }), 'level');
  // Apply passive effects that change stats
  if (skillId === 'tough_skin') recalcDerivedStats();
  if (skillId === 'mana_flow') recalcDerivedStats();
  return true;
}

export function getSkillTree() {
  return SKILL_TREES[state.playerClass] || {};
}

// ── Active Skills ──────────────────────────────

function getAdjacentEnemies() {
  const px = state.player.x, py = state.player.y;
  return state.enemies.filter(e => e.hp > 0 && Math.abs(e.x - px) <= 1 && Math.abs(e.y - py) <= 1 && !(e.x === px && e.y === py));
}

export function useActiveSkill(skillId) {
  if (state.gameOver || state.pendingLevelUp) return false;
  const rank = getSkillRank(skillId);
  if (rank < 1) { log(t('log.skill_not_learned'), 'info'); return false; }
  const def = findSkillDef(skillId);
  if (!def || def.type !== 'active') return false;
  const p = state.player;
  const cd = p.skillCooldowns || {};
  if (cd[skillId] > 0) { log(t('log.skill_cooldown', { name: def.name, n: cd[skillId] }), 'info'); return false; }

  switch (skillId) {
    case 'cleave': {
      const targets = getAdjacentEnemies();
      if (targets.length === 0) { log(t('log.no_adjacent'), 'info'); return false; }
      const dmgPct = [0.5, 0.75, 1.0][rank - 1];
      const power = getEffectivePower(p);
      for (const tgt of targets) {
        const armor = getEffectiveArmor(tgt);
        const dmg = Math.max(1, Math.floor(power * dmgPct) - armor + randInt(-1, 1));
        tgt.hp -= dmg;
        log(t('log.cleave_hit', { name: getEnemyName(tgt), dmg: dmg }), 'combat');
        if (tgt.hp <= 0) {
          tgt.hp = 0;
          log(t('log.enemy_defeated', { name: getEnemyName(tgt) }), 'combat');
          recordKill(tgt.type, tgt);
          grantXP(tgt.xpReward || 8);
          grantGold(tgt);
          dropLoot(tgt);
          onKillEffects();
        }
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'execute': {
      const target = findNearestVisibleEnemy(2);
      if (!target) { log(t('log.no_enemies_nearby'), 'info'); return false; }
      if (target.hp > target.maxHp * 0.3) { log(t('log.too_much_hp', { name: getEnemyName(target) }), 'info'); return false; }
      const power = getEffectivePower(p);
      const dmg = Math.max(1, power * 3 - getEffectiveArmor(target));
      target.hp -= dmg;
      log(t('log.execute_hit', { name: getEnemyName(target), dmg: dmg }), 'combat');
      if (target.hp <= 0) {
        target.hp = 0;
        log(t('log.enemy_executed', { name: getEnemyName(target) }), 'combat');
        recordKill(target.type, target);
        grantXP(target.xpReward || 8);
        grantGold(target);
        dropLoot(target);
        onKillEffects();
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'battle_cry': {
      const visible = state.enemies.filter(e => e.hp > 0 && state.visibility[e.y] && state.visibility[e.y][e.x]);
      if (visible.length === 0) { log(t('log.no_visible_enemies'), 'info'); return false; }
      for (const e of visible) {
        e.stunTurns = (e.stunTurns || 0) + 2;
      }
      log(t('log.battle_cry', { n: visible.length }), 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'multishot': {
      const maxTargets = rank >= 3 ? 99 : rank + 1;
      const bowRange = BOW_RANGE + getRangeBonus(p);
      const targets = findMultipleVisibleEnemies(bowRange, maxTargets);
      if (targets.length === 0) { log(t('log.no_enemies_range'), 'info'); return false; }
      const bowPower = getEffectiveRangedPower(p);
      for (const tgt of targets) {
        state.projectiles.push({ x: tgt.x, y: tgt.y, type: 'arrow', ttl: 3 });
        rangedAttack(tgt, bowPower, 'arrow');
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'poison_arrow': {
      const bowRange = BOW_RANGE + getRangeBonus(p);
      const target = findNearestVisibleEnemy(bowRange);
      if (!target) { log(t('log.no_enemies_range'), 'info'); return false; }
      const bowPower = getEffectiveRangedPower(p);
      state.projectiles.push({ x: target.x, y: target.y, type: 'arrow', ttl: 3 });
      rangedAttack(target, bowPower, 'poison arrow');
      const poisonDmg = rank + 1; // 2, 3, 4
      target.poisonDot = { dmg: poisonDmg, turns: 3 };
      log(t('log.poison_applied', { name: getEnemyName(target), dmg: poisonDmg }), 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'smoke_bomb': {
      p.invisible = 3;
      log(t('log.smoke_bomb'), 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
  }
  return false;
}

function onKillEffects() {
  // Bloodlust passive heal on kill
  const blRank = getSkillRank('bloodlust');
  if (blRank > 0) {
    const heal = [3, 5, 8][blRank - 1];
    const healed = Math.min(heal, state.player.maxHp - state.player.hp);
    if (healed > 0) {
      state.player.hp += healed;
      log(t('log.bloodlust_heal', { n: healed }), 'item');
    }
  }
}

// ── Achievement System ─────────────────────────

function unlockAchievement(id) {
  if (state.achievements[id]) return; // already unlocked
  if (!ACHIEVEMENTS[id]) return;
  state.achievements[id] = Date.now();
  const ach = ACHIEVEMENTS[id];
  log(t('log.achievement_unlocked', { icon: ach.icon, name: ach.name }), 'level');
  state.achievementToast = { id, name: ach.name, icon: ach.icon, timer: 180 }; // ~3 seconds at 60fps
}

export function checkAchievements() {
  const p = state.player;
  if (!p) return;

  const totalKills = state.stats.totalKills;
  const bestiary = state.bestiary;

  // Combat
  if (totalKills >= 1) unlockAchievement('first_blood');
  if (totalKills >= 50) unlockAchievement('monster_slayer');
  if (totalKills >= 200) unlockAchievement('massacre');

  // Goblin kills
  const goblinTypes = ['goblin', 'goblin_shaman', 'goblin_berserker', 'goblin_scout', 'goblin_chief'];
  const goblinKills = goblinTypes.reduce((sum, t) => sum + (bestiary[t] ? bestiary[t].kills : 0), 0);
  if (goblinKills >= 20) unlockAchievement('goblin_bane');

  // Undead kills
  const undeadTypes = ['skeleton', 'zombie', 'wraith', 'phantom', 'death_knight', 'necromancer', 'bone_archer'];
  const undeadKills = undeadTypes.reduce((sum, t) => sum + (bestiary[t] ? bestiary[t].kills : 0), 0);
  if (undeadKills >= 20) unlockAchievement('undead_purger');

  // Exploration
  if (state.stats.highestFloor >= 5) unlockAchievement('spelunker');
  if (state.stats.highestFloor >= 10) unlockAchievement('deep_diver');
  if (state.stats.highestFloor >= 20) unlockAchievement('abyss_walker');

  // Bestiary discovery count
  const discovered = Object.values(bestiary).filter(b => b.kills > 0).length;
  if (discovered >= 10) unlockAchievement('explorer');
  if (discovered >= 25) unlockAchievement('naturalist');

  // Progression
  if (p.level >= 5) unlockAchievement('level_5');
  if (p.level >= 10) unlockAchievement('level_10');
  if (p.level >= 20) unlockAchievement('level_20');

  // Skills
  if (p.skills) {
    const learnedAny = Object.values(p.skills).some(r => r > 0);
    if (learnedAny) unlockAchievement('first_skill');
    // Check if any skill is maxed
    const tree = SKILL_TREES[state.playerClass];
    if (tree) {
      for (const branch of Object.values(tree)) {
        for (const skill of branch.skills) {
          if ((p.skills[skill.id] || 0) >= skill.maxRank) {
            unlockAchievement('skill_master');
          }
        }
      }
    }
  }

  // Wealth
  if (state.stats.totalGoldEarned >= 500) unlockAchievement('wealthy');
  if (state.stats.totalGoldEarned >= 2000) unlockAchievement('rich');
  if (state.stats.itemsBought >= 10) unlockAchievement('shopper');

  // Collection
  const armoryCount = Object.keys(state.armory).length;
  if (armoryCount >= 10) unlockAchievement('collector');
  if (armoryCount >= 25) unlockAchievement('curator');
  if (state.stats.chestsOpened >= 10) unlockAchievement('chest_hunter');

  // Fully equipped
  if (p.equipment) {
    const slots = Object.values(p.equipment);
    if (slots.length >= 6 && slots.every(s => s !== null)) unlockAchievement('fully_equipped');
  }

  // Speed runner
  if (state.stats.highestFloor >= 5 && state.turnCount <= 150) unlockAchievement('speed_runner');

  // Quest complete
  if (state.completedQuestIds.length >= 1) unlockAchievement('quest_complete');

  // Fishing
  if (state.stats.fishCaught >= 20) unlockAchievement('master_angler');

  // Arena
  if (state.stats.arenaBestWave >= 5) unlockAchievement('gladiator');
  if (state.stats.arenaBestWave >= 10) unlockAchievement('arena_champion');
}

export function getAchievements() {
  const result = [];
  for (const [id, def] of Object.entries(ACHIEVEMENTS)) {
    const unlocked = !!state.achievements[id];
    if (def.hidden && !unlocked) continue; // hide secret achievements
    result.push({ id, ...def, unlocked, time: state.achievements[id] || null });
  }
  return result;
}

export function toggleAchievements() {
  state.showAchievements = !state.showAchievements;
}

export function closeAchievements() {
  state.showAchievements = false;
}

// ── Boss QoL Skills ─────────────────────────────

export function useTownPortal() {
  if (state.mode !== 'dungeon') { log(t('log.portal_dungeon_only'), 'info'); return; }
  if (!state.bossSkills.town_portal) { log(t('log.portal_not_learned'), 'info'); return; }
  log(t('log.portal_opened'), 'level');
  state.lastDungeonFloor = state.floor;
  initVillage();
}

export function getBossSkills() {
  return state.bossSkills;
}

export function applyCheatCode(code) {
  if (code.toLowerCase() === 'godmode') {
    state.godMode = !state.godMode;
    log(state.godMode ? t('log.godmode_on') : t('log.godmode_off'), 'level');
    unlockAchievement('godlike');
    return true;
  }
  return false;
}

export function closeHealer() {
  state.showHealer = false;
}

export function healPlayer() {
  const p = state.player;
  if (p.hp >= p.maxHp && p.mana >= p.maxMana) {
    log(t('log.already_healed'), 'info');
    return;
  }
  if (p.gold < HEALER_COST) {
    log(t('log.not_enough_gold_healer', { n: HEALER_COST }), 'info');
    return;
  }
  p.gold -= HEALER_COST;
  p.hp = p.maxHp;
  p.mana = p.maxMana;
  log(t('log.healer_healed', { n: HEALER_COST }), 'item');
}

export function closeShop() {
  state.showShop = false;
  state.isDungeonShop = false;
}

// ── Chest System ─────────────────────────────

export function closeChest() {
  state.showChest = false;
  state.activeChest = null;
}

export function takeChestItem(index) {
  const chest = state.activeChest;
  if (!chest || index < 0 || index >= chest.items.length) return;
  const p = state.player;
  if (p.inventory.length >= BACKPACK_SIZE) {
    log(t('log.backpack_full'), 'info');
    return;
  }
  const item = chest.items.splice(index, 1)[0];
  const newItem = { ...item };
  if (newItem.stackable) {
    const existing = p.inventory.find(i => i.id === newItem.id && (i.count || 1) < (i.maxStack || 5));
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      newItem.count = 1;
      p.inventory.push(newItem);
    }
  } else {
    p.inventory.push(newItem);
  }
  registerArmoryItem(item.id);
  log(t('log.took_from_chest', { name: item.name }), 'item');
}

export function takeChestGold() {
  const chest = state.activeChest;
  if (!chest || chest.gold <= 0) return;
  state.player.gold += chest.gold;
  log(t('log.took_gold_chest', { n: chest.gold }), 'item');
  chest.gold = 0;
}

export function takeAllFromChest() {
  const chest = state.activeChest;
  if (!chest) return;
  if (chest.gold > 0) takeChestGold();
  while (chest.items.length > 0) {
    if (state.player.inventory.length >= BACKPACK_SIZE) {
      log(t('log.backpack_full'), 'info');
      break;
    }
    takeChestItem(0);
  }
  if (chest.items.length === 0 && chest.gold <= 0) {
    closeChest();
  }
}

export function getActiveChest() {
  return state.activeChest;
}

export function getDiscountedPrice(basePrice) {
  if (!state.player || !state.player.attrs) return basePrice;
  const discount = ATTR_BONUSES.cha.shopDiscount(state.player.attrs.cha);
  return Math.max(1, Math.floor(basePrice * (100 - discount) / 100));
}

export function buyItem(shopIndex) {
  const inventory = state.isDungeonShop ? DUNGEON_SHOP_INVENTORY : SHOP_INVENTORY;
  const entry = inventory[shopIndex];
  if (!entry) return;
  const p = state.player;
  const price = getDiscountedPrice(entry.price);
  if (p.gold < price) {
    log(t('log.not_enough_gold'), 'info');
    return;
  }
  if (p.inventory.length >= BACKPACK_SIZE) {
    log(t('log.backpack_full'), 'info');
    return;
  }
  const item = { ...ITEMS[entry.itemId] };
  // Stack if possible
  if (item.stackable) {
    const existing = p.inventory.find(i => i.id === item.id && (i.count || 1) < (i.maxStack || 5));
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      p.gold -= price;
      state.stats.itemsBought++;
      registerArmoryItem(entry.itemId);
      log(t('log.bought_item', { name: item.name, price: price }), 'item');
      checkAchievements();
      return;
    }
  }
  item.count = 1;
  p.inventory.push(item);
  p.gold -= price;
  state.stats.itemsBought++;
  registerArmoryItem(entry.itemId);
  log(t('log.bought_item', { name: item.name, price: price }), 'item');
  checkAchievements();
}

export function sellItem(invIndex) {
  const p = state.player;
  if (invIndex < 0 || invIndex >= p.inventory.length) return;
  const item = p.inventory[invIndex];
  // Sell price = roughly half of shop price, or a base value
  const shopEntry = SHOP_INVENTORY.find(s => s.itemId === item.id) || DUNGEON_SHOP_INVENTORY.find(s => s.itemId === item.id);
  let sellPrice = shopEntry ? Math.floor(shopEntry.price / 2) : 3;
  if (item.tier === 2) sellPrice = Math.max(sellPrice, 10);
  if (item.tier === 3) sellPrice = Math.max(sellPrice, 25);
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    p.inventory.splice(invIndex, 1);
  }
  p.gold += sellPrice;
  log(t('log.sold_item', { name: item.name, price: sellPrice }), 'item');
}

export function getShopInventory() {
  const inventory = state.isDungeonShop ? DUNGEON_SHOP_INVENTORY : SHOP_INVENTORY;
  return inventory.map((entry, idx) => ({
    index: idx,
    item: ITEMS[entry.itemId],
    price: entry.price,
  }));
}

export function getFloorThemeName() {
  if (!state.floorTheme || !FLOOR_THEMES[state.floorTheme]) return null;
  return FLOOR_THEMES[state.floorTheme].name;
}

// ── Derived Stats from Attributes ────────────

function recalcDerivedStats() {
  const p = state.player;
  if (!p || !p.attrs) return;
  const a = p.attrs;
  const oldMaxHp = p.maxHp;
  const oldMaxMana = p.maxMana;

  // Max HP = base class HP + STR bonus + VIT bonus
  p.maxHp = (p.baseMaxHp || 20) + ATTR_BONUSES.str.hpBonus(a.str) + ATTR_BONUSES.vit.hpBonus(a.vit);
  // Max Mana = base class mana + INT bonus
  p.maxMana = (p.baseMaxMana || 0) + ATTR_BONUSES.int.manaBonus(a.int);
  // Base power from STR
  p.power = (p.basePower || 1) + ATTR_BONUSES.str.powerBonus(a.str);
  // Base armor from AGI
  p.armor = (p.baseArmor || 0) + ATTR_BONUSES.agi.armorBonus(a.agi);

  // Skill bonuses
  const tsRank = (p.skills && p.skills.tough_skin) || 0;
  if (tsRank > 0) p.armor += tsRank; // +1/+2/+3 armor
  const mfRank = (p.skills && p.skills.mana_flow) || 0;
  if (mfRank > 0) p.maxMana += [5, 10, 15][mfRank - 1];

  // Set bonuses (HP/mana)
  for (const sb of getActiveSetBonuses(p)) {
    for (const b of sb.activeBonuses) {
      if (b.hpBonus) p.maxHp += b.hpBonus;
      if (b.manaBonus) p.maxMana += b.manaBonus;
    }
  }

  // Prestige bonuses
  if (state.prestigeLevel > 0) {
    p.maxHp += PRESTIGE.PER_LEVEL.hpBonus * state.prestigeLevel;
    p.power += PRESTIGE.PER_LEVEL.powerBonus * state.prestigeLevel;
  }

  // Keep hp/mana within bounds, heal the difference if max increased
  if (p.maxHp > oldMaxHp) p.hp = Math.min(p.maxHp, p.hp + (p.maxHp - oldMaxHp));
  else p.hp = Math.min(p.hp, p.maxHp);
  if (p.maxMana > oldMaxMana) p.mana = Math.min(p.maxMana, p.mana + (p.maxMana - oldMaxMana));
  else p.mana = Math.min(p.mana, p.maxMana);
}

export function getPlayerDodgeChance() {
  if (!state.player || !state.player.attrs) return 0;
  return ATTR_BONUSES.agi.dodgeChance(state.player.attrs.agi);
}

export function getPlayerGoldBonus() {
  if (!state.player || !state.player.attrs) return 0;
  return ATTR_BONUSES.cha.goldBonus(state.player.attrs.cha);
}

export function getPlayerShopDiscount() {
  if (!state.player || !state.player.attrs) return 0;
  return ATTR_BONUSES.cha.shopDiscount(state.player.attrs.cha);
}

// ── Combat ───────────────────────────────────

function getEffectivePower(entity) {
  let p = entity.power;
  if (!entity.equipment) return p;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (!item) continue;
    if (slot === EQUIP_SLOT.WEAPON) {
      p += item.power || 0;
    }
    p += item.powerBonus || 0;
  }
  // Effect bonuses
  if (entity.effects) {
    for (const eff of entity.effects) {
      if (eff.stat === 'power') p += eff.amount;
    }
  }
  // Set bonuses
  for (const sb of getActiveSetBonuses(entity)) {
    for (const b of sb.activeBonuses) {
      if (b.powerBonus) p += b.powerBonus;
    }
  }
  return p;
}

function getEffectiveRangedPower(entity) {
  let p = getEffectivePower(entity);
  // AGI bonus for ranged attacks
  if (entity.attrs) {
    p += ATTR_BONUSES.agi.rangedBonus(entity.attrs.agi);
  }
  return p;
}

function getEffectiveArmor(entity) {
  let a = entity.armor;
  if (!entity.equipment) return a;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (!item) continue;
    a += item.armor || 0;
  }
  // Effect bonuses
  if (entity.effects) {
    for (const eff of entity.effects) {
      if (eff.stat === 'armor') a += eff.amount;
    }
  }
  // Set bonuses
  for (const sb of getActiveSetBonuses(entity)) {
    for (const b of sb.activeBonuses) {
      if (b.armorBonus) a += b.armorBonus;
    }
  }
  return a;
}

function hasEffect(entity, stat) {
  if (!entity.effects) return false;
  return entity.effects.some(e => e.stat === stat);
}

// ── Set Bonus Helpers ────────────────────────

export function getActiveSetBonuses(entity) {
  const result = [];
  if (!entity || !entity.equipment) return result;
  const setCounts = {};
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (item && item.setId) {
      setCounts[item.setId] = (setCounts[item.setId] || 0) + 1;
    }
  }
  for (const [setId, count] of Object.entries(setCounts)) {
    const setDef = ITEM_SETS[setId];
    if (!setDef) continue;
    const activeBonuses = [];
    for (const [threshold, bonus] of Object.entries(setDef.bonuses)) {
      if (count >= parseInt(threshold)) {
        activeBonuses.push({ threshold: parseInt(threshold), ...bonus });
      }
    }
    result.push({ setId, setDef, piecesEquipped: count, piecesTotal: setDef.items.length, activeBonuses });
  }
  return result;
}

// ── Item Feature Helpers ─────────────────────

function getEquippedFeatures(entity) {
  const features = [];
  if (!entity.equipment) return features;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (item && item.features) {
      for (const f of item.features) features.push(f);
    }
  }
  // Set bonus effects
  for (const sb of getActiveSetBonuses(entity)) {
    for (const b of sb.activeBonuses) {
      if (b.effects) {
        for (const f of b.effects) features.push(f);
      }
    }
  }
  return features;
}

function getFeatureValue(entity, featureType) {
  let total = 0;
  for (const f of getEquippedFeatures(entity)) {
    if (f.type === featureType) total += f.value;
  }
  return total;
}

export function playerHasAllSeeingEye() {
  return state.player && getFeatureValue(state.player, 'all_seeing_eye') > 0;
}

function getXpBoostPercent(entity) {
  return getFeatureValue(entity, 'xp_boost');
}

function getSpellBonus(entity) {
  let bonus = 0;
  if (!entity.equipment) return bonus;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (item && item.spellBonus) bonus += item.spellBonus;
  }
  // INT bonus for spells
  if (entity.attrs) {
    bonus += ATTR_BONUSES.int.spellBonus(entity.attrs.int);
  }
  // Set bonuses
  for (const sb of getActiveSetBonuses(entity)) {
    for (const b of sb.activeBonuses) {
      if (b.spellBonus) bonus += b.spellBonus;
    }
  }
  return bonus;
}

function getRangeBonus(entity) {
  let bonus = 0;
  if (!entity.equipment) return bonus;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = entity.equipment[slot];
    if (item && item.rangeBonus) bonus += item.rangeBonus;
  }
  return bonus;
}

export function getPlayerPower() { return getEffectivePower(state.player); }
export function getPlayerArmor() { return getEffectiveArmor(state.player); }

function attack(attacker, defender) {
  // Spell Shield (mage passive) - negate damage using mana
  if (defender.type === ENTITY.PLAYER) {
    const ssRank = getSkillRank('spell_shield');
    if (ssRank > 0 && defender.mana >= 3) {
      const shieldChance = [10, 20, 30][ssRank - 1];
      if (Math.random() * 100 < shieldChance) {
        defender.mana -= 3;
        log(t('log.spell_shield'), 'combat');
        return;
      }
    }
  }

  // Dodge check (AGI-based + Evasion skill) for the defender
  if (defender.attrs) {
    let dodgeChance = ATTR_BONUSES.agi.dodgeChance(defender.attrs.agi);
    const evRank = defender.type === ENTITY.PLAYER ? getSkillRank('evasion_skill') : 0;
    if (evRank > 0) dodgeChance += [5, 10, 15][evRank - 1];
    if (Math.random() * 100 < dodgeChance) {
      const aName = attacker.type === ENTITY.PLAYER ? 'You' : getEnemyName(attacker);
      const dName = defender.type === ENTITY.PLAYER ? 'You' : getEnemyNameLower(defender);
      if (defender.type === ENTITY.PLAYER) {
        log(t('log.you_dodge', { name: getEnemyName(attacker) }), 'combat');
      } else {
        log(t('log.enemy_dodges', { name: getEnemyName(defender) }), 'combat');
      }
      return;
    }
  }

  const power = getEffectivePower(attacker);
  const armor = getEffectiveArmor(defender);
  let baseDmg = Math.max(1, power - armor + randInt(-1, 1));

  // Power Strike passive (warrior skill)
  if (attacker.type === ENTITY.PLAYER) {
    const psRank = getSkillRank('power_strike');
    if (psRank > 0) {
      const chance = [10, 20, 30][psRank - 1];
      if (Math.random() * 100 < chance) {
        baseDmg *= 2;
        log(t('log.power_strike'), 'combat');
      }
    }
  }

  // Crit check
  const critChance = getFeatureValue(attacker, 'crit_chance');
  let isCrit = false;
  if (critChance > 0 && Math.random() * 100 < critChance) {
    baseDmg = baseDmg * 2;
    isCrit = true;
  }

  defender.hp -= baseDmg;
  // Spawn floating damage number
  if (defender.type !== ENTITY.PLAYER) {
    spawnDamageNumber(defender.x, defender.y, baseDmg, isCrit ? '#ff4' : '#fff');
  }
  // Godmode: player can't die
  if (defender.type === ENTITY.PLAYER && state.godMode && defender.hp < 1) {
    defender.hp = 1;
  }

  const aName = attacker.type === ENTITY.PLAYER ? 'You' : getEnemyName(attacker);
  const dName = defender.type === ENTITY.PLAYER ? 'you' : getEnemyNameLower(defender);
  const critTag = isCrit ? ' CRITICAL!' : '';

  if (attacker.type === ENTITY.PLAYER) {
    log(t('log.you_hit', { name: dName, dmg: baseDmg, crit: critTag }), 'combat');
  } else {
    log(t('log.enemy_hits_you', { attacker: aName, defender: dName, dmg: baseDmg, crit: critTag }), 'combat');
  }

  // Elemental bonus damage from attacker's features
  const fireDmg = getFeatureValue(attacker, 'fire_dmg');
  if (fireDmg > 0 && defender.hp > 0) {
    defender.hp -= fireDmg;
    if (defender.type !== ENTITY.PLAYER) spawnDamageNumber(defender.x, defender.y, fireDmg, '#f80');
    log(t('log.fire_burns', { name: dName, dmg: fireDmg }), 'combat');
  }
  const iceDmg = getFeatureValue(attacker, 'ice_dmg');
  if (iceDmg > 0 && defender.hp > 0) {
    defender.hp -= iceDmg;
    if (defender.type !== ENTITY.PLAYER) spawnDamageNumber(defender.x, defender.y, iceDmg, '#4cf');
    log(t('log.ice_chills', { name: dName, dmg: iceDmg }), 'combat');
  }
  const poisonDmg = getFeatureValue(attacker, 'poison_dmg');
  if (poisonDmg > 0 && defender.hp > 0) {
    if (!defender.effects) defender.effects = [];
    const existing = defender.effects.find(e => e.stat === 'poison');
    if (!existing) {
      defender.effects.push({ name: 'Poison', stat: 'poison', amount: poisonDmg, turns: 3 });
      log(t('log.poisoned', { name: dName }), 'combat');
    }
  }

  // Life steal
  const lifeSteal = getFeatureValue(attacker, 'life_steal');
  if (lifeSteal > 0 && attacker.hp < attacker.maxHp) {
    const healed = Math.min(lifeSteal, attacker.maxHp - attacker.hp);
    attacker.hp += healed;
    if (attacker.type === ENTITY.PLAYER) log(t('log.life_steal', { n: healed }), 'item');
  }

  // Thorns (defender reflects damage to attacker)
  const thorns = getFeatureValue(defender, 'thorns');
  if (thorns > 0 && attacker.hp > 0) {
    attacker.hp -= thorns;
    if (defender.type === ENTITY.PLAYER) {
      log(t('log.thorns_reflect', { n: thorns }), 'combat');
    }
  }

  // Godmode on thorns
  if (attacker.type === ENTITY.PLAYER && state.godMode && attacker.hp < 1) {
    attacker.hp = 1;
  }

  if (defender.hp <= 0) {
    defender.hp = 0;
    if (defender.type === ENTITY.PLAYER) {
      checkPlayerDeath('You have been slain!');
    } else {
      log(t('log.you_defeated', { name: getEnemyName(defender) }), 'combat');
      recordKill(defender.type, defender);
      let xpAward = defender.xpReward || 8;
      if (defender.isElite) xpAward = Math.floor(xpAward * 2);
      if (defender.isMiniboss) xpAward = Math.floor(xpAward * 3);
      grantXP(xpAward);
      grantGold(defender);
      dropLoot(defender);
      if (attacker.type === ENTITY.PLAYER) onKillEffects();
    }
  }
  if (attacker.hp <= 0) {
    if (attacker.type === ENTITY.PLAYER) {
      checkPlayerDeath('Thorns have slain you!');
    } else {
      attacker.hp = 0;
    }
  }
}

function rangedAttack(defender, damage, attackName) {
  const armor = getEffectiveArmor(defender);
  // Steady Aim bonus
  const saRank = getSkillRank('steady_aim');
  if (saRank > 0) damage += saRank;
  let finalDamage = Math.max(1, damage - armor + randInt(-1, 1));

  // Headshot crit
  const hsRank = getSkillRank('headshot');
  let critText = '';
  if (hsRank > 0) {
    const critChance = [10, 15, 20][hsRank - 1];
    if (Math.random() * 100 < critChance) {
      finalDamage *= 2;
      critText = ' CRITICAL!';
    }
  }

  defender.hp -= finalDamage;
  spawnDamageNumber(defender.x, defender.y, finalDamage, critText ? '#ff4' : '#fff');
  log(t('log.ranged_hit', { attack: attackName, name: getEnemyName(defender), dmg: finalDamage, crit: critText }), 'combat');

  if (defender.hp <= 0) {
    defender.hp = 0;
    log(t('log.you_defeated', { name: getEnemyName(defender) }), 'combat');
    recordKill(defender.type, defender);
    let xpAward2 = defender.xpReward || 8;
    if (defender.isElite) xpAward2 = Math.floor(xpAward2 * 2);
    if (defender.isMiniboss) xpAward2 = Math.floor(xpAward2 * 3);
    grantXP(xpAward2);
    grantGold(defender);
    dropLoot(defender);
    onKillEffects();
  }
}

function grantXP(amount) {
  if (state.mode === 'arena') return; // No XP from arena kills
  const p = state.player;
  // XP boost from item features + prestige
  let xpBoost = getXpBoostPercent(p);
  if (state.prestigeLevel > 0) xpBoost += PRESTIGE.PER_LEVEL.xpBoostPercent * state.prestigeLevel;
  if (xpBoost > 0) {
    amount = amount + Math.floor(amount * xpBoost / 100);
  }
  p.xp += amount;
  log(t('log.xp_gain', { n: amount }), 'info');

  while (p.xp >= p.xpToLevel) {
    p.xp -= p.xpToLevel;
    p.level++;
    p.xpToLevel = Math.floor(p.xpToLevel * 1.5);
    p.statPoints += 2;
    p.skillPoints = (p.skillPoints || 0) + 1;
    log(t('log.level_up', { level: p.level }), 'level');
  }
}

function grantGold(enemy) {
  const base = GOLD_REWARDS[enemy.type] || 2;
  const bonus = randInt(0, Math.floor(base / 2));
  let gold = base + bonus;
  // Elite/miniboss gold bonus
  if (enemy.isElite) gold = Math.floor(gold * 2);
  if (enemy.isMiniboss) gold = Math.floor(gold * 3);
  // CHA bonus: extra gold %
  if (state.player.attrs) {
    const chaBonus = ATTR_BONUSES.cha.goldBonus(state.player.attrs.cha);
    gold += Math.floor(gold * chaBonus / 100);
  }
  state.player.gold += gold;
  state.stats.totalGoldEarned += gold;
  log(t('log.gold_gain', { n: gold }), 'item');
  checkAchievements();
}

function dropLoot(enemy) {
  const lootTable = LOOT_TABLES[enemy.type];
  if (!lootTable) return;

  // Find a safe drop position (not on stairs/portal)
  let dropX = enemy.x, dropY = enemy.y;
  const dropTile = state.map[dropY] && state.map[dropY][dropX];
  if (dropTile === TILE.CAVE_STAIRS || dropTile === TILE.PORTAL || dropTile === TILE.CAVE_ENTRANCE) {
    // Shift to an adjacent walkable tile
    const offsets = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
    for (const [ox, oy] of offsets) {
      const tx = dropX + ox, ty = dropY + oy;
      if (tx >= 0 && tx < state.mapW && ty >= 0 && ty < state.mapH && canWalk(tx, ty)) {
        const tt = state.map[ty][tx];
        if (tt !== TILE.CAVE_STAIRS && tt !== TILE.PORTAL && tt !== TILE.CAVE_ENTRANCE) {
          dropX = tx; dropY = ty; break;
        }
      }
    }
  }

  // Elites and minibosses get boosted drop rates and can drop multiple
  const isSpecial = enemy.isElite || enemy.isMiniboss || enemy.isBoss;
  const chanceMultiplier = enemy.isMiniboss ? 2.0 : enemy.isElite ? 1.5 : 1.0;

  const autoLoot = !!state.bossSkills.gold_magnet;

  for (const drop of lootTable) {
    const effectiveChance = Math.min(drop.chance * chanceMultiplier, 0.95);
    if (Math.random() < effectiveChance) {
      const item = { ...ITEMS[drop.itemId] };
      if (autoLoot && state.player.inventory.length < BACKPACK_SIZE) {
        state.player.inventory.push(item);
        log(t('log.auto_loot', { name: item.name }), 'item');
        registerArmoryItem(item.id);
      } else {
        state.items.push({ x: dropX, y: dropY, item });
        log(t('log.enemy_dropped', { enemy: getEnemyName(enemy), item: item.name }), 'item');
      }
      if (!isSpecial) break; // only special enemies can drop multiple items
    }
  }

  // Elites and minibosses always drop at least one item
  if (isSpecial && !state.items.find(i => i.x === dropX && i.y === dropY)) {
    const fallback = lootTable[randInt(0, Math.min(2, lootTable.length - 1))];
    if (fallback) {
      const item = { ...ITEMS[fallback.itemId] };
      if (autoLoot && state.player.inventory.length < BACKPACK_SIZE) {
        state.player.inventory.push(item);
        log(t('log.auto_loot', { name: item.name }), 'item');
        registerArmoryItem(item.id);
      } else {
        state.items.push({ x: dropX, y: dropY, item });
        log(t('log.enemy_dropped', { enemy: getEnemyName(enemy), item: item.name }), 'item');
      }
    }
  }
}

// ── Ranged Attacks ───────────────────────────

function hasLineOfSight(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  let cx = x1, cy = y1;

  while (cx !== x2 || cy !== y2) {
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; cx += sx; }
    if (e2 < dx) { err += dx; cy += sy; }
    if (cx === x2 && cy === y2) break;
    const tile = state.map[cy] && state.map[cy][cx];
    if (tile === undefined) return false;
    if (!TILE_PROPS[tile] || !TILE_PROPS[tile].transparent) return false;
  }
  return true;
}

function findNearestVisibleEnemy(range) {
  let nearest = null;
  let nearestDist = Infinity;
  const px = state.player.x, py = state.player.y;

  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const dist = Math.abs(enemy.x - px) + Math.abs(enemy.y - py);
    if (dist > range) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    if (!hasLineOfSight(px, py, enemy.x, enemy.y)) continue;
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = enemy;
    }
  }
  return nearest;
}

export function castFireSpell() {
  if (state.gameOver || state.pendingLevelUp) return false;
  if (state.playerClass !== PLAYER_CLASS.MAGE) {
    log(t('log.only_mages_spell'), 'info');
    return false;
  }
  if (state.player.mana < FIRE_SPELL_COST) {
    log(t('log.not_enough_mana'), 'info');
    return false;
  }

  const spellRange = FIRE_SPELL_RANGE + getRangeBonus(state.player);
  const target = findNearestVisibleEnemy(spellRange);
  if (!target) {
    log(t('log.no_enemies_in_range'), 'info');
    return false;
  }

  state.player.mana -= FIRE_SPELL_COST;
  state.projectiles.push({ x: target.x, y: target.y, type: 'fire', ttl: 3 });
  const spellDamage = FIRE_SPELL_POWER + getSpellBonus(state.player);
  rangedAttack(target, spellDamage, 'fire spell');
  endTurn();
  return true;
}

export function shootBow() {
  if (state.gameOver || state.pendingLevelUp) return false;
  if (state.playerClass !== PLAYER_CLASS.ARCHER) {
    log(t('log.only_archers_bow'), 'info');
    return false;
  }

  const bowRange = BOW_RANGE + getRangeBonus(state.player);
  const target = findNearestVisibleEnemy(bowRange);
  if (!target) {
    log(t('log.no_enemies_in_range'), 'info');
    return false;
  }

  const bowPower = getEffectiveRangedPower(state.player);
  state.projectiles.push({ x: target.x, y: target.y, type: 'arrow', ttl: 3 });
  rangedAttack(target, bowPower, 'arrow');
  endTurn();
  return true;
}

// ── Level Up Choices ─────────────────────────

export function chooseLevelUp(choice) {
  // Legacy — kept for compat, no longer used
  state.pendingLevelUp = false;
}

export function allocateStat(stat) {
  const p = state.player;
  if (p.statPoints <= 0) return;
  if (!p.attrs) return;
  const validAttrs = ['str', 'agi', 'int', 'vit', 'cha'];
  if (!validAttrs.includes(stat)) return;
  p.statPoints--;
  p.attrs[stat]++;
  const labels = { str: 'Strength', agi: 'Agility', int: 'Intelligence', vit: 'Vitality', cha: 'Charisma' };
  log(t('log.stat_up', { stat: labels[stat] }), 'level');
  recalcDerivedStats();
}

// ── Inventory / Equipment ────────────────────

function tryStackItem(item) {
  if (!item.stackable) return false;
  for (const invItem of state.player.inventory) {
    if (invItem.id === item.id && (invItem.count || 1) < (invItem.maxStack || 5)) {
      invItem.count = (invItem.count || 1) + 1;
      return true;
    }
  }
  return false;
}

export function pickupItem() {
  const px = state.player.x;
  const py = state.player.y;
  const idx = state.items.findIndex(i => i.x === px && i.y === py);
  if (idx === -1) return;

  const { item } = state.items[idx];

  // Try stacking first
  if (item.stackable && tryStackItem(item)) {
    state.items.splice(idx, 1);
    registerArmoryItem(item.id);
    log(t('log.picked_up', { name: item.name }), 'item');
    return;
  }

  if (state.player.inventory.length >= BACKPACK_SIZE) {
    log(t('log.backpack_full'), 'info');
    return;
  }

  const newItem = { ...item };
  if (newItem.stackable) newItem.count = 1;
  state.player.inventory.push(newItem);
  state.items.splice(idx, 1);
  registerArmoryItem(item.id);
  log(t('log.picked_up', { name: item.name }), 'item');
}

export function useItem(slotIndex) {
  const inv = state.player.inventory;
  if (slotIndex < 0 || slotIndex >= inv.length) return;

  const item = inv[slotIndex];

  if (item.type === ITEM_TYPE.CONSUMABLE) {
    if (item.healAmount) {
      const p = state.player;
      const healed = Math.min(item.healAmount, p.maxHp - p.hp);
      p.hp += healed;
      log(t('log.used_hp_pot', { name: item.name, n: healed }), 'item');
    }
    if (item.manaAmount) {
      const p = state.player;
      if (p.maxMana <= 0) {
        log(t('log.no_mana_use'), 'info');
        return;
      }
      const restored = Math.min(item.manaAmount, p.maxMana - p.mana);
      p.mana += restored;
      log(t('log.used_mana_pot', { name: item.name, n: restored }), 'item');
    }
    if (item.curePoison) {
      log(t('log.used_antidote', { name: item.name }), 'item');
    }
    if (item.effect) {
      const eff = { ...item.effect };
      // Remove existing effect of same name
      state.player.effects = state.player.effects.filter(e => e.name !== eff.name);
      state.player.effects.push(eff);
      log(t('log.used_potion_effect', { name: item.name, effect: eff.name, turns: eff.turns }), 'item');
    }
    // Decrease stack or remove
    if (item.stackable && (item.count || 1) > 1) {
      item.count--;
    } else {
      inv.splice(slotIndex, 1);
    }
  } else {
    // Equipment item - determine slot from item
    const slot = item.slot;
    if (!slot) return;

    const old = state.player.equipment[slot];
    state.player.equipment[slot] = item;
    inv.splice(slotIndex, 1);
    if (old) inv.push(old);

    // Apply mana bonus from equipment
    recalcMaxMana();

    log(t('log.equipped', { name: item.name }), 'item');
  }
}

export function dropItem(slotIndex) {
  const inv = state.player.inventory;
  if (slotIndex < 0 || slotIndex >= inv.length) return;
  const item = inv[slotIndex];
  // Place item on ground at player's feet
  state.items.push({ x: state.player.x, y: state.player.y, item: { ...item, count: undefined } });
  if (item.stackable && (item.count || 1) > 1) {
    item.count--;
  } else {
    inv.splice(slotIndex, 1);
  }
  log(t('log.dropped', { name: item.name }), 'item');
}

export function destroyItem(slotIndex) {
  const inv = state.player.inventory;
  if (slotIndex < 0 || slotIndex >= inv.length) return;
  const item = inv[slotIndex];
  if (item.stackable && (item.count || 1) > 1) {
    item.count--;
  } else {
    inv.splice(slotIndex, 1);
  }
  log(t('log.destroyed', { name: item.name }), 'item');
}

export function unequipItem(slot) {
  const item = state.player.equipment[slot];
  if (!item) return;
  if (state.player.inventory.length >= BACKPACK_SIZE) {
    log(t('log.cannot_unequip'), 'info');
    return;
  }
  state.player.equipment[slot] = null;
  state.player.inventory.push(item);
  recalcMaxMana();
  log(t('log.unequipped', { name: item.name }), 'item');
}

function recalcMaxMana() {
  // Now handled by recalcDerivedStats — this just adds equipment mana bonuses
  recalcDerivedStats();
  // Also add equipment mana bonuses on top
  let equipMana = 0;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = state.player.equipment[slot];
    if (item && item.manaBonus) equipMana += item.manaBonus;
  }
  // recalcDerivedStats already sets maxMana from base + INT; add equip on top
  state.player.maxMana += equipMana;
  state.player.mana = Math.min(state.player.mana, state.player.maxMana);
}

// ── Enemy AI ─────────────────────────────────

const SIGHT_RANGES = {
  [ENTITY.GOBLIN]:           GOBLIN_SIGHT_RANGE,
  [ENTITY.ORC]:              ORC_SIGHT_RANGE,
  [ENTITY.SKELETON]:         6,
  [ENTITY.SPIDER]:           7,
  [ENTITY.TROLL]:            5,
  [ENTITY.DARK_MAGE]:        8,
  [ENTITY.BAT]:              6,
  [ENTITY.SLIME]:            4,
  [ENTITY.WRAITH]:           8,
  [ENTITY.GOBLIN_SHAMAN]:    7,
  [ENTITY.MUSHROOM]:         4,
  [ENTITY.GOBLIN_BERSERKER]: 6,
  [ENTITY.GOBLIN_WARLORD]:   8,
  [ENTITY.SPIDER_QUEEN]:     8,
  [ENTITY.LICH]:             10,
  [ENTITY.MYCELIUM_LORD]:    6,
  [ENTITY.FIRE_ELEMENTAL]:   8,
  [ENTITY.FROST_GIANT]:      7,
};

function getEnemySightRange(enemy) {
  return SIGHT_RANGES[enemy.type] || GOBLIN_SIGHT_RANGE;
}

function moveEnemies() {
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;

    // Stunned enemies skip turn
    if (enemy.stunTurns > 0) continue;

    // Slowed enemies skip every other turn
    if (enemy.slowTurns > 0 && state.turnCount % 2 === 0) continue;

    // If player is invisible, enemies don't chase
    if (state.player.invisible > 0) continue;

    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    const sightRange = getEnemySightRange(enemy);

    if (dist > sightRange) continue;

    // Adjacent? Attack
    if (dist === 1) {
      attack(enemy, state.player);
      // Goblin Berserker frenzy: 30% chance for double attack
      if (enemy.type === ENTITY.GOBLIN_BERSERKER && Math.random() < 0.3 && state.player.hp > 0) {
        log(t('log.berserker_frenzy'), 'combat');
        attack(enemy, state.player);
      }
      // Goblin Warlord double strike: 35% chance
      if (enemy.type === ENTITY.GOBLIN_WARLORD && Math.random() < 0.35 && state.player.hp > 0) {
        log(t('log.warlord_strikes'), 'combat');
        attack(enemy, state.player);
      }
      // Frost Giant ground slam: 25% chance bonus damage
      if (enemy.type === ENTITY.FROST_GIANT && Math.random() < 0.25 && state.player.hp > 0) {
        const slamDmg = Math.max(1, 4 + randInt(-1, 2));
        state.player.hp -= slamDmg;
        log(t('log.frost_slam', { n: slamDmg }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
      }
      continue;
    }

    // Mycelium Lord regeneration
    if (enemy.type === ENTITY.MYCELIUM_LORD && enemy.hp < enemy.maxHp) {
      enemy.hp = Math.min(enemy.maxHp, enemy.hp + 2);
    }

    // Dark mage ranged attack (if within sight and > 1 tile away)
    if (enemy.type === ENTITY.DARK_MAGE && dist <= 6 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(t('log.shadow_bolt', { n: damage }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
        continue;
      }
    }

    // Goblin Shaman ranged hex (range 5)
    if (enemy.type === ENTITY.GOBLIN_SHAMAN && dist <= 5 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(t('log.shaman_hex', { n: damage }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
        continue;
      }
    }

    // Wraith life drain (range 2, ignores armor)
    if (enemy.type === ENTITY.WRAITH && dist <= 2 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power + randInt(-1, 1));
        state.player.hp -= damage;
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + Math.floor(damage / 2));
        log(t('log.wraith_drain', { n: damage }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
        continue;
      }
    }

    // Lich necrotic bolt (range 8, halved armor)
    if (enemy.type === ENTITY.LICH && dist <= 8 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const halfArmor = Math.floor(getEffectiveArmor(state.player) / 2);
        const damage = Math.max(1, enemy.power - halfArmor + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(t('log.lich_bolt', { n: damage }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
        continue;
      }
    }

    // Fire Elemental flame blast (range 4)
    if (enemy.type === ENTITY.FIRE_ELEMENTAL && dist <= 4 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(t('log.fire_elemental_blast', { n: damage }), 'combat');
        if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
        continue;
      }
    }

    // Chase player
    let mx = 0, my = 0;
    if (Math.abs(dx) >= Math.abs(dy)) {
      mx = dx > 0 ? 1 : -1;
    } else {
      my = dy > 0 ? 1 : -1;
    }

    const nx = enemy.x + mx;
    const ny = enemy.y + my;

    if (canWalk(nx, ny) && !isOccupied(nx, ny)) {
      enemy.x = nx;
      enemy.y = ny;
    } else {
      let ax = 0, ay = 0;
      if (mx !== 0) {
        ay = dy > 0 ? 1 : dy < 0 ? -1 : 0;
      } else {
        ax = dx > 0 ? 1 : dx < 0 ? -1 : 0;
      }
      const anx = enemy.x + ax;
      const any_ = enemy.y + ay;
      if (canWalk(anx, any_) && !isOccupied(anx, any_)) {
        enemy.x = anx;
        enemy.y = any_;
      }
    }
  }
}

// ── Player Turn ──────────────────────────────

export function playerMove(dx, dy) {
  if (state.gameOver || state.pendingLevelUp || state.showChest || state.arenaWaveCleared) return;

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  if (nx < 0 || nx >= state.mapW || ny < 0 || ny >= state.mapH) return;

  // Bump to attack
  const enemy = enemyAt(nx, ny);
  if (enemy) {
    attack(state.player, enemy);
    // Haste effect: double attack
    if (hasEffect(state.player, 'haste') && enemy.hp > 0) {
      log(t('log.haste_strike'), 'combat');
      attack(state.player, enemy);
    }
    endTurn();
    return;
  }

  if (!canWalk(nx, ny)) return;

  state.player.x = nx;
  state.player.y = ny;

  // Cave entrance
  if (state.mode === 'village' && state.map[ny][nx] === TILE.CAVE_ENTRANCE) {
    log(t('log.enter_cave'), 'info');
    enterDungeon(1);
    return;
  }

  // Stairs
  if (state.mode === 'dungeon' && state.map[ny][nx] === TILE.CAVE_STAIRS) {
    // Prestige check: clearing floor 20 triggers NG+ offer
    if (state.floor === PRESTIGE.TRIGGER_FLOOR && state.prestigeLevel < PRESTIGE.MAX_LEVEL) {
      state.showPrestige = true;
      log(t('log.conquered_dungeon'), 'level');
      return;
    }
    log(t('log.descend_deeper'), 'info');
    enterDungeon(state.floor + 1);
    return;
  }

  // Portal
  if (state.map[ny][nx] === TILE.PORTAL) {
    unlockAchievement('portal_user');
    if (state.mode === 'dungeon') {
      log(t('log.portal_return_village'), 'level');
      state.lastDungeonFloor = state.floor;
      initVillage();
    } else if (state.mode === 'village' && state.lastDungeonFloor > 0) {
      log(t('log.portal_return_floor', { floor: state.lastDungeonFloor }), 'level');
      const returnFloor = state.lastDungeonFloor;
      state.lastDungeonFloor = 0;
      enterDungeon(returnFloor);
    }
    return;
  }

  // Healer
  if (state.mode === 'village' && state.map[ny][nx] === TILE.HEALER) {
    state.showHealer = true;
    return;
  }

  // Merchant
  if (state.mode === 'village' && state.map[ny][nx] === TILE.MERCHANT) {
    state.showShop = true;
    return;
  }

  // Dungeon Merchant
  if (state.mode === 'dungeon' && state.map[ny][nx] === TILE.DUNGEON_MERCHANT) {
    state.showShop = true;
    state.isDungeonShop = true;
    return;
  }

  // Quest Board
  if (state.mode === 'village' && state.map[ny][nx] === TILE.QUEST_BOARD) {
    state.showQuestBoard = true;
    // Check collect quests
    for (const q of state.quests) {
      if (q.type === 'collect' && !q.completed) {
        q.progress = state.player.gold;
        if (q.progress >= q.amount) {
          q.completed = true;
          log(t('log.quest_ready', { name: q.name }), 'level');
        }
      }
    }
    return;
  }

  // Fishing Spot
  if (state.mode === 'village' && state.map[ny][nx] === TILE.FISHING_SPOT) {
    state.showFishing = true;
    state.fishingPhase = 'idle';
    return;
  }

  // Arena
  if (state.mode === 'village' && state.map[ny][nx] === TILE.ARENA) {
    state.showArena = true;
    return;
  }

  // Check for chest
  const chest = state.chests.find(c => c.x === nx && c.y === ny && !c.opened);
  if (chest) {
    chest.opened = true;
    state.activeChest = chest;
    state.showChest = true;
    state.stats.chestsOpened++;
    log(t('log.found_chest'), 'item');
    checkAchievements();
    return;
  }

  if (gameSettings.autoPickup) pickupItem();
  endTurn();
}

export function playerWait() {
  if (state.gameOver || state.pendingLevelUp) return;
  log(t('log.wait'), 'info');
  endTurn();
}

function endTurn() {
  if (state.gameOver) return;
  state.turnCount++;

  // Decay projectile visuals
  state.projectiles = state.projectiles.filter(p => {
    p.ttl--;
    return p.ttl > 0;
  });

  // Tick skill cooldowns
  const cd = state.player.skillCooldowns;
  if (cd) {
    for (const key of Object.keys(cd)) {
      if (cd[key] > 0) cd[key]--;
    }
  }

  // Tick invisibility
  if (state.player.invisible > 0) {
    state.player.invisible--;
    if (state.player.invisible === 0) log(t('log.no_longer_invisible'), 'info');
  }

  // Tick enemy slow/stun effects
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (enemy.stunTurns > 0) enemy.stunTurns--;
    if (enemy.slowTurns > 0) enemy.slowTurns--;
    // Poison DOT on enemies
    if (enemy.poisonDot && enemy.poisonDot.turns > 0) {
      enemy.hp -= enemy.poisonDot.dmg;
      enemy.poisonDot.turns--;
      log(t('log.poison_damage', { name: getEnemyName(enemy), n: enemy.poisonDot.dmg }), 'combat');
      if (enemy.hp <= 0) {
        enemy.hp = 0;
        log(t('log.poison_kill', { name: getEnemyName(enemy) }), 'combat');
        recordKill(enemy.type, enemy);
        grantXP(enemy.xpReward || 8);
        grantGold(enemy);
        dropLoot(enemy);
      }
    }
  }

  // Mana regen (1 per turn for mages, or if player has max mana via INT)
  if (state.player.maxMana > 0 && state.player.mana < state.player.maxMana) {
    state.player.mana = Math.min(state.player.maxMana, state.player.mana + 1);
  }

  // VIT passive HP regen
  if (state.player.attrs) {
    const vitRegen = ATTR_BONUSES.vit.hpRegen(state.player.attrs.vit);
    if (vitRegen > 0 && state.player.hp < state.player.maxHp) {
      const healed = Math.min(vitRegen, state.player.maxHp - state.player.hp);
      state.player.hp += healed;
    }
  }

  // Set bonus regen (Holy Crusader 2pc)
  for (const sb of getActiveSetBonuses(state.player)) {
    for (const b of sb.activeBonuses) {
      if (b.regenBonus && state.player.hp < state.player.maxHp) {
        const healed = Math.min(b.regenBonus, state.player.maxHp - state.player.hp);
        state.player.hp += healed;
      }
    }
  }

  // Tick effects
  if (state.player.effects) {
    // Regen effect
    for (const eff of state.player.effects) {
      if (eff.stat === 'regen' && state.player.hp < state.player.maxHp) {
        const healed = Math.min(eff.amount, state.player.maxHp - state.player.hp);
        state.player.hp += healed;
      }
    }
    // Decrease turns and remove expired
    state.player.effects = state.player.effects.filter(eff => {
      eff.turns--;
      if (eff.turns <= 0) {
        log(t('log.effect_wore_off', { name: eff.name }), 'info');
        return false;
      }
      return true;
    });
  }

  if (state.mode === 'dungeon' || state.mode === 'arena') {
    moveEnemies();
  }

  state.enemies = state.enemies.filter(e => e.hp > 0);
  if (state.mode === 'arena') checkArenaWaveCleared();
  updateFOV();

  // Decay achievement toast
  if (state.achievementToast && state.achievementToast.timer > 0) {
    state.achievementToast.timer--;
    if (state.achievementToast.timer <= 0) state.achievementToast = null;
  }

  // Auto-save after every turn
  autoSave();
}

// ── Throw System ────────────────────────────

export function enterThrowMode() {
  if (state.gameOver || state.pendingLevelUp) return;
  if (state.player.inventory.length === 0) {
    log(t('log.nothing_to_throw'), 'info');
    return;
  }
  state.throwMode = true;
  log(t('log.throw_mode'), 'info');
}

export function cancelThrowMode() {
  state.throwMode = false;
  log(t('log.throw_cancelled'), 'info');
}

export function throwInDirection(dx, dy) {
  if (!state.throwMode) return;
  state.throwMode = false;

  const inv = state.player.inventory;
  if (inv.length === 0) return;

  const item = inv[0];
  const throwPower = item.power || 3;
  const range = 6;
  let tx = state.player.x;
  let ty = state.player.y;
  let hitEnemy = null;

  for (let i = 0; i < range; i++) {
    tx += dx;
    ty += dy;
    if (!canWalk(tx, ty)) break;
    const enemy = enemyAt(tx, ty);
    if (enemy) {
      hitEnemy = enemy;
      break;
    }
  }

  // Remove/decrement item
  if (item.stackable && (item.count || 1) > 1) {
    item.count--;
  } else {
    inv.splice(0, 1);
  }

  if (hitEnemy) {
    state.projectiles.push({ x: hitEnemy.x, y: hitEnemy.y, type: 'arrow', ttl: 2 });
    rangedAttack(hitEnemy, throwPower, `thrown ${item.name}`);
  } else {
    // Missed - drop item on ground
    const groundItem = { ...item };
    if (groundItem.stackable) groundItem.count = 1;
    state.items.push({ x: tx - dx, y: ty - dy, item: groundItem });
    log(t('log.throw_miss', { name: item.name }), 'info');
  }

  endTurn();
}

// ── Generic Spell System ────────────────────

function findMultipleVisibleEnemies(range, maxCount) {
  const targets = [];
  const px = state.player.x, py = state.player.y;

  const sorted = state.enemies
    .filter(e => {
      if (e.hp <= 0) return false;
      const dist = Math.abs(e.x - px) + Math.abs(e.y - py);
      if (dist > range) return false;
      if (!state.visibility[e.y] || !state.visibility[e.y][e.x]) return false;
      if (!hasLineOfSight(px, py, e.x, e.y)) return false;
      return true;
    })
    .sort((a, b) => {
      const da = Math.abs(a.x - px) + Math.abs(a.y - py);
      const db = Math.abs(b.x - px) + Math.abs(b.y - py);
      return da - db;
    });

  for (let i = 0; i < Math.min(maxCount, sorted.length); i++) {
    targets.push(sorted[i]);
  }
  return targets;
}

export function castSpell(spellId) {
  if (state.gameOver || state.pendingLevelUp) return false;
  if (state.playerClass !== PLAYER_CLASS.MAGE) {
    log(t('log.only_mages_cast'), 'info');
    return false;
  }

  const spell = SPELLS[spellId];
  if (!spell) return false;

  // Arcane Mastery reduces spell costs
  const amRank = getSkillRank('arcane_mastery');
  const costReduction = amRank > 0 ? amRank : 0;
  const manaCost = Math.max(1, spell.manaCost - costReduction);

  if (state.player.mana < manaCost) {
    log(t('log.not_enough_mana'), 'info');
    return false;
  }

  // Empower bonus damage
  const empRank = getSkillRank('empower');
  const empBonus = empRank > 0 ? [2, 4, 6][empRank - 1] : 0;

  if (spell.type === 'self_heal') {
    state.player.mana -= manaCost;
    const healed = Math.min(spell.healAmount + empBonus, state.player.maxHp - state.player.hp);
    state.player.hp += healed;
    log(t('log.heal_cast', { name: spell.name, n: healed }), 'item');
    endTurn();
    return true;
  }

  if (spell.type === 'ranged_single') {
    const spellRange = spell.range + getRangeBonus(state.player);
    const target = findNearestVisibleEnemy(spellRange);
    if (!target) {
      log(t('log.no_enemies_in_range'), 'info');
      return false;
    }
    state.player.mana -= manaCost;
    const projType = spellId === 'ice_shard' ? 'ice' : 'fire';
    state.projectiles.push({ x: target.x, y: target.y, type: projType, ttl: 3 });
    const spellDamage = spell.damage + getSpellBonus(state.player) + empBonus;
    rangedAttack(target, spellDamage, spell.name.toLowerCase());
    // Frost Mastery: ice shard slows
    if (spellId === 'ice_shard' && target.hp > 0) {
      const fmRank = getSkillRank('frost_mastery');
      if (fmRank > 0) {
        target.slowTurns = (target.slowTurns || 0) + fmRank;
        log(t('log.enemy_slowed', { name: getEnemyName(target), n: fmRank }), 'combat');
      }
    }
    endTurn();
    return true;
  }

  if (spell.type === 'ranged_multi') {
    const spellRange = spell.range + getRangeBonus(state.player);
    // Chain Master: extra targets
    const cmRank = getSkillRank('chain_master');
    const maxTargets = (spell.maxTargets || 3) + cmRank;
    const targets = findMultipleVisibleEnemies(spellRange, maxTargets);
    if (targets.length === 0) {
      log(t('log.no_enemies_in_range'), 'info');
      return false;
    }
    state.player.mana -= manaCost;
    const spellDamage = spell.damage + getSpellBonus(state.player) + empBonus;
    for (const target of targets) {
      state.projectiles.push({ x: target.x, y: target.y, type: 'lightning', ttl: 3 });
      rangedAttack(target, spellDamage, spell.name.toLowerCase());
    }
    endTurn();
    return true;
  }

  return false;
}

// ── Restart ──────────────────────────────────

export function restartGame() {
  state.stats.deaths++;
  unlockAchievement('survivor');
  // Preserve achievements, stats, boss skills, and prestige across restarts
  const savedAchievements = { ...state.achievements };
  const savedStats = { ...state.stats };
  const savedBossSkills = { ...state.bossSkills };
  const savedPrestige = state.prestigeLevel;
  const savedArenaBest = state.arenaBestWave;
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.phase = 'class_select';
  state.achievements = savedAchievements;
  state.stats = savedStats;
  state.bossSkills = savedBossSkills;
  state.prestigeLevel = savedPrestige;
  state.arenaBestWave = savedArenaBest;
  // Reset fishing/arena
  closeFishing();
  state.showArena = false;
  state.arenaWave = 0;
  state.arenaEnemiesRemaining = 0;
  state.arenaRewards = { gold: 0, items: [] };
  state.arenaWaveCleared = false;
  deleteSave();
}

// ── Prestige / New Game+ ────────────────────────

export function activatePrestige() {
  if (state.prestigeLevel >= PRESTIGE.MAX_LEVEL) {
    log(t('log.max_prestige'), 'info');
    state.showPrestige = false;
    return;
  }
  state.prestigeLevel++;
  const level = state.prestigeLevel;
  const title = PRESTIGE.TITLES[level];
  log(t('log.prestige_up', { level: level, title: title }), 'level');

  unlockAchievement('prestige_1');
  if (level === 5) unlockAchievement('prestige_5');

  // Save persistent data
  const savedAchievements = { ...state.achievements };
  const savedStats = { ...state.stats };
  const savedBossSkills = { ...state.bossSkills };
  const savedPrestige = state.prestigeLevel;
  const savedArmory = { ...state.armory };

  // Reset player state
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.phase = 'class_select';
  state.showPrestige = false;
  state.lastDungeonFloor = 0;

  // Restore persistent data
  state.achievements = savedAchievements;
  state.stats = savedStats;
  state.bossSkills = savedBossSkills;
  state.prestigeLevel = savedPrestige;
  state.armory = savedArmory;

  deleteSave();
}

export function declinePrestige() {
  state.showPrestige = false;
  log(t('log.press_onward'), 'info');
  enterDungeon(state.floor + 1);
}

// ── Cloud Auth ──────────────────────────────────

let authToken = sessionStorage.getItem('rpg_auth_token') || null;
let authUsername = sessionStorage.getItem('rpg_auth_user') || null;
let cloudSaveTimer = null;
const CLOUD_SAVE_INTERVAL = 30000; // 30 seconds

export function getAuthToken() { return authToken; }
export function getAuthUsername() { return authUsername; }
export function isLoggedIn() { return !!authToken; }

export function setAuth(token, username) {
  authToken = token;
  authUsername = username;
  if (token) {
    sessionStorage.setItem('rpg_auth_token', token);
    sessionStorage.setItem('rpg_auth_user', username);
  } else {
    sessionStorage.removeItem('rpg_auth_token');
    sessionStorage.removeItem('rpg_auth_user');
  }
}

export async function apiRegister(username, password) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function apiLogin(username, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

async function cloudSave() {
  if (!authToken) return;
  try {
    const snap = serializeState();
    await fetch('/api/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      },
      body: JSON.stringify({ save: snap })
    });
  } catch (_) { /* silent fail — localStorage is the backup */ }
}

export async function cloudLoad() {
  if (!authToken) return null;
  try {
    const res = await fetch('/api/load', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    const data = await res.json();
    return data.save || null;
  } catch (_) {
    return null;
  }
}

export function startCloudSync() {
  if (cloudSaveTimer) clearInterval(cloudSaveTimer);
  if (!authToken) return;
  cloudSaveTimer = setInterval(() => {
    if (state.phase === 'playing') cloudSave();
  }, CLOUD_SAVE_INTERVAL);
}

export async function checkDbStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    return data.db === true;
  } catch (_) {
    return false;
  }
}

// ── Save / Load System ──────────────────────────

function serializeState() {
  const snap = {};
  for (const key of Object.keys(state)) {
    if (key === 'visibility' || key === 'achievementToast' || key === 'fishingTimer') continue; // transient
    const val = state[key];
    if (val === null || val === undefined) {
      snap[key] = val;
    } else if (Array.isArray(val) && val.length > 0 && val[0] instanceof Uint8Array) {
      // 2D Uint8Array (map, revealed)
      snap[key] = val.map(row => Array.from(row));
    } else {
      snap[key] = val;
    }
  }
  return snap;
}

function deserializeState(snap) {
  for (const key of Object.keys(snap)) {
    if (key === 'visibility' || key === 'achievementToast') continue;
    const val = snap[key];
    if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0]) &&
        (key === 'map' || key === 'revealed')) {
      state[key] = val.map(row => new Uint8Array(row));
    } else {
      state[key] = val;
    }
  }
  // Recompute transient fields
  state.visibility = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  state.achievementToast = null;
  state.fishingTimer = null;
  state.fishingPhase = 'idle';
  state.showFishing = false;
  updateFOV();
}

function autoSave() {
  try {
    const json = JSON.stringify(serializeState());
    localStorage.setItem('rpg_save', json);
  } catch (_) { /* silently fail if storage full */ }
}

export function saveGame() {
  try {
    const json = JSON.stringify(serializeState());
    localStorage.setItem('rpg_save', json);
    log(t('log.game_saved'), 'info');
    return true;
  } catch (_) {
    log(t('log.save_failed'), 'combat');
    return false;
  }
}

export function loadGame() {
  const raw = localStorage.getItem('rpg_save');
  if (!raw) return false;
  try {
    const snap = JSON.parse(raw);
    deserializeState(snap);
    log(t('log.game_loaded'), 'info');
    return true;
  } catch (_) {
    log(t('log.load_failed'), 'combat');
    return false;
  }
}

export async function loadGameFromCloud() {
  const snap = await cloudLoad();
  if (!snap) return false;
  try {
    deserializeState(snap);
    // Also cache locally
    localStorage.setItem('rpg_save', JSON.stringify(snap));
    log(t('log.game_loaded'), 'info');
    return true;
  } catch (_) {
    log(t('log.load_failed'), 'combat');
    return false;
  }
}

export function hasSaveGame() {
  return localStorage.getItem('rpg_save') !== null;
}

export function deleteSave() {
  localStorage.removeItem('rpg_save');
}
