import {
  TILE, TILE_PROPS, ENTITY, BASE_STATS, ITEMS, ITEM_TYPE, EQUIP_SLOT,
  LOOT_TABLES, BACKPACK_SIZE,
  CLASS_STATS, PLAYER_CLASS, BESTIARY_INFO,
  FLOOR_THEME, FLOOR_THEMES, BOSS_FOR_THEME, SPELLS,
  FIRE_SPELL_COST, FIRE_SPELL_RANGE, FIRE_SPELL_POWER, BOW_RANGE,
  ITEMS_PER_FLOOR_MIN, ITEMS_PER_FLOOR_MAX,
  GOBLIN_SIGHT_RANGE, ORC_SIGHT_RANGE,
  GOLD_REWARDS, HEALER_COST, SHOP_INVENTORY,
  ATTR_BONUSES, FEATURE_INFO, QUEST_POOL,
} from './constants.js?v=8';
import { generateVillage, generateDungeon } from './mapgen.js?v=8';
import { computeFOV } from './fov.js?v=8';

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
  floorTheme: null,       // current floor theme key
  throwMode: false,       // true when player is aiming a throw
  portalPos: null,        // { x, y } if portal exists on current floor
  lastDungeonFloor: 0,    // for continuing from village
  chests: [],             // { x, y, items: [...], gold, opened }
  showChest: false,       // true when chest overlay is visible
  activeChest: null,      // reference to the chest being viewed
  showSettings: false,
  showCharSheet: false,
  godMode: false,         // unkillable when true
};

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
  log('You check your starting gear.', 'item');
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

  state.portalPos = null;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log('You arrive at the village. A cave entrance beckons to the north-east.', 'info');
  log('Visit the Healer (west) or Merchant (east) near the huts.', 'info');
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
  // Quest: reach floor
  updateQuestProgress('reach', floor);
  state.mapW = dungeon.map[0].length;
  state.mapH = dungeon.map.length;
  state.stairsPos = dungeon.stairsPos;
  state.projectiles = [];

  state.player.x = dungeon.playerStart.x;
  state.player.y = dungeon.playerStart.y;

  const floorRooms = dungeon.rooms;

  // Spawn enemies using theme spawn weights
  state.enemies = [];
  const enemyCount = 4 + floor * 2 + randInt(0, 3);
  for (let i = 0; i < enemyCount; i++) {
    const type = weightedRandomPick(theme.spawnWeights);
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const ex = randInt(room.x + 1, room.x + room.w - 2);
    const ey = randInt(room.y + 1, room.y + room.h - 2);
    if (!isOccupied(ex, ey)) {
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
    if (!isOccupied(mbx, mby)) {
      const miniboss = createEntity(mbType, mbx, mby);
      miniboss.isMiniboss = true;
      miniboss.elitePrefix = ELITE_PREFIXES[randInt(0, ELITE_PREFIXES.length - 1)];
      miniboss.maxHp = Math.floor((miniboss.maxHp + floor * 3) * 2.5);
      miniboss.hp = miniboss.maxHp;
      miniboss.power = Math.floor((miniboss.power + Math.floor(floor / 2)) * 1.8);
      miniboss.armor = (miniboss.armor || 0) + 2;
      state.enemies.push(miniboss);
      log(`A ${miniboss.elitePrefix} ${getEnemyName(miniboss)} guards this floor!`, 'combat');
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
    log(`A powerful ${getEnemyName(boss)} lurks on this floor!`, 'combat');
  }

  // Spawn ground items (tier-appropriate)
  state.items = [];
  const numItems = randInt(ITEMS_PER_FLOOR_MIN, ITEMS_PER_FLOOR_MAX);
  const allItemIds = Object.keys(ITEMS);
  // Filter items to appropriate tier for this floor
  const tierMax = Math.min(3, 1 + Math.floor(floor / 2));
  const eligibleItems = allItemIds.filter(id => (ITEMS[id].tier || 0) <= tierMax || ITEMS[id].type === ITEM_TYPE.CONSUMABLE);
  for (let i = 0; i < numItems; i++) {
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const ix = randInt(room.x + 1, room.x + room.w - 2);
    const iy = randInt(room.y + 1, room.y + room.h - 2);
    const pool = eligibleItems.length > 0 ? eligibleItems : allItemIds;
    const itemId = pool[randInt(0, pool.length - 1)];
    state.items.push({ x: ix, y: iy, item: { ...ITEMS[itemId] } });
  }

  // Spawn chests (1-2 per floor)
  state.chests = [];
  state.showChest = false;
  state.activeChest = null;
  const numChests = randInt(1, 2);
  for (let i = 0; i < numChests; i++) {
    const room = floorRooms[randInt(1, floorRooms.length - 1)];
    const cx = randInt(room.x + 1, room.x + room.w - 2);
    const cy = randInt(room.y + 1, room.y + room.h - 2);
    if (isOccupied(cx, cy)) continue;
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

  // Place portal every 5 floors (in second room)
  state.portalPos = null;
  if (floor % 5 === 0 && floorRooms.length > 1) {
    const portalRoom = floorRooms[0]; // same room as player start
    const px = portalRoom.cx + 1;
    const py = portalRoom.cy;
    state.map[py][px] = TILE.PORTAL;
    state.portalPos = { x: px, y: py };
    log('A shimmering portal to the village has appeared!', 'level');
  }

  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log(`You enter the ${theme.name} — Floor ${floor}.`, 'info');
}

// ── FOV ──────────────────────────────────────

function updateFOV() {
  const radius = state.mode === 'village' ? 20 : 7;
  state.visibility = computeFOV(state.map, state.player.x, state.player.y, radius);

  for (let y = 0; y < state.mapH; y++) {
    for (let x = 0; x < state.mapW; x++) {
      if (state.visibility[y][x]) state.revealed[y][x] = 1;
    }
  }
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

function recordKill(entityType) {
  if (!state.bestiary[entityType]) {
    state.bestiary[entityType] = { kills: 0 };
  }
  state.bestiary[entityType].kills++;
  // Quest progress
  updateQuestProgress('kill', entityType);
  updateQuestProgress('kill_any', null);
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
    log('You can only have 5 active quests!', 'info');
    return;
  }
  state.quests.push({ ...def, progress: 0, completed: false });
  log(`Quest accepted: ${def.name}`, 'level');
}

export function abandonQuest(questId) {
  const idx = state.quests.findIndex(q => q.id === questId);
  if (idx !== -1) {
    log(`Quest abandoned: ${state.quests[idx].name}`, 'info');
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
      log(`Received ${item.name}!`, 'item');
    } else {
      log('Backpack full! Item reward lost.', 'info');
    }
  }
  log(`Quest complete: ${quest.name}! +${quest.goldReward}g`, 'level');
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
        log(`Quest ready to turn in: ${quest.name}!`, 'level');
      }
    }
  }
}

// ── Settings ────────────────────────────────

export function toggleSettings() {
  state.showSettings = !state.showSettings;
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

export function applyCheatCode(code) {
  if (code.toLowerCase() === 'godmode') {
    state.godMode = !state.godMode;
    log(state.godMode ? 'God mode ENABLED!' : 'God mode disabled.', 'level');
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
    log('You are already fully healed.', 'info');
    return;
  }
  if (p.gold < HEALER_COST) {
    log(`Not enough gold. Healing costs ${HEALER_COST} gold.`, 'info');
    return;
  }
  p.gold -= HEALER_COST;
  p.hp = p.maxHp;
  p.mana = p.maxMana;
  log(`The healer restores you to full health! (-${HEALER_COST} gold)`, 'item');
}

export function closeShop() {
  state.showShop = false;
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
    log('Backpack is full!', 'info');
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
  log(`Took ${item.name} from chest.`, 'item');
}

export function takeChestGold() {
  const chest = state.activeChest;
  if (!chest || chest.gold <= 0) return;
  state.player.gold += chest.gold;
  log(`Took ${chest.gold} gold from chest.`, 'item');
  chest.gold = 0;
}

export function takeAllFromChest() {
  const chest = state.activeChest;
  if (!chest) return;
  if (chest.gold > 0) takeChestGold();
  while (chest.items.length > 0) {
    if (state.player.inventory.length >= BACKPACK_SIZE) {
      log('Backpack is full!', 'info');
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
  const entry = SHOP_INVENTORY[shopIndex];
  if (!entry) return;
  const p = state.player;
  const price = getDiscountedPrice(entry.price);
  if (p.gold < price) {
    log('Not enough gold!', 'info');
    return;
  }
  if (p.inventory.length >= BACKPACK_SIZE) {
    log('Backpack is full!', 'info');
    return;
  }
  const item = { ...ITEMS[entry.itemId] };
  // Stack if possible
  if (item.stackable) {
    const existing = p.inventory.find(i => i.id === item.id && (i.count || 1) < (i.maxStack || 5));
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      p.gold -= price;
      registerArmoryItem(entry.itemId);
      log(`Bought ${item.name} for ${price} gold.`, 'item');
      return;
    }
  }
  item.count = 1;
  p.inventory.push(item);
  p.gold -= price;
  registerArmoryItem(entry.itemId);
  log(`Bought ${item.name} for ${price} gold.`, 'item');
}

export function sellItem(invIndex) {
  const p = state.player;
  if (invIndex < 0 || invIndex >= p.inventory.length) return;
  const item = p.inventory[invIndex];
  // Sell price = roughly half of shop price, or a base value
  const shopEntry = SHOP_INVENTORY.find(s => s.itemId === item.id);
  let sellPrice = shopEntry ? Math.floor(shopEntry.price / 2) : 3;
  if (item.tier === 2) sellPrice = Math.max(sellPrice, 10);
  if (item.tier === 3) sellPrice = Math.max(sellPrice, 25);
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    p.inventory.splice(invIndex, 1);
  }
  p.gold += sellPrice;
  log(`Sold ${item.name} for ${sellPrice} gold.`, 'item');
}

export function getShopInventory() {
  return SHOP_INVENTORY.map((entry, idx) => ({
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
  return a;
}

function hasEffect(entity, stat) {
  if (!entity.effects) return false;
  return entity.effects.some(e => e.stat === stat);
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
  // Dodge check (AGI-based) for the defender
  if (defender.attrs) {
    const dodgeChance = ATTR_BONUSES.agi.dodgeChance(defender.attrs.agi);
    if (Math.random() * 100 < dodgeChance) {
      const aName = attacker.type === ENTITY.PLAYER ? 'You' : getEnemyName(attacker);
      const dName = defender.type === ENTITY.PLAYER ? 'You' : getEnemyNameLower(defender);
      if (defender.type === ENTITY.PLAYER) {
        log(`You dodge ${getEnemyNameLower(attacker)}'s attack!`, 'combat');
      } else {
        log(`${getEnemyNameLower(defender)} dodges your attack!`, 'combat');
      }
      return;
    }
  }

  const power = getEffectivePower(attacker);
  const armor = getEffectiveArmor(defender);
  let baseDmg = Math.max(1, power - armor + randInt(-1, 1));

  // Crit check
  const critChance = getFeatureValue(attacker, 'crit_chance');
  let isCrit = false;
  if (critChance > 0 && Math.random() * 100 < critChance) {
    baseDmg = baseDmg * 2;
    isCrit = true;
  }

  defender.hp -= baseDmg;
  // Godmode: player can't die
  if (defender.type === ENTITY.PLAYER && state.godMode && defender.hp < 1) {
    defender.hp = 1;
  }

  const aName = attacker.type === ENTITY.PLAYER ? 'You' : getEnemyName(attacker);
  const dName = defender.type === ENTITY.PLAYER ? 'you' : getEnemyNameLower(defender);
  const critTag = isCrit ? ' CRITICAL!' : '';

  if (attacker.type === ENTITY.PLAYER) {
    log(`You hit ${dName} for ${baseDmg} damage!${critTag}`, 'combat');
  } else {
    log(`${aName} hits ${dName} for ${baseDmg} damage!${critTag}`, 'combat');
  }

  // Elemental bonus damage from attacker's features
  const fireDmg = getFeatureValue(attacker, 'fire_dmg');
  if (fireDmg > 0 && defender.hp > 0) {
    defender.hp -= fireDmg;
    log(`  Fire burns ${dName} for ${fireDmg}!`, 'combat');
  }
  const iceDmg = getFeatureValue(attacker, 'ice_dmg');
  if (iceDmg > 0 && defender.hp > 0) {
    defender.hp -= iceDmg;
    log(`  Ice chills ${dName} for ${iceDmg}!`, 'combat');
  }
  const poisonDmg = getFeatureValue(attacker, 'poison_dmg');
  if (poisonDmg > 0 && defender.hp > 0) {
    if (!defender.effects) defender.effects = [];
    const existing = defender.effects.find(e => e.stat === 'poison');
    if (!existing) {
      defender.effects.push({ name: 'Poison', stat: 'poison', amount: poisonDmg, turns: 3 });
      log(`  ${dName} is poisoned!`, 'combat');
    }
  }

  // Life steal
  const lifeSteal = getFeatureValue(attacker, 'life_steal');
  if (lifeSteal > 0 && attacker.hp < attacker.maxHp) {
    const healed = Math.min(lifeSteal, attacker.maxHp - attacker.hp);
    attacker.hp += healed;
    if (attacker.type === ENTITY.PLAYER) log(`  Life steal restores ${healed} HP!`, 'item');
  }

  // Thorns (defender reflects damage to attacker)
  const thorns = getFeatureValue(defender, 'thorns');
  if (thorns > 0 && attacker.hp > 0) {
    attacker.hp -= thorns;
    if (defender.type === ENTITY.PLAYER) {
      log(`  Thorns reflect ${thorns} damage!`, 'combat');
    }
  }

  // Godmode on thorns
  if (attacker.type === ENTITY.PLAYER && state.godMode && attacker.hp < 1) {
    attacker.hp = 1;
  }

  if (defender.hp <= 0) {
    defender.hp = 0;
    if (defender.type === ENTITY.PLAYER) {
      if (state.godMode) { defender.hp = 1; } else {
        log('You have been slain!', 'combat');
        state.gameOver = true;
      }
    } else {
      log(`You defeated ${getEnemyNameLower(defender)}!`, 'combat');
      recordKill(defender.type);
      let xpAward = defender.xpReward || 8;
      if (defender.isElite) xpAward = Math.floor(xpAward * 2);
      if (defender.isMiniboss) xpAward = Math.floor(xpAward * 3);
      grantXP(xpAward);
      grantGold(defender);
      dropLoot(defender);
    }
  }
  if (attacker.hp <= 0) {
    attacker.hp = 0;
    if (attacker.type === ENTITY.PLAYER) {
      if (state.godMode) { attacker.hp = 1; } else {
        log('Thorns have slain you!', 'combat');
        state.gameOver = true;
      }
    }
  }
}

function rangedAttack(defender, damage, attackName) {
  const armor = getEffectiveArmor(defender);
  const finalDamage = Math.max(1, damage - armor + randInt(-1, 1));
  defender.hp -= finalDamage;

  log(`Your ${attackName} hits ${getEnemyNameLower(defender)} for ${finalDamage} damage!`, 'combat');

  if (defender.hp <= 0) {
    defender.hp = 0;
    log(`You defeated ${getEnemyNameLower(defender)}!`, 'combat');
    recordKill(defender.type);
    let xpAward2 = defender.xpReward || 8;
    if (defender.isElite) xpAward2 = Math.floor(xpAward2 * 2);
    if (defender.isMiniboss) xpAward2 = Math.floor(xpAward2 * 3);
    grantXP(xpAward2);
    grantGold(defender);
    dropLoot(defender);
  }
}

function grantXP(amount) {
  const p = state.player;
  // XP boost from item features
  const xpBoost = getXpBoostPercent(p);
  if (xpBoost > 0) {
    amount = amount + Math.floor(amount * xpBoost / 100);
  }
  p.xp += amount;
  log(`+${amount} XP`, 'info');

  while (p.xp >= p.xpToLevel) {
    p.xp -= p.xpToLevel;
    p.level++;
    p.xpToLevel = Math.floor(p.xpToLevel * 1.5);
    p.statPoints += 2;
    log(`Level up! You are now level ${p.level}! +2 stat points.`, 'level');
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
  log(`+${gold} gold`, 'item');
}

function dropLoot(enemy) {
  const lootTable = LOOT_TABLES[enemy.type];
  if (!lootTable) return;

  // Elites and minibosses get boosted drop rates and can drop multiple
  const isSpecial = enemy.isElite || enemy.isMiniboss || enemy.isBoss;
  const chanceMultiplier = enemy.isMiniboss ? 2.0 : enemy.isElite ? 1.5 : 1.0;

  for (const drop of lootTable) {
    const effectiveChance = Math.min(drop.chance * chanceMultiplier, 0.95);
    if (Math.random() < effectiveChance) {
      const item = { ...ITEMS[drop.itemId] };
      state.items.push({ x: enemy.x, y: enemy.y, item });
      log(`${getEnemyName(enemy)} dropped ${item.name}!`, 'item');
      if (!isSpecial) break; // only special enemies can drop multiple items
    }
  }

  // Elites and minibosses always drop at least one item
  if (isSpecial && !state.items.find(i => i.x === enemy.x && i.y === enemy.y)) {
    const fallback = lootTable[randInt(0, Math.min(2, lootTable.length - 1))];
    if (fallback) {
      const item = { ...ITEMS[fallback.itemId] };
      state.items.push({ x: enemy.x, y: enemy.y, item });
      log(`${getEnemyName(enemy)} dropped ${item.name}!`, 'item');
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
    log('Only mages can cast spells!', 'info');
    return false;
  }
  if (state.player.mana < FIRE_SPELL_COST) {
    log('Not enough mana!', 'info');
    return false;
  }

  const spellRange = FIRE_SPELL_RANGE + getRangeBonus(state.player);
  const target = findNearestVisibleEnemy(spellRange);
  if (!target) {
    log('No enemies in range!', 'info');
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
    log('Only archers can shoot bows!', 'info');
    return false;
  }

  const bowRange = BOW_RANGE + getRangeBonus(state.player);
  const target = findNearestVisibleEnemy(bowRange);
  if (!target) {
    log('No enemies in range!', 'info');
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
  log(`+1 ${labels[stat]}`, 'level');
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
    log(`Picked up ${item.name}.`, 'item');
    return;
  }

  if (state.player.inventory.length >= BACKPACK_SIZE) {
    log('Backpack is full!', 'info');
    return;
  }

  const newItem = { ...item };
  if (newItem.stackable) newItem.count = 1;
  state.player.inventory.push(newItem);
  state.items.splice(idx, 1);
  registerArmoryItem(item.id);
  log(`Picked up ${item.name}.`, 'item');
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
      log(`Used ${item.name}. Restored ${healed} HP.`, 'item');
    }
    if (item.manaAmount) {
      const p = state.player;
      if (p.maxMana <= 0) {
        log('You have no use for mana!', 'info');
        return;
      }
      const restored = Math.min(item.manaAmount, p.maxMana - p.mana);
      p.mana += restored;
      log(`Used ${item.name}. Restored ${restored} Mana.`, 'item');
    }
    if (item.curePoison) {
      log(`Used ${item.name}. You feel purified.`, 'item');
    }
    if (item.effect) {
      const eff = { ...item.effect };
      // Remove existing effect of same name
      state.player.effects = state.player.effects.filter(e => e.name !== eff.name);
      state.player.effects.push(eff);
      log(`Used ${item.name}. ${eff.name} active for ${eff.turns} turns!`, 'item');
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

    log(`Equipped ${item.name}.`, 'item');
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
  log(`Dropped ${item.name}.`, 'item');
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
  log(`Destroyed ${item.name}.`, 'item');
}

export function unequipItem(slot) {
  const item = state.player.equipment[slot];
  if (!item) return;
  if (state.player.inventory.length >= BACKPACK_SIZE) {
    log('Backpack is full! Cannot unequip.', 'info');
    return;
  }
  state.player.equipment[slot] = null;
  state.player.inventory.push(item);
  recalcMaxMana();
  log(`Unequipped ${item.name}.`, 'item');
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
        log('Goblin Berserker enters a frenzy!', 'combat');
        attack(enemy, state.player);
      }
      // Goblin Warlord double strike: 35% chance
      if (enemy.type === ENTITY.GOBLIN_WARLORD && Math.random() < 0.35 && state.player.hp > 0) {
        log('Goblin Warlord strikes again!', 'combat');
        attack(enemy, state.player);
      }
      // Frost Giant ground slam: 25% chance bonus damage
      if (enemy.type === ENTITY.FROST_GIANT && Math.random() < 0.25 && state.player.hp > 0) {
        const slamDmg = Math.max(1, 4 + randInt(-1, 2));
        state.player.hp -= slamDmg;
        log(`Frost Giant slams the ground for ${slamDmg} extra damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
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
        log(`Dark Mage hurls a shadow bolt at you for ${damage} damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
        continue;
      }
    }

    // Goblin Shaman ranged hex (range 5)
    if (enemy.type === ENTITY.GOBLIN_SHAMAN && dist <= 5 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(`Goblin Shaman flings a hex at you for ${damage} damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
        continue;
      }
    }

    // Wraith life drain (range 2, ignores armor)
    if (enemy.type === ENTITY.WRAITH && dist <= 2 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power + randInt(-1, 1));
        state.player.hp -= damage;
        enemy.hp = Math.min(enemy.maxHp, enemy.hp + Math.floor(damage / 2));
        log(`Wraith drains your life for ${damage} damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
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
        log(`Lich hurls a necrotic bolt at you for ${damage} damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
        continue;
      }
    }

    // Fire Elemental flame blast (range 4)
    if (enemy.type === ENTITY.FIRE_ELEMENTAL && dist <= 4 && dist > 1) {
      if (hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
        const damage = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 1));
        state.player.hp -= damage;
        state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
        log(`Fire Elemental blasts you with flame for ${damage} damage!`, 'combat');
        if (state.player.hp <= 0) {
          state.player.hp = 0;
          log('You have been slain!', 'combat');
          state.gameOver = true;
        }
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
  if (state.gameOver || state.pendingLevelUp || state.showChest) return;

  const nx = state.player.x + dx;
  const ny = state.player.y + dy;

  if (nx < 0 || nx >= state.mapW || ny < 0 || ny >= state.mapH) return;

  // Bump to attack
  const enemy = enemyAt(nx, ny);
  if (enemy) {
    attack(state.player, enemy);
    // Haste effect: double attack
    if (hasEffect(state.player, 'haste') && enemy.hp > 0) {
      log('Haste! You strike again!', 'combat');
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
    log('You enter the cave...', 'info');
    enterDungeon(1);
    return;
  }

  // Stairs
  if (state.mode === 'dungeon' && state.map[ny][nx] === TILE.CAVE_STAIRS) {
    log('You descend deeper...', 'info');
    enterDungeon(state.floor + 1);
    return;
  }

  // Portal back to village
  if (state.map[ny][nx] === TILE.PORTAL) {
    log('You step through the portal and return to the village!', 'level');
    state.lastDungeonFloor = state.floor; // remember where we were
    initVillage();
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

  // Quest Board
  if (state.mode === 'village' && state.map[ny][nx] === TILE.QUEST_BOARD) {
    state.showQuestBoard = true;
    // Check collect quests
    for (const q of state.quests) {
      if (q.type === 'collect' && !q.completed) {
        q.progress = state.player.gold;
        if (q.progress >= q.amount) {
          q.completed = true;
          log(`Quest ready to turn in: ${q.name}!`, 'level');
        }
      }
    }
    return;
  }

  // Check for chest
  const chest = state.chests.find(c => c.x === nx && c.y === ny && !c.opened);
  if (chest) {
    chest.opened = true;
    state.activeChest = chest;
    state.showChest = true;
    log('You found a treasure chest!', 'item');
    return;
  }

  pickupItem();
  endTurn();
}

export function playerWait() {
  if (state.gameOver || state.pendingLevelUp) return;
  log('You wait...', 'info');
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
        log(`${eff.name} effect wore off.`, 'info');
        return false;
      }
      return true;
    });
  }

  if (state.mode === 'dungeon') {
    moveEnemies();
  }

  state.enemies = state.enemies.filter(e => e.hp > 0);
  updateFOV();
}

// ── Throw System ────────────────────────────

export function enterThrowMode() {
  if (state.gameOver || state.pendingLevelUp) return;
  if (state.player.inventory.length === 0) {
    log('Nothing to throw!', 'info');
    return;
  }
  state.throwMode = true;
  log('Throw mode: press a direction key to throw your first item.', 'info');
}

export function cancelThrowMode() {
  state.throwMode = false;
  log('Throw cancelled.', 'info');
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
    log(`You throw ${item.name} but miss! It lands on the ground.`, 'info');
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
    log('Only mages can cast spells!', 'info');
    return false;
  }

  const spell = SPELLS[spellId];
  if (!spell) return false;

  if (state.player.mana < spell.manaCost) {
    log('Not enough mana!', 'info');
    return false;
  }

  if (spell.type === 'self_heal') {
    state.player.mana -= spell.manaCost;
    const healed = Math.min(spell.healAmount, state.player.maxHp - state.player.hp);
    state.player.hp += healed;
    log(`You cast ${spell.name}. Restored ${healed} HP.`, 'item');
    endTurn();
    return true;
  }

  if (spell.type === 'ranged_single') {
    const spellRange = spell.range + getRangeBonus(state.player);
    const target = findNearestVisibleEnemy(spellRange);
    if (!target) {
      log('No enemies in range!', 'info');
      return false;
    }
    state.player.mana -= spell.manaCost;
    const projType = spellId === 'ice_shard' ? 'ice' : 'fire';
    state.projectiles.push({ x: target.x, y: target.y, type: projType, ttl: 3 });
    const spellDamage = spell.damage + getSpellBonus(state.player);
    rangedAttack(target, spellDamage, spell.name.toLowerCase());
    endTurn();
    return true;
  }

  if (spell.type === 'ranged_multi') {
    const spellRange = spell.range + getRangeBonus(state.player);
    const targets = findMultipleVisibleEnemies(spellRange, spell.maxTargets || 3);
    if (targets.length === 0) {
      log('No enemies in range!', 'info');
      return false;
    }
    state.player.mana -= spell.manaCost;
    const spellDamage = spell.damage + getSpellBonus(state.player);
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
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.phase = 'class_select';
}
