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
  FISH_LOOT, ARENA_CONFIG, CRAFTING_RECIPES,
  SUBCLASS, SUBCLASS_INFO,
  TOWN_UPGRADES, SHOP_UPGRADE_ITEMS, SHOP_EPIC_ITEMS,
  CRAFTING_RECIPES_T2, CRAFTING_RECIPES_T3,
  PHASE_BOSSES, BOSS_CAVE_BOSSES,
  ROOM_TYPE, DEN_TYPES, GUARDIAN_NAMES, GUARDIAN_FOR_THEME,
  ENTITY_FACTION, areFactionsHostile,
  DIFFICULTY, CLASS_UNLOCK_CONDITIONS, VILLAGE_BUILDINGS,
  ALCHEMY_RECIPES, HERO_COLORS, BESTIARY_BONUSES,
  TALENT_TREES, ENEMY_REACTIONS,
} from './constants.js?v=43';
import { t } from './i18n.js';
import { generateVillage, generateDungeon, generateArenaMap, generateCave, generateMiniDungeon, generateBeach, generateTown, generateBossCave } from './mapgen.js?v=43';
import { computeFOV } from './fov.js?v=43';

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
  showBlacksmith: false,
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
  showSubclassSelect: false,
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
  // Town upgrades (persist across runs)
  townUpgrades: { healer: 1, shop: 1, blacksmith: 1, arena: 1 },
  // Run history (persist across runs)
  runHistory: [],
  showRunHistory: false,
  // Saved dungeon snapshot for portal return
  savedDungeon: null,
  // Monster breeding dens
  dens: [],
  // Floor warp system: floors unlocked for teleport (every 5 floors reached)
  unlockedFloorWarps: [],
  showFloorWarp: false,
  // Spell book overlay
  showSpellBook: false,
  // Persistent floor cache: each floor is generated once per run and remembered
  // Key = floor number, value = { map, enemies, items, chests, dens, stairsPos, portalPos, floorTheme, isDungeonShop, revealed }
  floorCache: {},
  // Difficulty / hardship level
  difficulty: 'normal',
  heroName: 'Hero',
  heroColor: 'default',
  // Unlocked classes (persists across runs via localStorage)
  unlockedClasses: [],
  // Village expansion buildings (persists across runs)
  townBuildings: { library: false, tavern: false, training: false, shrine: false },
  // Show village expansion overlay
  showVillageExpansion: false,
  // Village cave
  mode_cave: false,       // true when inside the village cave
  caveFloor: 0,           // current cave depth (1-2)
  caveReturnPos: null,    // village player pos to return to after cave
  // Beach and town
  mode_beach: false,
  mode_town: false,
  mapNotes: {},          // { [floorKey]: { [coordKey]: string } } — tile notes
  speechBubbles: [],     // [{ x, y, text, expiresAt, type }]
  autoExplore: false,    // Tab auto-explore mode
  talentPoints: 0,       // earned from prestige, spent on talent tree
  talents: {},           // { [nodeId]: true }
  showTalentTree: false, // talent tree overlay visibility
  // Mini dungeon
  inMiniDungeon: false,
  miniDungeonReturnFloor: 0,
  miniDungeonReturnPos: null,
  // Boss Cave
  inBossCave: false,
  bossCaveDefeated: [false, false, false, false, false], // one per boss
  bossCaveMap: null,     // persisted map so doors stay open
  bossCaveReturnPos: null,
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
// Load persisted unlocks and buildings
setTimeout(() => { loadUnlockedClasses(); loadTownBuildings(); loadTalents(); loadMapNotes(); }, 0);

export function spawnDamageNumber(x, y, amount, color = '#fff') {
  if (!gameSettings.showDamageNumbers) return;
  damageNumbers.push({ x, y, text: String(amount), color, age: 0, maxAge: 60 });
}

// ── Speech Bubbles & Reactions ───────────────

export function addSpeechBubble(x, y, text, type = 'reaction') {
  // Remove any existing bubble at same position
  state.speechBubbles = state.speechBubbles.filter(b => !(b.x === x && b.y === y));
  state.speechBubbles.push({ x, y, text, type, expiresAt: Date.now() + 2500 });
}

export function cleanSpeechBubbles() {
  const now = Date.now();
  state.speechBubbles = state.speechBubbles.filter(b => b.expiresAt > now);
}

export function triggerEnemyReaction(enemy, reactionType) {
  const reactions = ENEMY_REACTIONS[enemy.type];
  if (!reactions) return;
  const pool = reactions[reactionType];
  if (!pool || pool.length === 0) return;
  // Random chance to react
  const chance = reactionType === 'spot' ? 0.5 : reactionType === 'death' ? 0.4 : 0.25;
  if (Math.random() > chance) return;
  const text = pool[Math.floor(Math.random() * pool.length)];
  addSpeechBubble(enemy.x, enemy.y, text, 'reaction');
  log(`${getEnemyName(enemy)}: "${text}"`, 'reaction');
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

// ── Hero Name & Color ─────────────────────────

export function setHeroName(name) {
  state.heroName = (name || 'Hero').trim().slice(0, 20) || 'Hero';
}

export function setHeroColor(colorId) {
  state.heroColor = colorId || 'default';
  // Invalidate player sprite cache so it redraws
  if (typeof window !== 'undefined' && window.__clearPlayerSpriteCache) {
    window.__clearPlayerSpriteCache();
  }
}

// ── Difficulty ───────────────────────────────

export function setDifficulty(id) {
  state.difficulty = id;
}

// Returns flat damage bonus from bestiary kills vs the given entity type
export function getBestiaryDamageBonus(entityType) {
  const info = BESTIARY_INFO[entityType];
  if (!info) return 0;
  const category = info.category;
  const bonus = BESTIARY_BONUSES[category];
  if (!bonus) return 0;
  const kills = Object.entries(state.bestiary)
    .filter(([t]) => BESTIARY_INFO[t]?.category === category)
    .reduce((sum, [, b]) => sum + (b.kills || 0), 0);
  return kills >= bonus.killsNeeded ? bonus.damageBonus : 0;
}

export function getDifficultyInfo() {
  return Object.values(DIFFICULTY).find(d => d.id === state.difficulty) || DIFFICULTY.NORMAL;
}

// ── Unlockable Classes ────────────────────────

export function checkClassUnlocks() {
  for (const [cls, cond] of Object.entries(CLASS_UNLOCK_CONDITIONS)) {
    if (!state.unlockedClasses.includes(cls) && cond.check(state)) {
      state.unlockedClasses.push(cls);
      log(`🎓 New class unlocked: ${CLASS_STATS[cls]?.name || cls}!`, 'level');
      saveUnlockedClasses();
    }
  }
}

function saveUnlockedClasses() {
  try {
    localStorage.setItem('rpg_unlocked_classes', JSON.stringify(state.unlockedClasses));
  } catch (_) {}
}

export function loadUnlockedClasses() {
  try {
    const raw = localStorage.getItem('rpg_unlocked_classes');
    if (raw) state.unlockedClasses = JSON.parse(raw);
  } catch (_) {}
}

// ── Village Buildings ─────────────────────────

export function saveTownBuildings() {
  try {
    localStorage.setItem('rpg_town_buildings', JSON.stringify(state.townBuildings));
  } catch (_) {}
}

export function loadTownBuildings() {
  try {
    const raw = localStorage.getItem('rpg_town_buildings');
    if (raw) Object.assign(state.townBuildings, JSON.parse(raw));
  } catch (_) {}
}

export function saveTalents() {
  try { localStorage.setItem('rpg_talents', JSON.stringify({ points: state.talentPoints, unlocked: state.talents })); } catch(e) {}
}

export function loadTalents() {
  try {
    const raw = localStorage.getItem('rpg_talents');
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.talentPoints = saved.points || 0;
    state.talents = saved.unlocked || {};
  } catch(e) {}
}

export function unlockTalent(nodeId) {
  // Find the node
  let node = null;
  for (const tree of Object.values(TALENT_TREES)) {
    node = tree.nodes.find(n => n.id === nodeId);
    if (node) break;
  }
  if (!node) return;
  if (state.talents[nodeId]) { log('Already unlocked.', 'info'); return; }
  if (state.talentPoints < node.cost) { log(`Need ${node.cost} talent points.`, 'info'); return; }
  if (node.requires && !state.talents[node.requires]) { log('Prerequisite not met.', 'info'); return; }
  state.talentPoints -= node.cost;
  state.talents[nodeId] = true;
  saveTalents();
  log(`✨ Talent unlocked: ${node.name}!`, 'level');
}

export function getTalentPoints() { return state.talentPoints; }
export function getUnlockedTalents() { return state.talents; }

export function saveMapNotes() {
  try { localStorage.setItem('rpg_map_notes', JSON.stringify(state.mapNotes)); } catch(e) {}
}

export function loadMapNotes() {
  try {
    const raw = localStorage.getItem('rpg_map_notes');
    if (raw) state.mapNotes = JSON.parse(raw);
  } catch(e) {}
}

export function addMapNote(text) {
  const p = state.player;
  const floorKey = state.mode === 'dungeon' ? `floor_${state.floor}` : state.mode;
  const coordKey = `${p.x},${p.y}`;
  if (!state.mapNotes[floorKey]) state.mapNotes[floorKey] = {};
  if (text && text.trim()) {
    state.mapNotes[floorKey][coordKey] = text.trim().slice(0, 60);
    log(`📍 Note saved: "${text.trim().slice(0,30)}"`, 'info');
  } else {
    delete state.mapNotes[floorKey][coordKey];
    log('📍 Note removed.', 'info');
  }
  saveMapNotes();
}

export function getMapNote() {
  const p = state.player;
  const floorKey = state.mode === 'dungeon' ? `floor_${state.floor}` : state.mode;
  return (state.mapNotes[floorKey] || {})[`${p.x},${p.y}`] || null;
}

export function getFloorMapNotes() {
  const floorKey = state.mode === 'dungeon' ? `floor_${state.floor}` : state.mode;
  return state.mapNotes[floorKey] || {};
}

export function toggleAutoExplore() {
  state.autoExplore = !state.autoExplore;
  if (state.autoExplore) log('Auto-explore: ON (Tab to cancel)', 'info');
  else log('Auto-explore: OFF', 'info');
}

export function purchaseBuilding(key) {
  const bld = VILLAGE_BUILDINGS[key];
  if (!bld) return;
  if (state.townBuildings[key]) { log('Already built!', 'info'); return; }
  if (state.player.gold < bld.cost) { log(`Not enough gold! Need ${bld.cost}g.`, 'combat'); return; }
  state.player.gold -= bld.cost;
  state.townBuildings[key] = true;
  saveTownBuildings();
  // Place building tile on village map
  if (state.mode === 'village') {
    const { x, y } = bld.mapPos;
    if (y < state.mapH && x < state.mapW) {
      state.map[y][x] = bld.tile;
      updateFOV();
    }
  }
  log(`🏗️ ${bld.name} built! ${bld.desc}`, 'level');
}

export function toggleVillageExpansion() {
  state.showVillageExpansion = !state.showVillageExpansion;
}

export function closeVillageExpansion() {
  state.showVillageExpansion = false;
}

// ── Beach & Town ───────────────────────────────

export function enterBeach() {
  state.player.beachReturnPos = { x: state.player.x, y: state.player.y };
  const beach = generateBeach();
  state.map = beach.map;
  state.mapW = beach.map[0].length;
  state.mapH = beach.map.length;
  state.items = beach.items || [];
  state.enemies = (beach.enemies || []).map(e => createEntity(e.type, e.x, e.y));
  state.chests = beach.chests || [];
  state.dens = [];
  state.projectiles = [];
  state.player.x = beach.playerStart.x;
  state.player.y = beach.playerStart.y;
  state.mode_beach = true;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log('You step onto a windswept beach...', 'explore');
}

export function exitBeach() {
  const returnPos = state.player.beachReturnPos || { x: 1, y: 8 };
  initVillage();
  state.player.x = returnPos.x;
  state.player.y = returnPos.y;
  state.mode_beach = false;
  log('You return to the village.', 'explore');
}

export function enterTown() {
  state.player.townReturnPos = { x: state.player.x, y: state.player.y };
  const town = generateTown();
  state.map = town.map;
  state.mapW = town.map[0].length;
  state.mapH = town.map.length;
  state.items = town.items || [];
  state.enemies = (town.enemies || []).map(e => createEntity(e.type, e.x, e.y));
  state.chests = town.chests || [];
  state.dens = [];
  state.projectiles = [];
  state.player.x = town.playerStart.x;
  state.player.y = town.playerStart.y;
  state.mode_town = true;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log('You enter the bustling nearby town...', 'explore');
}

export function exitTown() {
  const returnPos = state.player.townReturnPos || { x: 20, y: 8 };
  initVillage();
  state.player.x = returnPos.x;
  state.player.y = returnPos.y;
  state.mode_town = false;
  log('You return to the village.', 'explore');
}

// ── Village Cave ──────────────────────────────

export function enterCave() {
  state.caveReturnPos = { x: state.player.x, y: state.player.y };
  const cave = generateCave(1);
  state.mode_cave = true;
  state.caveFloor = 1;
  state.mode = 'dungeon';
  state.map = cave.map;
  state.mapW = cave.map[0].length;
  state.mapH = cave.map.length;
  state.enemies = cave.enemies.map(e => {
    const enemy = createEntity(e.type, e.x, e.y);
    enemy.maxHp = Math.floor(enemy.maxHp * 1.2);
    enemy.hp = enemy.maxHp;
    return enemy;
  });
  state.items = [];
  state.chests = cave.chests || [];
  state.dens = [];
  state.stairsPos = cave.stairsPos;
  state.player.x = cave.playerStart.x;
  state.player.y = cave.playerStart.y;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  state.floorTheme = 'cave';
  updateFOV();
  log('🦇 You venture into the village cave...', 'info');
}

export function exitCave() {
  state.mode_cave = false;
  state.caveFloor = 0;
  state.lastDungeonFloor = 0;
  initVillage();
  if (state.caveReturnPos) {
    state.player.x = state.caveReturnPos.x;
    state.player.y = state.caveReturnPos.y;
    state.caveReturnPos = null;
  }
  log('You emerge from the cave into fresh air.', 'info');
}

// ── Mini Dungeons ─────────────────────────────

export function enterMiniDungeon() {
  // Save the real floor to cache BEFORE overwriting state, so we can restore it on exit
  saveCurrentFloorToCache();
  state.inMiniDungeon = true;
  state.miniDungeonReturnFloor = state.floor;
  state.miniDungeonReturnPos = { x: state.player.x, y: state.player.y };
  const mini = generateMiniDungeon(state.floor);
  state.map = mini.map;
  state.mapW = mini.map[0].length;
  state.mapH = mini.map.length;
  const diff = getDifficultyInfo();
  state.enemies = mini.enemies.map(e => {
    const enemy = createEntity(e.type, e.x, e.y);
    enemy.isElite = true;
    enemy.elitePrefix = ELITE_PREFIXES[randInt(0, ELITE_PREFIXES.length - 1)];
    enemy.maxHp = Math.floor((enemy.maxHp + state.floor * 2) * 1.5 * diff.hpMult);
    enemy.hp = enemy.maxHp;
    enemy.power = Math.floor((enemy.power + Math.floor(state.floor / 2)) * 1.5 * diff.powMult);
    return enemy;
  });
  state.items = [];
  state.chests = mini.chests || [];
  state.dens = [];
  state.stairsPos = null;
  state.player.x = mini.playerStart.x;
  state.player.y = mini.playerStart.y;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();
  log(`⚡ You enter a Mini Dungeon! Elite enemies and rare rewards await...`, 'level');
}

export function exitMiniDungeon() {
  state.inMiniDungeon = false;
  const returnFloor = state.miniDungeonReturnFloor;
  state.miniDungeonReturnFloor = 0;
  // Restore the real floor directly from cache — do NOT call enterDungeon() which
  // would run saveCurrentFloorToCache() first, overwriting the real floor with mini-dungeon state
  state.floor = returnFloor;
  restoreFloorFromCache(returnFloor);
  if (state.miniDungeonReturnPos) {
    state.player.x = state.miniDungeonReturnPos.x;
    state.player.y = state.miniDungeonReturnPos.y;
    state.miniDungeonReturnPos = null;
  }
  updateFOV();
  log('You step back through the gate, richer and wiser.', 'info');
}

// ── Boss Cave ─────────────────────────────────
export function enterBossCave() {
  state.bossCaveReturnPos = { x: state.player.x, y: state.player.y };
  state.inBossCave = true;
  state.mode = 'dungeon'; // reuse dungeon rendering

  // Generate or reuse persisted map (doors stay open between visits)
  let cave;
  if (state.bossCaveMap) {
    // Restore persisted map (already has open/closed doors)
    cave = { map: state.bossCaveMap.map.map(r => new Uint8Array(r)), playerStart: { x: 3, y: 7 }, bossPositions: state.bossCaveMap.bossPositions, doorPositions: state.bossCaveMap.doorPositions };
  } else {
    cave = generateBossCave();
  }

  state.map = cave.map;
  state.mapW = cave.map[0].length;
  state.mapH = cave.map.length;
  state.items = [];
  state.chests = [];
  state.dens = [];
  state.projectiles = [];
  state.stairsPos = null;
  state.portalPos = null;
  state.floorTheme = 'cave';

  // Spawn bosses that are still alive (not yet defeated in this run)
  state.enemies = [];
  for (let i = 0; i < BOSS_CAVE_BOSSES.length; i++) {
    if (state.bossCaveDefeated[i]) continue;
    const bossData = BOSS_CAVE_BOSSES[i];
    const pos = cave.bossPositions[i];
    const boss = createEntity(bossData.type, pos.x, pos.y);
    boss.isBoss = true;
    boss.isPhaseBoss = true;
    boss.isBossCaveBoss = true;
    boss.bossCaveIndex = i;
    boss.bossPhase = 0;
    boss.phaseName = bossData.name;
    boss.bossSize = bossData.bossSize || 1;
    // Apply base stats from definition
    boss.maxHp = bossData.baseHp;
    boss.hp = bossData.baseHp;
    boss.power = bossData.basePower;
    boss.armor = bossData.baseArmor;
    // 1-turn phase invulnerability at start (dramatic entrance)
    boss.phaseInvulnerable = 0;
    state.enemies.push(boss);
  }

  state.player.x = cave.playerStart.x;
  state.player.y = cave.playerStart.y;
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));

  // Persist cave layout (doors are stored in the map array)
  state.bossCaveMap = { map: cave.map.map(r => new Uint8Array(r)), bossPositions: cave.bossPositions, doorPositions: cave.doorPositions };

  updateFOV();
  log('⚔️ You enter the Trial Cave. Five ancient horrors await within.', 'level');
}

export function exitBossCave() {
  state.inBossCave = false;
  state.mode = 'village';
  // Restore village
  const village = generateVillage();
  state.map = village.map;
  state.mapW = village.map[0].length;
  state.mapH = village.map.length;
  state.enemies = [];
  state.items = [];
  state.chests = [];
  state.dens = [];
  state.stairsPos = null;
  state.portalPos = null;
  state.floorTheme = null;
  // Place player back where they entered from
  if (state.bossCaveReturnPos) {
    state.player.x = state.bossCaveReturnPos.x;
    state.player.y = state.bossCaveReturnPos.y;
    state.bossCaveReturnPos = null;
  }
  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  // Re-apply village building tiles
  for (const [key, built] of Object.entries(state.townBuildings)) {
    if (built && VILLAGE_BUILDINGS[key]) {
      const { tile, mapPos: { x: bx, y: by } } = VILLAGE_BUILDINGS[key];
      if (by < state.mapH && bx < state.mapW) state.map[by][bx] = tile;
    }
  }
  updateFOV();
  log('You leave the Trial Cave.', 'info');
}

// Open the boss door for room index i (called when boss i is defeated)
function openBossCaveDoor(bossIndex) {
  if (!state.bossCaveMap) return;
  const door = state.bossCaveMap.doorPositions[bossIndex];
  if (!door) return;
  const { x, yTop, yBot } = door;
  // Open on live map
  for (let y = yTop; y <= yBot; y++) {
    if (state.map[y] && x < state.map[y].length) {
      state.map[y][x] = TILE.BOSS_DOOR_OPEN;
    }
  }
  // Persist open state
  for (let y = yTop; y <= yBot; y++) {
    if (state.bossCaveMap.map[y]) state.bossCaveMap.map[y][x] = TILE.BOSS_DOOR_OPEN;
  }
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
    case PLAYER_CLASS.BARD:
      equip('worn_staff');
      equip('sandals');
      p.inventory.push({ ...ITEMS.minor_health_pot, count: 1 });
      p.inventory.push({ ...ITEMS.mana_potion, count: 1 });
      registerArmoryItem('minor_health_pot');
      registerArmoryItem('mana_potion');
      break;
    case PLAYER_CLASS.HOLY_KNIGHT:
      equip('rusty_sword');
      equip('leather_tunic');
      equip('leather_boots');
      p.inventory.push({ ...ITEMS.minor_health_pot, count: 2 });
      registerArmoryItem('minor_health_pot');
      break;
    case PLAYER_CLASS.PLAGUE_DOCTOR:
      equip('worn_staff');
      equip('sandals');
      p.inventory.push({ ...ITEMS.mana_potion, count: 3 });
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
  // Talent bonuses at run start
  if (state.talents?.keen_eye) {
    if (!p.inventory.find(i => i.id === 'minor_health_pot')) {
      p.inventory.push({ ...ITEMS.minor_health_pot, count: 1 });
    } else {
      const existing = p.inventory.find(i => i.id === 'minor_health_pot');
      existing.count = (existing.count || 1) + 1;
    }
  }
  if (state.talents?.lucky_start) {
    p.gold = Math.floor(p.gold * 1.25);
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
  state.chests = [];
  state.dens = [];
  state.showChest = false;
  state.activeChest = null;
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
      // Training grounds: +2 to primary stat at game start
      if (state.townBuildings.training) {
        const primaryStat = { warrior: 'str', mage: 'int', archer: 'agi', bard: 'cha', holy_knight: 'str', plague_doctor: 'int' }[state.playerClass] || 'str';
        state.player.attrs[primaryStat] = (state.player.attrs[primaryStat] || 1) + 2;
        recalcDerivedStats();
        log(`⚔️ Training grounds granted +2 ${primaryStat.toUpperCase()}!`, 'level');
      }
    }
  } else {
    state.player.x = village.playerStart.x;
    state.player.y = village.playerStart.y;
    // Heal on return to village (Tavern gives full heal + debuff removal)
    if (state.townBuildings.tavern) {
      state.player.hp = state.player.maxHp;
      state.player.mana = state.player.maxMana;
      state.player.effects = (state.player.effects || []).filter(e => !e.debuff);
      if (state.lastDungeonFloor > 0) log('🍺 The Tavern keeper welcomes you back, fully restored!', 'item');
    } else {
      state.player.hp = state.player.maxHp;
      state.player.mana = state.player.maxMana;
    }
  }

  // Place purchased village buildings on map
  for (const [key, built] of Object.entries(state.townBuildings || {})) {
    if (built && VILLAGE_BUILDINGS[key]) {
      const { tile, mapPos: { x: bx, y: by } } = VILLAGE_BUILDINGS[key];
      if (by < state.mapH && bx < state.mapW) {
        state.map[by][bx] = tile;
      }
    }
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

// ── Floor Cache ──────────────────────────────
// Save the current dungeon floor state so revisiting it looks identical

function saveCurrentFloorToCache() {
  if (state.mode !== 'dungeon' || !state.floor || !state.player) return;
  // Deep-copy map (array of Uint8Array rows)
  const mapCopy = state.map.map(row => new Uint8Array(row));
  // Deep-copy revealed fog-of-war
  const revealedCopy = state.revealed
    ? state.revealed.map(row => new Uint8Array(row))
    : null;
  state.floorCache[state.floor] = {
    map: mapCopy,
    mapW: state.mapW,
    mapH: state.mapH,
    enemies: JSON.parse(JSON.stringify(state.enemies)),
    items: JSON.parse(JSON.stringify(state.items)),
    chests: JSON.parse(JSON.stringify(state.chests)),
    dens: JSON.parse(JSON.stringify(state.dens || [])),
    stairsPos: state.stairsPos,
    portalPos: state.portalPos,
    floorTheme: state.floorTheme,
    isDungeonShop: state.isDungeonShop,
    revealed: revealedCopy,
    playerStart: { x: state.player.x, y: state.player.y }, // entry point from below
  };
}

function restoreFloorFromCache(floor) {
  const snap = state.floorCache[floor];
  if (!snap) return false;
  state.map = snap.map.map(row => new Uint8Array(row));
  state.mapW = snap.mapW;
  state.mapH = snap.mapH;
  state.enemies = JSON.parse(JSON.stringify(snap.enemies));
  state.items = JSON.parse(JSON.stringify(snap.items));
  state.chests = JSON.parse(JSON.stringify(snap.chests));
  state.dens = JSON.parse(JSON.stringify(snap.dens));
  state.stairsPos = snap.stairsPos;
  state.portalPos = snap.portalPos;
  state.floorTheme = snap.floorTheme;
  state.isDungeonShop = snap.isDungeonShop;
  state.revealed = snap.revealed
    ? snap.revealed.map(row => new Uint8Array(row))
    : Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  return true;
}

export function clearFloorCache() {
  state.floorCache = {};
}

export function enterDungeon(floor = 1) {
  // Save the current floor before leaving it, so we can restore it if the player returns
  const comingFromFloor = state.floor;
  saveCurrentFloorToCache();
  state.savedDungeon = null;
  state.mode = 'dungeon';
  state.floor = floor;
  state.projectiles = [];
  state.showChest = false;
  state.activeChest = null;

  // ── Restore cached floor if already visited ──────────────────────────────
  if (state.floorCache[floor]) {
    restoreFloorFromCache(floor);
    const themeKey = state.floorTheme;
    const theme = FLOOR_THEMES[themeKey] || {};
    // Place player at correct entry point based on direction of travel
    if (floor < comingFromFloor) {
      // Came back UP — appear near the down-stairs (CAVE_STAIRS)
      state.player.x = state.stairsPos.x;
      state.player.y = state.stairsPos.y + 1;
    } else {
      // Went DOWN — appear at the up-stairs entry (stored as playerStart)
      const snap = state.floorCache[floor]; // already restored, but playerStart was saved
      // playerStart was overwritten during restoreFloorFromCache, re-read from the snapshot
      // Actually we can search for UP_STAIRS tile as the canonical entry
      let px = -1, py = -1;
      outer: for (let y = 0; y < state.mapH; y++) {
        for (let x = 0; x < state.mapW; x++) {
          if (state.map[y][x] === TILE.UP_STAIRS) { px = x; py = y; break outer; }
        }
      }
      if (px !== -1) { state.player.x = px; state.player.y = py + 1; }
      else { state.player.x = 1; state.player.y = 1; }
    }
    updateQuestProgress('reach', floor);
    checkAchievements();
    updateFOV();
    log(`You return to floor ${floor} — the dungeon feels familiar.`, 'info');
    return;
  }

  // ── Generate a brand-new floor ───────────────────────────────────────────
  // Pick a random theme appropriate for this floor
  const themeKey = pickFloorTheme(floor);
  const theme = FLOOR_THEMES[themeKey];
  state.floorTheme = themeKey;

  const dungeon = generateDungeon(floor, themeKey);
  state.map = dungeon.map;
  if (floor > state.stats.highestFloor) {
    state.stats.highestFloor = floor;
    // Unlock floor warp checkpoint every 5 floors
    if (floor % 5 === 0 && !state.unlockedFloorWarps.includes(floor)) {
      state.unlockedFloorWarps.push(floor);
      state.unlockedFloorWarps.sort((a, b) => a - b);
      log(`⬆ Floor ${floor} warp unlocked! Return to the village warp stone to use it.`, 'level');
    }
  }
  // Quest: reach floor
  updateQuestProgress('reach', floor);
  checkAchievements();
  state.mapW = dungeon.map[0].length;
  state.mapH = dungeon.map.length;
  state.stairsPos = dungeon.stairsPos;

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

  // Spawn boss every 5 floors (phase boss overrides on floors 10/20/30)
  if (floor % 5 === 0) {
    const phaseBossData = PHASE_BOSSES[floor];
    if (phaseBossData) {
      // Spawn a phase boss
      const bossRoomIdx = floorRooms.length > 2 ? randInt(1, floorRooms.length - 2) : 1;
      const bossRoom = floorRooms[bossRoomIdx];
      const bx = bossRoom.cx;
      const by = bossRoom.cy;
      const boss = createEntity(phaseBossData.type, bx, by);
      boss.isBoss = true;
      boss.isPhaseBoss = true;
      boss.bossPhase = 0;
      boss.phaseFloor = floor;
      boss.phaseName = phaseBossData.name;
      boss.phaseInvulnerable = 0;
      // Extra scaling for phase bosses
      boss.maxHp += floor * 4;
      boss.hp = boss.maxHp;
      boss.power += Math.floor(floor / 2);
      // Floor 10 boss is a massive 4x4 tile entity
      if (floor === 10) {
        boss.bossSize = 4;
        boss.maxHp = Math.floor(boss.maxHp * 1.5);
        boss.hp = boss.maxHp;
        boss.power += 3;
      }
      state.enemies.push(boss);
      log(`${phaseBossData.phases[0].msg}`, 'combat');
    } else if (BOSS_FOR_THEME[themeKey]) {
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

  // Apply difficulty (hardship) scaling
  const diffInfo = getDifficultyInfo();
  if (state.difficulty !== 'normal') {
    for (const e of state.enemies) {
      e.maxHp = Math.floor(e.maxHp * diffInfo.hpMult);
      e.hp = e.maxHp;
      e.power = Math.max(1, Math.floor(e.power * diffInfo.powMult));
      // Scale XP/gold rewards too
      if (e.xpReward)   e.xpReward   = Math.floor(e.xpReward   * diffInfo.xpMult);
      if (e.goldDrop)   e.goldDrop   = Math.floor(e.goldDrop    * diffInfo.goldMult);
    }
  }

  // Spawn ground items (tier-appropriate)
  state.items = [];
  const numItems = randInt(ITEMS_PER_FLOOR_MIN, ITEMS_PER_FLOOR_MAX);
  const allItemIds = Object.keys(ITEMS);
  // Filter items to appropriate tier for this floor
  const tierMax = Math.min(5, 1 + Math.floor(floor / 2));
  const eligibleItems = allItemIds.filter(id => (ITEMS[id].tier || 0) <= tierMax || ITEMS[id].type === ITEM_TYPE.CONSUMABLE);
  const isSpecialTile = (x, y) => {
    const tile = state.map[y] && state.map[y][x];
    return tile === TILE.CAVE_STAIRS || tile === TILE.UP_STAIRS || tile === TILE.PORTAL || tile === TILE.CAVE_ENTRANCE ||
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

  // Mimic chests: 15% chance per chest on floors 2+
  if (floor >= 2) {
    for (const chest of state.chests) {
      if (Math.random() < 0.15) {
        chest.isMimic = true;
        if (floor >= 10) chest.mimicType = ENTITY.ANCIENT_MIMIC;
        else if (floor >= 5) chest.mimicType = ENTITY.GREATER_MIMIC;
        else chest.mimicType = ENTITY.MIMIC;
      }
    }
  }

  // Monster breeding dens: 1-2 per floor on floors 2+
  state.dens = [];
  if (floor >= 2 && floorRooms.length > 2) {
    const denConfig = DEN_TYPES[themeKey];
    if (denConfig) {
      const numDens = randInt(1, 2);
      for (let i = 0; i < numDens; i++) {
        const dRoomIdx = randInt(1, floorRooms.length - 2);
        const dRoom = floorRooms[dRoomIdx];
        const dx = dRoom.cx + (i === 0 ? 0 : randInt(-1, 1));
        const dy = dRoom.cy + (i === 0 ? 0 : randInt(-1, 1));
        if (!isOccupied(dx, dy) && canWalk(dx, dy) && !isSpecialTile(dx, dy)) {
          const denHp = denConfig.hp + floor * 3;
          state.dens.push({
            x: dx, y: dy,
            hp: denHp, maxHp: denHp,
            type: denConfig.sprite,
            name: denConfig.name,
            spawnType: denConfig.spawnType,
            spawnTimer: 5,
            spawnCount: 0,
            maxSpawns: 6,
            destroyed: false,
            themeKey: themeKey,
          });
        }
      }
      if (state.dens.length > 0) {
        log(`A ${denConfig.name} pulses with dark energy nearby...`, 'combat');
      }
    }
  }

  // Guardian chambers: spawn guardian in guardian rooms (floors 3+, 40% chance)
  if (floor >= 3) {
    for (const room of floorRooms) {
      if (room.type !== ROOM_TYPE.GUARDIAN_CHAMBER) continue;
      if (Math.random() > 0.40) continue;
      const guardianType = GUARDIAN_FOR_THEME[themeKey] || ENTITY.GUARDIAN_HOARDER;
      const gx = room.cx;
      const gy = room.cy;
      if (!isOccupied(gx, gy) && canWalk(gx, gy)) {
        const guardian = createEntity(guardianType, gx, gy);
        guardian.isGuardian = true;
        guardian.guardianRoom = { x: room.x, y: room.y, w: room.w, h: room.h };
        guardian.guardianName = GUARDIAN_NAMES[randInt(0, GUARDIAN_NAMES.length - 1)];
        // Boost stats significantly
        guardian.maxHp = Math.floor((guardian.maxHp + floor * 3) * 2.5);
        guardian.hp = guardian.maxHp;
        guardian.power = Math.floor((guardian.power + Math.floor(floor / 2)) * 1.8);
        guardian.armor = (guardian.armor || 0) + 3;
        state.enemies.push(guardian);
        // Place extra treasure in the room
        const extraGold = randInt(3, 5);
        for (let g = 0; g < extraGold; g++) {
          const gix = randInt(room.x + 2, room.x + room.w - 3);
          const giy = randInt(room.y + 2, room.y + room.h - 3);
          if (canWalk(gix, giy) && !isSpecialTile(gix, giy)) {
            const goldAmount = randInt(10, 20 + floor * 3);
            state.chests.push({ x: gix, y: giy, items: [], gold: goldAmount, opened: false });
          }
        }
        log(`A powerful guardian protects a treasure hoard nearby...`, 'combat');
      }
    }
  }

  // Apply prestige scaling to guardians too (already in enemies array)

  state.revealed = Array.from({ length: state.mapH }, () => new Uint8Array(state.mapW));
  updateFOV();

  // Cartographer boss skill: reveal entire map
  if (state.bossSkills.cartographer) {
    for (let y = 0; y < state.mapH; y++)
      for (let x = 0; x < state.mapW; x++)
        state.revealed[y][x] = 1;
    log(t('log.cartographer'), 'info');
  }

  // Place Mini Dungeon portal on floors 5 and 10
  if ((floor === 5 || floor === 10) && floorRooms.length > 2) {
    const miniRoom = floorRooms[Math.floor(floorRooms.length / 2)];
    const mx2 = miniRoom.cx - 1;
    const my2 = miniRoom.cy;
    if (canWalk(mx2, my2) && !isSpecialTile(mx2, my2) && !isOccupied(mx2, my2)) {
      state.map[my2][mx2] = TILE.MINI_DUNGEON;
      log(`⚡ A mini dungeon gate has opened nearby!`, 'level');
    }
  }

  // Shrine blessing on first entry to this floor
  if (state.townBuildings.shrine && floor === 1) {
    applyShrineBlessingNow();
  }

  // Library: show XP boost hint
  if (state.townBuildings.library) {
    log(`📚 Library bonus active: +15% XP this floor.`, 'info');
  }

  log(t('log.enter_floor', { theme: theme.name, floor: floor }), 'info');
}

function applyShrineBlessingNow() {
  const blessings = [
    { name: 'Protection',  effect: () => { state.player.armor = (state.player.armor || 0) + 2; },         desc: '+2 armor' },
    { name: 'Fortitude',   effect: () => { state.player.maxHp += 10; state.player.hp = Math.min(state.player.hp + 10, state.player.maxHp); }, desc: '+10 max HP' },
    { name: 'Arcane Rush', effect: () => { state.player.mana = Math.min(state.player.mana + 5, state.player.maxMana || 5); }, desc: '+5 mana' },
    { name: 'Swiftness',   effect: () => { state.player.attrs = state.player.attrs || {}; state.player.attrs.agi = (state.player.attrs.agi || 1) + 1; recalcDerivedStats(); }, desc: '+1 Agility' },
    { name: 'Avarice',     effect: () => { state.player.gold = (state.player.gold || 0) + randInt(15, 30); }, desc: '+15-30 gold' },
  ];
  const b = blessings[randInt(0, blessings.length - 1)];
  b.effect();
  log(`🏛️ The Shrine bestows the blessing of ${b.name}: ${b.desc}!`, 'level');
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
  recordRun(deathMsg || 'Slain');
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
  return state.enemies.find(e => {
    if (e.hp <= 0) return false;
    if (e.bossSize && e.bossSize > 1) {
      // Large boss: occupies a bossSize x bossSize area from its (x,y) origin
      return x >= e.x && x < e.x + e.bossSize && y >= e.y && y < e.y + e.bossSize;
    }
    return e.x === x && e.y === y;
  });
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
  // Wave 2 monsters
  [ENTITY.BLOOD_BAT]:        'Blood Bat',
  [ENTITY.PLAGUE_RAT]:       'Plague Rat',
  [ENTITY.SAND_SCORPION]:    'Sand Scorpion',
  [ENTITY.BONE_SENTINEL]:    'Bone Sentinel',
  [ENTITY.DARK_ACOLYTE]:     'Dark Acolyte',
  [ENTITY.SWAMP_HAG]:        'Swamp Hag',
  [ENTITY.THUNDER_LIZARD]:   'Thunder Lizard',
  [ENTITY.STONE_GARGOYLE]:   'Stone Gargoyle',
  [ENTITY.CORPSE_EATER]:     'Corpse Eater',
  [ENTITY.VOID_TOUCHED]:     'Void Touched',
  [ENTITY.FLAME_DANCER]:     'Flame Dancer',
  [ENTITY.GLACIAL_BEETLE]:   'Glacial Beetle',
  [ENTITY.IRON_REVENANT]:    'Iron Revenant',
  [ENTITY.MYCONID_SPROUT]:   'Myconid Sprout',
  [ENTITY.WAILING_BANSHEE]:  'Wailing Banshee',
  [ENTITY.OBSIDIAN_DRAKE]:   'Obsidian Drake',
  [ENTITY.VILE_SHAMAN]:      'Vile Shaman',
  [ENTITY.BLOOD_GOLEM]:      'Blood Golem',
  [ENTITY.FROST_ARCHER]:     'Frost Archer',
  [ENTITY.ABYSSAL_WATCHER]:  'Abyssal Watcher',
  [ENTITY.VOID_EMPEROR]:     'Void Emperor',
  // Mimics
  [ENTITY.MIMIC]:            'Mimic',
  [ENTITY.GREATER_MIMIC]:    'Greater Mimic',
  [ENTITY.ANCIENT_MIMIC]:    'Ancient Mimic',
  // Guardians
  [ENTITY.GUARDIAN_HOARDER]:  'Treasure Guardian',
  [ENTITY.GUARDIAN_SENTINEL]: 'Vault Sentinel',
  [ENTITY.GUARDIAN_KEEPER]:   'Arcane Keeper',
  // Kobold
  [ENTITY.KOBOLD]:           'Kobold',
  // Boss Cave Bosses
  [ENTITY.STONE_COLOSSUS]:   'Stone Colossus',
  [ENTITY.FLAME_TYRANT]:     'Flame Tyrant',
  [ENTITY.LICH_QUEEN]:       'Lich Queen',
  [ENTITY.KARG_WAR_MACHINE]: 'Karg',
  [ENTITY.THE_ANCIENT_ONE]:  'The Ancient One',
  // Boss Cave Minions
  [ENTITY.STONE_SHARD]:      'Stone Shard',
  [ENTITY.TURRET_DRONE]:     'Turret Drone',
};

export function getEnemyName(entity) {
  if (entity.guardianName) return entity.guardianName;
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

export function toggleTalentTree() {
  state.showTalentTree = !state.showTalentTree;
  if (state.showTalentTree) { state.showPrestige = false; state.showSettings = false; }
}

export function closeTalentTree() {
  state.showTalentTree = false;
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

  // Calculate rewards (arena upgrade: 1.5x gold at level 2+)
  const arenaLevel = getTownUpgradeLevel('arena');
  let waveGold = ARENA_CONFIG.REWARDS.goldPerWave(wave);
  if (arenaLevel >= 2) waveGold = Math.floor(waveGold * 1.5);
  state.arenaRewards.gold += waveGold;
  state.player.gold += waveGold;
  state.stats.totalGoldEarned += waveGold;
  // Arena level 3: grant XP per wave
  if (arenaLevel >= 3 && state.player) {
    const xpGain = 5 + wave * 3;
    grantXP(xpGain);
    log(t('log.wave_cleared', { n: wave, gold: waveGold }) + ` (+${xpGain} XP)`, 'level');
  } else {
    log(t('log.wave_cleared', { n: wave, gold: waveGold }), 'level');
  }

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
    // Arena level 3: bonus epic item at wave 10
    if (arenaLevel >= 3) {
      const epicItems = Object.entries(ITEMS).filter(([, v]) => v.tier === 4 && (v.type === ITEM_TYPE.WEAPON || v.type === ITEM_TYPE.ARMOR || v.type === ITEM_TYPE.HELMET || v.type === ITEM_TYPE.CHEST || v.type === ITEM_TYPE.BOOTS));
      if (epicItems.length > 0) {
        const [eid, eDef] = epicItems[randInt(0, epicItems.length - 1)];
        const eItem = { ...eDef };
        if (state.player.inventory.length < BACKPACK_SIZE) {
          state.player.inventory.push(eItem);
          registerArmoryItem(eid);
          state.arenaRewards.items.push(eItem.name);
          log(`Arena bonus: ${eItem.name}!`, 'item');
        }
      }
    }
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
  // Check subclass branch access
  for (const [branchKey, branch] of Object.entries(tree)) {
    if (branch.skills.some(s => s.id === skillId) && branch.subclass) {
      if (!p.subclass || p.subclass !== branch.subclass) return false;
    }
  }
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
  const statSkills = ['tough_skin', 'mana_flow', 'aura_of_protection', 'iron_will', 'weapon_mastery'];
  if (statSkills.includes(skillId)) recalcDerivedStats();
  return true;
}

export function getSkillTree() {
  const fullTree = SKILL_TREES[state.playerClass];
  if (!fullTree) return {};
  // Return all branches — subclass branches will be marked locked in UI if not unlocked
  return fullTree;
}

export function selectSubclass(subclassId) {
  const info = SUBCLASS_INFO[subclassId];
  if (!info) return false;
  if (info.baseClass !== state.playerClass) return false;
  const p = state.player;
  if (!p) return false;
  p.subclass = subclassId;
  state.showSubclassSelect = false;

  // Apply stat bonuses
  if (info.statBonuses.power) p.basePower = (p.basePower || 0) + info.statBonuses.power;
  if (info.statBonuses.armor) p.baseArmor = (p.baseArmor || 0) + info.statBonuses.armor;
  if (info.statBonuses.maxHp) p.baseMaxHp = (p.baseMaxHp || 20) + info.statBonuses.maxHp;
  if (info.statBonuses.maxMana) p.baseMaxMana = (p.baseMaxMana || 0) + info.statBonuses.maxMana;
  if (info.statBonuses.spellBonus) p.subclassSpellBonus = info.statBonuses.spellBonus;
  if (info.statBonuses.rangedBonus) p.subclassRangedBonus = info.statBonuses.rangedBonus;
  if (info.statBonuses.critBonus) p.subclassCritBonus = info.statBonuses.critBonus;

  recalcDerivedStats();
  log(`Specialized as ${info.name}!`, 'level');
  return true;
}

export function isSubclassBranchUnlocked(branchKey) {
  const fullTree = SKILL_TREES[state.playerClass];
  if (!fullTree || !fullTree[branchKey]) return true; // base branches always unlocked
  const branch = fullTree[branchKey];
  if (!branch.subclass) return true; // no subclass requirement
  const p = state.player;
  if (!p || !p.subclass) return false;
  return p.subclass === branch.subclass;
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
    // ── New base skills ──
    case 'devastating_blow': {
      const target = findNearestVisibleEnemy(2);
      if (!target) { log('No enemies nearby!', 'info'); return false; }
      const power = getEffectivePower(p);
      const dmg = Math.max(1, power * 5 - getEffectiveArmor(target));
      target.hp -= dmg;
      target.stunTurns = (target.stunTurns || 0) + 2;
      log(`Devastating Blow hits ${getEnemyName(target)} for ${dmg} damage! Stunned!`, 'combat');
      if (target.hp <= 0) { target.hp = 0; recordKill(target.type, target); grantXP(target.xpReward || 8); grantGold(target); dropLoot(target); onKillEffects(); }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'last_stand': {
      if (p.hp > p.maxHp * 0.2) { log('HP too high for Last Stand!', 'info'); return false; }
      p.effects.push({ name: 'Last Stand', stat: 'power', amount: Math.floor(getEffectivePower(p) * 0.5), turns: 5 });
      log('Last Stand activated! +50% damage for 5 turns!', 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'elemental_surge': {
      p.elementalSurge = true;
      log('Elemental Surge! Next spell deals double damage!', 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'mana_surge': {
      const restore = [10, 15, 20][rank - 1];
      p.mana = Math.min(p.maxMana, p.mana + restore);
      log(`Mana Surge restores ${restore} mana!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'arcane_barrier': {
      const absorb = [10, 15, 20][rank - 1];
      p.arcaneBarrier = (p.arcaneBarrier || 0) + absorb;
      log(`Arcane Barrier absorbs next ${absorb} damage!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'piercing_shot': {
      const bowRange = BOW_RANGE + getRangeBonus(p);
      const target = findNearestVisibleEnemy(bowRange);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const bowPower = getEffectiveRangedPower(p);
      const dmg = Math.max(1, bowPower); // ignores armor
      target.hp -= dmg;
      state.projectiles.push({ x: target.x, y: target.y, type: 'arrow', ttl: 3 });
      log(`Piercing Shot hits ${getEnemyName(target)} for ${dmg} damage (ignores armor)!`, 'combat');
      if (target.hp <= 0) { target.hp = 0; recordKill(target.type, target); grantXP(target.xpReward || 8); grantGold(target); dropLoot(target); onKillEffects(); }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'trap_mastery': {
      const trapDmg = [5, 8, 12][rank - 1];
      const tx = p.x, ty = p.y;
      if (!state.traps) state.traps = [];
      state.traps.push({ x: tx, y: ty, damage: trapDmg, active: true });
      log(`Placed a spike trap (${trapDmg} dmg)!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'second_wind': {
      const healPct = [0.15, 0.20, 0.25][rank - 1];
      const heal = Math.floor(p.maxHp * healPct);
      p.hp = Math.min(p.maxHp, p.hp + heal);
      log(`Second Wind heals ${heal} HP!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Berserker skills ──
    case 'frenzy': {
      p.frenzyTurns = 3;
      log('Frenzy! Attack twice per turn for 3 turns!', 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'reckless_swing': {
      const target = findNearestVisibleEnemy(2);
      if (!target) { log('No enemies nearby!', 'info'); return false; }
      const dmgPct = [2.0, 2.25, 2.5][rank - 1];
      const recoilPct = [0.25, 0.20, 0.15][rank - 1];
      const power = getEffectivePower(p);
      const dmg = Math.max(1, Math.floor(power * dmgPct) - getEffectiveArmor(target));
      target.hp -= dmg;
      const recoil = Math.floor(dmg * recoilPct);
      p.hp = Math.max(1, p.hp - recoil);
      log(`Reckless Swing hits ${getEnemyName(target)} for ${dmg}! Recoil: ${recoil}`, 'combat');
      if (target.hp <= 0) { target.hp = 0; recordKill(target.type, target); grantXP(target.xpReward || 8); grantGold(target); dropLoot(target); onKillEffects(); }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'unstoppable': {
      p.unstoppableTurns = 5;
      log('Unstoppable! Immune to stun/slow for 5 turns!', 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Paladin skills ──
    case 'holy_light': {
      const heal = [5, 8, 12][rank - 1];
      p.hp = Math.min(p.maxHp, p.hp + heal);
      log(`Holy Light heals ${heal} HP!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'divine_shield': {
      const blocks = [2, 3, 4][rank - 1];
      p.divineShield = (p.divineShield || 0) + blocks;
      log(`Divine Shield! Block next ${blocks} hits!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'smite': {
      const target = findNearestVisibleEnemy(3);
      if (!target) { log('No enemies nearby!', 'info'); return false; }
      const power = getEffectivePower(p);
      const isUndead = [ENTITY.SKELETON, ENTITY.WRAITH, ENTITY.ZOMBIE, ENTITY.PHANTOM, ENTITY.DEATH_KNIGHT,
        ENTITY.NECROMANCER, ENTITY.BONE_ARCHER, ENTITY.WAILING_BANSHEE, ENTITY.BONE_SENTINEL,
        ENTITY.CORPSE_EATER, ENTITY.BLOOD_BAT, ENTITY.DARK_ACOLYTE, ENTITY.BLOOD_GOLEM].includes(target.type);
      const dmg = Math.max(1, (isUndead ? power * 2 : power) - getEffectiveArmor(target));
      target.hp -= dmg;
      log(`Smite hits ${getEnemyName(target)} for ${dmg}${isUndead ? ' (Holy!)' : ''}!`, 'combat');
      if (target.hp <= 0) { target.hp = 0; recordKill(target.type, target); grantXP(target.xpReward || 8); grantGold(target); dropLoot(target); onKillEffects(); }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Pyromancer skills ──
    case 'fireball': {
      const target = findNearestVisibleEnemy(5);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const spellPow = getSpellPower(p);
      const enemies = state.enemies.filter(e => e.hp > 0 && Math.abs(e.x - target.x) <= 2 && Math.abs(e.y - target.y) <= 2 && state.visibility[e.y] && state.visibility[e.y][e.x]);
      for (const e of enemies) {
        const dmg = Math.max(1, spellPow - getEffectiveArmor(e));
        e.hp -= dmg;
        log(`Fireball burns ${getEnemyName(e)} for ${dmg}!`, 'combat');
        if (e.hp <= 0) { e.hp = 0; recordKill(e.type, e); grantXP(e.xpReward || 8); grantGold(e); dropLoot(e); onKillEffects(); }
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'flame_wall': {
      const dmg = [4, 6, 8][rank - 1];
      if (!state.burningTiles) state.burningTiles = [];
      // Place burning tiles around player
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const bx = p.x + dx, by = p.y + dy;
          if (bx >= 0 && bx < state.mapW && by >= 0 && by < state.mapH && canWalk(bx, by)) {
            state.burningTiles.push({ x: bx, y: by, damage: dmg, turns: 4 });
          }
        }
      }
      log(`Flame Wall created (${dmg} dmg/turn)!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'inferno_skill': {
      const visible = state.enemies.filter(e => e.hp > 0 && state.visibility[e.y] && state.visibility[e.y][e.x]);
      if (visible.length === 0) { log('No visible enemies!', 'info'); return false; }
      for (const e of visible) {
        const dmg = 8;
        e.hp -= dmg;
        log(`Inferno burns ${getEnemyName(e)} for ${dmg}!`, 'combat');
        if (e.hp <= 0) { e.hp = 0; recordKill(e.type, e); grantXP(e.xpReward || 8); grantGold(e); dropLoot(e); onKillEffects(); }
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Necromancer skills ──
    case 'life_drain': {
      const target = findNearestVisibleEnemy(4);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const steal = [2, 3, 4][rank - 1];
      target.hp -= steal;
      p.hp = Math.min(p.maxHp, p.hp + steal);
      log(`Life Drain steals ${steal} HP from ${getEnemyName(target)}!`, 'combat');
      if (target.hp <= 0) { target.hp = 0; recordKill(target.type, target); grantXP(target.xpReward || 8); grantGold(target); dropLoot(target); onKillEffects(); }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'dark_pact': {
      const spellBuff = [8, 10, 12][rank - 1];
      p.hp = Math.max(1, p.hp - 5);
      p.effects.push({ name: 'Dark Pact', stat: 'spellPower', amount: spellBuff, turns: 3 });
      log(`Dark Pact! -5 HP, +${spellBuff} spell damage for 3 turns!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'shadow_cloak': {
      const turns = [2, 3, 4][rank - 1];
      p.invisible = turns;
      log(`Shadow Cloak! Invisible for ${turns} turns!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'death_mark': {
      const target = findNearestVisibleEnemy(5);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      target.deathMark = 4;
      log(`Death Mark on ${getEnemyName(target)}! +50% damage for 4 turns!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Ranger skills ──
    case 'entangle': {
      const target = findNearestVisibleEnemy(5);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const rootTurns = [2, 3, 4][rank - 1];
      target.rootedTurns = (target.rootedTurns || 0) + rootTurns;
      log(`Entangle roots ${getEnemyName(target)} for ${rootTurns} turns!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'rain_of_arrows': {
      const target = findNearestVisibleEnemy(6);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const bowPower = getEffectiveRangedPower(p);
      const targets = state.enemies.filter(e => e.hp > 0 && Math.abs(e.x - target.x) <= 3 && Math.abs(e.y - target.y) <= 3 && state.visibility[e.y] && state.visibility[e.y][e.x]);
      for (const tgt of targets) {
        const dmg = Math.max(1, bowPower - getEffectiveArmor(tgt));
        tgt.hp -= dmg;
        state.projectiles.push({ x: tgt.x, y: tgt.y, type: 'arrow', ttl: 3 });
        log(`Rain of Arrows hits ${getEnemyName(tgt)} for ${dmg}!`, 'combat');
        if (tgt.hp <= 0) { tgt.hp = 0; recordKill(tgt.type, tgt); grantXP(tgt.xpReward || 8); grantGold(tgt); dropLoot(tgt); onKillEffects(); }
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'beast_companion': {
      const wolfDmg = [3, 4, 5][rank - 1];
      p.beastCompanion = { damage: wolfDmg, active: true };
      log(`Wolf companion summoned (${wolfDmg} dmg/turn)!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    // ── Assassin skills ──
    case 'fan_of_knives': {
      const targets = getAdjacentEnemies();
      if (targets.length === 0) { log('No adjacent enemies!', 'info'); return false; }
      const dmg = [4, 6, 8][rank - 1];
      for (const tgt of targets) {
        const finalDmg = Math.max(1, dmg - getEffectiveArmor(tgt));
        tgt.hp -= finalDmg;
        log(`Fan of Knives hits ${getEnemyName(tgt)} for ${finalDmg}!`, 'combat');
        if (tgt.hp <= 0) { tgt.hp = 0; recordKill(tgt.type, tgt); grantXP(tgt.xpReward || 8); grantGold(tgt); dropLoot(tgt); onKillEffects(); }
      }
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'mark_for_death': {
      const target = findNearestVisibleEnemy(5);
      if (!target) { log('No enemies in range!', 'info'); return false; }
      const bonus = [25, 35, 50][rank - 1];
      target.deathMark = 4;
      target.deathMarkBonus = bonus;
      log(`Marked ${getEnemyName(target)} for Death! +${bonus}% damage for 4 turns!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'shadow_step': {
      const target = findNearestVisibleEnemy(3);
      if (!target) { log('No enemies within 3 tiles!', 'info'); return false; }
      // Teleport behind target
      const dx = target.x - p.x, dy = target.y - p.y;
      const behindX = target.x + Math.sign(dx), behindY = target.y + Math.sign(dy);
      if (behindX >= 0 && behindX < state.mapW && behindY >= 0 && behindY < state.mapH && canWalk(behindX, behindY)) {
        p.x = behindX; p.y = behindY;
      } else {
        p.x = target.x; p.y = target.y; // fallback to target position
        target.x = target.x + Math.sign(-dx); target.y = target.y + Math.sign(-dy); // swap
      }
      p.invisible = 1; // brief stealth for backstab
      log(`Shadow Step behind ${getEnemyName(target)}!`, 'combat');
      cd[skillId] = def.cooldown;
      endTurn();
      return true;
    }
    case 'death_lotus': {
      const visible = state.enemies.filter(e => e.hp > 0 && state.visibility[e.y] && state.visibility[e.y][e.x]);
      if (visible.length === 0) { log('No visible enemies!', 'info'); return false; }
      const power = getEffectivePower(p);
      for (let i = 0; i < 5; i++) {
        const tgt = visible[randInt(0, visible.length - 1)];
        if (tgt.hp <= 0) continue;
        const dmg = Math.max(1, power - getEffectiveArmor(tgt));
        tgt.hp -= dmg;
        log(`Death Lotus strikes ${getEnemyName(tgt)} for ${dmg}!`, 'combat');
        if (tgt.hp <= 0) { tgt.hp = 0; recordKill(tgt.type, tgt); grantXP(tgt.xpReward || 8); grantGold(tgt); dropLoot(tgt); onKillEffects(); }
      }
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

  // Check for class unlocks
  checkClassUnlocks();

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

function saveDungeonSnapshot() {
  state.savedDungeon = {
    map: state.map.map(row => new Uint8Array(row)),
    mapW: state.mapW,
    mapH: state.mapH,
    floor: state.floor,
    floorTheme: state.floorTheme,
    enemies: state.enemies,
    items: state.items,
    chests: state.chests,
    stairsPos: state.stairsPos,
    revealed: state.revealed.map(row => new Uint8Array(row)),
    playerX: state.player.x,
    playerY: state.player.y,
    turnCount: state.turnCount,
    projectiles: state.projectiles,
    portalPos: state.portalPos,
    dens: state.dens,
  };
}

function restoreDungeonSnapshot() {
  const snap = state.savedDungeon;
  if (!snap) return false;
  state.mode = 'dungeon';
  state.floor = snap.floor;
  state.floorTheme = snap.floorTheme;
  state.map = snap.map;
  state.mapW = snap.mapW;
  state.mapH = snap.mapH;
  state.enemies = snap.enemies;
  state.items = snap.items;
  state.chests = snap.chests;
  state.stairsPos = snap.stairsPos;
  state.revealed = snap.revealed;
  state.turnCount = snap.turnCount;
  state.projectiles = snap.projectiles;
  state.portalPos = snap.portalPos;
  state.dens = snap.dens || [];
  state.player.x = snap.playerX;
  state.player.y = snap.playerY;
  state.savedDungeon = null;
  state.lastDungeonFloor = 0;
  updateFOV();
  return true;
}

export function useTownPortal() {
  if (state.mode !== 'dungeon') { log(t('log.portal_dungeon_only'), 'info'); return; }
  if (!state.bossSkills.town_portal) { log(t('log.portal_not_learned'), 'info'); return; }
  log(t('log.portal_opened'), 'level');
  saveDungeonSnapshot();
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

  if (code.toLowerCase() === 'perfectwarrior') {
    const p = state.player;
    // Set class to warrior if not already playing
    if (!state.playerClass) state.playerClass = PLAYER_CLASS.WARRIOR;
    // Level 50 with full stats
    p.level = 50;
    p.xp = 0;
    p.xpToNext = 9999;
    p.maxHp = 250;
    p.hp = 250;
    p.statPoints = 0;
    p.skillPoints = 0;
    p.gold = 9999;
    // Max all warrior attributes
    p.attrs = { str: 20, vit: 20, agi: 15, int: 5, cha: 5 };
    // Give best warrior gear (Tier 5 + Dragonscale set)
    const bestGear = ['excalibur', 'crown_of_ages', 'aegis_plate', 'dragon_gauntlets', 'boots_of_hermes', 'phoenix_cloak'];
    for (const id of bestGear) {
      if (ITEMS[id]) {
        const item = { ...ITEMS[id] };
        p.equipment[item.slot] = item;
        registerArmoryItem(id);
      }
    }
    // Max all warrior skills (both trees, skip subclass branches)
    const tree = SKILL_TREES[PLAYER_CLASS.WARRIOR];
    if (tree) {
      for (const branch of Object.values(tree)) {
        if (branch.subclass) continue; // skip subclass-locked branches
        for (const skill of branch.skills) {
          p.skills[skill.id] = skill.maxRank;
        }
      }
    }
    // Set berserker subclass and max its skills too
    p.subclass = 'berserker';
    if (tree) {
      for (const branch of Object.values(tree)) {
        if (branch.subclass && branch.subclass === 'berserker') {
          for (const skill of branch.skills) {
            p.skills[skill.id] = skill.maxRank;
          }
        }
      }
    }
    // Unlock all floor warps up to floor 50
    for (let f = 5; f <= 50; f += 5) state.unlockedFloorWarps = state.unlockedFloorWarps || [];
    state.unlockedFloorWarps = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
    log('⚔ Perfect Warrior activated! Level 50, best gear, all skills maxed.', 'level');
    return true;
  }

  return false;
}

export function closeFloorWarp() {
  state.showFloorWarp = false;
}

export function warpToFloor(floor) {
  if (!state.unlockedFloorWarps.includes(floor)) {
    log('That floor warp is not unlocked yet.', 'info');
    return;
  }
  state.showFloorWarp = false;
  log(`⬆ Warping to floor ${floor}...`, 'level');
  enterDungeon(floor);
}

export function toggleSpellBook() {
  state.showSpellBook = !state.showSpellBook;
}
export function closeSpellBook() {
  state.showSpellBook = false;
}

export function closeHealer() {
  state.showHealer = false;
}

export function getTownUpgradeLevel(building) {
  return state.townUpgrades[building] || 1;
}

export function upgradeTownBuilding(building) {
  const info = TOWN_UPGRADES[building];
  if (!info) return;
  const currentLevel = getTownUpgradeLevel(building);
  if (currentLevel >= info.maxLevel) {
    log('Already at max level!', 'info');
    return;
  }
  const cost = info.costs[currentLevel]; // cost to reach next level
  if (state.player.gold < cost) {
    log(`Not enough gold! Need ${cost}g.`, 'info');
    return;
  }
  state.player.gold -= cost;
  state.townUpgrades[building] = currentLevel + 1;
  log(`${info.name} upgraded to level ${currentLevel + 1}!`, 'level');
}

export function healPlayer() {
  const p = state.player;
  if (p.hp >= p.maxHp && p.mana >= p.maxMana) {
    log(t('log.already_healed'), 'info');
    return;
  }
  const healerLevel = getTownUpgradeLevel('healer');
  const cost = healerLevel >= 3 ? 0 : healerLevel >= 2 ? 5 : HEALER_COST;
  if (cost > 0 && p.gold < cost) {
    log(t('log.not_enough_gold_healer', { n: cost }), 'info');
    return;
  }
  p.gold -= cost;
  p.hp = p.maxHp;
  p.mana = p.maxMana;
  // Level 2+: cure poison
  if (healerLevel >= 2) {
    p.effects = p.effects ? p.effects.filter(e => e.name !== 'Poison') : [];
  }
  // Level 3: regen buff
  if (healerLevel >= 3) {
    if (!p.effects) p.effects = [];
    p.effects = p.effects.filter(e => e.name !== 'Regen');
    p.effects.push({ name: 'Regen', stat: 'regen', amount: 2, turns: 10 });
  }
  log(cost > 0 ? t('log.healer_healed', { n: cost }) : 'Healed for free!', 'item');
}

export function closeShop() {
  state.showShop = false;
  state.isDungeonShop = false;
}

// ── Blacksmith / Crafting ────────────────────────

export function closeBlacksmith() {
  state.showBlacksmith = false;
}

export function getAvailableCraftingRecipes() {
  let recipes = [...CRAFTING_RECIPES];
  const bsLevel = getTownUpgradeLevel('blacksmith');
  if (bsLevel >= 2) recipes = recipes.concat(CRAFTING_RECIPES_T2);
  if (bsLevel >= 3) recipes = recipes.concat(CRAFTING_RECIPES_T3);
  return recipes;
}

export function alchemyCraft(recipeIndex) {
  const recipes = ALCHEMY_RECIPES;
  const recipe = recipes[recipeIndex];
  if (!recipe) return;
  const p = state.player;

  // Check materials
  for (const [matId, qty] of Object.entries(recipe.materials)) {
    const count = p.inventory.filter(it => it.id === matId).reduce((sum, it) => sum + (it.count ?? it.qty ?? 1), 0);
    if (count < qty) { log(`Not enough ${ITEMS[matId]?.name || matId}.`, 'info'); return; }
  }
  if (p.gold < recipe.gold) { log(`Need ${recipe.gold}g to brew.`, 'info'); return; }
  if (p.inventory.length >= BACKPACK_SIZE) { log('Backpack full!', 'info'); return; }

  // Deduct materials
  for (const [matId, qty] of Object.entries(recipe.materials)) {
    let remaining = qty;
    for (let i = p.inventory.length - 1; i >= 0 && remaining > 0; i--) {
      if (p.inventory[i].id !== matId) continue;
      const stack = p.inventory[i].count ?? p.inventory[i].qty ?? 1;
      if (stack <= remaining) { remaining -= stack; p.inventory.splice(i, 1); }
      else { p.inventory[i].count = stack - remaining; delete p.inventory[i].qty; remaining = 0; }
    }
  }
  p.gold -= recipe.gold;

  // Add crafted item
  const crafted = { ...ITEMS[recipe.output] };
  if (crafted.stackable) crafted.count = 1;
  if (!tryStackItem(crafted)) p.inventory.push(crafted);
  if (!state.armory[recipe.output]) state.armory[recipe.output] = { count: 0 };
  state.armory[recipe.output].count++;
  log(`Brewed: ${crafted.name}!`, 'item');
}

export function craftItem(recipeIndex) {
  const allRecipes = getAvailableCraftingRecipes();
  const recipe = allRecipes[recipeIndex];
  if (!recipe) return;

  const p = state.player;
  const bsLevel = getTownUpgradeLevel('blacksmith');

  // Check gold (20% reduction at level 3)
  const goldCost = bsLevel >= 3 ? Math.floor(recipe.gold * 0.8) : recipe.gold;
  if (p.gold < goldCost) {
    log(t('log.not_enough_gold'), 'info');
    return;
  }

  // Check materials
  for (const [matId, qty] of Object.entries(recipe.materials)) {
    const count = p.inventory.filter(it => it.id === matId).reduce((sum, it) => sum + (it.count ?? it.qty ?? 1), 0);
    if (count < qty) {
      log(t('log.not_enough_materials'), 'info');
      return;
    }
  }

  // Check backpack space
  if (p.inventory.length >= BACKPACK_SIZE) {
    log(t('log.backpack_full'), 'info');
    return;
  }

  // Deduct gold
  p.gold -= goldCost;

  // Deduct materials
  for (const [matId, qty] of Object.entries(recipe.materials)) {
    let remaining = qty;
    for (let i = p.inventory.length - 1; i >= 0 && remaining > 0; i--) {
      if (p.inventory[i].id === matId) {
        const stack = p.inventory[i].count ?? p.inventory[i].qty ?? 1;
        if (stack <= remaining) {
          remaining -= stack;
          p.inventory.splice(i, 1);
        } else {
          p.inventory[i].count = stack - remaining;
          delete p.inventory[i].qty;
          remaining = 0;
        }
      }
    }
  }

  // Create crafted item
  const itemDef = ITEMS[recipe.output];
  if (!itemDef) return;
  const crafted = { ...itemDef };
  if (crafted.stackable) crafted.count = 1;
  p.inventory.push(crafted);

  // Track in armory
  if (!state.armory[recipe.output]) {
    state.armory[recipe.output] = { count: 0 };
  }
  state.armory[recipe.output].count++;

  log(t('log.crafted_item', { name: crafted.name }), 'item');
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
  let discount = ATTR_BONUSES.cha.shopDiscount(state.player.attrs.cha);
  // Shop upgrade discount
  const shopLevel = getTownUpgradeLevel('shop');
  if (shopLevel >= 3) discount += 20;
  else if (shopLevel >= 2) discount += 10;
  discount = Math.min(discount, 60); // cap at 60%
  return Math.max(1, Math.floor(basePrice * (100 - discount) / 100));
}

export function buyItem(shopIndex) {
  const inventory = getShopItems();
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

export function getSellPrice(item) {
  const shopEntry = SHOP_INVENTORY.find(s => s.itemId === item.id) || DUNGEON_SHOP_INVENTORY.find(s => s.itemId === item.id);
  let price = shopEntry ? Math.floor(shopEntry.price / 2) : 3;
  if (item.tier === 2) price = Math.max(price, 10);
  if (item.tier === 3) price = Math.max(price, 25);
  if (item.tier === 4) price = Math.max(price, 60);
  if (item.tier === 5) price = Math.max(price, 150);
  if (item.count && item.count > 1) price *= item.count;
  return price;
}

export function isTrashItem(item) {
  // Trash = tier 1 gear only. Materials and ingredients are NOT trash.
  if (!item) return false;
  if (item.type === 'material') return false;   // crafting materials — keep
  if (item.type === 'ingredient') return false; // alchemy ingredients — keep
  if (item.type === 'consumable') return false; // potions are not trash
  return (item.tier || 1) <= 1;
}

export function sellItem(invIndex) {
  const p = state.player;
  if (invIndex < 0 || invIndex >= p.inventory.length) return;
  const item = p.inventory[invIndex];
  const sellPrice = getSellPrice({ ...item, count: 1 }); // per-unit price
  if (item.count && item.count > 1) {
    item.count--;
  } else {
    p.inventory.splice(invIndex, 1);
  }
  p.gold += sellPrice;
  log(t('log.sold_item', { name: item.name, price: sellPrice }), 'item');
}

export function sellAllTrash() {
  const p = state.player;
  let totalGold = 0;
  let count = 0;
  // Iterate backwards to avoid index shifting issues
  for (let i = p.inventory.length - 1; i >= 0; i--) {
    const item = p.inventory[i];
    if (!isTrashItem(item)) continue;
    const perUnit = getSellPrice({ ...item, count: 1 });
    const qty = item.count || 1;
    totalGold += perUnit * qty;
    count += qty;
    p.inventory.splice(i, 1);
  }
  if (count === 0) {
    log('No trash gear to sell.', 'info');
  } else {
    p.gold += totalGold;
    log(`Sold ${count} trash item${count > 1 ? 's' : ''} for ${totalGold}g.`, 'item');
  }
}

function getShopItems() {
  let inventory = state.isDungeonShop
    ? [...DUNGEON_SHOP_INVENTORY]
    : [...SHOP_INVENTORY];
  if (!state.isDungeonShop) {
    const shopLevel = getTownUpgradeLevel('shop');
    if (shopLevel >= 2) inventory = inventory.concat(SHOP_UPGRADE_ITEMS);
    if (shopLevel >= 3) inventory = inventory.concat(SHOP_EPIC_ITEMS);
  }
  return inventory;
}

export function getShopInventory() {
  return getShopItems().map((entry, idx) => ({
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
  const aopRank = (p.skills && p.skills.aura_of_protection) || 0;
  if (aopRank > 0) p.armor += aopRank; // +1/+2/+3 armor from paladin aura

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

  // Apply talent tree bonuses
  const t = state.talents || {};
  if (t.iron_fist)   p.power  += 1;
  if (t.resilience)  p.armor  = (p.armor || 0) + 1;
  if (t.tough_skin)  p.maxHp  += 8;
  if (t.vitality_t)  p.maxHp  += 15;
  if (t.berserker_t) p.power  += Math.min(5, state.floor || 0);
  if (t.pack_rat)    { /* handled in BACKPACK_SIZE override */ }

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

function getSpellPower(entity) {
  // Total spell power = base power + spell bonus + empower skill
  const base = getEffectivePower(entity);
  const spellB = getSpellBonus(entity);
  const empowerRank = (entity.skills && entity.skills.empower) || 0;
  const empowerBonus = empowerRank > 0 ? [2, 4, 6][empowerRank - 1] : 0;
  const subclassBonus = entity.subclassSpellBonus || 0;
  return base + spellB + empowerBonus + subclassBonus;
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

  // Dodge check (AGI-based + Evasion skill + enemy dodgeChance field) for the defender
  if (defender.attrs || defender.dodgeChance) {
    let dodgeChance = defender.attrs ? ATTR_BONUSES.agi.dodgeChance(defender.attrs.agi) : 0;
    if (defender.dodgeChance) dodgeChance += defender.dodgeChance;
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

  // Phase boss invulnerability during transition
  if (defender.isPhaseBoss && defender.phaseInvulnerable > 0) {
    log(`${defender.phaseName || 'Boss'} is invulnerable!`, 'combat');
    return;
  }

  const power = getEffectivePower(attacker);
  const armor = getEffectiveArmor(defender);
  let baseDmg = Math.max(1, power - armor + randInt(-1, 1));

  // Bestiary damage bonus
  if (attacker.type === ENTITY.PLAYER && defender.type !== ENTITY.PLAYER) {
    baseDmg += getBestiaryDamageBonus(defender.type);
  }

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

  // Phase boss: check mid-fight phase transitions
  if (defender.isPhaseBoss && defender.hp > 0) {
    checkBossPhaseTransition(defender);
  }

  const aName = attacker.type === ENTITY.PLAYER ? 'You' : getEnemyName(attacker);
  const dName = defender.type === ENTITY.PLAYER ? 'you' : getEnemyNameLower(defender);
  const critTag = isCrit ? ' CRITICAL!' : '';

  if (attacker.type === ENTITY.PLAYER) {
    log(t('log.you_hit', { name: dName, dmg: baseDmg, crit: critTag }), 'combat');
  } else {
    // Trigger enemy attack reaction and spot reaction
    if (defender.type === ENTITY.PLAYER && !attacker.hasSpotted) {
      attacker.hasSpotted = true;
      triggerEnemyReaction(attacker, 'spot');
    }
    triggerEnemyReaction(attacker, 'attack');
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

  // Phase boss: check phase transition before death
  if (defender.isPhaseBoss && defender.hp <= 0) {
    const pbData = PHASE_BOSSES[defender.phaseFloor];
    if (pbData && (defender.bossPhase || 0) < pbData.phases.length - 1) {
      defender.hp = 1; // prevent death, transition will heal
      checkBossPhaseTransition(defender);
    }
  }
  if (defender.hp <= 0) {
    defender.hp = 0;
    if (defender.type === ENTITY.PLAYER) {
      checkPlayerDeath('You have been slain!');
    } else {
      triggerEnemyReaction(defender, 'death');
      log(t('log.you_defeated', { name: getEnemyName(defender) }), 'combat');
      recordKill(defender.type, defender);
      let xpAward = defender.xpReward || 8;
      if (defender.isElite) xpAward = Math.floor(xpAward * 2);
      if (defender.isMiniboss) xpAward = Math.floor(xpAward * 3);
      grantXP(xpAward);
      grantGold(defender);
      dropLoot(defender);
      if (attacker.type === ENTITY.PLAYER) onKillEffects();
      // Boss Cave: mark boss as defeated, open door to next room, grant reward
      if (defender.isBossCaveBoss) {
        const idx = defender.bossCaveIndex;
        state.bossCaveDefeated[idx] = true;
        // Open the door AFTER this room (leading to the next boss), not this room's entry door
        if (idx + 1 < 5) openBossCaveDoor(idx + 1);
        const bossData = BOSS_CAVE_BOSSES[idx];
        const goldReward = bossData.reward?.gold || 100;
        state.player.gold += goldReward;
        state.stats.totalGoldEarned += goldReward;
        log(`⚔️ ${bossData.name} has been slain! You gain ${goldReward} gold!`, 'level');
        if (idx + 1 < 5) log(`🚪 The gate to the next trial opens...`, 'info');
        // Drop extra high-tier items for boss cave bosses
        const extraItems = bossData.reward?.items || 2;
        const tierMin = idx >= 3 ? 4 : idx >= 1 ? 3 : 2; // higher index = higher tier
        const allItemIds = Object.keys(ITEMS);
        const bossPool = allItemIds.filter(id => {
          const it = ITEMS[id];
          return it && it.type !== ITEM_TYPE.CONSUMABLE && (it.tier || 0) >= tierMin;
        });
        const fallbackPool = allItemIds.filter(id => ITEMS[id] && ITEMS[id].type !== ITEM_TYPE.CONSUMABLE);
        const usePool = bossPool.length > 0 ? bossPool : fallbackPool;
        for (let di = 0; di < extraItems; di++) {
          const itemId = usePool[randInt(0, usePool.length - 1)];
          if (itemId && ITEMS[itemId]) {
            state.items.push({ x: defender.x + di, y: defender.y, item: { ...ITEMS[itemId] } });
          }
        }
        if (state.bossCaveDefeated.every(Boolean)) {
          log('🏆 ALL FIVE TRIALS COMPLETE! You are the Champion of the Cave!', 'level');
          unlockAchievement('cave_champion');
        }
      }
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

function attackDen(den, overrideDamage) {
  const power = overrideDamage !== undefined ? overrideDamage : getPlayerPower();
  const damage = Math.max(1, power + (overrideDamage !== undefined ? 0 : randInt(-1, 2)));
  den.hp -= damage;
  spawnDamageNumber(den.x, den.y, damage, '#ff8');
  log(`You strike the ${den.name} for ${damage} damage!`, 'combat');
  if (den.hp <= 0) {
    den.hp = 0;
    den.destroyed = true;
    log(`The ${den.name} is destroyed!`, 'combat');
    // Drop den core material
    const item = { ...ITEMS['den_core'] };
    state.items.push({ x: den.x, y: den.y, item });
    log(`The ${den.name} dropped a Den Core!`, 'item');
    // Grant XP
    const xpAward = 15 + state.floor * 2;
    grantXP(xpAward);
    // Grant some gold
    const goldAward = 5 + state.floor * 2;
    state.player.gold += goldAward;
    state.stats.totalGoldEarned += goldAward;
    log(t('log.gold_gain', { n: goldAward }), 'item');
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
  // XP boost from item features + prestige + library building
  let xpBoost = getXpBoostPercent(p);
  if (state.prestigeLevel > 0) xpBoost += PRESTIGE.PER_LEVEL.xpBoostPercent * state.prestigeLevel;
  if (state.townBuildings.library) xpBoost += 15;
  // Talent XP bonuses
  if (state.talents?.xp_hunter || state.talents?.scholar_t) {
    const xpBonusPct = (state.talents.xp_hunter ? 10 : 0) + (state.talents.scholar_t ? 10 : 0);
    xpBoost += xpBonusPct;
  }
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
    // Trigger subclass selection at level 5
    if (p.level === 5 && !p.subclass) {
      state.showSubclassSelect = true;
      log('Choose your specialization!', 'level');
    }
  }
}

function grantGold(enemy) {
  const base = GOLD_REWARDS[enemy.type] || 2;
  const bonus = randInt(0, Math.floor(base / 2));
  let gold = base + bonus;
  // Elite/miniboss/guardian gold bonus
  if (enemy.isElite) gold = Math.floor(gold * 2);
  if (enemy.isMiniboss) gold = Math.floor(gold * 3);
  if (enemy.isGuardian) gold = Math.floor(gold * 8);
  // CHA bonus: extra gold %
  if (state.player.attrs) {
    const chaBonus = ATTR_BONUSES.cha.goldBonus(state.player.attrs.cha);
    gold += Math.floor(gold * chaBonus / 100);
  }
  // Talent: fortune tree gold bonus
  if (state.talents?.fortune_t) gold = Math.floor(gold * 1.10);
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
  if (dropTile === TILE.CAVE_STAIRS || dropTile === TILE.UP_STAIRS || dropTile === TILE.PORTAL || dropTile === TILE.CAVE_ENTRANCE) {
    // Shift to an adjacent walkable tile
    const offsets = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
    for (const [ox, oy] of offsets) {
      const tx = dropX + ox, ty = dropY + oy;
      if (tx >= 0 && tx < state.mapW && ty >= 0 && ty < state.mapH && canWalk(tx, ty)) {
        const tt = state.map[ty][tx];
        if (tt !== TILE.CAVE_STAIRS && tt !== TILE.UP_STAIRS && tt !== TILE.PORTAL && tt !== TILE.CAVE_ENTRANCE) {
          dropX = tx; dropY = ty; break;
        }
      }
    }
  }

  // Elites, minibosses, and guardians get boosted drop rates and can drop multiple
  const isSpecial = enemy.isElite || enemy.isMiniboss || enemy.isBoss || enemy.isGuardian;
  const chanceMultiplier = enemy.isGuardian ? 3.0 : enemy.isMiniboss ? 2.0 : enemy.isElite ? 1.5 : 1.0;

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

// Like findNearestVisibleEnemy but also considers monster dens as targets.
// Returns { target, isDen } where isDen=true means attackDen() should be used.
function findNearestVisibleTarget(range) {
  const px = state.player.x, py = state.player.y;
  let bestEnemy = null, bestEnemyDist = Infinity;
  let bestDen = null, bestDenDist = Infinity;

  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const dist = Math.abs(enemy.x - px) + Math.abs(enemy.y - py);
    if (dist > range) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    if (!hasLineOfSight(px, py, enemy.x, enemy.y)) continue;
    if (dist < bestEnemyDist) { bestEnemyDist = dist; bestEnemy = enemy; }
  }

  for (const den of (state.dens || [])) {
    if (den.destroyed) continue;
    const dist = Math.abs(den.x - px) + Math.abs(den.y - py);
    if (dist > range) continue;
    if (!state.visibility[den.y] || !state.visibility[den.y][den.x]) continue;
    if (!hasLineOfSight(px, py, den.x, den.y)) continue;
    if (dist < bestDenDist) { bestDenDist = dist; bestDen = den; }
  }

  // Prefer enemies; fall back to dens
  if (bestEnemy) return { target: bestEnemy, isDen: false };
  if (bestDen)   return { target: bestDen,   isDen: true  };
  return null;
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
  const result = findNearestVisibleTarget(spellRange);
  if (!result) {
    log(t('log.no_enemies_in_range'), 'info');
    return false;
  }
  const { target, isDen } = result;

  state.player.mana -= FIRE_SPELL_COST;
  state.projectiles.push({ x: target.x, y: target.y, type: 'fire', ttl: 3 });
  const spellDamage = FIRE_SPELL_POWER + getSpellBonus(state.player);
  if (isDen) attackDen(target, spellDamage);
  else rangedAttack(target, spellDamage, 'fire spell');
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
  const result = findNearestVisibleTarget(bowRange);
  if (!result) {
    log(t('log.no_enemies_in_range'), 'info');
    return false;
  }
  const { target, isDen } = result;

  const bowPower = getEffectiveRangedPower(state.player);
  state.projectiles.push({ x: target.x, y: target.y, type: 'arrow', ttl: 3 });
  if (isDen) attackDen(target, bowPower);
  else rangedAttack(target, bowPower, 'arrow');
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
    if (invItem.id === item.id) {
      // Normalize: treat .qty and .count as the same field (use .count canonically)
      const current = invItem.count ?? invItem.qty ?? 1;
      if (current < (invItem.maxStack || item.maxStack || 30)) {
        invItem.count = current + 1;
        delete invItem.qty; // normalize to count only
        return true;
      }
    }
  }
  return false;
}

// BFS pathfind for auto-explore: find path to nearest unrevealed tile
function autoExplorePath() {
  const p = state.player;
  const H = state.mapH, W = state.mapW;
  // Find nearest unrevealed walkable-adjacent tile
  const dist = Array.from({ length: H }, () => new Int32Array(W).fill(-1));
  const prev = Array.from({ length: H }, () => Array(W).fill(null));
  const queue = [[p.x, p.y]];
  dist[p.y][p.x] = 0;
  let target = null;

  while (queue.length > 0) {
    const [cx, cy] = queue.shift();
    // Check if any adjacent tile is unrevealed
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      if (!state.revealed[ny] || !state.revealed[ny][nx]) {
        target = { x: cx, y: cy }; // walk toward this
        break;
      }
    }
    if (target) break;
    for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || nx >= W || ny < 0 || ny >= H) continue;
      if (dist[ny][nx] !== -1) continue;
      if (!canWalk(nx, ny)) continue;
      if (state.enemies.find(e => e.x === nx && e.y === ny && e.hp > 0)) continue;
      dist[ny][nx] = dist[cy][cx] + 1;
      prev[ny][nx] = [cx, cy];
      queue.push([nx, ny]);
    }
  }

  if (!target) return null;

  // Trace back the path from target to player
  let cur = [target.x, target.y];
  let step = null;
  while (cur) {
    const [cx, cy] = cur;
    const [px_, py_] = prev[cy][cx] || [p.x, p.y];
    if (px_ === p.x && py_ === p.y) { step = [cx, cy]; break; }
    cur = prev[cy][cx];
  }
  return step; // [nx, ny] — next step toward unexplored area
}

export function doAutoExplore() {
  if (!state.autoExplore) return false;
  if (state.mode !== 'dungeon' && state.mode !== 'village') { state.autoExplore = false; return false; }
  // Stop if any enemy is visible
  for (const e of state.enemies) {
    if (e.hp <= 0) continue;
    if (state.visibility[e.y] && state.visibility[e.y][e.x]) {
      state.autoExplore = false;
      log('Auto-explore stopped: enemy nearby!', 'info');
      return false;
    }
  }
  // Stop if on interactive tile
  const tile = state.map[state.player.y][state.player.x];
  const interactiveTiles = [TILE.HEALER, TILE.MERCHANT, TILE.BLACKSMITH, TILE.QUEST_BOARD,
                             TILE.ARENA, TILE.FISHING_SPOT, TILE.CAVE_STAIRS, TILE.PORTAL, TILE.FLOOR_WARP];
  if (interactiveTiles.includes(tile)) {
    state.autoExplore = false;
    log('Auto-explore stopped: point of interest!', 'info');
    return false;
  }
  const step = autoExplorePath();
  if (!step) {
    state.autoExplore = false;
    log('Auto-explore: floor fully explored!', 'info');
    return false;
  }
  const [nx, ny] = step;
  // Actually perform the move
  state.player.x = nx;
  state.player.y = ny;
  // Pickup if autoPickup
  if (gameSettings.autoPickup) pickupItem();
  return true;
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
    // Portal scroll: teleport to village (and back)
    if (item.isPortalScroll) {
      if (state.mode !== 'dungeon') {
        log('Portal scrolls can only be used in the dungeon!', 'info');
        return;
      }
      // Consume one scroll
      if (item.stackable && (item.count || 1) > 1) {
        item.count--;
      } else {
        inv.splice(slotIndex, 1);
      }
      log('You use a Portal Scroll and open a portal to the village!', 'level');
      saveDungeonSnapshot();
      state.lastDungeonFloor = state.floor;
      initVillage();
      return;
    }
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

export function throwTrash() {
  const inv = state.player.inventory;
  let count = 0;
  // Iterate backwards to safely splice
  for (let i = inv.length - 1; i >= 0; i--) {
    const item = inv[i];
    // Skip consumables — only target equippable items
    if (item.type === ITEM_TYPE.CONSUMABLE) continue;
    // Skip items with magical features
    if (item.features && item.features.length > 0) continue;
    // Skip set items
    if (item.setId) continue;
    // Skip items with special bonuses (spellBonus, manaBonus, rangeBonus, powerBonus)
    if (item.spellBonus || item.manaBonus || item.rangeBonus || item.powerBonus) continue;
    // This is a plain non-magical wearable — destroy it
    inv.splice(i, 1);
    count++;
  }
  if (count > 0) {
    log(t('log.trash_thrown', { count }), 'item');
  } else {
    log(t('log.no_trash'), 'info');
  }
  return count;
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
  // Mimics (chase after springing)
  [ENTITY.MIMIC]:            5,
  [ENTITY.GREATER_MIMIC]:    6,
  [ENTITY.ANCIENT_MIMIC]:    7,
  // Guardians (room-range sight)
  [ENTITY.GUARDIAN_HOARDER]:  10,
  [ENTITY.GUARDIAN_SENTINEL]: 10,
  [ENTITY.GUARDIAN_KEEPER]:   10,
  // Kobold
  [ENTITY.KOBOLD]:           5,
};

function getEnemySightRange(enemy) {
  return SIGHT_RANGES[enemy.type] || GOBLIN_SIGHT_RANGE;
}

// Returns ability array for current phase of a phase boss (regular or boss cave)
function getPhaseBossAbilities(enemy) {
  if (!enemy.isPhaseBoss) return null;
  const phases = enemy.isBossCaveBoss
    ? BOSS_CAVE_BOSSES[enemy.bossCaveIndex]?.phases
    : PHASE_BOSSES[enemy.phaseFloor]?.phases;
  if (!phases) return null;
  return phases[enemy.bossPhase || 0]?.abilities || null;
}

// ── Phase Boss Transitions ─────────────────────
function checkBossPhaseTransition(enemy) {
  if (!enemy.isPhaseBoss) return false;

  // Boss Cave bosses use BOSS_CAVE_BOSSES array
  const phases = enemy.isBossCaveBoss
    ? BOSS_CAVE_BOSSES[enemy.bossCaveIndex]?.phases
    : PHASE_BOSSES[enemy.phaseFloor]?.phases;

  if (!phases) return false;

  if (!enemy.isBossCaveBoss && !enemy.phaseFloor) return false;
  if (!enemy.isBossCaveBoss) {
    const pbData = PHASE_BOSSES[enemy.phaseFloor];
    if (!pbData) return false;
  }
  const currentPhase = enemy.bossPhase || 0;
  const nextPhase = currentPhase + 1;
  if (nextPhase >= phases.length) return false;

  const hpRatio = enemy.hp / enemy.maxHp;
  const nextThreshold = phases[nextPhase].threshold;
  if (hpRatio > nextThreshold) return false;

  // Transition!
  enemy.bossPhase = nextPhase;
  const phaseData = phases[nextPhase];

  // Heal 10%
  enemy.hp = Math.min(enemy.maxHp, enemy.hp + Math.floor(enemy.maxHp * 0.1));

  // Apply stat mods
  if (phaseData.mods.power) enemy.power += phaseData.mods.power;
  if (phaseData.mods.armor) enemy.armor = (enemy.armor || 0) + phaseData.mods.armor;
  if (phaseData.mods.dodge) enemy.dodgeChance = (enemy.dodgeChance || 0) + phaseData.mods.dodge;

  // 1-turn invulnerability
  enemy.phaseInvulnerable = 1;

  // Summon adds
  if (phaseData.summon) {
    const s = phaseData.summon;
    for (let i = 0; i < s.count; i++) {
      const ox = enemy.x + randInt(-2, 2);
      const oy = enemy.y + randInt(-2, 2);
      if (ox >= 0 && ox < state.mapW && oy >= 0 && oy < state.mapH && canWalk(ox, oy) && !isOccupied(ox, oy)) {
        const add = createEntity(s.type, ox, oy);
        add.maxHp += state.floor * 2;
        add.hp = add.maxHp;
        add.power += Math.floor(state.floor / 2);
        if (s.isClone) {
          add.isElite = true;
          add.elitePrefix = 'Mirror';
        }
        state.enemies.push(add);
      }
    }
  }

  log(phaseData.msg, 'combat');
  return true;
}

// ── Faction Infighting Combat ──────────────────
function enemyAttackEnemy(attacker, defender) {
  const damage = Math.max(1, attacker.power - (defender.armor || 0) + randInt(-1, 1));
  defender.hp -= damage;
  const atkName = getEnemyName(attacker);
  const defName = getEnemyName(defender);

  // Only log if player can see the fight
  const px = state.player.x, py = state.player.y;
  const aDist = Math.abs(attacker.x - px) + Math.abs(attacker.y - py);
  const canSee = aDist <= 12 && state.visibility && state.visibility[attacker.y] && state.visibility[attacker.y][attacker.x];

  if (canSee) {
    log(`${atkName} attacks ${defName} for ${damage}!`, 'faction');
    spawnDamageNumber(defender.x, defender.y, damage, '#d4a030');
  }

  if (defender.hp <= 0) {
    defender.hp = 0;
    if (canSee) {
      log(`${atkName} slays ${defName}!`, 'faction');
    }
    // No XP, gold, or loot for the player — enemies killing enemies
  }
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

    // Guardians only activate when player is inside their room
    if (enemy.isGuardian && enemy.guardianRoom) {
      const gr = enemy.guardianRoom;
      const px = state.player.x, py = state.player.y;
      if (px < gr.x + 1 || px >= gr.x + gr.w - 1 || py < gr.y + 1 || py >= gr.y + gr.h - 1) {
        continue; // Player not in guardian's room — stay passive
      }
    }

    const dx = state.player.x - enemy.x;
    const dy = state.player.y - enemy.y;
    const dist = Math.abs(dx) + Math.abs(dy);
    const sightRange = getEnemySightRange(enemy);

    // ── Faction Infighting ────────────────────────
    // Bosses, minibosses, and guardians never infight
    if (!enemy.isBoss && !enemy.isMiniboss && !enemy.isGuardian) {
      const myFaction = ENTITY_FACTION[enemy.type];
      if (myFaction) {
        let closestRival = null;
        let rivalDist = Infinity;
        for (const other of state.enemies) {
          if (other === enemy || other.hp <= 0) continue;
          if (other.isBoss || other.isMiniboss || other.isGuardian) continue;
          const otherFaction = ENTITY_FACTION[other.type];
          if (!otherFaction || !areFactionsHostile(myFaction, otherFaction)) continue;
          const rd = Math.abs(other.x - enemy.x) + Math.abs(other.y - enemy.y);
          if (rd <= 3 && rd < rivalDist) {
            closestRival = other;
            rivalDist = rd;
          }
        }
        // Priority: player adjacent always wins; otherwise prefer closer target
        if (closestRival && !(dist === 1)) {
          if (rivalDist < dist || dist > sightRange) {
            // Fight the rival instead of chasing player
            if (rivalDist === 1) {
              enemyAttackEnemy(enemy, closestRival);
            } else {
              // Move toward rival
              const rdx = closestRival.x - enemy.x;
              const rdy = closestRival.y - enemy.y;
              let mx, my;
              if (Math.abs(rdx) >= Math.abs(rdy)) { mx = Math.sign(rdx); my = 0; }
              else { mx = 0; my = Math.sign(rdy); }
              const nx = enemy.x + mx, ny = enemy.y + my;
              if (canWalk(nx, ny) && !isOccupied(nx, ny)) {
                enemy.x = nx; enemy.y = ny;
              }
            }
            continue; // Skip normal player-chase for this turn
          }
        }
      }
    }

    if (dist > sightRange) continue;

    // Phase boss invulnerability tick
    if (enemy.phaseInvulnerable > 0) {
      enemy.phaseInvulnerable--;
      continue;
    }

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
      // Phase boss melee-range abilities (adjacent)
      if (enemy.isPhaseBoss && state.player.hp > 0) {
        const abilities = getPhaseBossAbilities(enemy);
        if (abilities) {
          if (abilities.includes('double_attack')) {
            log(`${enemy.phaseName || 'Boss'} attacks again!`, 'combat');
            attack(enemy, state.player);
          }
          if (abilities.includes('enrage') && Math.random() < 0.3 && state.player.hp > 0) {
            const rageDmg = Math.max(1, Math.floor(enemy.power * 0.5));
            state.player.hp -= rageDmg;
            log(`${enemy.phaseName || 'Boss'} rages for ${rageDmg} bonus damage!`, 'combat');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
          // ground_stomp (Stone Colossus): AoE shockwave hurts if adjacent
          if (abilities.includes('ground_stomp') && Math.random() < 0.4 && state.player.hp > 0) {
            const stompDmg = Math.max(1, Math.floor(enemy.power * 0.7) - getEffectiveArmor(state.player));
            state.player.hp -= stompDmg;
            log(`💥 ${enemy.phaseName || 'Boss'} STOMPS! The shockwave hits for ${stompDmg}!`, 'combat');
            spawnDamageNumber(state.player.x, state.player.y, stompDmg, '#cc8844');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
          // fire_aura (Flame Tyrant phase 2): damages player every adjacent turn
          if (abilities.includes('fire_aura') && state.player.hp > 0) {
            const auraDmg = Math.max(1, Math.floor(enemy.power * 0.4) - Math.floor(getEffectiveArmor(state.player) / 2));
            state.player.hp -= auraDmg;
            log(`🔥 ${enemy.phaseName || 'Boss'}'s fire aura scorches you for ${auraDmg}!`, 'combat');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
          // drain_life (Lich Queen): heals boss on hit
          if (abilities.includes('drain_life') && state.player.hp > 0) {
            const drainHeal = Math.floor(enemy.power * 0.3);
            enemy.hp = Math.min(enemy.maxHp, enemy.hp + drainHeal);
            log(`💀 ${enemy.phaseName || 'Boss'} drains your life! (+${drainHeal} HP)`, 'combat');
          }
          // death_coil (Lich Queen phase 3 / Ancient One phase 3): bypasses armor, 30% chance
          if (abilities.includes('death_coil') && Math.random() < 0.3 && state.player.hp > 0) {
            const coilDmg = Math.max(2, Math.floor(enemy.power * 0.6));
            state.player.hp -= coilDmg;
            log(`💀 DEATH COIL! ${coilDmg} unavoidable damage!`, 'combat');
            spawnDamageNumber(state.player.x, state.player.y, coilDmg, '#8844cc');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
        }
      }
      continue;
    }

    // Phase boss ranged abilities (non-adjacent)
    if (enemy.isPhaseBoss && dist > 1) {
      const abilities = getPhaseBossAbilities(enemy);
      if (abilities) {
        // fire_attack (Demon Lord phase 2+, range 3)
        if (abilities.includes('fire_attack') && dist <= 3 && hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
          const fDmg = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 2));
          state.player.hp -= fDmg;
          state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
          log(`${enemy.phaseName || 'Boss'} hurls fire for ${fDmg} damage!`, 'combat');
          if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          continue;
        }
        // rock_throw (Stone Colossus, range 5)
        if (abilities.includes('rock_throw') && dist <= 5 && hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
          const rDmg = Math.max(1, Math.floor(enemy.power * 1.2) - getEffectiveArmor(state.player) + randInt(-1, 2));
          state.player.hp -= rDmg;
          state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'arrow', ttl: 2 });
          log(`🪨 ${enemy.phaseName || 'Boss'} hurls a boulder for ${rDmg} damage!`, 'combat');
          if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          continue;
        }
        // cannon_shot (Karg, range 8, ignores half armor)
        if (abilities.includes('cannon_shot') && dist <= 8 && hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
          const halfArm = Math.floor(getEffectiveArmor(state.player) / 2);
          const cDmg = Math.max(2, Math.floor(enemy.power * 1.4) - halfArm + randInt(-2, 3));
          state.player.hp -= cDmg;
          state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
          log(`⚙️ CANNON FIRE! ${cDmg} damage! (armor partially ignored)`, 'combat');
          if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          continue;
        }
        // ranged_fire (Ancient Dragon / Flame Tyrant, range 6)
        if (abilities.includes('ranged_fire') && dist <= 6 && hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
          const rDmg = Math.max(1, enemy.power - getEffectiveArmor(state.player) + randInt(-1, 2));
          state.player.hp -= rDmg;
          state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
          log(`${enemy.phaseName || 'Boss'} breathes fire for ${rDmg} damage!`, 'combat');
          if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          if (abilities.includes('breath_weapon') && Math.random() < 0.4 && state.player.hp > 0) {
            const bDmg = Math.max(1, Math.floor(enemy.power * 1.6) - getEffectiveArmor(state.player));
            state.player.hp -= bDmg;
            log(`🔥 INFERNO BREATH! ${bDmg} devastating fire damage!`, 'combat');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
          // ground_slam (Dragon phase 2+, AoE 1.5x)
          if (abilities.includes('ground_slam') && Math.random() < 0.3) {
            const gDmg = Math.max(1, Math.floor(enemy.power * 1.5) - getEffectiveArmor(state.player));
            state.player.hp -= gDmg;
            log(`${enemy.phaseName || 'Boss'} slams the ground for ${gDmg} damage!`, 'combat');
            if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          }
          continue;
        }
        // shadow_bolt (Void Emperor / Ancient One, range 7, half armor)
        if (abilities.includes('shadow_bolt') && dist <= 7 && hasLineOfSight(enemy.x, enemy.y, state.player.x, state.player.y)) {
          const halfArm = Math.floor(getEffectiveArmor(state.player) / 2);
          const sDmg = Math.max(1, enemy.power - halfArm + randInt(-1, 2));
          state.player.hp -= sDmg;
          state.projectiles.push({ x: state.player.x, y: state.player.y, type: 'fire', ttl: 2 });
          log(`${enemy.phaseName || 'Boss'} fires a shadow bolt for ${sDmg} damage!`, 'combat');
          if (state.player.hp <= 0) checkPlayerDeath('You have been slain!');
          continue;
        }
      }
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

  // Bump to attack den
  const targetDen = state.dens && state.dens.find(d => d.x === nx && d.y === ny && !d.destroyed);
  if (targetDen) {
    attackDen(targetDen);
    endTurn();
    return;
  }

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

  // Cave entrance → village cave (not main dungeon)
  // Beach entrance
  if ((state.mode === 'village' || state.mode === 'dungeon') && !state.mode_beach && !state.mode_town &&
      state.map[ny][nx] === TILE.BEACH_ENTRANCE) {
    enterBeach();
    return;
  }
  if (state.mode_beach && state.map[ny][nx] === TILE.BEACH_ENTRANCE) {
    exitBeach();
    return;
  }

  // Town entrance
  if ((state.mode === 'village' || state.mode === 'dungeon') && !state.mode_beach && !state.mode_town &&
      state.map[ny][nx] === TILE.TOWN_ENTRANCE) {
    enterTown();
    return;
  }
  if (state.mode_town && state.map[ny][nx] === TILE.TOWN_ENTRANCE) {
    exitTown();
    return;
  }

  if (state.mode === 'village' && state.map[ny][nx] === TILE.CAVE_ENTRANCE) {
    enterDungeon(1);
    return;
  }

  // Village cave exit
  if (state.mode === 'dungeon' && state.mode_cave && state.map[ny][nx] === TILE.VILLAGE_CAVE_EXIT) {
    exitCave();
    return;
  }

  // Mini dungeon portal (enter if not already in one, exit if inside)
  if (state.mode === 'dungeon' && state.map[ny][nx] === TILE.MINI_DUNGEON) {
    if (state.inMiniDungeon) {
      exitMiniDungeon();
    } else {
      enterMiniDungeon();
    }
    return;
  }

  // Boss Cave entrance (village) and exit (inside cave)
  if (state.mode === 'village' && state.map[ny][nx] === TILE.BOSS_CAVE_ENTRANCE) {
    enterBossCave();
    return;
  }
  if (state.inBossCave && state.map[ny][nx] === TILE.BOSS_CAVE_EXIT) {
    exitBossCave();
    return;
  }

  // Village expansion buildings
  if (state.mode === 'village') {
    const tileHere = state.map[ny][nx];
    if (tileHere === TILE.LIBRARY)          { log('📚 Library: +15% XP while built.', 'info'); }
    if (tileHere === TILE.TAVERN)           { log('🍺 Tavern: Full heal on every village return.', 'info'); }
    if (tileHere === TILE.TRAINING_GROUNDS) { log('⚔️ Training Grounds: +2 primary stat at game start.', 'info'); }
    if (tileHere === TILE.SHRINE)           { log('🏛️ Shrine: Grants a blessing on each dungeon entry.', 'info'); }
  }

  // Stairs down
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

  // Stairs up
  if (state.mode === 'dungeon' && state.map[ny][nx] === TILE.UP_STAIRS) {
    if (state.floor <= 1) {
      saveCurrentFloorToCache();   // preserve floor 1 so it restores when re-entering
      log('You ascend back to the village.', 'info');
      state.lastDungeonFloor = 0;
      initVillage();
    } else {
      log('You ascend to floor ' + (state.floor - 1) + '.', 'info');
      enterDungeon(state.floor - 1);
    }
    return;
  }

  // Portal
  if (state.map[ny][nx] === TILE.PORTAL) {
    unlockAchievement('portal_user');
    if (state.mode === 'dungeon') {
      log(t('log.portal_return_village'), 'level');
      saveCurrentFloorToCache();   // keep floor in cache for floor warp / re-entry
      saveDungeonSnapshot();
      state.lastDungeonFloor = state.floor;
      initVillage();
    } else if (state.mode === 'village' && state.lastDungeonFloor > 0) {
      log(t('log.portal_return_floor', { floor: state.lastDungeonFloor }), 'level');
      if (state.savedDungeon) {
        restoreDungeonSnapshot();
      } else {
        const returnFloor = state.lastDungeonFloor;
        state.lastDungeonFloor = 0;
        enterDungeon(returnFloor);
      }
    }
    return;
  }

  // Floor Warp
  if (state.mode === 'village' && state.map[ny][nx] === TILE.FLOOR_WARP) {
    state.showFloorWarp = true;
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

  // Blacksmith
  if (state.mode === 'village' && state.map[ny][nx] === TILE.BLACKSMITH) {
    state.showBlacksmith = true;
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

  // Check for chest (or mimic!)
  const chest = state.chests.find(c => c.x === nx && c.y === ny && !c.opened);
  if (chest) {
    // Mimic activation — chest springs to life!
    if (chest.isMimic) {
      state.chests = state.chests.filter(c => c !== chest);
      const mimic = createEntity(chest.mimicType, chest.x, chest.y);
      mimic.maxHp += state.floor * 2;
      mimic.hp = mimic.maxHp;
      mimic.power += Math.floor(state.floor / 2);
      state.enemies.push(mimic);
      log(`The chest springs to life! It's a ${getEnemyName(mimic)}!`, 'combat');
      endTurn();
      return;
    }
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

  // Talent: passive regen every 8 turns
  if (state.talents?.regenerator) {
    const turnCount = (state.player._talentRegenTick || 0) + 1;
    state.player._talentRegenTick = turnCount;
    if (turnCount % 8 === 0 && state.player.hp < state.player.maxHp) {
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1);
    }
  }

  // Tick monster breeding dens
  if (state.mode === 'dungeon' && state.dens) {
    for (const den of state.dens) {
      if (den.destroyed) continue;
      den.spawnTimer--;
      if (den.spawnTimer <= 0 && den.spawnCount < den.maxSpawns) {
        // Find empty adjacent tile to spawn enemy
        const offsets = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];
        let spawned = false;
        for (const [ox, oy] of offsets) {
          const sx = den.x + ox, sy = den.y + oy;
          if (sx >= 0 && sx < state.mapW && sy >= 0 && sy < state.mapH &&
              canWalk(sx, sy) && !isOccupied(sx, sy)) {
            const spawn = createEntity(den.spawnType, sx, sy);
            spawn.maxHp += state.floor * 2;
            spawn.hp = spawn.maxHp;
            spawn.power += Math.floor(state.floor / 2);
            state.enemies.push(spawn);
            den.spawnCount++;
            den.spawnTimer = 5;
            log(`The ${den.name} spawns a ${getEnemyName(spawn)}!`, 'combat');
            spawned = true;
            break;
          }
        }
        if (!spawned) den.spawnTimer = 2; // Retry sooner if blocked
      }
    }
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
    const result = findNearestVisibleTarget(spellRange);
    if (!result) {
      log(t('log.no_enemies_in_range'), 'info');
      return false;
    }
    const { target, isDen } = result;
    state.player.mana -= manaCost;
    const projType = spellId === 'ice_shard' ? 'ice' : 'fire';
    state.projectiles.push({ x: target.x, y: target.y, type: projType, ttl: 3 });
    const spellDamage = spell.damage + getSpellBonus(state.player) + empBonus;
    if (isDen) {
      attackDen(target, spellDamage);
    } else {
      rangedAttack(target, spellDamage, spell.name.toLowerCase());
      // Frost Mastery: ice shard slows
      if (spellId === 'ice_shard' && target.hp > 0) {
        const fmRank = getSkillRank('frost_mastery');
        if (fmRank > 0) {
          target.slowTurns = (target.slowTurns || 0) + fmRank;
          log(t('log.enemy_slowed', { name: getEnemyName(target), n: fmRank }), 'combat');
        }
      }
    }
    endTurn();
    return true;
  }

  if (spell.type === 'ranged_multi') {
    const spellRange = spell.range + getRangeBonus(state.player);
    const cmRank = getSkillRank('chain_master');
    const maxTargets = (spell.maxTargets || 3) + cmRank;
    // Include dens as additional targets for chain lightning
    const enemyTargets = findMultipleVisibleEnemies(spellRange, maxTargets);
    const denTargets = (state.dens || [])
      .filter(d => !d.destroyed && Math.abs(d.x - state.player.x) + Math.abs(d.y - state.player.y) <= spellRange
        && state.visibility[d.y]?.[d.x] && hasLineOfSight(state.player.x, state.player.y, d.x, d.y))
      .slice(0, maxTargets - enemyTargets.length);
    const allTargets = [...enemyTargets, ...denTargets];
    if (allTargets.length === 0) {
      log(t('log.no_enemies_in_range'), 'info');
      return false;
    }
    state.player.mana -= manaCost;
    const spellDamage = spell.damage + getSpellBonus(state.player) + empBonus;
    for (const target of enemyTargets) {
      state.projectiles.push({ x: target.x, y: target.y, type: 'lightning', ttl: 3 });
      rangedAttack(target, spellDamage, spell.name.toLowerCase());
    }
    for (const den of denTargets) {
      state.projectiles.push({ x: den.x, y: den.y, type: 'lightning', ttl: 3 });
      attackDen(den, spellDamage);
    }
    endTurn();
    return true;
  }

  return false;
}

// ── Run History ──────────────────────────────

function recordRun(cause) {
  if (!state.player) return;
  const record = {
    timestamp: Date.now(),
    playerClass: state.playerClass,
    subclass: state.player.subclass || null,
    floorReached: state.floor,
    cause: cause,
    kills: state.stats.totalKills,
    goldEarned: state.stats.totalGoldEarned,
    level: state.player.level || 1,
    turns: state.turnCount,
  };
  state.runHistory.unshift(record);
  if (state.runHistory.length > 50) state.runHistory.length = 50;
}

export function toggleRunHistory() {
  state.showRunHistory = !state.showRunHistory;
}

export function closeRunHistory() {
  state.showRunHistory = false;
}

export function getRunHistory() {
  return state.runHistory;
}

// ── Restart ──────────────────────────────────

export function restartGame() {
  state.stats.deaths++;
  unlockAchievement('survivor');
  // Preserve persistent data across restarts
  const savedAchievements = { ...state.achievements };
  const savedStats = { ...state.stats };
  const savedBossSkills = { ...state.bossSkills };
  const savedPrestige = state.prestigeLevel;
  const savedArenaBest = state.arenaBestWave;
  const savedTownUpgrades = { ...state.townUpgrades };
  const savedTownBuildings = { ...state.townBuildings };
  const savedUnlockedClasses = [...state.unlockedClasses];
  const savedRunHistory = [...state.runHistory];
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.phase = 'class_select';
  state.achievements = savedAchievements;
  state.stats = savedStats;
  state.bossSkills = savedBossSkills;
  state.prestigeLevel = savedPrestige;
  state.arenaBestWave = savedArenaBest;
  state.townUpgrades = savedTownUpgrades;
  state.townBuildings = savedTownBuildings;
  state.unlockedClasses = savedUnlockedClasses;
  state.runHistory = savedRunHistory;
  // Reset fishing/arena
  closeFishing();
  state.showArena = false;
  state.arenaWave = 0;
  state.arenaEnemiesRemaining = 0;
  state.arenaRewards = { gold: 0, items: [] };
  state.arenaWaveCleared = false;
  state.savedDungeon = null;
  state.floorCache = {};  // New character = fresh floors
  state.unlockedFloorWarps = [];
  state.inMiniDungeon = false;
  state.inBossCave = false;
  state.bossCaveDefeated = [false, false, false, false, false];
  state.bossCaveMap = null;
  state.bossCaveReturnPos = null;
  state.mode_cave = false;
  state.mode_beach = false;
  state.mode_town = false;
  state.caveFloor = 0;
  state.autoExplore = false;
  state.speechBubbles = [];
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

  state.talentPoints += 3;
  saveTalents();
  log('🌟 Gained 3 Talent Points! Visit the Talent Tree (T) to spend them.', 'level');

  unlockAchievement('prestige_1');
  if (level === 5) unlockAchievement('prestige_5');
  recordRun('Prestige ' + level);

  // Save persistent data
  const savedAchievements = { ...state.achievements };
  const savedStats = { ...state.stats };
  const savedBossSkills = { ...state.bossSkills };
  const savedPrestige = state.prestigeLevel;
  const savedArmory = { ...state.armory };
  const savedTownUpgrades = { ...state.townUpgrades };
  const savedRunHistory = [...state.runHistory];

  // Reset player state
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.phase = 'class_select';
  state.showPrestige = false;
  state.lastDungeonFloor = 0;
  state.floorCache = {};  // Prestige = new run, fresh floors
  state.unlockedFloorWarps = [];

  // Restore persistent data
  state.achievements = savedAchievements;
  state.stats = savedStats;
  state.bossSkills = savedBossSkills;
  state.prestigeLevel = savedPrestige;
  state.armory = savedArmory;
  state.townUpgrades = savedTownUpgrades;
  state.runHistory = savedRunHistory;

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
    if (!res.ok) {
      if (res.status === 401) setAuth(null, null);
      return null;
    }
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
  const snap = { savedAt: Date.now() };
  for (const key of Object.keys(state)) {
    if (key === 'visibility' || key === 'achievementToast' || key === 'fishingTimer') continue; // transient
    const val = state[key];
    if (val === null || val === undefined) {
      snap[key] = val;
    } else if (Array.isArray(val) && val.length > 0 && val[0] instanceof Uint8Array) {
      // 2D Uint8Array (map, revealed)
      snap[key] = val.map(row => Array.from(row));
    } else if (key === 'floorCache') {
      // Floor cache: each value has map/revealed as 2D Uint8Arrays
      const serialized = {};
      for (const [floorNum, floorSnap] of Object.entries(val)) {
        serialized[floorNum] = {
          ...floorSnap,
          map: floorSnap.map ? floorSnap.map.map(row => Array.from(row)) : null,
          revealed: floorSnap.revealed ? floorSnap.revealed.map(row => Array.from(row)) : null,
        };
      }
      snap[key] = serialized;
    } else {
      snap[key] = val;
    }
  }
  return snap;
}

function isValidSave(snap) {
  return snap && snap.map && snap.player && snap.mapW > 0 && snap.mapH > 0
    && snap.phase && snap.phase !== 'class_select';
}

function deserializeState(snap) {
  if (!isValidSave(snap)) throw new Error('Invalid save data');
  for (const key of Object.keys(snap)) {
    if (key === 'visibility' || key === 'achievementToast') continue;
    const val = snap[key];
    if (Array.isArray(val) && val.length > 0 && Array.isArray(val[0]) &&
        (key === 'map' || key === 'revealed')) {
      state[key] = val.map(row => new Uint8Array(row));
    } else if (key === 'floorCache' && val && typeof val === 'object') {
      // Restore floor cache: convert map/revealed back to Uint8Arrays
      const restored = {};
      for (const [floorNum, floorSnap] of Object.entries(val)) {
        restored[floorNum] = {
          ...floorSnap,
          map: floorSnap.map ? floorSnap.map.map(row => new Uint8Array(row)) : null,
          revealed: floorSnap.revealed ? floorSnap.revealed.map(row => new Uint8Array(row)) : null,
        };
      }
      state[key] = restored;
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
    // Corrupted save — delete it
    localStorage.removeItem('rpg_save');
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
  const raw = localStorage.getItem('rpg_save');
  if (!raw) return false;
  try {
    return isValidSave(JSON.parse(raw));
  } catch (_) {
    localStorage.removeItem('rpg_save');
    return false;
  }
}

export function deleteSave() {
  localStorage.removeItem('rpg_save');
}

// ── Save Slots (3 slots for multiple characters) ──────────────────────────
export const SAVE_SLOTS = 3;

export function saveToSlot(slot) {
  try {
    const json = JSON.stringify(serializeState());
    localStorage.setItem(`rpg_save_slot_${slot}`, json);
    log(`Game saved to slot ${slot}.`, 'info');
    return true;
  } catch (_) {
    log('Save failed.', 'combat');
    return false;
  }
}

export function loadFromSlot(slot) {
  const raw = localStorage.getItem(`rpg_save_slot_${slot}`);
  if (!raw) return false;
  try {
    const snap = JSON.parse(raw);
    deserializeState(snap);
    log(`Slot ${slot} loaded.`, 'info');
    return true;
  } catch (_) {
    localStorage.removeItem(`rpg_save_slot_${slot}`);
    log('Load failed — save corrupted.', 'combat');
    return false;
  }
}

export function deleteSlot(slot) {
  localStorage.removeItem(`rpg_save_slot_${slot}`);
}

export function getSlotInfo(slot) {
  const raw = localStorage.getItem(`rpg_save_slot_${slot}`);
  if (!raw) return null;
  try {
    const snap = JSON.parse(raw);
    if (!snap || !snap.player) return null;
    const p = snap.player;
    return {
      name: p.name || 'Unknown',
      playerClass: snap.playerClass || '?',
      level: p.level || 1,
      floor: snap.floor || 0,
      gold: p.gold || 0,
      savedAt: snap.savedAt || null,
    };
  } catch (_) { return null; }
}

export function fullResetGame() {
  // Wipe everything — persistent data included
  localStorage.removeItem('rpg_save');
  localStorage.removeItem(SETTINGS_KEY);
  state.player = null;
  state.pendingLevelUp = false;
  state.bestiary = {};
  state.achievements = {};
  state.stats = { kills: 0, deaths: 0, floorsCleared: 0, bossKills: 0, itemsCrafted: 0, questsCompleted: 0, totalGold: 0, totalXp: 0, fishCaught: 0, chestsOpened: 0, potionsUsed: 0, spellsCast: 0, arrowsFired: 0, stepsWalked: 0, criticalHits: 0, dodges: 0, timePlayedMs: 0 };
  state.bossSkills = {};
  state.prestigeLevel = 0;
  state.arenaBestWave = 0;
  state.townUpgrades = { healer: 1, shop: 1, blacksmith: 1, arena: 1 };
  state.runHistory = [];
  state.armory = {};
  state.phase = 'class_select';
  state.gameOver = false;
  state.showSettings = false;
  closeFishing();
  state.showArena = false;
  state.arenaWave = 0;
  state.arenaEnemiesRemaining = 0;
  state.arenaRewards = { gold: 0, items: [] };
  state.arenaWaveCleared = false;
}
