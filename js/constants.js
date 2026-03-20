// ── Tile Types ────────────────────────────────────
export const TILE = {
  VOID:          0,
  GRASS:         1,
  DIRT:          2,
  HUT:           3,
  CAVE_ENTRANCE: 4,
  CAVE_WALL:     5,
  CAVE_FLOOR:    6,
  CAVE_STAIRS:   7,
  // Themed tiles (use same walkability, different visuals)
  MOSS_WALL:     8,
  MOSS_FLOOR:    9,
  BONE_WALL:     10,
  BONE_FLOOR:    11,
  WEB_FLOOR:     12,
  LAVA_WALL:     13,
  LAVA_FLOOR:    14,
  ICE_WALL:      15,
  ICE_FLOOR:     16,
  PORTAL:        17,
  HEALER:        18,
  MERCHANT:      19,
  QUEST_BOARD:   20,
  // Dungeon decoration tiles
  PILLAR:           21,
  WATER:            22,
  CARPET:           23,
  RUBBLE:           24,
  BARREL:           25,
  BOOKSHELF:        26,
  WEAPON_RACK:      27,
  SARCOPHAGUS:      28,
  FOUNTAIN:         29,
  DUNGEON_MERCHANT: 30,
  FISHING_SPOT:     31,
  ARENA:            32,
  BLACKSMITH:       33,
  UP_STAIRS:        34,
  // New environment tiles
  VILLAGE_WALL:     35,
  VILLAGE_FLOOR:    36,
  CHARRED_WALL:     37,
  CHARRED_FLOOR:    38,
  SWAMP_WALL:       39,
  SWAMP_FLOOR:      40,
  SHADOW_WALL:      41,
  SHADOW_FLOOR:     42,
  FLOOR_WARP:       43,
  // Village expansion buildings
  LIBRARY:          44,
  TAVERN:           45,
  TRAINING_GROUNDS: 46,
  SHRINE:           47,
  // Mini dungeon portal
  MINI_DUNGEON:     48,
  // Village cave exit
  VILLAGE_CAVE_EXIT:49,
};


export const TILE_PROPS = {
  [TILE.VOID]:          { name: 'Void',          walkable: false, transparent: false },
  [TILE.GRASS]:         { name: 'Grass',         walkable: true,  transparent: true  },
  [TILE.DIRT]:          { name: 'Dirt Path',     walkable: true,  transparent: true  },
  [TILE.HUT]:           { name: 'Hut',           walkable: false, transparent: false },
  [TILE.CAVE_ENTRANCE]: { name: 'Cave Entrance', walkable: true,  transparent: true  },
  [TILE.CAVE_WALL]:     { name: 'Cave Wall',     walkable: false, transparent: false },
  [TILE.CAVE_FLOOR]:    { name: 'Cave Floor',    walkable: true,  transparent: true  },
  [TILE.CAVE_STAIRS]:   { name: 'Stairs Down',   walkable: true,  transparent: true  },
  [TILE.MOSS_WALL]:     { name: 'Mossy Wall',    walkable: false, transparent: false },
  [TILE.MOSS_FLOOR]:    { name: 'Mossy Floor',   walkable: true,  transparent: true  },
  [TILE.BONE_WALL]:     { name: 'Bone Wall',     walkable: false, transparent: false },
  [TILE.BONE_FLOOR]:    { name: 'Bone Floor',    walkable: true,  transparent: true  },
  [TILE.WEB_FLOOR]:     { name: 'Webbed Floor',  walkable: true,  transparent: true  },
  [TILE.LAVA_WALL]:     { name: 'Scorched Wall', walkable: false, transparent: false },
  [TILE.LAVA_FLOOR]:    { name: 'Scorched Floor',walkable: true,  transparent: true  },
  [TILE.ICE_WALL]:      { name: 'Frozen Wall',   walkable: false, transparent: false },
  [TILE.ICE_FLOOR]:     { name: 'Frozen Floor',  walkable: true,  transparent: true  },
  [TILE.PORTAL]:        { name: 'Portal',        walkable: true,  transparent: true  },
  [TILE.HEALER]:        { name: 'Healer',        walkable: true,  transparent: true  },
  [TILE.MERCHANT]:      { name: 'Merchant',      walkable: true,  transparent: true  },
  [TILE.QUEST_BOARD]:   { name: 'Quest Board',   walkable: true,  transparent: true  },
  [TILE.PILLAR]:           { name: 'Pillar',           walkable: false, transparent: true  },
  [TILE.WATER]:            { name: 'Pool',             walkable: true,  transparent: true  },
  [TILE.CARPET]:           { name: 'Carpet',           walkable: true,  transparent: true  },
  [TILE.RUBBLE]:           { name: 'Rubble',           walkable: true,  transparent: true  },
  [TILE.BARREL]:           { name: 'Barrel',           walkable: false, transparent: true  },
  [TILE.BOOKSHELF]:        { name: 'Bookshelf',        walkable: false, transparent: false },
  [TILE.WEAPON_RACK]:      { name: 'Weapon Rack',      walkable: false, transparent: true  },
  [TILE.SARCOPHAGUS]:      { name: 'Sarcophagus',      walkable: false, transparent: true  },
  [TILE.FOUNTAIN]:         { name: 'Fountain',         walkable: false, transparent: true  },
  [TILE.DUNGEON_MERCHANT]: { name: 'Wandering Trader', walkable: true,  transparent: true  },
  [TILE.FISHING_SPOT]:     { name: 'Fishing Spot',     walkable: true,  transparent: true  },
  [TILE.ARENA]:            { name: 'Arena',            walkable: true,  transparent: true  },
  [TILE.BLACKSMITH]:       { name: 'Blacksmith',       walkable: true,  transparent: true  },
  [TILE.UP_STAIRS]:        { name: 'Stairs Up',        walkable: true,  transparent: true  },
  // New environment tiles
  [TILE.VILLAGE_WALL]:     { name: 'Palisade',        walkable: false, transparent: true  },
  [TILE.VILLAGE_FLOOR]:    { name: 'Packed Dirt',     walkable: true,  transparent: true  },
  [TILE.CHARRED_WALL]:     { name: 'Charred Rock',    walkable: false, transparent: false },
  [TILE.CHARRED_FLOOR]:    { name: 'Scorched Stone',  walkable: true,  transparent: true  },
  [TILE.SWAMP_WALL]:       { name: 'Dense Mangrove',  walkable: false, transparent: false },
  [TILE.SWAMP_FLOOR]:      { name: 'Muddy Ground',    walkable: true,  transparent: true  },
  [TILE.SHADOW_WALL]:      { name: 'Void Barrier',    walkable: false, transparent: false },
  [TILE.SHADOW_FLOOR]:     { name: 'Shadow Stone',    walkable: true,  transparent: true  },
  [TILE.FLOOR_WARP]:       { name: 'Floor Warp',      walkable: true,  transparent: true  },
  [TILE.LIBRARY]:          { name: 'Library',          walkable: true,  transparent: true  },
  [TILE.TAVERN]:           { name: 'Tavern',            walkable: true,  transparent: true  },
  [TILE.TRAINING_GROUNDS]: { name: 'Training Grounds', walkable: true,  transparent: true  },
  [TILE.SHRINE]:           { name: 'Shrine',            walkable: true,  transparent: true  },
  [TILE.MINI_DUNGEON]:     { name: 'Mini Dungeon Gate', walkable: true,  transparent: true  },
  [TILE.VILLAGE_CAVE_EXIT]:{ name: 'Cave Exit',         walkable: true,  transparent: true  },
};

// ── Item Features ────────────────────────────────
export const ITEM_FEATURE = {
  FIRE_DMG:       'fire_dmg',
  ICE_DMG:        'ice_dmg',
  POISON_DMG:     'poison_dmg',
  LIFE_STEAL:     'life_steal',
  THORNS:         'thorns',
  CRIT_CHANCE:    'crit_chance',
  ALL_SEEING_EYE: 'all_seeing_eye',
  XP_BOOST:       'xp_boost',
  STUN_CHANCE:    'stun_chance',
  DODGE_BONUS:    'dodge_bonus',
  MANA_REGEN:     'mana_regen',
  DOUBLE_STRIKE:  'double_strike',
};

export const FEATURE_INFO = {
  fire_dmg:       { name: 'Fire Damage',    color: '#e06030', desc: (v) => `+${v} fire damage on hit` },
  ice_dmg:        { name: 'Ice Damage',     color: '#60a0e0', desc: (v) => `+${v} ice damage on hit` },
  poison_dmg:     { name: 'Poison Damage',  color: '#60c040', desc: (v) => `${v} poison damage over 3 turns` },
  life_steal:     { name: 'Life Steal',     color: '#c04060', desc: (v) => `Heal ${v} HP on hit` },
  thorns:         { name: 'Thorns',         color: '#a08040', desc: (v) => `Reflect ${v} damage when hit` },
  crit_chance:    { name: 'Critical Hit',   color: '#e0c040', desc: (v) => `${v}% chance for double damage` },
  all_seeing_eye: { name: 'All-Seeing Eye', color: '#c080e0', desc: () => 'Reveals enemies on minimap' },
  xp_boost:       { name: 'XP Boost',       color: '#40c0c0', desc: (v) => `+${v}% bonus XP` },
  stun_chance:    { name: 'Stun Chance',    color: '#e0e040', desc: (v) => `${v}% chance to stun for 1 turn` },
  dodge_bonus:    { name: 'Dodge Bonus',    color: '#60e0a0', desc: (v) => `+${v}% dodge chance` },
  mana_regen:     { name: 'Mana Regen',     color: '#6080e0', desc: (v) => `Restore ${v} mana per turn` },
  double_strike:  { name: 'Double Strike',  color: '#e08060', desc: (v) => `${v}% chance to attack twice` },
};

// ── Entity Types ──────────────────────────────────
export const ENTITY = {
  PLAYER:           'player',
  GOBLIN:           'goblin',
  ORC:              'orc',
  SKELETON:         'skeleton',
  SPIDER:           'spider',
  TROLL:            'troll',
  DARK_MAGE:        'dark_mage',
  BAT:              'bat',
  SLIME:            'slime',
  WRAITH:           'wraith',
  GOBLIN_SHAMAN:    'goblin_shaman',
  MUSHROOM:         'mushroom',
  GOBLIN_BERSERKER: 'goblin_berserker',
  // Bosses
  GOBLIN_WARLORD:   'goblin_warlord',
  SPIDER_QUEEN:     'spider_queen',
  LICH:             'lich',
  MYCELIUM_LORD:    'mycelium_lord',
  FIRE_ELEMENTAL:   'fire_elemental',
  FROST_GIANT:      'frost_giant',
  // New monsters
  GOBLIN_SCOUT:     'goblin_scout',
  GOBLIN_CHIEF:     'goblin_chief',
  CAVE_CRAWLER:     'cave_crawler',
  VENOM_SPITTER:    'venom_spitter',
  COCOON_HORROR:    'cocoon_horror',
  ZOMBIE:           'zombie',
  BONE_ARCHER:      'bone_archer',
  PHANTOM:          'phantom',
  DEATH_KNIGHT:     'death_knight',
  NECROMANCER:      'necromancer',
  SPORE_WALKER:     'spore_walker',
  TOXIC_TOAD:       'toxic_toad',
  VINE_LURKER:      'vine_lurker',
  MOSS_GOLEM:       'moss_golem',
  FIRE_IMP:         'fire_imp',
  LAVA_HOUND:       'lava_hound',
  ASH_WRAITH:       'ash_wraith',
  MAGMA_GOLEM:      'magma_golem',
  INFERNAL_MAGE:    'infernal_mage',
  EMBER_BAT:        'ember_bat',
  ICE_SPIDER:       'ice_spider',
  FROST_WRAITH:     'frost_wraith',
  FROZEN_SENTINEL:  'frozen_sentinel',
  SNOW_WOLF:        'snow_wolf',
  ICE_MAGE:         'ice_mage',
  SHADOW_STALKER:   'shadow_stalker',
  CRYSTAL_GOLEM:    'crystal_golem',
  DEMON_LORD:       'demon_lord',
  DRAGON_WHELP:     'dragon_whelp',
  ANCIENT_WYRM:     'ancient_wyrm',
  // Wave 2 new monsters
  BLOOD_BAT:        'blood_bat',
  PLAGUE_RAT:       'plague_rat',
  SAND_SCORPION:    'sand_scorpion',
  BONE_SENTINEL:    'bone_sentinel',
  DARK_ACOLYTE:     'dark_acolyte',
  SWAMP_HAG:        'swamp_hag',
  THUNDER_LIZARD:   'thunder_lizard',
  STONE_GARGOYLE:   'stone_gargoyle',
  CORPSE_EATER:     'corpse_eater',
  VOID_TOUCHED:     'void_touched',
  FLAME_DANCER:     'flame_dancer',
  GLACIAL_BEETLE:   'glacial_beetle',
  IRON_REVENANT:    'iron_revenant',
  MYCONID_SPROUT:   'myconid_sprout',
  WAILING_BANSHEE:  'wailing_banshee',
  OBSIDIAN_DRAKE:   'obsidian_drake',
  VILE_SHAMAN:      'vile_shaman',
  BLOOD_GOLEM:      'blood_golem',
  FROST_ARCHER:     'frost_archer',
  ABYSSAL_WATCHER:  'abyssal_watcher',
  VOID_EMPEROR:     'void_emperor',
  // Mimics
  MIMIC:            'mimic',
  GREATER_MIMIC:    'greater_mimic',
  ANCIENT_MIMIC:    'ancient_mimic',
  // Guardians
  GUARDIAN_HOARDER:  'guardian_hoarder',
  GUARDIAN_SENTINEL: 'guardian_sentinel',
  GUARDIAN_KEEPER:   'guardian_keeper',
  // Dragon's Lair minion
  KOBOLD:           'kobold',
};

// ── Player Classes ────────────────────────────────
export const PLAYER_CLASS = {
  WARRIOR:       'warrior',
  MAGE:          'mage',
  ARCHER:        'archer',
  // Unlockable classes
  BARD:          'bard',
  HOLY_KNIGHT:   'holy_knight',
  PLAGUE_DOCTOR: 'plague_doctor',
};

// ── Hardship Difficulty ───────────────────────────
export const DIFFICULTY = {
  STROLL:    { id: 'stroll',    name: 'Sunday Stroll',  emoji: '🌸', desc: 'Enemies trip over flowers.',          hpMult: 0.7,  powMult: 0.7,  goldMult: 1.2,  xpMult: 1.2,  color: '#80e060' },
  NORMAL:    { id: 'normal',    name: 'Getting Sweaty', emoji: '💦', desc: 'A fair and proper dungeon crawl.',    hpMult: 1.0,  powMult: 1.0,  goldMult: 1.0,  xpMult: 1.0,  color: '#60a0e0' },
  SEND_HELP: { id: 'send_help', name: 'Send Help',      emoji: '😰', desc: 'They read the strategy guide.',      hpMult: 1.35, powMult: 1.3,  goldMult: 0.8,  xpMult: 0.85, color: '#e09030' },
  WHY_GOD:   { id: 'why_god',   name: 'Why God Why',    emoji: '☠️',  desc: 'The dungeon hates you personally.',  hpMult: 1.8,  powMult: 1.65, goldMult: 0.55, xpMult: 0.75, color: '#c03030' },
};

export const CLASS_STATS = {
  [PLAYER_CLASS.WARRIOR]: {
    name: 'Warrior', desc: 'Strong melee fighter. High HP and power.',
    maxHp: 10, hp: 10, power: 1, armor: 0, maxMana: 0, mana: 0,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 5, agi: 2, int: 1, vit: 4, cha: 1 },
    // Derived: HP=10+10+12=32, Pow=1+2=3, Arm=0
  },
  [PLAYER_CLASS.MAGE]: {
    name: 'Mage', desc: 'Wields fire magic. Ranged spells cost mana.',
    maxHp: 8, hp: 8, power: 0, armor: 0, maxMana: 5, mana: 5,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 1, agi: 2, int: 5, vit: 2, cha: 2 },
    // Derived: HP=8+2+6=16, Pow=0+0=0, Mana=5+15=20
  },
  [PLAYER_CLASS.ARCHER]: {
    name: 'Archer', desc: 'Shoots arrows from range. Fast and precise.',
    maxHp: 8, hp: 8, power: 0, armor: 0, maxMana: 0, mana: 0,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 2, agi: 5, int: 1, vit: 3, cha: 2 },
    // Derived: HP=8+4+9=21, Pow=0+1=1, Arm=1, RangedBonus=2
  },
  [PLAYER_CLASS.BARD]: {
    name: 'Bard', desc: 'Charming performer who turns wit and gold into power. High charisma grants shop discounts and XP bonuses.',
    maxHp: 8, hp: 8, power: 0, armor: 0, maxMana: 4, mana: 4,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 1, agi: 2, int: 3, vit: 2, cha: 6 },
  },
  [PLAYER_CLASS.HOLY_KNIGHT]: {
    name: 'Holy Knight', desc: 'Divine tank with built-in armor and a healing ability. Slow but near-unkillable early on.',
    maxHp: 12, hp: 12, power: 0, armor: 2, maxMana: 3, mana: 3,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 4, agi: 1, int: 2, vit: 5, cha: 2 },
  },
  [PLAYER_CLASS.PLAGUE_DOCTOR]: {
    name: 'Plague Doctor', desc: 'Masked physician who weaponizes disease. Poisons stack and spells drain enemy vitality.',
    maxHp: 7, hp: 7, power: 0, armor: 0, maxMana: 5, mana: 5,
    xp: 0, level: 1, xpToLevel: 20,
    attrs: { str: 1, agi: 3, int: 5, vit: 2, cha: 3 },
  },
};

// ── Class Unlock Conditions ────────────────────────
export const CLASS_UNLOCK_CONDITIONS = {
  [PLAYER_CLASS.BARD]:          { desc: 'Complete 3 quests',  check: (s) => (s.completedQuestIds || []).length >= 3 },
  [PLAYER_CLASS.HOLY_KNIGHT]:   { desc: 'Reach floor 5',      check: (s) => (s.stats?.highestFloor || 0) >= 5 },
  [PLAYER_CLASS.PLAGUE_DOCTOR]: { desc: 'Kill 50 enemies',    check: (s) => (s.stats?.totalKills || 0) >= 50 },
};

// ── Village Buildings (purchasable expansions) ────
export const VILLAGE_BUILDINGS = {
  library: {
    name: 'Library', emoji: '📚',
    desc: '+15% XP earned this run. Knowledge is power!',
    cost: 100, tile: TILE.LIBRARY,
    mapPos: { x: 7, y: 11 },
    benefit: 'xp',
  },
  tavern: {
    name: 'Tavern', emoji: '🍺',
    desc: 'Fully heals you AND cures debuffs on each village return.',
    cost: 150, tile: TILE.TAVERN,
    mapPos: { x: 16, y: 11 },
    benefit: 'heal',
  },
  training: {
    name: 'Training Grounds', emoji: '⚔️',
    desc: 'Grants +2 to your primary stat at game start.',
    cost: 200, tile: TILE.TRAINING_GROUNDS,
    mapPos: { x: 6, y: 7 },
    benefit: 'stat',
  },
  shrine: {
    name: 'Shrine', emoji: '🏛️',
    desc: 'Bestows a random blessing when you enter the dungeon.',
    cost: 120, tile: TILE.SHRINE,
    mapPos: { x: 19, y: 11 },
    benefit: 'blessing',
  },
};

// ── Subclass Specializations ─────────────────────
export const SUBCLASS = {
  BERSERKER:   'berserker',
  PALADIN:     'paladin',
  PYROMANCER:  'pyromancer',
  NECROMANCER: 'necromancer',
  RANGER:      'ranger',
  ASSASSIN:    'assassin',
};

export const SUBCLASS_INFO = {
  [SUBCLASS.BERSERKER]: {
    name: 'Berserker', baseClass: PLAYER_CLASS.WARRIOR, requiredLevel: 5,
    desc: 'A raging warrior who trades defense for devastating damage.',
    statBonuses: { power: 3, maxHp: 5 },
    branches: ['fury'],
  },
  [SUBCLASS.PALADIN]: {
    name: 'Paladin', baseClass: PLAYER_CLASS.WARRIOR, requiredLevel: 5,
    desc: 'A holy knight who heals allies and smites the undead.',
    statBonuses: { armor: 2, maxHp: 8 },
    branches: ['holy'],
  },
  [SUBCLASS.PYROMANCER]: {
    name: 'Pyromancer', baseClass: PLAYER_CLASS.MAGE, requiredLevel: 5,
    desc: 'A fire mage specializing in burn damage and AoE destruction.',
    statBonuses: { spellBonus: 3, maxMana: 5 },
    branches: ['inferno'],
  },
  [SUBCLASS.NECROMANCER]: {
    name: 'Necromancer', baseClass: PLAYER_CLASS.MAGE, requiredLevel: 5,
    desc: 'A dark caster who drains life and bends shadow to their will.',
    statBonuses: { spellBonus: 2, maxHp: 8 },
    branches: ['shadow'],
  },
  [SUBCLASS.RANGER]: {
    name: 'Ranger', baseClass: PLAYER_CLASS.ARCHER, requiredLevel: 5,
    desc: 'A nature warrior with traps, companions, and rain of arrows.',
    statBonuses: { rangedBonus: 2, maxHp: 5 },
    branches: ['nature'],
  },
  [SUBCLASS.ASSASSIN]: {
    name: 'Assassin', baseClass: PLAYER_CLASS.ARCHER, requiredLevel: 5,
    desc: 'A shadow striker with lethal crits and devastating combos.',
    statBonuses: { power: 3, critBonus: 10 },
    branches: ['shadow_arts'],
  },
};

// Attribute bonus formulas (functions of attribute value)
export const ATTR_BONUSES = {
  str: { powerBonus: v => Math.floor(v / 2), hpBonus: v => v * 2 },
  agi: { dodgeChance: v => Math.min(30, v * 2), armorBonus: v => Math.floor(v / 3), rangedBonus: v => Math.floor(v / 2) },
  int: { spellBonus: v => Math.floor(v / 2), manaBonus: v => v * 3 },
  vit: { hpBonus: v => v * 3, hpRegen: v => Math.floor(v / 5) },
  cha: { shopDiscount: v => Math.min(40, v * 3), goldBonus: v => v * 10 },
};

export const ATTR_LABELS = {
  str: 'Strength',
  agi: 'Agility',
  int: 'Intelligence',
  vit: 'Vitality',
  cha: 'Charisma',
};

export const ATTR_DESCRIPTIONS = {
  str: '+1 Melee Pow / 2 pts, +2 HP / pt',
  agi: '+2% Dodge / pt, +1 Armor / 3 pts, +1 Ranged / 2 pts',
  int: '+1 Spell Dmg / 2 pts, +3 Max Mana / pt',
  vit: '+3 Max HP / pt, +1 HP Regen / 5 pts',
  cha: '+3% Shop Discount / pt, +10% Gold / pt',
};

// ── Base Stats ────────────────────────────────────
export const BASE_STATS = {
  [ENTITY.PLAYER]:        { maxHp: 30, hp: 30, power: 2, armor: 0, maxMana: 0, mana: 0, xp: 0, level: 1, xpToLevel: 20 },
  [ENTITY.GOBLIN]:        { maxHp: 6,  hp: 6,  power: 2, armor: 0, xpReward: 8 },
  [ENTITY.ORC]:           { maxHp: 14, hp: 14, power: 4, armor: 1, xpReward: 15 },
  [ENTITY.SKELETON]:      { maxHp: 8,  hp: 8,  power: 3, armor: 2, xpReward: 12 },
  [ENTITY.SPIDER]:        { maxHp: 5,  hp: 5,  power: 3, armor: 0, xpReward: 7 },
  [ENTITY.TROLL]:         { maxHp: 24, hp: 24, power: 5, armor: 2, xpReward: 25 },
  [ENTITY.DARK_MAGE]:     { maxHp: 10, hp: 10, power: 6, armor: 0, xpReward: 20 },
  [ENTITY.BAT]:           { maxHp: 4,  hp: 4,  power: 1, armor: 0, xpReward: 4 },
  [ENTITY.SLIME]:         { maxHp: 8,  hp: 8,  power: 1, armor: 3, xpReward: 6 },
  [ENTITY.WRAITH]:        { maxHp: 12, hp: 12, power: 5, armor: 0, xpReward: 18 },
  [ENTITY.GOBLIN_SHAMAN]: { maxHp: 7,  hp: 7,  power: 4, armor: 0, xpReward: 14 },
  [ENTITY.MUSHROOM]:         { maxHp: 10, hp: 10, power: 2, armor: 1, xpReward: 9 },
  [ENTITY.GOBLIN_BERSERKER]: { maxHp: 8,  hp: 8,  power: 4, armor: 0, xpReward: 12 },
  // Bosses
  [ENTITY.GOBLIN_WARLORD]:   { maxHp: 40, hp: 40, power: 6, armor: 3, xpReward: 60 },
  [ENTITY.SPIDER_QUEEN]:     { maxHp: 35, hp: 35, power: 7, armor: 1, xpReward: 55 },
  [ENTITY.LICH]:             { maxHp: 30, hp: 30, power: 9, armor: 2, xpReward: 70 },
  [ENTITY.MYCELIUM_LORD]:    { maxHp: 45, hp: 45, power: 5, armor: 4, xpReward: 50 },
  [ENTITY.FIRE_ELEMENTAL]:   { maxHp: 38, hp: 38, power: 8, armor: 2, xpReward: 65 },
  [ENTITY.FROST_GIANT]:      { maxHp: 50, hp: 50, power: 7, armor: 4, xpReward: 75 },
  // New monsters - Early (floors 1-3)
  [ENTITY.GOBLIN_SCOUT]:     { maxHp: 5,  hp: 5,  power: 2, armor: 0, xpReward: 6 },
  [ENTITY.CAVE_CRAWLER]:     { maxHp: 6,  hp: 6,  power: 2, armor: 1, xpReward: 7 },
  [ENTITY.VENOM_SPITTER]:    { maxHp: 4,  hp: 4,  power: 3, armor: 0, xpReward: 8 },
  [ENTITY.ZOMBIE]:           { maxHp: 8,  hp: 8,  power: 2, armor: 1, xpReward: 7 },
  [ENTITY.SPORE_WALKER]:     { maxHp: 7,  hp: 7,  power: 2, armor: 0, xpReward: 6 },
  [ENTITY.TOXIC_TOAD]:       { maxHp: 6,  hp: 6,  power: 2, armor: 0, xpReward: 7 },
  [ENTITY.EMBER_BAT]:        { maxHp: 5,  hp: 5,  power: 2, armor: 0, xpReward: 5 },
  [ENTITY.SNOW_WOLF]:        { maxHp: 7,  hp: 7,  power: 3, armor: 0, xpReward: 8 },
  [ENTITY.ICE_SPIDER]:       { maxHp: 6,  hp: 6,  power: 3, armor: 0, xpReward: 7 },
  // New monsters - Mid (floors 2-6)
  [ENTITY.COCOON_HORROR]:    { maxHp: 12, hp: 12, power: 4, armor: 1, xpReward: 14 },
  [ENTITY.BONE_ARCHER]:      { maxHp: 8,  hp: 8,  power: 4, armor: 1, xpReward: 12 },
  [ENTITY.PHANTOM]:          { maxHp: 10, hp: 10, power: 4, armor: 0, xpReward: 15 },
  [ENTITY.VINE_LURKER]:      { maxHp: 9,  hp: 9,  power: 3, armor: 2, xpReward: 11 },
  [ENTITY.FIRE_IMP]:         { maxHp: 8,  hp: 8,  power: 4, armor: 0, xpReward: 10 },
  [ENTITY.LAVA_HOUND]:       { maxHp: 14, hp: 14, power: 4, armor: 2, xpReward: 16 },
  [ENTITY.FROST_WRAITH]:     { maxHp: 11, hp: 11, power: 5, armor: 0, xpReward: 18 },
  [ENTITY.DRAGON_WHELP]:     { maxHp: 16, hp: 16, power: 5, armor: 1, xpReward: 20 },
  [ENTITY.SHADOW_STALKER]:   { maxHp: 10, hp: 10, power: 5, armor: 0, xpReward: 16 },
  // New monsters - Late (floors 3+)
  [ENTITY.DEATH_KNIGHT]:     { maxHp: 20, hp: 20, power: 6, armor: 3, xpReward: 28 },
  [ENTITY.NECROMANCER]:      { maxHp: 14, hp: 14, power: 7, armor: 1, xpReward: 25 },
  [ENTITY.MOSS_GOLEM]:       { maxHp: 22, hp: 22, power: 4, armor: 3, xpReward: 22 },
  [ENTITY.ASH_WRAITH]:       { maxHp: 15, hp: 15, power: 6, armor: 1, xpReward: 22 },
  [ENTITY.MAGMA_GOLEM]:      { maxHp: 20, hp: 20, power: 5, armor: 3, xpReward: 25 },
  [ENTITY.INFERNAL_MAGE]:    { maxHp: 12, hp: 12, power: 7, armor: 1, xpReward: 24 },
  [ENTITY.FROZEN_SENTINEL]:  { maxHp: 18, hp: 18, power: 5, armor: 3, xpReward: 22 },
  [ENTITY.ICE_MAGE]:         { maxHp: 12, hp: 12, power: 6, armor: 1, xpReward: 20 },
  [ENTITY.CRYSTAL_GOLEM]:    { maxHp: 22, hp: 22, power: 5, armor: 3, xpReward: 26 },
  // New bosses
  [ENTITY.GOBLIN_CHIEF]:     { maxHp: 35, hp: 35, power: 6, armor: 2, xpReward: 50 },
  [ENTITY.DEMON_LORD]:       { maxHp: 55, hp: 55, power: 9, armor: 4, xpReward: 85 },
  [ENTITY.ANCIENT_WYRM]:     { maxHp: 60, hp: 60, power: 10, armor: 5, xpReward: 90 },
  [ENTITY.VOID_EMPEROR]:     { maxHp: 80, hp: 80, power: 12, armor: 6, xpReward: 150 },
  // Wave 2 monsters - Early (floors 1-3)
  [ENTITY.PLAGUE_RAT]:       { maxHp: 5,  hp: 5,  power: 2, armor: 0, xpReward: 5 },
  [ENTITY.MYCONID_SPROUT]:   { maxHp: 4,  hp: 4,  power: 1, armor: 1, xpReward: 4 },
  [ENTITY.SAND_SCORPION]:    { maxHp: 7,  hp: 7,  power: 3, armor: 1, xpReward: 8 },
  [ENTITY.VILE_SHAMAN]:      { maxHp: 6,  hp: 6,  power: 3, armor: 0, xpReward: 9 },
  // Wave 2 monsters - Mid (floors 2-5)
  [ENTITY.BLOOD_BAT]:        { maxHp: 6,  hp: 6,  power: 3, armor: 0, xpReward: 8 },
  [ENTITY.DARK_ACOLYTE]:     { maxHp: 9,  hp: 9,  power: 4, armor: 0, xpReward: 12 },
  [ENTITY.SWAMP_HAG]:        { maxHp: 11, hp: 11, power: 4, armor: 1, xpReward: 14 },
  [ENTITY.CORPSE_EATER]:     { maxHp: 10, hp: 10, power: 3, armor: 2, xpReward: 11 },
  [ENTITY.GLACIAL_BEETLE]:   { maxHp: 8,  hp: 8,  power: 3, armor: 3, xpReward: 10 },
  [ENTITY.FLAME_DANCER]:     { maxHp: 9,  hp: 9,  power: 5, armor: 0, xpReward: 13 },
  [ENTITY.FROST_ARCHER]:     { maxHp: 8,  hp: 8,  power: 4, armor: 1, xpReward: 12 },
  // Wave 2 monsters - Late (floors 3+)
  [ENTITY.BONE_SENTINEL]:    { maxHp: 16, hp: 16, power: 5, armor: 3, xpReward: 20 },
  [ENTITY.THUNDER_LIZARD]:   { maxHp: 18, hp: 18, power: 6, armor: 2, xpReward: 22 },
  [ENTITY.STONE_GARGOYLE]:   { maxHp: 15, hp: 15, power: 5, armor: 4, xpReward: 20 },
  [ENTITY.IRON_REVENANT]:    { maxHp: 20, hp: 20, power: 6, armor: 3, xpReward: 24 },
  [ENTITY.WAILING_BANSHEE]:  { maxHp: 12, hp: 12, power: 7, armor: 0, xpReward: 22 },
  [ENTITY.BLOOD_GOLEM]:      { maxHp: 22, hp: 22, power: 5, armor: 3, xpReward: 24 },
  [ENTITY.VOID_TOUCHED]:     { maxHp: 14, hp: 14, power: 7, armor: 1, xpReward: 25 },
  [ENTITY.ABYSSAL_WATCHER]:  { maxHp: 18, hp: 18, power: 8, armor: 2, xpReward: 28 },
  [ENTITY.OBSIDIAN_DRAKE]:   { maxHp: 24, hp: 24, power: 7, armor: 3, xpReward: 30 },
  // Kobold
  [ENTITY.KOBOLD]:           { maxHp: 12, hp: 12, power: 3,  armor: 1, xpReward: 8 },
  // Mimics
  [ENTITY.MIMIC]:            { maxHp: 25, hp: 25, power: 5,  armor: 2, xpReward: 20 },
  [ENTITY.GREATER_MIMIC]:    { maxHp: 45, hp: 45, power: 8,  armor: 3, xpReward: 40 },
  [ENTITY.ANCIENT_MIMIC]:    { maxHp: 70, hp: 70, power: 12, armor: 5, xpReward: 70 },
  // Guardians
  [ENTITY.GUARDIAN_HOARDER]:  { maxHp: 60, hp: 60, power: 10, armor: 4, xpReward: 80 },
  [ENTITY.GUARDIAN_SENTINEL]: { maxHp: 70, hp: 70, power: 8,  armor: 6, xpReward: 90 },
  [ENTITY.GUARDIAN_KEEPER]:   { maxHp: 55, hp: 55, power: 12, armor: 3, xpReward: 85 },
};

// ── Equipment Slots ──────────────────────────────
export const EQUIP_SLOT = {
  WEAPON:  'weapon',
  HELMET:  'helmet',
  CHEST:   'chest',
  GLOVES:  'gloves',
  BOOTS:   'boots',
  CAPE:    'cape',
};

// ── Item Types ───────────────────────────────────
export const ITEM_TYPE = {
  WEAPON:     'weapon',
  HELMET:     'helmet',
  CHEST:      'chest',
  GLOVES:     'gloves',
  BOOTS:      'boots',
  CAPE:       'cape',
  CONSUMABLE: 'consumable',
};

// ── Items ─────────────────────────────────────────
export const ITEMS = {
  // Weapons
  rusty_sword:    { id: 'rusty_sword',    name: 'Rusty Sword',    type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 2, icon: 'W1', desc: '+2 Power', tier: 1 },
  iron_sword:     { id: 'iron_sword',     name: 'Iron Sword',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 4, icon: 'W2', desc: '+4 Power', tier: 2 },
  steel_blade:    { id: 'steel_blade',    name: 'Steel Blade',    type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 6, icon: 'W3', desc: '+6 Power', tier: 3 },
  fire_staff:     { id: 'fire_staff',     name: 'Fire Staff',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 3, icon: 'WS', desc: '+3 Power, +4 Spell Dmg, Fire Dmg', spellBonus: 4, tier: 2, features: [{ type: 'fire_dmg', value: 3 }] },
  war_axe:        { id: 'war_axe',        name: 'War Axe',        type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 5, icon: 'WA', desc: '+5 Power', tier: 2 },
  shadow_dagger:  { id: 'shadow_dagger',  name: 'Shadow Dagger',  type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 7, icon: 'WD', desc: '+7 Power, Crit', tier: 3, features: [{ type: 'crit_chance', value: 15 }] },
  long_bow:       { id: 'long_bow',       name: 'Long Bow',       type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 4, icon: 'WB', desc: '+4 Power, +2 Range', rangeBonus: 2, tier: 2 },
  bone_club:      { id: 'bone_club',      name: 'Bone Club',      type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 3, icon: 'WC', desc: '+3 Power', tier: 1 },
  worn_staff:     { id: 'worn_staff',     name: 'Worn Staff',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 1, icon: 'WS', desc: '+1 Power, +2 Spell Dmg', spellBonus: 2, tier: 1 },
  short_bow:      { id: 'short_bow',      name: 'Short Bow',      type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 2, icon: 'WB', desc: '+2 Power, +1 Range', rangeBonus: 1, tier: 1 },
  frost_wand:     { id: 'frost_wand',     name: 'Frost Wand',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 2, icon: 'WF', desc: '+2 Power, +3 Spell Dmg, Ice Dmg', spellBonus: 3, tier: 2, features: [{ type: 'ice_dmg', value: 2 }] },

  // Helmets
  leather_cap:    { id: 'leather_cap',    name: 'Leather Cap',    type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 1, icon: 'H1', desc: '+1 Armor', tier: 1 },
  iron_helm:      { id: 'iron_helm',      name: 'Iron Helm',      type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 2, icon: 'H2', desc: '+2 Armor', tier: 2 },
  skull_helm:     { id: 'skull_helm',     name: 'Skull Helm',     type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 3, icon: 'H3', desc: '+3 Armor, Life Steal', tier: 3, features: [{ type: 'life_steal', value: 2 }] },

  // Chest
  leather_tunic:  { id: 'leather_tunic',  name: 'Leather Tunic',  type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 1, icon: 'C1', desc: '+1 Armor', tier: 1 },
  chain_mail:     { id: 'chain_mail',     name: 'Chain Mail',     type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 3, icon: 'C2', desc: '+3 Armor', tier: 2 },
  plate_armor:    { id: 'plate_armor',    name: 'Plate Armor',    type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 5, icon: 'C3', desc: '+5 Armor', tier: 3 },
  mage_robe:      { id: 'mage_robe',     name: 'Mage Robe',      type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 1, icon: 'CR', desc: '+1 Armor, +5 Max Mana', manaBonus: 5, tier: 2 },

  // Gloves
  leather_gloves: { id: 'leather_gloves', name: 'Leather Gloves', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, icon: 'G1', desc: '+1 Armor', tier: 1 },
  iron_gauntlets: { id: 'iron_gauntlets', name: 'Iron Gauntlets', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 2, icon: 'G2', desc: '+2 Armor', tier: 2 },
  spiked_gloves:  { id: 'spiked_gloves',  name: 'Spiked Gloves',  type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, powerBonus: 1, icon: 'G3', desc: '+1 Armor, +1 Power, Thorns', tier: 2, features: [{ type: 'thorns', value: 2 }] },

  // Boots
  sandals:        { id: 'sandals',        name: 'Sandals',        type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 0, icon: 'B1', desc: 'Light footwear', tier: 1 },
  leather_boots:  { id: 'leather_boots',  name: 'Leather Boots',  type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 1, icon: 'B2', desc: '+1 Armor', tier: 1 },
  iron_greaves:   { id: 'iron_greaves',   name: 'Iron Greaves',   type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 2, icon: 'B3', desc: '+2 Armor', tier: 2 },

  // Capes
  worn_cloak:     { id: 'worn_cloak',     name: 'Worn Cloak',     type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 1, icon: 'K1', desc: '+1 Armor', tier: 1 },
  shadow_cape:    { id: 'shadow_cape',    name: 'Shadow Cape',    type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 2, icon: 'K2', desc: '+2 Armor, XP Boost', tier: 2, features: [{ type: 'xp_boost', value: 10 }] },
  fire_cloak:     { id: 'fire_cloak',     name: 'Fire Cloak',     type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 1, icon: 'KF', desc: '+1 Armor, +2 Spell Dmg, Fire Dmg', spellBonus: 2, tier: 2, features: [{ type: 'fire_dmg', value: 2 }] },

  // Featured items
  vampiric_blade: { id: 'vampiric_blade', name: 'Vampiric Blade', type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 5, icon: 'WD', desc: '+5 Power, Life Steal', tier: 3, features: [{ type: 'life_steal', value: 3 }] },
  venom_fang:     { id: 'venom_fang',     name: 'Venom Fang',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 4, icon: 'WD', desc: '+4 Power, Poison', tier: 2, features: [{ type: 'poison_dmg', value: 2 }] },
  inferno_axe:    { id: 'inferno_axe',    name: 'Inferno Axe',    type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 6, icon: 'WA', desc: '+6 Power, Fire Dmg', tier: 3, features: [{ type: 'fire_dmg', value: 4 }] },
  oracle_helm:    { id: 'oracle_helm',    name: 'Oracle Helm',    type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 2, icon: 'H2', desc: '+2 Armor, All-Seeing Eye', tier: 3, features: [{ type: 'all_seeing_eye', value: 1 }] },
  thornmail:      { id: 'thornmail',      name: 'Thornmail',      type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 3, icon: 'C2', desc: '+3 Armor, Thorns', tier: 3, features: [{ type: 'thorns', value: 3 }] },
  lucky_cloak:    { id: 'lucky_cloak',    name: 'Lucky Cloak',    type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE,   armor: 1, icon: 'K2', desc: '+1 Armor, Crit + XP Boost', tier: 3, features: [{ type: 'crit_chance', value: 10 }, { type: 'xp_boost', value: 15 }] },
  frost_greaves:  { id: 'frost_greaves',  name: 'Frost Greaves',  type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 2, icon: 'B3', desc: '+2 Armor, Ice Dmg', tier: 2, features: [{ type: 'ice_dmg', value: 2 }] },
  seer_orb:       { id: 'seer_orb',       name: "Seer's Orb",     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 2, icon: 'WF', desc: '+2 Power, +3 Spell, All-Seeing Eye', spellBonus: 3, tier: 3, features: [{ type: 'all_seeing_eye', value: 1 }] },

  // ── Set Items ──────────────────────────────
  // Shadow Assassin Set (4 pieces)
  shadow_hood:      { id: 'shadow_hood',      name: 'Shadow Hood',      type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 2, icon: 'HS', desc: '+2 Armor, 5% Crit [Shadow Assassin]', tier: 3, setId: 'shadow_set', features: [{ type: 'crit_chance', value: 5 }] },
  shadow_vest:      { id: 'shadow_vest',      name: 'Shadow Vest',      type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 3, icon: 'CS', desc: '+3 Armor [Shadow Assassin]', tier: 3, setId: 'shadow_set' },
  shadow_gloves:    { id: 'shadow_gloves',    name: 'Shadow Gloves',    type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, powerBonus: 2, icon: 'GS', desc: '+1 Armor, +2 Power [Shadow Assassin]', tier: 3, setId: 'shadow_set' },
  shadow_boots:     { id: 'shadow_boots',     name: 'Shadow Boots',     type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 2, icon: 'BS', desc: '+2 Armor [Shadow Assassin]', tier: 3, setId: 'shadow_set' },
  // Dragonscale Set (4 pieces)
  dragon_helm:      { id: 'dragon_helm',      name: 'Dragonscale Helm',      type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 3, icon: 'HD', desc: '+3 Armor, Fire Dmg 2 [Dragonscale]', tier: 3, setId: 'dragon_set', features: [{ type: 'fire_dmg', value: 2 }] },
  dragon_plate:     { id: 'dragon_plate',     name: 'Dragonscale Plate',     type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 5, icon: 'CD', desc: '+5 Armor [Dragonscale]', tier: 3, setId: 'dragon_set' },
  dragon_gauntlets: { id: 'dragon_gauntlets', name: 'Dragonscale Gauntlets', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 2, powerBonus: 1, icon: 'GD', desc: '+2 Armor, +1 Power [Dragonscale]', tier: 3, setId: 'dragon_set' },
  dragon_greaves:   { id: 'dragon_greaves',   name: 'Dragonscale Greaves',   type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 3, icon: 'BD', desc: '+3 Armor [Dragonscale]', tier: 3, setId: 'dragon_set' },
  // Arcane Sage Set (3 pieces)
  arcane_circlet:   { id: 'arcane_circlet',   name: 'Arcane Circlet',   type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 1, spellBonus: 3, icon: 'HA', desc: '+1 Armor, +3 Spell Dmg [Arcane Sage]', tier: 3, setId: 'arcane_set' },
  arcane_robe:      { id: 'arcane_robe',      name: 'Arcane Robe',      type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 2, manaBonus: 8, icon: 'CA', desc: '+2 Armor, +8 Max Mana [Arcane Sage]', tier: 3, setId: 'arcane_set' },
  arcane_wraps:     { id: 'arcane_wraps',     name: 'Arcane Wraps',     type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, spellBonus: 2, icon: 'GA', desc: '+1 Armor, +2 Spell Dmg [Arcane Sage]', tier: 3, setId: 'arcane_set' },
  // Holy Crusader Set (4 pieces)
  holy_crown:       { id: 'holy_crown',       name: 'Holy Crown',       type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 3, icon: 'HH', desc: '+3 Armor [Holy Crusader]', tier: 3, setId: 'holy_set' },
  holy_mail:        { id: 'holy_mail',        name: 'Holy Chainmail',   type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 4, icon: 'CH', desc: '+4 Armor, Life Steal 1 [Holy Crusader]', tier: 3, setId: 'holy_set', features: [{ type: 'life_steal', value: 1 }] },
  holy_shield_cape: { id: 'holy_shield_cape', name: 'Holy Shield Cape', type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE,   armor: 2, icon: 'KH', desc: '+2 Armor, Thorns 2 [Holy Crusader]', tier: 3, setId: 'holy_set', features: [{ type: 'thorns', value: 2 }] },
  holy_sabatons:    { id: 'holy_sabatons',    name: 'Holy Sabatons',    type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 3, icon: 'BH', desc: '+3 Armor [Holy Crusader]', tier: 3, setId: 'holy_set' },

  // ── Epic Items (Tier 4) ────────────────────
  demon_slayer:       { id: 'demon_slayer',       name: 'Demon Slayer',       type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 8,  icon: 'WA', desc: '+8 Power, Fire Dmg, Crit',           tier: 4, features: [{ type: 'fire_dmg', value: 4 }, { type: 'crit_chance', value: 10 }] },
  frostfire_staff:    { id: 'frostfire_staff',    name: 'Frostfire Staff',    type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 6,  icon: 'WF', desc: '+6 Power, +5 Spell, Fire+Ice',       spellBonus: 5, tier: 4, features: [{ type: 'fire_dmg', value: 3 }, { type: 'ice_dmg', value: 3 }] },
  windrunner_bow:     { id: 'windrunner_bow',     name: 'Windrunner Bow',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 7,  icon: 'WB', desc: '+7 Power, +3 Range, Crit',           rangeBonus: 3, tier: 4, features: [{ type: 'crit_chance', value: 12 }] },
  titan_helm:         { id: 'titan_helm',         name: 'Titan Helm',         type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 4,  icon: 'H3', desc: '+4 Armor, +10 Max HP',               hpBonus: 10, tier: 4 },
  dragonhide_plate:   { id: 'dragonhide_plate',   name: 'Dragonhide Plate',   type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 6,  icon: 'CD', desc: '+6 Armor, Thorns 3',                 tier: 4, features: [{ type: 'thorns', value: 3 }] },
  wraithweave_gloves: { id: 'wraithweave_gloves', name: 'Wraithweave Gloves', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 3,  icon: 'GS', desc: '+3 Armor, Life Steal 2',             tier: 4, features: [{ type: 'life_steal', value: 2 }] },
  stormstrider_boots: { id: 'stormstrider_boots', name: 'Stormstrider Boots', type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 3,  icon: 'BS', desc: '+3 Armor, +8% Dodge',                tier: 4, features: [{ type: 'dodge_bonus', value: 8 }] },
  phoenix_cloak:      { id: 'phoenix_cloak',      name: 'Phoenix Cloak',      type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE,   armor: 2,  icon: 'KF', desc: '+2 Armor, Mana Regen 2',            tier: 4, features: [{ type: 'mana_regen', value: 2 }] },

  // ── Legendary Items (Tier 5) ─────────────
  excalibur:          { id: 'excalibur',          name: 'Excalibur',          type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 12, icon: 'W3', desc: '+12 Power, Life Steal, Crit, Fire',  tier: 5, features: [{ type: 'life_steal', value: 3 }, { type: 'crit_chance', value: 15 }, { type: 'fire_dmg', value: 5 }] },
  staff_of_eternity:  { id: 'staff_of_eternity',  name: 'Staff of Eternity',  type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 10, icon: 'WF', desc: '+10 Power, +8 Spell, Mana Regen, Ice', spellBonus: 8, tier: 5, features: [{ type: 'mana_regen', value: 5 }, { type: 'ice_dmg', value: 6 }] },
  artemis_longbow:    { id: 'artemis_longbow',    name: "Artemis' Longbow",   type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 11, icon: 'WB', desc: '+11 Power, +4 Range, Double Strike', rangeBonus: 4, tier: 5, features: [{ type: 'double_strike', value: 15 }, { type: 'crit_chance', value: 20 }] },
  crown_of_ages:      { id: 'crown_of_ages',      name: 'Crown of Ages',      type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 6,  icon: 'HH', desc: '+6 Armor, All-Seeing Eye, XP Boost', tier: 5, features: [{ type: 'all_seeing_eye', value: 1 }, { type: 'xp_boost', value: 15 }] },
  aegis_plate:        { id: 'aegis_plate',        name: 'Aegis Plate',        type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST,  armor: 8,  icon: 'CH', desc: '+8 Armor, Thorns 5, Life Steal 2',  tier: 5, features: [{ type: 'thorns', value: 5 }, { type: 'life_steal', value: 2 }] },
  boots_of_hermes:    { id: 'boots_of_hermes',    name: 'Boots of Hermes',    type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS,  armor: 4,  icon: 'BH', desc: '+4 Armor, +15% Dodge',              tier: 5, features: [{ type: 'dodge_bonus', value: 15 }] },

  // Fishing
  trident_deep:     { id: 'trident_deep',     name: 'Trident of the Deep', type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 5, icon: 'WT', desc: '+5 Power, Life Steal 2', tier: 3, features: [{ type: 'life_steal', value: 2 }] },

  // Consumables (stackable)
  minor_health_pot: { id: 'minor_health_pot', name: 'Health Potion',   type: ITEM_TYPE.CONSUMABLE, healAmount: 15, icon: 'PH', desc: 'Restore 15 HP',   stackable: true, maxStack: 30 },
  major_health_pot: { id: 'major_health_pot', name: 'Greater Health',  type: ITEM_TYPE.CONSUMABLE, healAmount: 30, icon: 'PH+', desc: 'Restore 30 HP',  stackable: true, maxStack: 30 },
  mana_potion:      { id: 'mana_potion',      name: 'Mana Potion',     type: ITEM_TYPE.CONSUMABLE, manaAmount: 10, icon: 'PM', desc: 'Restore 10 Mana', stackable: true, maxStack: 30 },
  antidote:         { id: 'antidote',          name: 'Antidote',        type: ITEM_TYPE.CONSUMABLE, curePoison: true, icon: 'PA', desc: 'Cure poison',   stackable: true, maxStack: 30 },
  // Effect potions
  strength_potion:  { id: 'strength_potion',  name: 'Str Potion',     type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Strength', stat: 'power',  amount: 3, turns: 15 }, icon: 'PS', desc: '+3 Power for 15 turns', stackable: true, maxStack: 30 },
  shield_potion:    { id: 'shield_potion',    name: 'Shield Potion',  type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Shield',   stat: 'armor',  amount: 3, turns: 15 }, icon: 'PD', desc: '+3 Armor for 15 turns', stackable: true, maxStack: 30 },
  haste_potion:     { id: 'haste_potion',     name: 'Haste Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Haste',    stat: 'haste',  amount: 1, turns: 10 }, icon: 'PF', desc: 'Double attack for 10 turns', stackable: true, maxStack: 30 },
  regen_potion:     { id: 'regen_potion',     name: 'Regen Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Regen',    stat: 'regen',  amount: 2, turns: 20 }, icon: 'PR', desc: 'Regen 2 HP/turn for 20 turns', stackable: true, maxStack: 30 },
  town_portal_scroll: { id: 'town_portal_scroll', name: 'Portal Scroll', type: ITEM_TYPE.CONSUMABLE, isPortalScroll: true, icon: 'PT', desc: 'Open a portal to the village. Use again to return.', stackable: true, maxStack: 30 },

  // ── Crafting Materials ────────────────────────
  bone_fragment:    { id: 'bone_fragment',    name: 'Bone Fragment',    type: 'material', icon: 'MB', desc: 'A shard of bone. Used in crafting.', stackable: true, maxStack: 50 },
  spider_silk:      { id: 'spider_silk',      name: 'Spider Silk',      type: 'material', icon: 'MS', desc: 'Strong silk thread. Used in crafting.', stackable: true, maxStack: 50 },
  iron_ore:         { id: 'iron_ore',         name: 'Iron Ore',         type: 'material', icon: 'MI', desc: 'Raw iron ore. Used in crafting.', stackable: true, maxStack: 50 },
  dark_essence:     { id: 'dark_essence',     name: 'Dark Essence',     type: 'material', icon: 'MD', desc: 'A wisp of dark energy. Used in crafting.', stackable: true, maxStack: 50 },
  dragon_scale:     { id: 'dragon_scale',     name: 'Dragon Scale',     type: 'material', icon: 'MR', desc: 'A shimmering scale. Used in crafting.', stackable: true, maxStack: 50 },
  crystal_shard:    { id: 'crystal_shard',    name: 'Crystal Shard',    type: 'material', icon: 'MC', desc: 'A glowing crystal. Used in crafting.', stackable: true, maxStack: 50 },
  den_core:         { id: 'den_core',         name: 'Den Core',         type: 'material', icon: 'MN', desc: 'A pulsing core from a monster den. Radiates primal energy. Used in crafting.', stackable: true, maxStack: 50 },
  guardian_relic:    { id: 'guardian_relic',    name: 'Guardian Relic',    type: 'material', icon: 'MG', desc: 'An ancient artifact taken from a treasure guardian. Extremely valuable.', stackable: true, maxStack: 50 },
};

// ── Crafting Recipes ─────────────────────────────
export const CRAFTING_RECIPES = [
  // Tier 2
  { name: 'Reinforced Sword', output: 'iron_sword',     gold: 30,  materials: { iron_ore: 3 } },
  { name: 'Silk Armor',       output: 'chain_mail',      gold: 25,  materials: { spider_silk: 4 } },
  { name: 'Bone Cape',        output: 'worn_cloak',      gold: 20,  materials: { bone_fragment: 3 } },
  { name: 'Venom Blade',      output: 'venom_fang',      gold: 35,  materials: { spider_silk: 2, iron_ore: 2 } },
  { name: 'Frost Wand',       output: 'frost_wand',      gold: 40,  materials: { iron_ore: 2, dark_essence: 1 } },
  // Tier 3
  { name: 'Dark Blade',       output: 'shadow_dagger',   gold: 60,  materials: { dark_essence: 3, iron_ore: 2 } },
  { name: 'Dragonfire Axe',   output: 'inferno_axe',     gold: 80,  materials: { dragon_scale: 2, iron_ore: 3 } },
  { name: 'Crystal Staff',    output: 'seer_orb',        gold: 70,  materials: { crystal_shard: 2, dark_essence: 2 } },
  { name: 'Vampiric Edge',    output: 'vampiric_blade',  gold: 75,  materials: { dark_essence: 3, crystal_shard: 1 } },
  { name: 'Dragon Plate',     output: 'plate_armor',     gold: 100, materials: { dragon_scale: 4, iron_ore: 3 } },
  { name: 'Oracle Crown',     output: 'oracle_helm',     gold: 90,  materials: { crystal_shard: 2, dark_essence: 2 } },
  { name: 'Lucky Mantle',     output: 'lucky_cloak',     gold: 85,  materials: { crystal_shard: 2, spider_silk: 3 } },
  { name: 'Thornmail Vest',   output: 'thornmail',       gold: 65,  materials: { iron_ore: 3, bone_fragment: 2, crystal_shard: 1 } },
];

// ── Floor Themes ─────────────────────────────────
export const FLOOR_THEME = {
  GOBLIN_CAVE:    'goblin_cave',
  SPIDER_CAVERN:  'spider_cavern',
  CRYPT:          'crypt',
  MUSHROOM_GROTTO:'mushroom_grotto',
  SCORCHED_DEPTHS:'scorched_depths',
  FROZEN_HALLS:   'frozen_halls',
  GOBLIN_VILLAGE: 'goblin_village',
  DRAGON_LAIR:    'dragon_lair',
  SWAMP_BOG:      'swamp_bog',
  SHADOW_REALM:   'shadow_realm',
};

export const FLOOR_THEMES = {
  [FLOOR_THEME.GOBLIN_CAVE]: {
    name: 'Goblin Cave',
    wallTile: TILE.MOSS_WALL,
    floorTile: TILE.MOSS_FLOOR,
    spawnWeights: {
      [ENTITY.GOBLIN]: 5, [ENTITY.ORC]: 3, [ENTITY.GOBLIN_SHAMAN]: 2, [ENTITY.BAT]: 2, [ENTITY.GOBLIN_BERSERKER]: 2, [ENTITY.GOBLIN_SCOUT]: 3, [ENTITY.SAND_SCORPION]: 2, [ENTITY.VILE_SHAMAN]: 2,
    },
    minFloor: 1,
    maxFloor: 3,
  },
  [FLOOR_THEME.SPIDER_CAVERN]: {
    name: 'Spider Cavern',
    wallTile: TILE.CAVE_WALL,
    floorTile: TILE.WEB_FLOOR,
    spawnWeights: {
      [ENTITY.SPIDER]: 6, [ENTITY.BAT]: 3, [ENTITY.SLIME]: 2, [ENTITY.CAVE_CRAWLER]: 3, [ENTITY.VENOM_SPITTER]: 2, [ENTITY.COCOON_HORROR]: 1, [ENTITY.PLAGUE_RAT]: 3,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.CRYPT]: {
    name: 'Ancient Crypt',
    wallTile: TILE.BONE_WALL,
    floorTile: TILE.BONE_FLOOR,
    spawnWeights: {
      [ENTITY.SKELETON]: 5, [ENTITY.WRAITH]: 2, [ENTITY.DARK_MAGE]: 1, [ENTITY.BAT]: 1, [ENTITY.ZOMBIE]: 4, [ENTITY.BONE_ARCHER]: 3, [ENTITY.PHANTOM]: 2, [ENTITY.DEATH_KNIGHT]: 1, [ENTITY.NECROMANCER]: 1, [ENTITY.BLOOD_BAT]: 2, [ENTITY.DARK_ACOLYTE]: 2, [ENTITY.CORPSE_EATER]: 2, [ENTITY.BONE_SENTINEL]: 1, [ENTITY.WAILING_BANSHEE]: 1, [ENTITY.BLOOD_GOLEM]: 1,
    },
    minFloor: 2,
    maxFloor: 6,
  },
  [FLOOR_THEME.MUSHROOM_GROTTO]: {
    name: 'Mushroom Grotto',
    wallTile: TILE.MOSS_WALL,
    floorTile: TILE.MOSS_FLOOR,
    spawnWeights: {
      [ENTITY.MUSHROOM]: 4, [ENTITY.SLIME]: 3, [ENTITY.SPIDER]: 2, [ENTITY.GOBLIN]: 1, [ENTITY.SPORE_WALKER]: 3, [ENTITY.TOXIC_TOAD]: 2, [ENTITY.VINE_LURKER]: 2, [ENTITY.MOSS_GOLEM]: 1, [ENTITY.MYCONID_SPROUT]: 3, [ENTITY.SWAMP_HAG]: 2, [ENTITY.PLAGUE_RAT]: 2,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.SCORCHED_DEPTHS]: {
    name: 'Scorched Depths',
    wallTile: TILE.LAVA_WALL,
    floorTile: TILE.LAVA_FLOOR,
    spawnWeights: {
      [ENTITY.DARK_MAGE]: 3, [ENTITY.TROLL]: 2, [ENTITY.ORC]: 2, [ENTITY.GOBLIN_SHAMAN]: 1, [ENTITY.FIRE_IMP]: 4, [ENTITY.LAVA_HOUND]: 3, [ENTITY.ASH_WRAITH]: 2, [ENTITY.MAGMA_GOLEM]: 1, [ENTITY.INFERNAL_MAGE]: 1, [ENTITY.EMBER_BAT]: 2, [ENTITY.FLAME_DANCER]: 2, [ENTITY.THUNDER_LIZARD]: 1, [ENTITY.IRON_REVENANT]: 1, [ENTITY.OBSIDIAN_DRAKE]: 1, [ENTITY.ABYSSAL_WATCHER]: 1,
    },
    minFloor: 3,
    maxFloor: 99,
  },
  [FLOOR_THEME.FROZEN_HALLS]: {
    name: 'Frozen Halls',
    wallTile: TILE.ICE_WALL,
    floorTile: TILE.ICE_FLOOR,
    spawnWeights: {
      [ENTITY.WRAITH]: 3, [ENTITY.SKELETON]: 3, [ENTITY.SLIME]: 2, [ENTITY.TROLL]: 1, [ENTITY.ICE_SPIDER]: 3, [ENTITY.FROST_WRAITH]: 2, [ENTITY.FROZEN_SENTINEL]: 1, [ENTITY.SNOW_WOLF]: 3, [ENTITY.ICE_MAGE]: 1, [ENTITY.GLACIAL_BEETLE]: 2, [ENTITY.FROST_ARCHER]: 2, [ENTITY.STONE_GARGOYLE]: 1, [ENTITY.VOID_TOUCHED]: 1, [ENTITY.WAILING_BANSHEE]: 1,
    },
    minFloor: 3,
    maxFloor: 99,
  },
  [FLOOR_THEME.GOBLIN_VILLAGE]: {
    name: 'Goblin Village',
    wallTile: TILE.VILLAGE_WALL,
    floorTile: TILE.VILLAGE_FLOOR,
    spawnWeights: {
      [ENTITY.GOBLIN]: 6, [ENTITY.ORC]: 3, [ENTITY.GOBLIN_SHAMAN]: 2, [ENTITY.GOBLIN_BERSERKER]: 3, [ENTITY.GOBLIN_SCOUT]: 4, [ENTITY.VILE_SHAMAN]: 2, [ENTITY.GOBLIN_CHIEF]: 1,
    },
    minFloor: 1,
    maxFloor: 4,
    layoutType: 'village',
  },
  [FLOOR_THEME.DRAGON_LAIR]: {
    name: "Dragon's Lair",
    wallTile: TILE.CHARRED_WALL,
    floorTile: TILE.CHARRED_FLOOR,
    spawnWeights: {
      [ENTITY.DRAGON_WHELP]: 5, [ENTITY.OBSIDIAN_DRAKE]: 3, [ENTITY.FIRE_IMP]: 3, [ENTITY.LAVA_HOUND]: 2, [ENTITY.EMBER_BAT]: 4, [ENTITY.ASH_WRAITH]: 2, [ENTITY.KOBOLD]: 3,
    },
    minFloor: 5,
    maxFloor: 99,
    layoutType: 'lair',
  },
  [FLOOR_THEME.SWAMP_BOG]: {
    name: 'Swamp Bog',
    wallTile: TILE.SWAMP_WALL,
    floorTile: TILE.SWAMP_FLOOR,
    spawnWeights: {
      [ENTITY.SWAMP_HAG]: 3, [ENTITY.TOXIC_TOAD]: 4, [ENTITY.PLAGUE_RAT]: 3, [ENTITY.VINE_LURKER]: 3, [ENTITY.SLIME]: 4, [ENTITY.SPIDER]: 2, [ENTITY.VENOM_SPITTER]: 2, [ENTITY.SPORE_WALKER]: 2, [ENTITY.BLOOD_BAT]: 2,
    },
    minFloor: 2,
    maxFloor: 5,
    layoutType: 'swamp',
  },
  [FLOOR_THEME.SHADOW_REALM]: {
    name: 'Shadow Realm',
    wallTile: TILE.SHADOW_WALL,
    floorTile: TILE.SHADOW_FLOOR,
    spawnWeights: {
      [ENTITY.VOID_TOUCHED]: 4, [ENTITY.ABYSSAL_WATCHER]: 3, [ENTITY.DARK_MAGE]: 3, [ENTITY.WRAITH]: 3, [ENTITY.PHANTOM]: 3, [ENTITY.SHADOW_STALKER]: 3, [ENTITY.WAILING_BANSHEE]: 2, [ENTITY.DEATH_KNIGHT]: 1,
    },
    minFloor: 7,
    maxFloor: 99,
  },
};

// ── Loot Tables ──────────────────────────────────
export const LOOT_TABLES = {
  [ENTITY.GOBLIN]: [
    { itemId: 'minor_health_pot', chance: 0.35 },
    { itemId: 'rusty_sword',      chance: 0.10 },
    { itemId: 'leather_cap',      chance: 0.08 },
    { itemId: 'leather_tunic',    chance: 0.08 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'sandals',          chance: 0.06 },
    { itemId: 'worn_cloak',       chance: 0.05 },
  ],
  [ENTITY.ORC]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'iron_sword',       chance: 0.12 },
    { itemId: 'war_axe',          chance: 0.08 },
    { itemId: 'chain_mail',       chance: 0.10 },
    { itemId: 'iron_helm',        chance: 0.10 },
    { itemId: 'iron_gauntlets',   chance: 0.08 },
    { itemId: 'iron_greaves',     chance: 0.08 },
    { itemId: 'mana_potion',      chance: 0.10 },
    { itemId: 'iron_ore',         chance: 0.30 },
  ],
  [ENTITY.SKELETON]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'bone_club',        chance: 0.15 },
    { itemId: 'iron_helm',        chance: 0.10 },
    { itemId: 'leather_boots',    chance: 0.10 },
    { itemId: 'worn_cloak',       chance: 0.08 },
    { itemId: 'skull_helm',       chance: 0.04 },
    { itemId: 'bone_fragment',    chance: 0.35 },
  ],
  [ENTITY.SPIDER]: [
    { itemId: 'antidote',         chance: 0.40 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'leather_boots',    chance: 0.06 },
    { itemId: 'spider_silk',      chance: 0.35 },
  ],
  [ENTITY.TROLL]: [
    { itemId: 'major_health_pot', chance: 0.35 },
    { itemId: 'steel_blade',      chance: 0.12 },
    { itemId: 'plate_armor',      chance: 0.08 },
    { itemId: 'spiked_gloves',    chance: 0.10 },
    { itemId: 'iron_greaves',     chance: 0.10 },
    { itemId: 'shadow_cape',      chance: 0.08 },
    { itemId: 'strength_potion',  chance: 0.10 },
    { itemId: 'regen_potion',     chance: 0.08 },
    { itemId: 'thornmail',        chance: 0.04 },
    { itemId: 'inferno_axe',      chance: 0.03 },
    { itemId: 'iron_ore',         chance: 0.25 },
  ],
  [ENTITY.DARK_MAGE]: [
    { itemId: 'mana_potion',      chance: 0.40 },
    { itemId: 'fire_staff',       chance: 0.12 },
    { itemId: 'mage_robe',        chance: 0.10 },
    { itemId: 'fire_cloak',       chance: 0.08 },
    { itemId: 'shadow_dagger',    chance: 0.06 },
    { itemId: 'major_health_pot', chance: 0.15 },
    { itemId: 'skull_helm',       chance: 0.05 },
    { itemId: 'shield_potion',    chance: 0.08 },
    { itemId: 'haste_potion',     chance: 0.06 },
    { itemId: 'seer_orb',         chance: 0.03 },
    { itemId: 'dark_essence',     chance: 0.20 },
  ],
  [ENTITY.BAT]: [
    { itemId: 'minor_health_pot', chance: 0.20 },
    { itemId: 'leather_cap',      chance: 0.05 },
  ],
  [ENTITY.SLIME]: [
    { itemId: 'antidote',         chance: 0.30 },
    { itemId: 'minor_health_pot', chance: 0.20 },
    { itemId: 'mana_potion',      chance: 0.10 },
  ],
  [ENTITY.WRAITH]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'shadow_cape',      chance: 0.12 },
    { itemId: 'shadow_dagger',    chance: 0.08 },
    { itemId: 'skull_helm',       chance: 0.06 },
    { itemId: 'frost_wand',       chance: 0.08 },
    { itemId: 'mana_potion',      chance: 0.20 },
    { itemId: 'regen_potion',     chance: 0.10 },
    { itemId: 'shield_potion',    chance: 0.08 },
    { itemId: 'vampiric_blade',   chance: 0.04 },
    { itemId: 'lucky_cloak',      chance: 0.03 },
    { itemId: 'dark_essence',     chance: 0.20 },
  ],
  [ENTITY.GOBLIN_SHAMAN]: [
    { itemId: 'mana_potion',      chance: 0.35 },
    { itemId: 'fire_staff',       chance: 0.08 },
    { itemId: 'frost_wand',       chance: 0.08 },
    { itemId: 'minor_health_pot', chance: 0.20 },
    { itemId: 'fire_cloak',       chance: 0.06 },
    { itemId: 'mage_robe',        chance: 0.06 },
  ],
  [ENTITY.MUSHROOM]: [
    { itemId: 'antidote',         chance: 0.35 },
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'mana_potion',      chance: 0.15 },
  ],
  [ENTITY.GOBLIN_BERSERKER]: [
    { itemId: 'war_axe',          chance: 0.15 },
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'leather_tunic',    chance: 0.08 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'leather_boots',    chance: 0.06 },
  ],
  // Boss loot (higher drop rates, can drop multiple)
  [ENTITY.GOBLIN_WARLORD]: [
    { itemId: 'steel_blade',      chance: 0.40 },
    { itemId: 'iron_helm',        chance: 0.35 },
    { itemId: 'chain_mail',       chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'iron_gauntlets',   chance: 0.25 },
    { itemId: 'strength_potion',  chance: 0.40 },
    { itemId: 'haste_potion',     chance: 0.30 },
    { itemId: 'inferno_axe',      chance: 0.15 },
    { itemId: 'holy_crown',       chance: 0.05 },
    { itemId: 'crystal_shard',    chance: 0.25 },
    { itemId: 'iron_ore',         chance: 0.50 },
  ],
  [ENTITY.SPIDER_QUEEN]: [
    { itemId: 'shadow_dagger',    chance: 0.35 },
    { itemId: 'shadow_cape',      chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'antidote',         chance: 0.50 },
    { itemId: 'spiked_gloves',    chance: 0.25 },
    { itemId: 'venom_fang',       chance: 0.20 },
    { itemId: 'shadow_gloves',    chance: 0.06 },
    { itemId: 'shadow_boots',     chance: 0.06 },
    { itemId: 'crystal_shard',    chance: 0.25 },
    { itemId: 'spider_silk',      chance: 0.50 },
  ],
  [ENTITY.LICH]: [
    { itemId: 'fire_staff',       chance: 0.35 },
    { itemId: 'frost_wand',       chance: 0.30 },
    { itemId: 'skull_helm',       chance: 0.35 },
    { itemId: 'mage_robe',        chance: 0.30 },
    { itemId: 'mana_potion',      chance: 0.60 },
    { itemId: 'major_health_pot', chance: 0.40 },
    { itemId: 'seer_orb',         chance: 0.20 },
    { itemId: 'oracle_helm',      chance: 0.15 },
    { itemId: 'arcane_circlet',   chance: 0.07 },
    { itemId: 'arcane_robe',      chance: 0.06 },
    { itemId: 'arcane_wraps',     chance: 0.06 },
    { itemId: 'crystal_shard',    chance: 0.30 },
    { itemId: 'dark_essence',     chance: 0.50 },
    // Epic/Legendary drops
    { itemId: 'frostfire_staff',    chance: 0.10 },
    { itemId: 'phoenix_cloak',     chance: 0.08 },
    { itemId: 'staff_of_eternity', chance: 0.03 },
    { itemId: 'crown_of_ages',     chance: 0.03 },
  ],
  [ENTITY.MYCELIUM_LORD]: [
    { itemId: 'plate_armor',      chance: 0.30 },
    { itemId: 'iron_greaves',     chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'antidote',         chance: 0.50 },
    { itemId: 'spiked_gloves',    chance: 0.25 },
    { itemId: 'crystal_shard',    chance: 0.20 },
    { itemId: 'bone_fragment',    chance: 0.50 },
  ],
  [ENTITY.FIRE_ELEMENTAL]: [
    { itemId: 'fire_staff',       chance: 0.35 },
    { itemId: 'fire_cloak',       chance: 0.35 },
    { itemId: 'steel_blade',      chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'plate_armor',      chance: 0.20 },
    { itemId: 'inferno_axe',      chance: 0.20 },
    { itemId: 'vampiric_blade',   chance: 0.10 },
    { itemId: 'dragon_helm',      chance: 0.06 },
    { itemId: 'dragon_plate',     chance: 0.05 },
    { itemId: 'crystal_shard',    chance: 0.30 },
    { itemId: 'dragon_scale',     chance: 0.40 },
    // Epic/Legendary drops
    { itemId: 'demon_slayer',     chance: 0.10 },
    { itemId: 'dragonhide_plate', chance: 0.08 },
    { itemId: 'excalibur',        chance: 0.03 },
  ],
  [ENTITY.FROST_GIANT]: [
    { itemId: 'frost_wand',       chance: 0.35 },
    { itemId: 'plate_armor',      chance: 0.30 },
    { itemId: 'skull_helm',       chance: 0.25 },
    { itemId: 'iron_greaves',     chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'shadow_cape',      chance: 0.25 },
    { itemId: 'frost_greaves',    chance: 0.20 },
    { itemId: 'lucky_cloak',      chance: 0.10 },
    { itemId: 'holy_mail',        chance: 0.06 },
    { itemId: 'holy_sabatons',    chance: 0.06 },
    { itemId: 'holy_shield_cape', chance: 0.05 },
    // Epic/Legendary drops
    { itemId: 'titan_helm',          chance: 0.10 },
    { itemId: 'stormstrider_boots',  chance: 0.08 },
    { itemId: 'crown_of_ages',       chance: 0.03 },
    { itemId: 'aegis_plate',         chance: 0.03 },
  ],
  // New monster loot - Early
  [ENTITY.GOBLIN_SCOUT]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'rusty_sword',      chance: 0.08 },
    { itemId: 'leather_cap',      chance: 0.06 },
    { itemId: 'sandals',          chance: 0.05 },
  ],
  [ENTITY.CAVE_CRAWLER]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'antidote',         chance: 0.30 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'leather_boots',    chance: 0.06 },
  ],
  [ENTITY.VENOM_SPITTER]: [
    { itemId: 'antidote',         chance: 0.40 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'venom_fang',       chance: 0.05 },
  ],
  [ENTITY.ZOMBIE]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'bone_club',        chance: 0.12 },
    { itemId: 'leather_tunic',    chance: 0.08 },
    { itemId: 'worn_cloak',       chance: 0.06 },
  ],
  [ENTITY.SPORE_WALKER]: [
    { itemId: 'antidote',         chance: 0.30 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_boots',    chance: 0.06 },
  ],
  [ENTITY.TOXIC_TOAD]: [
    { itemId: 'antidote',         chance: 0.35 },
    { itemId: 'minor_health_pot', chance: 0.20 },
    { itemId: 'mana_potion',      chance: 0.10 },
  ],
  [ENTITY.EMBER_BAT]: [
    { itemId: 'minor_health_pot', chance: 0.20 },
    { itemId: 'leather_cap',      chance: 0.05 },
    { itemId: 'fire_cloak',       chance: 0.03 },
  ],
  [ENTITY.SNOW_WOLF]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_boots',    chance: 0.08 },
    { itemId: 'worn_cloak',       chance: 0.06 },
    { itemId: 'frost_greaves',    chance: 0.04 },
  ],
  [ENTITY.ICE_SPIDER]: [
    { itemId: 'antidote',         chance: 0.35 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'frost_wand',       chance: 0.04 },
  ],
  // New monster loot - Mid
  [ENTITY.COCOON_HORROR]: [
    { itemId: 'major_health_pot', chance: 0.20 },
    { itemId: 'antidote',         chance: 0.30 },
    { itemId: 'shadow_cape',      chance: 0.08 },
    { itemId: 'spiked_gloves',    chance: 0.06 },
    { itemId: 'venom_fang',       chance: 0.08 },
  ],
  [ENTITY.BONE_ARCHER]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'short_bow',        chance: 0.12 },
    { itemId: 'long_bow',         chance: 0.06 },
    { itemId: 'leather_cap',      chance: 0.08 },
    { itemId: 'iron_helm',        chance: 0.05 },
  ],
  [ENTITY.PHANTOM]: [
    { itemId: 'mana_potion',      chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.15 },
    { itemId: 'shadow_cape',      chance: 0.10 },
    { itemId: 'shadow_dagger',    chance: 0.06 },
    { itemId: 'skull_helm',       chance: 0.05 },
  ],
  [ENTITY.VINE_LURKER]: [
    { itemId: 'antidote',         chance: 0.30 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_tunic',    chance: 0.08 },
    { itemId: 'iron_gauntlets',   chance: 0.06 },
  ],
  [ENTITY.FIRE_IMP]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'mana_potion',      chance: 0.20 },
    { itemId: 'fire_cloak',       chance: 0.06 },
    { itemId: 'fire_staff',       chance: 0.04 },
  ],
  [ENTITY.LAVA_HOUND]: [
    { itemId: 'major_health_pot', chance: 0.20 },
    { itemId: 'chain_mail',       chance: 0.08 },
    { itemId: 'iron_gauntlets',   chance: 0.08 },
    { itemId: 'iron_greaves',     chance: 0.08 },
    { itemId: 'strength_potion',  chance: 0.10 },
  ],
  [ENTITY.FROST_WRAITH]: [
    { itemId: 'major_health_pot', chance: 0.20 },
    { itemId: 'frost_wand',       chance: 0.10 },
    { itemId: 'shadow_cape',      chance: 0.08 },
    { itemId: 'mana_potion',      chance: 0.20 },
    { itemId: 'frost_greaves',    chance: 0.08 },
  ],
  [ENTITY.DRAGON_WHELP]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'fire_staff',       chance: 0.10 },
    { itemId: 'steel_blade',      chance: 0.08 },
    { itemId: 'chain_mail',       chance: 0.08 },
    { itemId: 'fire_cloak',       chance: 0.10 },
  ],
  [ENTITY.SHADOW_STALKER]: [
    { itemId: 'major_health_pot', chance: 0.20 },
    { itemId: 'shadow_dagger',    chance: 0.10 },
    { itemId: 'shadow_cape',      chance: 0.10 },
    { itemId: 'haste_potion',     chance: 0.08 },
    { itemId: 'shadow_hood',      chance: 0.04 },
    { itemId: 'shadow_vest',      chance: 0.03 },
  ],
  // New monster loot - Late
  [ENTITY.DEATH_KNIGHT]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'steel_blade',      chance: 0.15 },
    { itemId: 'plate_armor',      chance: 0.10 },
    { itemId: 'skull_helm',       chance: 0.10 },
    { itemId: 'iron_greaves',     chance: 0.10 },
    { itemId: 'holy_crown',       chance: 0.04 },
    { itemId: 'shadow_gloves',    chance: 0.03 },
  ],
  [ENTITY.NECROMANCER]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'mana_potion',      chance: 0.30 },
    { itemId: 'fire_staff',       chance: 0.10 },
    { itemId: 'mage_robe',        chance: 0.10 },
    { itemId: 'seer_orb',         chance: 0.05 },
    { itemId: 'arcane_wraps',     chance: 0.04 },
  ],
  [ENTITY.MOSS_GOLEM]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'plate_armor',      chance: 0.10 },
    { itemId: 'iron_gauntlets',   chance: 0.12 },
    { itemId: 'iron_greaves',     chance: 0.12 },
    { itemId: 'regen_potion',     chance: 0.10 },
  ],
  [ENTITY.ASH_WRAITH]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'fire_cloak',       chance: 0.12 },
    { itemId: 'fire_staff',       chance: 0.08 },
    { itemId: 'inferno_axe',      chance: 0.05 },
  ],
  [ENTITY.MAGMA_GOLEM]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'plate_armor',      chance: 0.12 },
    { itemId: 'inferno_axe',      chance: 0.08 },
    { itemId: 'iron_greaves',     chance: 0.10 },
    { itemId: 'strength_potion',  chance: 0.12 },
    { itemId: 'dragon_gauntlets', chance: 0.04 },
  ],
  [ENTITY.INFERNAL_MAGE]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'mana_potion',      chance: 0.30 },
    { itemId: 'fire_staff',       chance: 0.12 },
    { itemId: 'fire_cloak',       chance: 0.10 },
    { itemId: 'seer_orb',         chance: 0.04 },
  ],
  [ENTITY.FROZEN_SENTINEL]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'plate_armor',      chance: 0.10 },
    { itemId: 'frost_wand',       chance: 0.10 },
    { itemId: 'frost_greaves',    chance: 0.12 },
    { itemId: 'shield_potion',    chance: 0.10 },
  ],
  [ENTITY.ICE_MAGE]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'mana_potion',      chance: 0.30 },
    { itemId: 'frost_wand',       chance: 0.12 },
    { itemId: 'mage_robe',        chance: 0.08 },
  ],
  [ENTITY.CRYSTAL_GOLEM]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'plate_armor',      chance: 0.12 },
    { itemId: 'oracle_helm',      chance: 0.06 },
    { itemId: 'seer_orb',         chance: 0.05 },
    { itemId: 'iron_greaves',     chance: 0.12 },
    { itemId: 'holy_mail',        chance: 0.04 },
    { itemId: 'holy_sabatons',    chance: 0.04 },
  ],
  // New boss loot
  [ENTITY.GOBLIN_CHIEF]: [
    { itemId: 'war_axe',          chance: 0.40 },
    { itemId: 'iron_helm',        chance: 0.35 },
    { itemId: 'chain_mail',       chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'iron_gauntlets',   chance: 0.30 },
    { itemId: 'strength_potion',  chance: 0.35 },
    { itemId: 'iron_greaves',     chance: 0.25 },
  ],
  [ENTITY.DEMON_LORD]: [
    { itemId: 'inferno_axe',      chance: 0.40 },
    { itemId: 'fire_staff',       chance: 0.35 },
    { itemId: 'plate_armor',      chance: 0.35 },
    { itemId: 'skull_helm',       chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.70 },
    { itemId: 'fire_cloak',       chance: 0.30 },
    { itemId: 'vampiric_blade',   chance: 0.15 },
    { itemId: 'lucky_cloak',      chance: 0.10 },
    { itemId: 'dragon_gauntlets', chance: 0.07 },
    { itemId: 'dragon_greaves',   chance: 0.07 },
    { itemId: 'dragon_scale',     chance: 0.30 },
    { itemId: 'crystal_shard',    chance: 0.25 },
    { itemId: 'town_portal_scroll', chance: 0.10 },
    // Epic/Legendary drops
    { itemId: 'demon_slayer',       chance: 0.15 },
    { itemId: 'phoenix_cloak',      chance: 0.10 },
    { itemId: 'wraithweave_gloves', chance: 0.10 },
    { itemId: 'excalibur',          chance: 0.04 },
    { itemId: 'boots_of_hermes',    chance: 0.03 },
  ],
  [ENTITY.ANCIENT_WYRM]: [
    { itemId: 'steel_blade',      chance: 0.40 },
    { itemId: 'plate_armor',      chance: 0.40 },
    { itemId: 'skull_helm',       chance: 0.35 },
    { itemId: 'major_health_pot', chance: 0.70 },
    { itemId: 'shadow_dagger',    chance: 0.30 },
    { itemId: 'inferno_axe',      chance: 0.25 },
    { itemId: 'vampiric_blade',   chance: 0.20 },
    { itemId: 'lucky_cloak',      chance: 0.15 },
    { itemId: 'shadow_hood',      chance: 0.08 },
    { itemId: 'shadow_vest',      chance: 0.08 },
    { itemId: 'dragon_helm',      chance: 0.08 },
    { itemId: 'dragon_plate',     chance: 0.08 },
    { itemId: 'crystal_shard',    chance: 0.40 },
    { itemId: 'dragon_scale',     chance: 0.50 },
    // Epic/Legendary drops
    { itemId: 'windrunner_bow',      chance: 0.12 },
    { itemId: 'frostfire_staff',     chance: 0.12 },
    { itemId: 'titan_helm',          chance: 0.10 },
    { itemId: 'dragonhide_plate',    chance: 0.10 },
    { itemId: 'stormstrider_boots',  chance: 0.08 },
    { itemId: 'excalibur',           chance: 0.05 },
    { itemId: 'staff_of_eternity',   chance: 0.05 },
    { itemId: 'artemis_longbow',     chance: 0.05 },
    { itemId: 'crown_of_ages',       chance: 0.04 },
    { itemId: 'aegis_plate',         chance: 0.04 },
    { itemId: 'boots_of_hermes',     chance: 0.04 },
  ],
  [ENTITY.VOID_EMPEROR]: [
    { itemId: 'plate_armor',        chance: 0.40 },
    { itemId: 'skull_helm',         chance: 0.35 },
    { itemId: 'shadow_dagger',      chance: 0.35 },
    { itemId: 'vampiric_blade',     chance: 0.25 },
    { itemId: 'major_health_pot',   chance: 0.80 },
    { itemId: 'dragon_scale',       chance: 0.50 },
    { itemId: 'crystal_shard',      chance: 0.50 },
    { itemId: 'dark_essence',       chance: 0.40 },
    { itemId: 'town_portal_scroll', chance: 0.30 },
    // Epic/Legendary drops
    { itemId: 'frostfire_staff',       chance: 0.15 },
    { itemId: 'windrunner_bow',        chance: 0.15 },
    { itemId: 'titan_helm',            chance: 0.12 },
    { itemId: 'dragonhide_plate',      chance: 0.12 },
    { itemId: 'stormstrider_boots',    chance: 0.10 },
    { itemId: 'excalibur',             chance: 0.08 },
    { itemId: 'staff_of_eternity',     chance: 0.08 },
    { itemId: 'artemis_longbow',       chance: 0.08 },
    { itemId: 'crown_of_ages',         chance: 0.06 },
    { itemId: 'aegis_plate',           chance: 0.06 },
    { itemId: 'boots_of_hermes',       chance: 0.06 },
  ],
  // Wave 2 monsters
  [ENTITY.PLAGUE_RAT]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'bone_club',       chance: 0.06 },
    { itemId: 'sandals',         chance: 0.05 },
  ],
  [ENTITY.MYCONID_SPROUT]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'worn_cloak',      chance: 0.05 },
    { itemId: 'mushroom_cap',    chance: 0.08 },
  ],
  [ENTITY.SAND_SCORPION]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'leather_gloves',  chance: 0.08 },
    { itemId: 'leather_tunic',   chance: 0.06 },
    { itemId: 'iron_ore',        chance: 0.10 },
  ],
  [ENTITY.VILE_SHAMAN]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'worn_staff',      chance: 0.10 },
    { itemId: 'leather_cap',     chance: 0.08 },
    { itemId: 'mana_potion',     chance: 0.08 },
  ],
  [ENTITY.BLOOD_BAT]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'leather_cap',     chance: 0.06 },
    { itemId: 'worn_cloak',      chance: 0.06 },
  ],
  [ENTITY.DARK_ACOLYTE]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'worn_staff',      chance: 0.10 },
    { itemId: 'mana_potion',     chance: 0.12 },
    { itemId: 'iron_helm',       chance: 0.08 },
    { itemId: 'dark_essence',    chance: 0.10 },
  ],
  [ENTITY.SWAMP_HAG]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'fire_staff',      chance: 0.06 },
    { itemId: 'mana_potion',     chance: 0.10 },
    { itemId: 'mushroom_cap',    chance: 0.10 },
    { itemId: 'spider_silk',     chance: 0.12 },
  ],
  [ENTITY.CORPSE_EATER]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'bone_club',       chance: 0.10 },
    { itemId: 'chain_mail',      chance: 0.08 },
    { itemId: 'bone_fragment',   chance: 0.15 },
  ],
  [ENTITY.GLACIAL_BEETLE]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'iron_gauntlets',  chance: 0.08 },
    { itemId: 'iron_greaves',    chance: 0.08 },
    { itemId: 'crystal_shard',   chance: 0.08 },
  ],
  [ENTITY.FLAME_DANCER]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'fire_staff',      chance: 0.08 },
    { itemId: 'fire_cloak',      chance: 0.06 },
    { itemId: 'mana_potion',     chance: 0.10 },
  ],
  [ENTITY.FROST_ARCHER]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'long_bow',        chance: 0.10 },
    { itemId: 'frost_wand',      chance: 0.06 },
    { itemId: 'iron_helm',       chance: 0.08 },
    { itemId: 'crystal_shard',   chance: 0.08 },
  ],
  [ENTITY.BONE_SENTINEL]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'iron_sword',      chance: 0.10 },
    { itemId: 'plate_armor',     chance: 0.08 },
    { itemId: 'skull_helm',      chance: 0.10 },
    { itemId: 'bone_fragment',   chance: 0.20 },
  ],
  [ENTITY.THUNDER_LIZARD]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'war_axe',         chance: 0.10 },
    { itemId: 'chain_mail',      chance: 0.10 },
    { itemId: 'iron_greaves',    chance: 0.10 },
    { itemId: 'strength_potion', chance: 0.08 },
    { itemId: 'iron_ore',        chance: 0.15 },
  ],
  [ENTITY.STONE_GARGOYLE]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'steel_blade',     chance: 0.08 },
    { itemId: 'iron_gauntlets',  chance: 0.10 },
    { itemId: 'iron_greaves',    chance: 0.10 },
    { itemId: 'iron_ore',        chance: 0.20 },
    { itemId: 'crystal_shard',   chance: 0.10 },
  ],
  [ENTITY.IRON_REVENANT]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'steel_blade',     chance: 0.10 },
    { itemId: 'plate_armor',     chance: 0.10 },
    { itemId: 'spiked_gloves',   chance: 0.08 },
    { itemId: 'iron_ore',        chance: 0.25 },
    { itemId: 'dark_essence',    chance: 0.10 },
  ],
  [ENTITY.WAILING_BANSHEE]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'frost_wand',      chance: 0.08 },
    { itemId: 'mana_potion',     chance: 0.15 },
    { itemId: 'shadow_cape',     chance: 0.06 },
    { itemId: 'dark_essence',    chance: 0.15 },
  ],
  [ENTITY.BLOOD_GOLEM]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'war_axe',         chance: 0.10 },
    { itemId: 'plate_armor',     chance: 0.08 },
    { itemId: 'regen_potion',    chance: 0.10 },
    { itemId: 'dark_essence',    chance: 0.15 },
    { itemId: 'bone_fragment',   chance: 0.15 },
  ],
  [ENTITY.VOID_TOUCHED]: [
    { itemId: 'major_health_pot', chance: 0.25 },
    { itemId: 'shadow_dagger',   chance: 0.08 },
    { itemId: 'mana_potion',     chance: 0.12 },
    { itemId: 'shadow_cape',     chance: 0.08 },
    { itemId: 'seer_orb',        chance: 0.06 },
    { itemId: 'dark_essence',    chance: 0.20 },
  ],
  [ENTITY.ABYSSAL_WATCHER]: [
    { itemId: 'major_health_pot', chance: 0.30 },
    { itemId: 'shadow_dagger',   chance: 0.10 },
    { itemId: 'skull_helm',      chance: 0.08 },
    { itemId: 'seer_orb',        chance: 0.08 },
    { itemId: 'shadow_hood',     chance: 0.05 },
    { itemId: 'dark_essence',    chance: 0.25 },
    { itemId: 'crystal_shard',   chance: 0.15 },
  ],
  [ENTITY.OBSIDIAN_DRAKE]: [
    { itemId: 'major_health_pot', chance: 0.35 },
    { itemId: 'inferno_axe',     chance: 0.10 },
    { itemId: 'plate_armor',     chance: 0.10 },
    { itemId: 'fire_cloak',      chance: 0.08 },
    { itemId: 'dragon_scale',    chance: 0.12 },
    { itemId: 'crystal_shard',   chance: 0.15 },
    { itemId: 'iron_ore',        chance: 0.20 },
  ],
  // Mimics
  [ENTITY.MIMIC]: [
    { itemId: 'minor_health_pot', chance: 0.50 },
    { itemId: 'iron_sword',       chance: 0.15 },
    { itemId: 'iron_helm',        chance: 0.12 },
    { itemId: 'crystal_shard',    chance: 0.20 },
  ],
  [ENTITY.GREATER_MIMIC]: [
    { itemId: 'major_health_pot', chance: 0.50 },
    { itemId: 'steel_blade',      chance: 0.15 },
    { itemId: 'plate_armor',      chance: 0.12 },
    { itemId: 'shadow_dagger',    chance: 0.10 },
    { itemId: 'crystal_shard',    chance: 0.25 },
    { itemId: 'iron_ore',         chance: 0.20 },
  ],
  [ENTITY.ANCIENT_MIMIC]: [
    { itemId: 'major_health_pot',  chance: 0.60 },
    { itemId: 'demon_slayer',      chance: 0.12 },
    { itemId: 'frostfire_staff',   chance: 0.10 },
    { itemId: 'windrunner_bow',    chance: 0.10 },
    { itemId: 'titan_helm',        chance: 0.08 },
    { itemId: 'dragonhide_plate',  chance: 0.08 },
    { itemId: 'crystal_shard',     chance: 0.30 },
    { itemId: 'guardian_relic',    chance: 0.15 },
  ],
  // Guardians
  [ENTITY.GUARDIAN_HOARDER]: [
    { itemId: 'major_health_pot',  chance: 0.80 },
    { itemId: 'excalibur',         chance: 0.08 },
    { itemId: 'demon_slayer',      chance: 0.25 },
    { itemId: 'aegis_plate',       chance: 0.10 },
    { itemId: 'titan_helm',        chance: 0.20 },
    { itemId: 'dragonhide_plate',  chance: 0.15 },
    { itemId: 'guardian_relic',    chance: 1.00 },
    { itemId: 'crystal_shard',     chance: 0.40 },
    { itemId: 'dragon_scale',      chance: 0.30 },
  ],
  [ENTITY.GUARDIAN_SENTINEL]: [
    { itemId: 'major_health_pot',   chance: 0.80 },
    { itemId: 'aegis_plate',        chance: 0.12 },
    { itemId: 'crown_of_ages',      chance: 0.08 },
    { itemId: 'boots_of_hermes',    chance: 0.10 },
    { itemId: 'plate_armor',        chance: 0.25 },
    { itemId: 'titan_helm',         chance: 0.20 },
    { itemId: 'guardian_relic',     chance: 1.00 },
    { itemId: 'iron_ore',           chance: 0.40 },
    { itemId: 'crystal_shard',      chance: 0.35 },
  ],
  [ENTITY.GUARDIAN_KEEPER]: [
    { itemId: 'major_health_pot',   chance: 0.80 },
    { itemId: 'staff_of_eternity',  chance: 0.08 },
    { itemId: 'artemis_longbow',    chance: 0.08 },
    { itemId: 'frostfire_staff',    chance: 0.20 },
    { itemId: 'windrunner_bow',     chance: 0.20 },
    { itemId: 'phoenix_cloak',      chance: 0.15 },
    { itemId: 'guardian_relic',     chance: 1.00 },
    { itemId: 'crystal_shard',      chance: 0.40 },
    { itemId: 'dark_essence',       chance: 0.30 },
  ],
  [ENTITY.KOBOLD]: [
    { itemId: 'minor_health_pot', chance: 0.30 },
    { itemId: 'rusty_sword',      chance: 0.08 },
    { itemId: 'leather_cap',      chance: 0.06 },
    { itemId: 'bone_fragment',    chance: 0.20 },
    { itemId: 'iron_ore',         chance: 0.15 },
  ],
};

// ── Bestiary Data ────────────────────────────────
export const ELEMENTS = {
  EARTH: 'EARTH', SHADOW: 'SHADOW', DEATH: 'DEATH', POISON: 'POISON',
  FIRE: 'FIRE', ARCANE: 'ARCANE', WIND: 'WIND', ICE: 'ICE', NATURE: 'NATURE',
};

export const ELEMENT_COLORS = {
  EARTH:  '#8a7a50', SHADOW: '#6a4a8a', DEATH:  '#5a6a5a', POISON: '#4a8a4a',
  FIRE:   '#e06020', ARCANE: '#6060c0', WIND:   '#60a0c0', ICE:    '#80c0e0',
  NATURE: '#4a9a4a',
};

export const MONSTER_CATEGORIES = {
  GOBLINOID:  'Goblinoid',
  UNDEAD:     'Undead',
  BEAST:      'Beast',
  NATURE:     'Nature',
  FIRE:       'Fire',
  ICE:        'Ice',
  CONSTRUCT:  'Construct',
  ARCANE:     'Arcane',
  DRAGON:     'Dragon',
  ABERRATION: 'Aberration',
  GUARDIAN:   'Guardian',
};

export const BESTIARY_INFO = {
  [ENTITY.GOBLIN]:        { name: 'Goblin',        title: 'Cave Skulker',      level: 2,  element: 'EARTH',  category: 'Goblinoid', desc: 'Small, cunning creatures that lurk in dark caves. Weak alone but dangerous in groups. Known for their glowing red eyes and crude wooden clubs.', lore: 'Born in the deepest tunnels, goblins are scavengers by nature. They build crude warrens connected by narrow passages.', habitat: 'Goblin Caves', threat: 'Low', moves: 'Club Swing, Sneak Attack', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.ORC]:           { name: 'Orc',           title: 'Iron Tusker',       level: 5,  element: 'EARTH',  category: 'Goblinoid', desc: 'Massive, brutish warriors with thick green skin and tusked jaws. Wear crude iron armor and wield heavy axes. Territorial and aggressive.', lore: 'Orcs once roamed the surface but were driven underground by human expansion. Their rage grows with each generation.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Axe Cleave, War Cry', basePower: 4, baseHp: 14, isBoss: false },
  [ENTITY.SKELETON]:      { name: 'Skeleton',      title: 'Bone Revenant',     level: 6,  element: 'DEATH',  category: 'Undead', desc: 'Animated bones of fallen warriors, held together by dark magic. Their bony frame gives natural armor, and they feel no pain or fear.', lore: 'The cursed remains of adventurers who perished in the crypt. Bound to eternal patrol by necromantic wards.', habitat: 'Crypt', threat: 'Moderate', moves: 'Bone Strike, Shield Block', basePower: 3, baseHp: 8, isBoss: false },
  [ENTITY.SPIDER]:        { name: 'Cave Spider',   title: 'Silk Stalker',      level: 4,  element: 'POISON', category: 'Beast', desc: 'Giant arachnids the size of a dog. Fast and venomous, they strike quickly with poisoned fangs. Fragile but dangerous in numbers.', lore: 'These spiders weave vast web networks across entire cavern systems. Their silk is prized by alchemists.', habitat: 'Spider Cavern', threat: 'Low-Moderate', moves: 'Poison Bite, Web Snare', basePower: 3, baseHp: 5, isBoss: false },
  [ENTITY.TROLL]:         { name: 'Troll',         title: 'Stone Crusher',     level: 10, element: 'EARTH',  category: 'Beast', desc: 'Towering brutes with thick, regenerating hide. Immensely strong with devastating club attacks. The most physically powerful dungeon dwellers.', lore: 'Ancient creatures as old as the mountains themselves. Their hide slowly turns to stone as they age.', habitat: 'Deep Caves', threat: 'High', moves: 'Crushing Blow, Regenerate', basePower: 5, baseHp: 24, isBoss: false },
  [ENTITY.DARK_MAGE]:     { name: 'Dark Mage',     title: 'Shadow Weaver',     level: 9,  element: 'ARCANE', category: 'Arcane', desc: 'Corrupted sorcerers who delved too deep into forbidden magic. They hurl shadow bolts from range and are protected by arcane wards.', lore: 'Once scholars of the arcane academy, they sought power in forbidden tomes hidden within the crypt.', habitat: 'Crypt', threat: 'High', moves: 'Shadow Bolt, Arcane Ward', basePower: 6, baseHp: 10, isBoss: false },
  [ENTITY.BAT]:           { name: 'Cave Bat',      title: 'Echo Screamer',     level: 1,  element: 'WIND',   category: 'Beast', desc: 'Swarms of giant bats infest every corner of the caves. Weak individually but their erratic flight makes them annoying. They screech in the dark.', lore: 'Cave bats navigate using echolocation. Their screeches can disorient unwary adventurers.', habitat: 'All Caves', threat: 'Minimal', moves: 'Sonic Screech, Dive', basePower: 1, baseHp: 4, isBoss: false },
  [ENTITY.SLIME]:         { name: 'Slime',         title: 'Acid Blob',         level: 3,  element: 'POISON', category: 'Nature', desc: 'Amorphous blobs of acidic gel that dissolve organic matter. Highly resistant to physical attacks thanks to their gelatinous body. Slow but persistent.', lore: 'Slimes are byproducts of magical runoff. They mindlessly consume everything in their path.', habitat: 'Damp Caverns', threat: 'Low', moves: 'Acid Touch, Absorb', basePower: 1, baseHp: 8, isBoss: false },
  [ENTITY.WRAITH]:        { name: 'Wraith',        title: 'Soul Reaper',       level: 8,  element: 'SHADOW', category: 'Undead', desc: 'Vengeful spirits of the restless dead. They phase through walls and drain life force with their icy touch. Immune to mundane defenses.', lore: 'Wraiths are born from souls consumed by rage and regret. They haunt the places where they died.', habitat: 'Crypt', threat: 'High', moves: 'Life Drain, Phase Shift', basePower: 5, baseHp: 12, isBoss: false },
  [ENTITY.GOBLIN_SHAMAN]: { name: 'Goblin Shaman', title: 'Hex Caster',        level: 5,  element: 'ARCANE', category: 'Goblinoid', desc: 'Goblin elders who discovered crude magic. They fling hexes from afar and empower nearby goblins. More dangerous than they appear.', lore: 'Shamans learn magic from stolen scrolls and broken wands. Their spells are crude but effective.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Hex Bolt, Empower Allies', basePower: 4, baseHp: 7, isBoss: false },
  [ENTITY.MUSHROOM]:         { name: 'Fungal Guardian',   title: 'Spore Sentinel',    level: 7,  element: 'NATURE', category: 'Nature', desc: 'Sentient mushroom colonies that defend their territory with toxic spore clouds. Tough and regenerative, they thrive in damp caverns.', lore: 'Part of a vast underground mycelial network. Each guardian is merely an extension of a greater organism.', habitat: 'Mushroom Grotto', threat: 'Moderate', moves: 'Spore Cloud, Root Lash', basePower: 2, baseHp: 10, isBoss: false },
  [ENTITY.GOBLIN_BERSERKER]: { name: 'Goblin Berserker',  title: 'Frenzy Blade',      level: 5,  element: 'EARTH',  category: 'Goblinoid', desc: 'Crazed goblin wielding a massive axe with reckless abandon. Enters a frenzy in close combat, sometimes striking twice in rapid succession.', lore: 'These goblins drink a potent war-brew before battle, sending them into an unstoppable rage.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Frenzy Strike, Double Chop', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.GOBLIN_WARLORD]:   { name: 'Goblin Warlord',    title: 'Warlord Supreme',   level: 12, element: 'EARTH',  category: 'Goblinoid', desc: 'A massive goblin chieftain clad in stolen armor. Commands lesser goblins through brute force and cunning. Double-strikes with terrifying speed.', lore: 'Rose to power by defeating every rival in single combat. Wears trophies from fallen adventurers.', habitat: 'Goblin Throne Room', threat: 'Very High', moves: 'Double Strike, Rally Goblins, Armor Slam', basePower: 6, baseHp: 40, isBoss: true },
  [ENTITY.SPIDER_QUEEN]:     { name: 'Spider Queen',      title: 'Broodmother',       level: 15, element: 'POISON', category: 'Beast', desc: 'The enormous matriarch of the spider nest. Her venomous bite is legendary, and webs fill the chamber around her throne.', lore: 'The queen has lived for centuries, growing ever larger. Her brood spans the entire cavern system.', habitat: 'Spider Throne', threat: 'Very High', moves: 'Venom Fang, Web Prison, Summon Brood', basePower: 7, baseHp: 35, isBoss: true },
  [ENTITY.LICH]:             { name: 'Lich',              title: 'Dread Archon',      level: 20, element: 'DEATH',  category: 'Undead', desc: 'An undead sorcerer who traded mortality for dark power. Hurls necrotic bolts that bypass armor and drain the very life force of victims.', lore: 'Once the crypt\'s head priest, he performed the forbidden ritual of undeath to guard its secrets forever.', habitat: 'Inner Sanctum', threat: 'Extreme', moves: 'Necrotic Bolt, Soul Siphon, Dark Resurrection', basePower: 9, baseHp: 30, isBoss: true },
  [ENTITY.MYCELIUM_LORD]:    { name: 'Mycelium Lord',     title: 'Fungal Titan',      level: 18, element: 'NATURE', category: 'Nature', desc: 'A towering fungal titan connected to the entire grotto. Regenerates rapidly through its mycelial network and crushes intruders with massive tendrils.', lore: 'The consciousness of the entire grotto made manifest. It has grown for a thousand years undisturbed.', habitat: 'Heart of the Grotto', threat: 'Extreme', moves: 'Tendril Crush, Spore Eruption, Regenerate', basePower: 5, baseHp: 45, isBoss: true },
  [ENTITY.FIRE_ELEMENTAL]:   { name: 'Fire Elemental',    title: 'Inferno Lord',      level: 22, element: 'FIRE',   category: 'Fire', desc: 'A living inferno of pure flame, born from the scorched depths. Blasts fire in all directions and incinerates anything that draws near.', lore: 'Summoned by ancient dwarven smiths to power their great forges, now unbound and consumed by rage.', habitat: 'Scorched Core', threat: 'Extreme', moves: 'Flame Blast, Inferno Wave, Molten Eruption', basePower: 8, baseHp: 38, isBoss: true },
  [ENTITY.FROST_GIANT]:      { name: 'Frost Giant',       title: 'Glacial Warden',    level: 25, element: 'ICE',    category: 'Ice', desc: 'A colossal being of ice and fury dwelling in the frozen halls. Ground-shaking slams can crush adventurers instantly. Nearly impervious to damage.', lore: 'The last of the frost giants, frozen in slumber for eons. Awakened by the tremors of deep mining.', habitat: 'Frozen Throne', threat: 'Extreme', moves: 'Ground Slam, Frost Breath, Avalanche', basePower: 7, baseHp: 50, isBoss: true },
  // Wave 1 monsters
  [ENTITY.GOBLIN_SCOUT]:     { name: 'Goblin Scout',      title: 'Tunnel Runner',     level: 1,  element: 'EARTH',  category: 'Goblinoid', desc: 'A nimble goblin trained in reconnaissance. Darts through tunnels with surprising speed, alerting larger threats to intruders.', lore: 'Scouts are chosen from the smallest goblins, prized for their ability to squeeze through narrow crevices.', habitat: 'Goblin Caves', threat: 'Low', moves: 'Quick Jab, Alert Call', basePower: 2, baseHp: 5, isBoss: false },
  [ENTITY.GOBLIN_CHIEF]:     { name: 'Goblin Chief',      title: 'Ironhide Tyrant',   level: 12, element: 'EARTH',  category: 'Goblinoid', desc: 'A battle-scarred goblin who rules through intimidation and cunning. Wears a patchwork of stolen armor and wields a jagged iron blade.', lore: 'The chief earned his throne by defeating a dozen challengers in a single night. His scars are his crown.', habitat: 'Goblin Stronghold', threat: 'Very High', moves: 'Iron Slash, War Stomp, Rally Troops', basePower: 6, baseHp: 35, isBoss: true },
  [ENTITY.CAVE_CRAWLER]:     { name: 'Cave Crawler',      title: 'Skittering Horror',  level: 2,  element: 'POISON', category: 'Beast', desc: 'A giant centipede-like creature with dozens of legs and venomous mandibles. Scuttles across walls and ceilings with unsettling speed.', lore: 'Cave crawlers shed their exoskeletons monthly. The discarded husks litter the tunnels like hollow ghosts.', habitat: 'Spider Cavern', threat: 'Low', moves: 'Mandible Bite, Wall Skitter', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.VENOM_SPITTER]:    { name: 'Venom Spitter',     title: 'Acid Archer',       level: 3,  element: 'POISON', category: 'Beast', desc: 'A bloated spider that launches globs of corrosive venom from a distance. Its sacs pulse with a sickly green glow in the darkness.', lore: 'Evolved to hunt from safety, these spiders dissolve prey before approaching. Their venom eats through iron.', habitat: 'Spider Cavern', threat: 'Low-Moderate', moves: 'Venom Spit, Acid Pool', basePower: 3, baseHp: 4, isBoss: false },
  [ENTITY.COCOON_HORROR]:    { name: 'Cocoon Horror',     title: 'Silk Abomination',  level: 6,  element: 'POISON', category: 'Beast', desc: 'A nightmarish fusion of multiple creatures wrapped in thick webbing. Bursts from cocoons when prey draws near, striking with multiple limbs.', lore: 'The Spider Queen feeds captured adventurers to her brood. What emerges is neither spider nor human.', habitat: 'Spider Cavern', threat: 'Moderate', moves: 'Limb Flurry, Web Burst, Paralyzing Shriek', basePower: 4, baseHp: 12, isBoss: false },
  [ENTITY.ZOMBIE]:           { name: 'Zombie',            title: 'Shambling Corpse',  level: 3,  element: 'DEATH',  category: 'Undead', desc: 'A rotting corpse animated by lingering necromantic energy. Slow but relentless, it feels no pain and never tires.', lore: 'The crypt\'s failed experiments in resurrection. These mindless husks wander endlessly, drawn to the warmth of the living.', habitat: 'Crypt', threat: 'Low', moves: 'Claw Swipe, Infectious Bite', basePower: 2, baseHp: 8, isBoss: false },
  [ENTITY.BONE_ARCHER]:      { name: 'Bone Archer',       title: 'Marrow Shot',       level: 5,  element: 'DEATH',  category: 'Undead', desc: 'A skeleton reassembled with a crude bow made of ribs and sinew. Fires sharpened bone shards from the shadows with eerie precision.', lore: 'These skeletons retain muscle memory from life. The best archers in death were the finest marksmen alive.', habitat: 'Crypt', threat: 'Moderate', moves: 'Bone Arrow, Ricochet Shot', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.PHANTOM]:          { name: 'Phantom',           title: 'Fading Echo',       level: 7,  element: 'SHADOW', category: 'Undead', desc: 'A translucent apparition that flickers between visibility. Its touch drains warmth and willpower, leaving victims in a stupor.', lore: 'Phantoms are the echoes of souls torn from their bodies by violent death. They seek to feel alive again.', habitat: 'Crypt', threat: 'Moderate', moves: 'Spectral Touch, Fade, Chill Aura', basePower: 4, baseHp: 10, isBoss: false },
  [ENTITY.DEATH_KNIGHT]:     { name: 'Death Knight',      title: 'Dread Champion',    level: 12, element: 'DEATH',  category: 'Undead', desc: 'A heavily armored undead warrior wielding a cursed greatsword. Once a noble paladin, now enslaved by dark magic to guard the crypt forever.', lore: 'The knight remembers fragments of honor. In rare moments of clarity, a mournful wail escapes its helm.', habitat: 'Crypt', threat: 'High', moves: 'Cursed Cleave, Shield Wall, Dark Charge', basePower: 6, baseHp: 20, isBoss: false },
  [ENTITY.NECROMANCER]:      { name: 'Necromancer',       title: 'Bone Caller',       level: 11, element: 'DEATH',  category: 'Arcane', desc: 'A robed figure crackling with necrotic energy. Raises fallen enemies to fight again and hurls bolts of pure death from skeletal hands.', lore: 'Apprentices who followed the Lich into darkness. They serve willingly, hoping to one day achieve undeath.', habitat: 'Crypt', threat: 'High', moves: 'Death Bolt, Raise Dead, Bone Shield', basePower: 7, baseHp: 14, isBoss: false },
  [ENTITY.SPORE_WALKER]:     { name: 'Spore Walker',      title: 'Pollen Drifter',    level: 3,  element: 'NATURE', category: 'Nature', desc: 'A shambling mass of fungal growth on two stumpy legs. Releases clouds of hallucinogenic spores that confuse and disorient prey.', lore: 'Spore walkers are the mycelial network\'s immune system, hunting down anything that threatens the grotto.', habitat: 'Mushroom Grotto', threat: 'Low', moves: 'Spore Puff, Stumble Slam', basePower: 2, baseHp: 7, isBoss: false },
  [ENTITY.TOXIC_TOAD]:       { name: 'Toxic Toad',        title: 'Bile Croaker',      level: 3,  element: 'POISON', category: 'Beast', desc: 'A massive amphibian covered in pustules of toxic slime. Its croak sends ripples of nausea through nearby creatures.', lore: 'These toads thrive in the damp grotto, feeding on mushrooms that make their skin increasingly poisonous.', habitat: 'Mushroom Grotto', threat: 'Low', moves: 'Toxic Tongue, Bile Splash', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.VINE_LURKER]:      { name: 'Vine Lurker',       title: 'Creeping Snare',    level: 5,  element: 'NATURE', category: 'Nature', desc: 'A predatory plant that disguises itself as harmless foliage. Lashes out with barbed vines to drag victims into its thorny embrace.', lore: 'Vine lurkers evolved alongside the mycelial network. They share nutrients with the fungal collective.', habitat: 'Mushroom Grotto', threat: 'Moderate', moves: 'Vine Lash, Root Snare, Thorn Embrace', basePower: 3, baseHp: 9, isBoss: false },
  [ENTITY.MOSS_GOLEM]:       { name: 'Moss Golem',        title: 'Living Cairn',      level: 10, element: 'NATURE', category: 'Construct', desc: 'A towering construct of stone and moss animated by the grotto\'s collective will. Incredibly durable and capable of devastating slam attacks.', lore: 'Moss golems form when the mycelial network detects a significant threat. They crumble once the danger passes.', habitat: 'Mushroom Grotto', threat: 'High', moves: 'Boulder Slam, Moss Shield, Regenerate', basePower: 4, baseHp: 22, isBoss: false },
  [ENTITY.FIRE_IMP]:         { name: 'Fire Imp',          title: 'Cinder Trickster',  level: 4,  element: 'FIRE',   category: 'Fire', desc: 'A small, cackling demon wreathed in flickering flames. Hurls fireballs with reckless glee and dances between attacks.', lore: 'Fire imps are drawn to volcanic vents from the lower planes. They delight in burning anything they find.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Fire Toss, Ember Dance', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.LAVA_HOUND]:       { name: 'Lava Hound',        title: 'Molten Tracker',    level: 7,  element: 'FIRE',   category: 'Fire', desc: 'A hulking canine forged from cooling magma. Its bite sears flesh and its footsteps leave smoldering prints in solid stone.', lore: 'Lava hounds are born from pools of cooling magma. They hunt in packs, herding prey toward volcanic fissures.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Searing Bite, Magma Howl, Flame Charge', basePower: 4, baseHp: 14, isBoss: false },
  [ENTITY.ASH_WRAITH]:       { name: 'Ash Wraith',        title: 'Cinder Specter',    level: 9,  element: 'FIRE',   category: 'Fire', desc: 'The burning ghost of a creature consumed by volcanic fire. Trails ash and embers as it drifts through the scorched corridors.', lore: 'When creatures die in the scorched depths, their agony sometimes crystallizes into these vengeful spirits.', habitat: 'Scorched Depths', threat: 'High', moves: 'Ash Cloud, Ember Touch, Immolate', basePower: 6, baseHp: 15, isBoss: false },
  [ENTITY.MAGMA_GOLEM]:      { name: 'Magma Golem',       title: 'Molten Colossus',   level: 11, element: 'FIRE',   category: 'Construct', desc: 'A massive humanoid of semi-molten rock. Lava oozes from cracks in its obsidian shell, and its fists can shatter stone walls.', lore: 'Ancient dwarven constructs designed to work the deepest forges. With no masters left, they attack all intruders.', habitat: 'Scorched Depths', threat: 'High', moves: 'Lava Fist, Eruption, Molten Shell', basePower: 5, baseHp: 20, isBoss: false },
  [ENTITY.INFERNAL_MAGE]:    { name: 'Infernal Mage',     title: 'Flame Weaver',      level: 11, element: 'FIRE',   category: 'Arcane', desc: 'A sorcerer who has merged with infernal fire, their body half-consumed by living flame. Casts devastating fire spells from a distance.', lore: 'These mages sought to master fire but were mastered by it instead. Their humanity burns away more each day.', habitat: 'Scorched Depths', threat: 'High', moves: 'Infernal Bolt, Fire Wall, Pyroclasm', basePower: 7, baseHp: 12, isBoss: false },
  [ENTITY.EMBER_BAT]:        { name: 'Ember Bat',         title: 'Spark Wing',        level: 2,  element: 'FIRE',   category: 'Beast', desc: 'A bat with wings that glow like hot coals. Swoops through the scorched tunnels leaving trails of sparks in the superheated air.', lore: 'Ember bats evolved in volcanic caves, their wings hardened by centuries of extreme heat into living embers.', habitat: 'Scorched Depths', threat: 'Low', moves: 'Spark Dive, Wing Scorch', basePower: 2, baseHp: 5, isBoss: false },
  [ENTITY.ICE_SPIDER]:       { name: 'Ice Spider',        title: 'Frost Weaver',      level: 3,  element: 'ICE',    category: 'Beast', desc: 'A pale spider adapted to frozen caves. Its webs are made of crystallized ice that shatters into razor shards when disturbed.', lore: 'Ice spiders spin webs that never decay in the frozen halls. Some webs are centuries old, filling entire passages.', habitat: 'Frozen Halls', threat: 'Low', moves: 'Frost Bite, Ice Web', basePower: 3, baseHp: 6, isBoss: false },
  [ENTITY.FROST_WRAITH]:     { name: 'Frost Wraith',      title: 'Frozen Specter',    level: 8,  element: 'ICE',    category: 'Ice', desc: 'A wraith bound to the frozen halls, trailing crystals of supernatural ice. Its presence drops the temperature to deadly levels.', lore: 'These spirits were once explorers who froze to death in the halls. Their regret keeps them tethered to the ice.', habitat: 'Frozen Halls', threat: 'High', moves: 'Freezing Touch, Blizzard Veil, Ice Drain', basePower: 5, baseHp: 11, isBoss: false },
  [ENTITY.FROZEN_SENTINEL]:  { name: 'Frozen Sentinel',   title: 'Glacial Guardian',  level: 10, element: 'ICE',    category: 'Construct', desc: 'A towering suit of ice-encrusted armor animated by ancient frost magic. Moves with grinding slowness but hits with the force of an avalanche.', lore: 'Built by the frost giant to guard his domain. Each sentinel is carved from a single block of enchanted glacier ice.', habitat: 'Frozen Halls', threat: 'High', moves: 'Glacier Smash, Frost Armor, Ice Slam', basePower: 5, baseHp: 18, isBoss: false },
  [ENTITY.SNOW_WOLF]:        { name: 'Snow Wolf',         title: 'Pale Fang',         level: 3,  element: 'ICE',    category: 'Beast', desc: 'A large wolf with fur as white as fresh snow and eyes like chips of blue ice. Hunts in packs with deadly coordination.', lore: 'Snow wolves are the only warm-blooded creatures that thrive in the frozen halls. They serve the frost giant as loyal guardians.', habitat: 'Frozen Halls', threat: 'Low-Moderate', moves: 'Frost Bite, Pack Howl', basePower: 3, baseHp: 7, isBoss: false },
  [ENTITY.ICE_MAGE]:         { name: 'Ice Mage',          title: 'Glacier Sage',      level: 9,  element: 'ICE',    category: 'Arcane', desc: 'A spellcaster who has mastered cryomancy. Encases victims in ice and shatters them with follow-up blasts of frozen magic.', lore: 'These mages came to study the frost giant and were seduced by the perfection of absolute cold.', habitat: 'Frozen Halls', threat: 'High', moves: 'Ice Lance, Freeze Ray, Shatter', basePower: 6, baseHp: 12, isBoss: false },
  [ENTITY.SHADOW_STALKER]:   { name: 'Shadow Stalker',    title: 'Umbral Hunter',     level: 7,  element: 'SHADOW', category: 'Arcane', desc: 'A creature made of living shadow that slips between darkness and reality. Strikes from blind spots with razor-sharp claws of condensed darkness.', lore: 'Shadow stalkers are born in places where darkness has pooled for centuries. They feed on fear and light.', habitat: 'Deep Caves', threat: 'Moderate', moves: 'Shadow Strike, Vanish, Dark Rend', basePower: 5, baseHp: 10, isBoss: false },
  [ENTITY.CRYSTAL_GOLEM]:    { name: 'Crystal Golem',     title: 'Prismatic Warden',  level: 11, element: 'ARCANE', category: 'Construct', desc: 'A golem carved from massive crystals that refract light into blinding rainbows. Its crystalline body is nearly indestructible and deflects magic.', lore: 'Ancient arcane constructs built to guard treasure vaults. The crystals that form their body amplify magical energy.', habitat: 'Deep Caves', threat: 'High', moves: 'Crystal Smash, Prismatic Beam, Reflect', basePower: 5, baseHp: 22, isBoss: false },
  [ENTITY.DEMON_LORD]:       { name: 'Demon Lord',        title: 'Archfiend',         level: 24, element: 'FIRE',   category: 'Dragon', desc: 'A towering demon wreathed in hellfire with massive horns and wings of shadow. Commands infernal legions and wields devastating dark fire magic.', lore: 'Sealed beneath the dungeon millennia ago by a coalition of heroes. The weakening wards have allowed him to stir.', habitat: 'Infernal Sanctum', threat: 'Extreme', moves: 'Hellfire Blast, Shadow Flame, Demon Summon, Infernal Roar', basePower: 9, baseHp: 55, isBoss: true },
  [ENTITY.DRAGON_WHELP]:     { name: 'Dragon Whelp',      title: 'Young Flame',       level: 8,  element: 'FIRE',   category: 'Dragon', desc: 'A juvenile dragon the size of a horse, already capable of breathing scorching flames. Aggressive and territorial despite its youth.', lore: 'Dragon whelps are sent into dungeons by their parents to hunt and grow strong. Only the fiercest survive.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Fire Breath, Claw Rake, Tail Swipe', basePower: 5, baseHp: 16, isBoss: false },
  [ENTITY.ANCIENT_WYRM]:     { name: 'Ancient Wyrm',      title: 'World Ender',       level: 28, element: 'FIRE',   category: 'Dragon', desc: 'A dragon of immense age and terrible power. Its scales are harder than adamantine, and its breath can melt stone. The apex predator of the deep.', lore: 'This wyrm has slumbered beneath the mountain since before recorded history. Its dreams shape the very tunnels around it.', habitat: 'Dragon\'s Maw', threat: 'Extreme', moves: 'Inferno Breath, Tail Crush, Wing Gale, Ancient Fury', basePower: 10, baseHp: 60, isBoss: true },
  // Wave 2 monsters
  [ENTITY.PLAGUE_RAT]:       { name: 'Plague Rat',        title: 'Filth Carrier',     level: 1,  element: 'POISON', category: 'Beast', desc: 'An oversized rat with matted fur and weeping sores. Carries a host of diseases that weaken prey over time.', lore: 'Plague rats thrive in the refuse of dungeon dwellers. Their numbers multiply exponentially in dark, warm places.', habitat: 'Spider Cavern', threat: 'Low', moves: 'Diseased Bite, Swarm Rush', basePower: 2, baseHp: 5, isBoss: false },
  [ENTITY.MYCONID_SPROUT]:   { name: 'Myconid Sprout',    title: 'Tiny Bloom',        level: 1,  element: 'NATURE', category: 'Nature', desc: 'A small, freshly sprouted mushroom creature with stubby legs. Weak but releases a puff of spores when threatened.', lore: 'The youngest of the mycelial network\'s children. They wander freely, spreading spores to new territory.', habitat: 'Mushroom Grotto', threat: 'Minimal', moves: 'Spore Puff, Headbutt', basePower: 1, baseHp: 4, isBoss: false },
  [ENTITY.SAND_SCORPION]:    { name: 'Sand Scorpion',     title: 'Dust Stinger',      level: 3,  element: 'EARTH',  category: 'Beast', desc: 'A large scorpion adapted to dry cave floors. Its armored shell deflects glancing blows, and its stinger delivers a numbing venom.', lore: 'Sand scorpions burrow into loose gravel and ambush prey. Their venom paralyzes small creatures instantly.', habitat: 'Goblin Caves', threat: 'Low-Moderate', moves: 'Sting, Pincer Crush', basePower: 3, baseHp: 7, isBoss: false },
  [ENTITY.VILE_SHAMAN]:      { name: 'Vile Shaman',       title: 'Curse Howler',      level: 4,  element: 'ARCANE', category: 'Goblinoid', desc: 'A hunched goblin draped in fetishes and bones. Mutters dark incantations that sap the strength of enemies nearby.', lore: 'Vile shamans practice a corrupted form of magic learned from intercepted necromantic scrolls.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Curse Bolt, Hex Cloud', basePower: 3, baseHp: 6, isBoss: false },
  [ENTITY.BLOOD_BAT]:        { name: 'Blood Bat',         title: 'Crimson Fang',      level: 4,  element: 'DEATH',  category: 'Undead', desc: 'An unnaturally large bat with glowing crimson eyes and razor fangs. Drains blood from victims to sustain its unnatural life.', lore: 'Blood bats are created when cave bats feed on corpses tainted by necromantic energy. They hunger endlessly.', habitat: 'Crypt', threat: 'Low-Moderate', moves: 'Blood Drain, Screech Dive', basePower: 3, baseHp: 6, isBoss: false },
  [ENTITY.DARK_ACOLYTE]:     { name: 'Dark Acolyte',      title: 'Shadow Initiate',   level: 6,  element: 'ARCANE', category: 'Arcane', desc: 'A young sorcerer in dark robes, still learning the forbidden arts. Casts weak shadow bolts but compensates with zealous aggression.', lore: 'Acolytes are drawn to the crypt by whispers of the Lich. They trade their humanity for scraps of dark knowledge.', habitat: 'Crypt', threat: 'Moderate', moves: 'Shadow Bolt, Dark Ward', basePower: 4, baseHp: 9, isBoss: false },
  [ENTITY.SWAMP_HAG]:        { name: 'Swamp Hag',         title: 'Bog Witch',         level: 7,  element: 'NATURE', category: 'Nature', desc: 'A twisted humanoid figure covered in moss and fungi. Brews toxic potions in bubbling cauldrons and hurls them at intruders.', lore: 'Swamp hags are corrupted druids who merged with the fungal network. They serve the Mycelium Lord willingly.', habitat: 'Mushroom Grotto', threat: 'Moderate', moves: 'Poison Brew, Root Bind, Fungal Curse', basePower: 4, baseHp: 11, isBoss: false },
  [ENTITY.CORPSE_EATER]:     { name: 'Corpse Eater',      title: 'Grave Glutton',     level: 5,  element: 'DEATH',  category: 'Undead', desc: 'A bloated, ghoulish creature that feeds on the dead. Its claws are caked with grave dirt and its bite carries the rot of the tomb.', lore: 'Corpse eaters lurk near battlefields within the crypt, growing stronger with each body they consume.', habitat: 'Crypt', threat: 'Moderate', moves: 'Rending Claws, Devour, Grave Stench', basePower: 3, baseHp: 10, isBoss: false },
  [ENTITY.GLACIAL_BEETLE]:   { name: 'Glacial Beetle',    title: 'Frost Shell',       level: 5,  element: 'ICE',    category: 'Beast', desc: 'A large beetle with a shell of living ice. Nearly impervious to physical attacks from the front, it charges with surprising speed.', lore: 'These beetles feed on ice crystals, incorporating them into their shells. Older beetles become nearly transparent.', habitat: 'Frozen Halls', threat: 'Moderate', moves: 'Ice Charge, Shell Block', basePower: 3, baseHp: 8, isBoss: false },
  [ENTITY.FLAME_DANCER]:     { name: 'Flame Dancer',      title: 'Ember Whirl',       level: 6,  element: 'FIRE',   category: 'Fire', desc: 'An elemental spirit of pure fire that moves in hypnotic, swirling patterns. Leaves trails of flame in its wake as it dances through corridors.', lore: 'Flame dancers are fragments of the Fire Elemental\'s essence that have gained a semblance of independence.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Fire Whirl, Ember Trail, Blaze Step', basePower: 5, baseHp: 9, isBoss: false },
  [ENTITY.FROST_ARCHER]:     { name: 'Frost Archer',      title: 'Ice Marksman',      level: 6,  element: 'ICE',    category: 'Ice', desc: 'An undead archer encased in a thin layer of frost. Fires arrows of crystallized ice that shatter on impact, spraying frozen shrapnel.', lore: 'These archers were among the first adventurers to challenge the Frozen Halls. Now they guard what killed them.', habitat: 'Frozen Halls', threat: 'Moderate', moves: 'Frost Arrow, Ice Volley', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.BONE_SENTINEL]:    { name: 'Bone Sentinel',     title: 'Crypt Warden',      level: 10, element: 'DEATH',  category: 'Undead', desc: 'A massive skeleton assembled from the bones of multiple warriors. Wields a heavy shield and mace, standing eternal guard at crypt doorways.', lore: 'The Lich constructs these sentinels from his finest fallen warriors, binding their bones with iron and dark magic.', habitat: 'Crypt', threat: 'High', moves: 'Mace Slam, Shield Wall, Bone Rally', basePower: 5, baseHp: 16, isBoss: false },
  [ENTITY.THUNDER_LIZARD]:   { name: 'Thunder Lizard',    title: 'Storm Scale',       level: 10, element: 'FIRE',   category: 'Beast', desc: 'A massive reptile crackling with electrical energy. Its scales shimmer with arcs of lightning and its tail strike sounds like a thunderclap.', lore: 'Thunder lizards absorb heat from volcanic vents and convert it into electrical energy stored in their scales.', habitat: 'Scorched Depths', threat: 'High', moves: 'Thunder Bite, Lightning Tail, Static Charge', basePower: 6, baseHp: 18, isBoss: false },
  [ENTITY.STONE_GARGOYLE]:   { name: 'Stone Gargoyle',    title: 'Frozen Sentinel',   level: 10, element: 'EARTH',  category: 'Construct', desc: 'A winged stone statue that comes alive when intruders approach. Its stone hide turns aside most weapons, and its claws gouge solid rock.', lore: 'Gargoyles were carved by the frost giant\'s ancient masters as watchers. They remain loyal to their long-dead creators.', habitat: 'Frozen Halls', threat: 'High', moves: 'Stone Claw, Dive Bomb, Petrify Gaze', basePower: 5, baseHp: 15, isBoss: false },
  [ENTITY.IRON_REVENANT]:    { name: 'Iron Revenant',     title: 'Forge Wraith',      level: 12, element: 'FIRE',   category: 'Construct', desc: 'The animated remains of a dwarven smith, fused with the forge they died at. Iron plates welded to bone create an unstoppable juggernaut.', lore: 'When the scorched depths consumed the dwarven forges, some smiths refused to abandon their life\'s work.', habitat: 'Scorched Depths', threat: 'High', moves: 'Iron Fist, Forge Slam, Heat Aura', basePower: 6, baseHp: 20, isBoss: false },
  [ENTITY.WAILING_BANSHEE]:  { name: 'Wailing Banshee',   title: 'Grief Herald',      level: 11, element: 'SHADOW', category: 'Undead', desc: 'A spectral woman whose piercing wail can shatter resolve and freeze blood. Her mournful cry echoes through halls, chilling the soul.', lore: 'Banshees form from the grief of those who died with unfinished business. Their wail carries centuries of sorrow.', habitat: 'Crypt', threat: 'High', moves: 'Soul Wail, Grief Touch, Haunting Cry', basePower: 7, baseHp: 12, isBoss: false },
  [ENTITY.BLOOD_GOLEM]:      { name: 'Blood Golem',       title: 'Crimson Hulk',      level: 12, element: 'DEATH',  category: 'Construct', desc: 'A towering construct of coagulated blood and bone, held together by dark magic. Regenerates from the blood of its victims.', lore: 'Blood golems are the Lich\'s masterwork — walking siege engines fueled by the life force of the fallen.', habitat: 'Crypt', threat: 'High', moves: 'Blood Slam, Drain Crush, Regenerate', basePower: 5, baseHp: 22, isBoss: false },
  [ENTITY.VOID_TOUCHED]:     { name: 'Void Touched',      title: 'Null Walker',       level: 12, element: 'SHADOW', category: 'Arcane', desc: 'A being partially consumed by the void between worlds. Reality warps around it, and its attacks bypass conventional defenses.', lore: 'Void touched were once mages who glimpsed the space between dimensions. What looked back consumed them.', habitat: 'Frozen Halls', threat: 'High', moves: 'Void Bolt, Reality Tear, Null Field', basePower: 7, baseHp: 14, isBoss: false },
  [ENTITY.ABYSSAL_WATCHER]:  { name: 'Abyssal Watcher',   title: 'Deep Eye',          level: 14, element: 'SHADOW', category: 'Arcane', desc: 'A floating mass of darkness with a single burning eye. Observes intruders from the shadows before striking with devastating psychic attacks.', lore: 'Watchers drift up from the deepest abyss beneath the dungeon. What they watch for, no one knows.', habitat: 'Deep Caves', threat: 'Very High', moves: 'Abyssal Gaze, Mind Crush, Shadow Pulse', basePower: 8, baseHp: 18, isBoss: false },
  [ENTITY.OBSIDIAN_DRAKE]:   { name: 'Obsidian Drake',    title: 'Volcanic Wyrm',     level: 14, element: 'FIRE',   category: 'Dragon', desc: 'A drake with scales of volcanic glass that reflect firelight like black mirrors. Breathes superheated gas that ignites on contact with air.', lore: 'Obsidian drakes nest in lava tubes, incubating their eggs in pools of molten rock. They are fiercely territorial.', habitat: 'Scorched Depths', threat: 'Very High', moves: 'Obsidian Breath, Glass Shard, Volcanic Charge', basePower: 7, baseHp: 24, isBoss: false },
  [ENTITY.VOID_EMPEROR]:     { name: 'Void Emperor',      title: 'Lord of the Abyss',  level: 30, element: 'SHADOW', category: 'Arcane', desc: 'The supreme entity of the void, a being of pure darkness that bends reality itself. Its shadow bolts bypass armor, and it can create mirror images of itself.', lore: 'The Void Emperor ruled the space between dimensions until a crack in reality drew it into the dungeon. It seeks to merge both realms into eternal darkness.', habitat: 'Void Throne', threat: 'Catastrophic', moves: 'Shadow Bolt, Clone Self, Double Attack, Reality Fracture', basePower: 12, baseHp: 80, isBoss: true },
  // Mimics
  [ENTITY.MIMIC]:            { name: 'Mimic',             title: 'Living Chest',       level: 4,  element: 'ARCANE', category: 'Aberration', desc: 'A predatory creature that disguises itself as a treasure chest. When an unwary adventurer reaches for its lid, powerful jaws snap shut with bone-crushing force.', lore: 'Mimics are thought to be magical constructs that escaped their creators. They reproduce by splitting — a well-fed mimic divides into two smaller ones.', habitat: 'Dungeon Rooms', threat: 'Moderate', moves: 'Jaw Snap, Sticky Tongue, Chest Slam', basePower: 5, baseHp: 25, isBoss: false },
  [ENTITY.GREATER_MIMIC]:    { name: 'Greater Mimic',     title: 'Gilded Maw',         level: 8,  element: 'ARCANE', category: 'Aberration', desc: 'A larger, more cunning mimic that has learned to coat itself in gold leaf and jewels to lure greedier prey. Its inner cavity is lined with razor-sharp teeth.', lore: 'Greater mimics are older specimens that have consumed enough treasure to grow a convincing gilded exterior. They are patient hunters, waiting months for the right victim.', habitat: 'Treasure Rooms', threat: 'High', moves: 'Golden Bite, Adhesive Trap, Treasure Lure', basePower: 8, baseHp: 45, isBoss: false },
  [ENTITY.ANCIENT_MIMIC]:    { name: 'Ancient Mimic',     title: 'Abyssal Devourer',   level: 14, element: 'SHADOW', category: 'Aberration', desc: 'A centuries-old mimic that has consumed so many adventurers that it has gained a dark intelligence. Radiates an aura of wrongness that chills the soul.', lore: 'The oldest mimics develop a rudimentary consciousness from absorbing the memories of their victims. They choose their disguises with sinister deliberation.', habitat: 'Deep Vaults', threat: 'Very High', moves: 'Soul Devour, Shadow Jaws, Reality Warp, Digest', basePower: 12, baseHp: 70, isBoss: false },
  // Guardians
  [ENTITY.GUARDIAN_HOARDER]:  { name: 'Treasure Guardian', title: 'The Hoarder',        level: 15, element: 'EARTH',  category: 'Guardian', desc: 'A massive creature that has claimed a room of treasure as its own. It sits motionless atop piles of gold, but attacks with devastating fury when its hoard is threatened.', lore: 'Hoarders were once dungeon bosses that chose to stop hunting. Instead, they lure prey with glittering treasure, waiting for greed to deliver meals to their lair.', habitat: 'Guardian Chamber', threat: 'Extreme', moves: 'Crushing Slam, Gold Scatter, Treasure Surge', basePower: 10, baseHp: 60, isBoss: false },
  [ENTITY.GUARDIAN_SENTINEL]: { name: 'Vault Sentinel',   title: 'Eternal Warden',     level: 16, element: 'EARTH',  category: 'Guardian', desc: 'An ancient construct of stone and iron, bound by forgotten magic to guard a vault for eternity. Its eyes glow with the light of ages past, and its fists can shatter walls.', lore: 'The sentinels were built by the same civilization that carved the deepest dungeons. Their creators are dust, but the sentinels remain, faithful to their eternal duty.', habitat: 'Guardian Chamber', threat: 'Extreme', moves: 'Iron Fist, Shield Bash, Sentinel Stance, Earthquake', basePower: 8, baseHp: 70, isBoss: false },
  [ENTITY.GUARDIAN_KEEPER]:   { name: 'Arcane Keeper',    title: 'Keeper of Secrets',  level: 15, element: 'ARCANE', category: 'Guardian', desc: 'A robed figure hovering above a cache of magical artifacts. It phases in and out of reality, and its spells can unravel the strongest enchantments.', lore: 'Keepers are mages who fused their souls with their collections, becoming one with the magic they hoarded. They attack with the very artifacts they protect.', habitat: 'Guardian Chamber', threat: 'Extreme', moves: 'Arcane Barrage, Relic Blast, Phase Shift, Mana Drain', basePower: 12, baseHp: 55, isBoss: false },
  // Kobold
  [ENTITY.KOBOLD]:           { name: 'Kobold',           title: 'Dragon Servant',     level: 3,  element: 'FIRE',   category: 'Dragon', desc: 'A small, scaly humanoid that worships dragons as gods. Fights with crude weapons and suicidal bravery, hoping to earn its master\'s favor.', lore: 'Kobolds build their warrens around dragon lairs, serving as lookouts, trapmakers, and living shields. They believe dying for a dragon earns rebirth as one.', habitat: "Dragon's Lair", threat: 'Low', moves: 'Claw Swipe, Javelin Toss', basePower: 3, baseHp: 12, isBoss: false },
};

// ── Monster Factions ─────────────────────────────
export const FACTION = {
  GOBLINOID:  'goblinoid',
  UNDEAD:     'undead',
  BEAST:      'beast',
  NATURE:     'nature',
  FIRE:       'fire',
  ICE:        'ice',
  CONSTRUCT:  'construct',
  ARCANE:     'arcane',
  DRAGON:     'dragon',
  ABERRATION: 'aberration',
};

export const ENTITY_FACTION = {
  // Goblinoid
  [ENTITY.GOBLIN]: FACTION.GOBLINOID, [ENTITY.ORC]: FACTION.GOBLINOID, [ENTITY.TROLL]: FACTION.GOBLINOID,
  [ENTITY.GOBLIN_SHAMAN]: FACTION.GOBLINOID, [ENTITY.GOBLIN_BERSERKER]: FACTION.GOBLINOID,
  [ENTITY.GOBLIN_SCOUT]: FACTION.GOBLINOID, [ENTITY.GOBLIN_CHIEF]: FACTION.GOBLINOID,
  [ENTITY.GOBLIN_WARLORD]: FACTION.GOBLINOID, [ENTITY.VILE_SHAMAN]: FACTION.GOBLINOID,
  // Undead
  [ENTITY.SKELETON]: FACTION.UNDEAD, [ENTITY.WRAITH]: FACTION.UNDEAD, [ENTITY.ZOMBIE]: FACTION.UNDEAD,
  [ENTITY.BONE_ARCHER]: FACTION.UNDEAD, [ENTITY.PHANTOM]: FACTION.UNDEAD,
  [ENTITY.DEATH_KNIGHT]: FACTION.UNDEAD, [ENTITY.NECROMANCER]: FACTION.UNDEAD,
  [ENTITY.DARK_ACOLYTE]: FACTION.UNDEAD, [ENTITY.CORPSE_EATER]: FACTION.UNDEAD,
  [ENTITY.BONE_SENTINEL]: FACTION.UNDEAD, [ENTITY.WAILING_BANSHEE]: FACTION.UNDEAD,
  [ENTITY.BLOOD_GOLEM]: FACTION.UNDEAD, [ENTITY.LICH]: FACTION.UNDEAD,
  // Beast
  [ENTITY.BAT]: FACTION.BEAST, [ENTITY.SPIDER]: FACTION.BEAST, [ENTITY.CAVE_CRAWLER]: FACTION.BEAST,
  [ENTITY.VENOM_SPITTER]: FACTION.BEAST, [ENTITY.COCOON_HORROR]: FACTION.BEAST,
  [ENTITY.SPIDER_QUEEN]: FACTION.BEAST, [ENTITY.PLAGUE_RAT]: FACTION.BEAST,
  [ENTITY.SAND_SCORPION]: FACTION.BEAST, [ENTITY.TOXIC_TOAD]: FACTION.BEAST,
  [ENTITY.SNOW_WOLF]: FACTION.BEAST, [ENTITY.ICE_SPIDER]: FACTION.BEAST,
  [ENTITY.BLOOD_BAT]: FACTION.BEAST, [ENTITY.THUNDER_LIZARD]: FACTION.BEAST,
  [ENTITY.EMBER_BAT]: FACTION.BEAST,
  // Nature
  [ENTITY.SLIME]: FACTION.NATURE, [ENTITY.MUSHROOM]: FACTION.NATURE, [ENTITY.SPORE_WALKER]: FACTION.NATURE,
  [ENTITY.VINE_LURKER]: FACTION.NATURE, [ENTITY.MOSS_GOLEM]: FACTION.NATURE,
  [ENTITY.MYCELIUM_LORD]: FACTION.NATURE, [ENTITY.MYCONID_SPROUT]: FACTION.NATURE,
  [ENTITY.SWAMP_HAG]: FACTION.NATURE,
  // Fire
  [ENTITY.FIRE_IMP]: FACTION.FIRE, [ENTITY.LAVA_HOUND]: FACTION.FIRE, [ENTITY.ASH_WRAITH]: FACTION.FIRE,
  [ENTITY.MAGMA_GOLEM]: FACTION.FIRE, [ENTITY.INFERNAL_MAGE]: FACTION.FIRE,
  [ENTITY.FIRE_ELEMENTAL]: FACTION.FIRE, [ENTITY.FLAME_DANCER]: FACTION.FIRE,
  // Ice
  [ENTITY.FROST_WRAITH]: FACTION.ICE, [ENTITY.FROZEN_SENTINEL]: FACTION.ICE,
  [ENTITY.FROST_GIANT]: FACTION.ICE, [ENTITY.GLACIAL_BEETLE]: FACTION.ICE,
  [ENTITY.FROST_ARCHER]: FACTION.ICE, [ENTITY.ICE_MAGE]: FACTION.ICE,
  // Construct
  [ENTITY.IRON_REVENANT]: FACTION.CONSTRUCT, [ENTITY.STONE_GARGOYLE]: FACTION.CONSTRUCT,
  [ENTITY.CRYSTAL_GOLEM]: FACTION.CONSTRUCT,
  // Arcane
  [ENTITY.DARK_MAGE]: FACTION.ARCANE, [ENTITY.VOID_TOUCHED]: FACTION.ARCANE,
  [ENTITY.ABYSSAL_WATCHER]: FACTION.ARCANE, [ENTITY.SHADOW_STALKER]: FACTION.ARCANE,
  // Dragon
  [ENTITY.DRAGON_WHELP]: FACTION.DRAGON, [ENTITY.OBSIDIAN_DRAKE]: FACTION.DRAGON,
  [ENTITY.KOBOLD]: FACTION.DRAGON, [ENTITY.ANCIENT_WYRM]: FACTION.DRAGON,
  // Aberration
  [ENTITY.MIMIC]: FACTION.ABERRATION, [ENTITY.GREATER_MIMIC]: FACTION.ABERRATION,
  [ENTITY.ANCIENT_MIMIC]: FACTION.ABERRATION,
};

export const FACTION_HOSTILITY = [
  ['goblinoid', 'undead'],    // territorial rivalry
  ['fire',      'ice'],       // elemental opposites
  ['nature',    'undead'],    // life vs death
  ['beast',     'construct'], // wild vs artificial
  ['goblinoid', 'beast'],    // goblins hunt beasts, beasts eat goblins
  ['arcane',    'nature'],    // corruption vs purity
];

export function areFactionsHostile(factionA, factionB) {
  if (!factionA || !factionB || factionA === factionB) return false;
  for (const [a, b] of FACTION_HOSTILITY) {
    if ((a === factionA && b === factionB) || (a === factionB && b === factionA)) return true;
  }
  return false;
}

// ── Ranged Attack Constants ──────────────────────
export const FIRE_SPELL_COST = 4;
export const FIRE_SPELL_RANGE = 5;
export const FIRE_SPELL_POWER = 5;
export const BOW_RANGE = 6;

// ── Map Sizes ─────────────────────────────────────
export const VILLAGE_W = 22;
export const VILLAGE_H = 16;
export const DUNGEON_W = 80;
export const DUNGEON_H = 60;

// ── Rendering ─────────────────────────────────────
export const TILE_SIZE = 48;
export const VIEW_W = 17;
export const VIEW_H = 11;

// ── Enemy AI ─────────────────────────────────────
export const GOBLIN_SIGHT_RANGE = 5;
export const ORC_SIGHT_RANGE = 6;

// ── Dungeon Gen ───────────────────────────────────
export const MIN_ROOM_SIZE = 5;
export const MAX_ROOM_SIZE = 12;
export const MAX_ROOMS = 20;

export const ITEMS_PER_FLOOR_MIN = 3;
export const ITEMS_PER_FLOOR_MAX = 6;

// ── Inventory ─────────────────────────────────────
export const BACKPACK_SIZE = 120;

// ── Boss Mapping ──────────────────────────────────
export const BOSS_FOR_THEME = {
  [FLOOR_THEME.GOBLIN_CAVE]:     ENTITY.GOBLIN_WARLORD,
  [FLOOR_THEME.SPIDER_CAVERN]:   ENTITY.SPIDER_QUEEN,
  [FLOOR_THEME.CRYPT]:           ENTITY.LICH,
  [FLOOR_THEME.MUSHROOM_GROTTO]: ENTITY.MYCELIUM_LORD,
  [FLOOR_THEME.SCORCHED_DEPTHS]: ENTITY.FIRE_ELEMENTAL,
  [FLOOR_THEME.FROZEN_HALLS]:    ENTITY.FROST_GIANT,
  [FLOOR_THEME.GOBLIN_VILLAGE]:  ENTITY.GOBLIN_WARLORD,
  [FLOOR_THEME.DRAGON_LAIR]:     ENTITY.ANCIENT_WYRM,
  [FLOOR_THEME.SWAMP_BOG]:       ENTITY.MYCELIUM_LORD,
  [FLOOR_THEME.SHADOW_REALM]:    ENTITY.LICH,
};

export const ELITE_PREFIXES = ['Savage', 'Frenzied', 'Ancient', 'Corrupted', 'Enraged', 'Cursed', 'Venomous', 'Spectral', 'Blazing', 'Frozen'];

// ── Boss QoL Skills ────────────────────────────
export const BOSS_SKILLS = {
  town_portal:  { id: 'town_portal',  name: 'Town Portal',  floor: 5,  type: 'active',  key: 'Q', desc: 'Open a portal to the village. A return portal lets you come back.' },
  gold_magnet:  { id: 'gold_magnet',  name: 'Gold Magnet',  floor: 10, type: 'passive', desc: 'Loot from kills is collected automatically.' },
  cartographer: { id: 'cartographer', name: 'Cartographer', floor: 15, type: 'passive', desc: 'Dungeon maps are fully revealed on entry.' },
  second_life:  { id: 'second_life',  name: 'Second Life',  floor: 20, type: 'passive', desc: 'Revive once on death with 50% HP.' },
};

// ── Town Upgrades ────────────────────────────────
export const TOWN_UPGRADES = {
  healer: {
    name: 'Healer',
    maxLevel: 3,
    costs: [0, 50, 150], // cost to reach level 1/2/3 (lvl 1 is free/default)
    descriptions: [
      'Heal costs 10g',
      'Heal costs 5g, cures poison',
      'Free heals, +2 regen buff (10 turns)',
    ],
  },
  shop: {
    name: 'Shop',
    maxLevel: 3,
    costs: [0, 75, 200],
    descriptions: [
      'Standard inventory',
      '+5 items, 10% discount',
      'Epic items available, 20% discount',
    ],
  },
  blacksmith: {
    name: 'Blacksmith',
    maxLevel: 3,
    costs: [0, 100, 250],
    descriptions: [
      'Standard recipes',
      'Epic tier recipes unlocked',
      'Legendary recipes, 20% cheaper crafting',
    ],
  },
  arena: {
    name: 'Arena',
    maxLevel: 3,
    costs: [0, 60, 175],
    descriptions: [
      'Standard arena rewards',
      '+50% arena gold',
      'Arena gives XP, bonus item at wave 10',
    ],
  },
};

// Additional shop items unlocked at shop upgrade level 2
export const SHOP_UPGRADE_ITEMS = [
  { itemId: 'steel_blade',     price: 65 },
  { itemId: 'plate_armor',     price: 80 },
  { itemId: 'skull_helm',      price: 55 },
  { itemId: 'shadow_cape',     price: 45 },
  { itemId: 'antidote',        price: 10 },
];

// Additional shop items unlocked at shop upgrade level 3
export const SHOP_EPIC_ITEMS = [
  { itemId: 'inferno_axe',     price: 120 },
  { itemId: 'vampiric_blade',  price: 140 },
  { itemId: 'seer_orb',        price: 110 },
  { itemId: 'fire_cloak',      price: 100 },
  { itemId: 'town_portal_scroll', price: 20 },
];

// Crafting recipes unlocked at blacksmith level 2 (Epic tier)
export const CRAFTING_RECIPES_T2 = [
  { name: 'Demon Slayer',    output: 'demon_slayer',       gold: 120, materials: { dragon_scale: 3, dark_essence: 3, iron_ore: 4 } },
  { name: 'Phoenix Cloak',   output: 'phoenix_cloak',      gold: 100, materials: { dragon_scale: 2, crystal_shard: 2, spider_silk: 3 } },
];

// Crafting recipes unlocked at blacksmith level 3 (Legendary tier)
export const CRAFTING_RECIPES_T3 = [
  { name: 'Excalibur',       output: 'excalibur',          gold: 250, materials: { dragon_scale: 5, crystal_shard: 4, iron_ore: 6 } },
  { name: 'Crown of Ages',   output: 'crown_of_ages',      gold: 200, materials: { crystal_shard: 5, dark_essence: 4, dragon_scale: 3 } },
];

// ── Phase Bosses (floors 10, 20, 30) ────────────
export const PHASE_BOSSES = {
  10: {
    type: ENTITY.DEMON_LORD,
    name: 'Demon Lord',
    phases: [
      { threshold: 1.0, mods: {}, abilities: ['melee'], msg: 'The Demon Lord draws his blade!' },
      { threshold: 0.66, mods: { power: 2 }, abilities: ['melee', 'fire_attack'], summon: { type: ENTITY.FIRE_IMP, count: 2 }, msg: 'The Demon Lord erupts in flame and summons Fire Imps!' },
      { threshold: 0.33, mods: { power: 5, armor: 2 }, abilities: ['melee', 'fire_attack', 'enrage'], msg: 'The Demon Lord enters a berserker rage!' },
    ],
  },
  20: {
    type: ENTITY.ANCIENT_WYRM,
    name: 'Ancient Dragon',
    phases: [
      { threshold: 1.0, mods: {}, abilities: ['ranged_fire'], msg: 'The Ancient Dragon roars!' },
      { threshold: 0.66, mods: { armor: 3 }, abilities: ['ranged_fire', 'ground_slam'], msg: 'The Ancient Dragon slams the ground, cracking stone!' },
      { threshold: 0.33, mods: { power: 4 }, abilities: ['ranged_fire', 'ground_slam', 'breath_weapon'], msg: 'The Ancient Dragon unleashes its breath weapon!' },
    ],
  },
  30: {
    type: ENTITY.VOID_EMPEROR,
    name: 'Void Emperor',
    phases: [
      { threshold: 1.0, mods: {}, abilities: ['shadow_bolt'], msg: 'The Void Emperor manifests from the darkness!' },
      { threshold: 0.66, mods: { armor: 2 }, abilities: ['shadow_bolt', 'clone_self'], summon: { type: ENTITY.VOID_TOUCHED, count: 2, isClone: true }, msg: 'The Void Emperor splits into mirror images!' },
      { threshold: 0.33, mods: { power: 3 }, abilities: ['shadow_bolt', 'double_attack'], msg: 'The Void Emperor attacks with blinding speed!' },
    ],
  },
};

// ── Set Items ───────────────────────────────────
export const ITEM_SETS = {
  shadow_set: {
    id: 'shadow_set', name: 'Shadow Assassin', color: '#8a4aaa',
    items: ['shadow_hood', 'shadow_vest', 'shadow_gloves', 'shadow_boots'],
    bonuses: {
      2: { label: '(2) +15% Crit Chance', effects: [{ type: 'crit_chance', value: 15 }] },
      4: { label: '(4) +5 Power, Life Steal 4', effects: [{ type: 'life_steal', value: 4 }], powerBonus: 5 },
    },
  },
  dragon_set: {
    id: 'dragon_set', name: 'Dragonscale', color: '#e06030',
    items: ['dragon_helm', 'dragon_plate', 'dragon_gauntlets', 'dragon_greaves'],
    bonuses: {
      2: { label: '(2) +4 Armor, Thorns 3', effects: [{ type: 'thorns', value: 3 }], armorBonus: 4 },
      4: { label: '(4) +6 Fire Dmg, +15 Max HP', effects: [{ type: 'fire_dmg', value: 6 }], hpBonus: 15 },
    },
  },
  arcane_set: {
    id: 'arcane_set', name: 'Arcane Sage', color: '#6060c0',
    items: ['arcane_circlet', 'arcane_robe', 'arcane_wraps'],
    bonuses: {
      2: { label: '(2) +4 Spell Dmg, +10 Max Mana', spellBonus: 4, manaBonus: 10 },
      3: { label: '(3) +20% XP, All-Seeing Eye', effects: [{ type: 'xp_boost', value: 20 }, { type: 'all_seeing_eye', value: 1 }] },
    },
  },
  holy_set: {
    id: 'holy_set', name: 'Holy Crusader', color: '#e0c040',
    items: ['holy_crown', 'holy_mail', 'holy_shield_cape', 'holy_sabatons'],
    bonuses: {
      2: { label: '(2) +3 Armor, Regen 2 HP/turn', armorBonus: 3, regenBonus: 2 },
      4: { label: '(4) +8 Max HP, Life Steal 3, +3 Power', effects: [{ type: 'life_steal', value: 3 }], hpBonus: 8, powerBonus: 3 },
    },
  },
};

// ── Prestige / New Game+ ────────────────────────
export const PRESTIGE = {
  MAX_LEVEL: 5,
  TRIGGER_FLOOR: 20,
  PER_LEVEL: { powerBonus: 2, hpBonus: 5, xpBoostPercent: 10 },
  ENEMY_SCALING: { hpMultiplier: 0.20, powerMultiplier: 0.20 },
  TITLES: { 0: '', 1: 'Veteran', 2: 'Champion', 3: 'Legend', 4: 'Mythic', 5: 'Ascendant' },
  TITLE_COLORS: { 1: '#60c060', 2: '#4488ee', 3: '#a060e0', 4: '#e0a040', 5: '#e04040' },
};

// ── Fish Loot Table ─────────────────────────────
export const FISH_LOOT = [
  { id: 'small_fish',      name: 'Small Fish',          rarity: 'common',    weight: 35, type: 'consumable', healAmount: 5,  icon: 'FC', desc: 'A small catch. Heals 5 HP.' },
  { id: 'muddy_boot',      name: 'Muddy Boot',          rarity: 'common',    weight: 25, type: 'junk',       sellValue: 2,   icon: 'FB', desc: 'An old boot. Sell for 2g.' },
  { id: 'large_fish',      name: 'Large Fish',          rarity: 'uncommon',  weight: 10, type: 'consumable', healAmount: 12, icon: 'FL', desc: 'A hearty catch. Heals 12 HP.' },
  { id: 'river_crab',      name: 'River Crab',          rarity: 'uncommon',  weight: 8,  type: 'consumable', healAmount: 8,  icon: 'FR', desc: 'Heals 8 HP, +1 armor 3 turns.', effect: { name: 'Crab Shell', stat: 'armor', amount: 1, turns: 3 } },
  { id: 'old_coin',        name: 'Old Coin',            rarity: 'uncommon',  weight: 7,  type: 'gold',       goldValue: 5,   icon: 'FG', desc: 'Worth 5 gold.' },
  { id: 'golden_fish',     name: 'Golden Fish',         rarity: 'rare',      weight: 7,  type: 'consumable', healAmount: 20, icon: 'FX', desc: 'Heals 20 HP, +2 power 10 turns.', effect: { name: 'Golden Vigor', stat: 'power', amount: 2, turns: 10 } },
  { id: 'enchanted_scale', name: 'Enchanted Scale',     rarity: 'rare',      weight: 5,  type: 'consumable', healAmount: 0,  icon: 'FS', desc: '+2 armor for 10 turns.', effect: { name: 'Scale Armor', stat: 'armor', amount: 2, turns: 10 } },
  { id: 'trident_deep',    name: 'Trident of the Deep', rarity: 'legendary', weight: 3,  type: 'equipment' },
];

// ── Arena Configuration ─────────────────────────
export const ARENA_CONFIG = {
  MAP_SIZE: 12,
  WAVE_HEAL_PERCENT: 10,
  ARENA_SPAWN_POOLS: {
    weak:   [ENTITY.GOBLIN, ENTITY.BAT, ENTITY.SLIME, ENTITY.SPIDER, ENTITY.GOBLIN_SCOUT],
    medium: [ENTITY.ORC, ENTITY.SKELETON, ENTITY.GOBLIN_SHAMAN, ENTITY.ZOMBIE, ENTITY.COCOON_HORROR],
    strong: [ENTITY.TROLL, ENTITY.DARK_MAGE, ENTITY.WRAITH, ENTITY.DEATH_KNIGHT, ENTITY.NECROMANCER],
  },
  REWARDS: {
    goldPerWave: (wave) => 10 + wave * 5,
    wave5Bonus: 50,
    wave10Bonus: 100,
    wave15PlusBonus: 50,
  },
};

// ── Room Types ──────────────────────────────────
export const ROOM_TYPE = {
  NORMAL:        'normal',
  TREASURE:      'treasure_room',
  LIBRARY:       'library',
  ARMORY:        'armory',
  FOUNTAIN:          'fountain_room',
  CRYPT_CHAMBER:     'crypt_chamber',
  GUARDIAN_CHAMBER:   'guardian_chamber',
};

// ── Den Types (Monster Breeding Dens) ─────────────
export const DEN_TYPES = {
  goblin_cave:      { name: 'Goblin War Camp',   spawnType: ENTITY.GOBLIN,       hp: 20, sprite: 'den_goblin' },
  spider_cavern:    { name: 'Spider Egg Sac',    spawnType: ENTITY.SPIDER,       hp: 15, sprite: 'den_spider' },
  crypt:            { name: 'Bone Pit',          spawnType: ENTITY.SKELETON,     hp: 25, sprite: 'den_crypt' },
  mushroom_grotto:  { name: 'Mycelium Cluster',  spawnType: ENTITY.MUSHROOM,     hp: 18, sprite: 'den_mushroom' },
  scorched_depths:  { name: 'Magma Vent',        spawnType: ENTITY.FIRE_IMP,     hp: 30, sprite: 'den_fire' },
  frozen_halls:     { name: 'Frost Nexus',       spawnType: ENTITY.FROST_WRAITH, hp: 28, sprite: 'den_ice' },
  goblin_village:   { name: 'Goblin War Camp',   spawnType: ENTITY.GOBLIN,       hp: 20, sprite: 'den_goblin' },
  dragon_lair:      { name: 'Dragon Egg Nest',   spawnType: ENTITY.KOBOLD,       hp: 35, sprite: 'den_fire' },
  swamp_bog:        { name: 'Swamp Nest',        spawnType: ENTITY.TOXIC_TOAD,   hp: 18, sprite: 'den_mushroom' },
  shadow_realm:     { name: 'Void Rift',         spawnType: ENTITY.PHANTOM,      hp: 30, sprite: 'den_crypt' },
};

// ── Guardian Names ─────────────────────────────────
export const GUARDIAN_NAMES = [
  'Grethmaw the Hoarder',
  'Sentinel of the Forgotten Vault',
  'Ironmaw the Eternal',
  'Keeper of Lost Souls',
  'Thaldris the Unyielding',
  'Warden of the Deep',
  'Calcifax the Gilded',
  'Stoneclaw the Avaricious',
  'Vorthak the Undying',
  'Aegis of the Lost Treasury',
];

export const GUARDIAN_FOR_THEME = {
  goblin_cave:     ENTITY.GUARDIAN_HOARDER,
  spider_cavern:   ENTITY.GUARDIAN_SENTINEL,
  crypt:           ENTITY.GUARDIAN_KEEPER,
  mushroom_grotto: ENTITY.GUARDIAN_HOARDER,
  scorched_depths: ENTITY.GUARDIAN_SENTINEL,
  frozen_halls:    ENTITY.GUARDIAN_KEEPER,
  goblin_village:  ENTITY.GUARDIAN_HOARDER,
  dragon_lair:     ENTITY.GUARDIAN_SENTINEL,
  swamp_bog:       ENTITY.GUARDIAN_KEEPER,
  shadow_realm:    ENTITY.GUARDIAN_KEEPER,
};

// ── Mage Spells ───────────────────────────────────
// ── Gold & Shop ──────────────────────────────────
export const GOLD_REWARDS = {
  [ENTITY.GOBLIN]:           3,
  [ENTITY.ORC]:              6,
  [ENTITY.SKELETON]:         4,
  [ENTITY.SPIDER]:           3,
  [ENTITY.TROLL]:            8,
  [ENTITY.DARK_MAGE]:        7,
  [ENTITY.BAT]:              2,
  [ENTITY.SLIME]:            2,
  [ENTITY.WRAITH]:           6,
  [ENTITY.GOBLIN_SHAMAN]:    5,
  [ENTITY.MUSHROOM]:         3,
  [ENTITY.GOBLIN_BERSERKER]: 5,
  [ENTITY.GOBLIN_WARLORD]:   30,
  [ENTITY.SPIDER_QUEEN]:     28,
  [ENTITY.LICH]:             35,
  [ENTITY.MYCELIUM_LORD]:    25,
  [ENTITY.FIRE_ELEMENTAL]:   32,
  [ENTITY.FROST_GIANT]:      38,
  // New monsters
  [ENTITY.GOBLIN_SCOUT]:     2,
  [ENTITY.CAVE_CRAWLER]:     3,
  [ENTITY.VENOM_SPITTER]:    3,
  [ENTITY.ZOMBIE]:           3,
  [ENTITY.SPORE_WALKER]:     2,
  [ENTITY.TOXIC_TOAD]:       3,
  [ENTITY.EMBER_BAT]:        2,
  [ENTITY.SNOW_WOLF]:        3,
  [ENTITY.ICE_SPIDER]:       3,
  [ENTITY.COCOON_HORROR]:    6,
  [ENTITY.BONE_ARCHER]:      5,
  [ENTITY.PHANTOM]:          6,
  [ENTITY.VINE_LURKER]:      5,
  [ENTITY.FIRE_IMP]:         4,
  [ENTITY.LAVA_HOUND]:       7,
  [ENTITY.FROST_WRAITH]:     7,
  [ENTITY.DRAGON_WHELP]:     8,
  [ENTITY.SHADOW_STALKER]:   6,
  [ENTITY.DEATH_KNIGHT]:     10,
  [ENTITY.NECROMANCER]:      9,
  [ENTITY.MOSS_GOLEM]:       8,
  [ENTITY.ASH_WRAITH]:       8,
  [ENTITY.MAGMA_GOLEM]:      10,
  [ENTITY.INFERNAL_MAGE]:    9,
  [ENTITY.FROZEN_SENTINEL]:  9,
  [ENTITY.ICE_MAGE]:         8,
  [ENTITY.CRYSTAL_GOLEM]:    10,
  [ENTITY.GOBLIN_CHIEF]:     20,
  [ENTITY.DEMON_LORD]:       30,
  [ENTITY.ANCIENT_WYRM]:     30,
  [ENTITY.VOID_EMPEROR]:     50,
  // Wave 2 monsters
  [ENTITY.PLAGUE_RAT]:       2,
  [ENTITY.MYCONID_SPROUT]:   2,
  [ENTITY.SAND_SCORPION]:    3,
  [ENTITY.VILE_SHAMAN]:      4,
  [ENTITY.BLOOD_BAT]:        3,
  [ENTITY.DARK_ACOLYTE]:     5,
  [ENTITY.SWAMP_HAG]:        6,
  [ENTITY.CORPSE_EATER]:     4,
  [ENTITY.GLACIAL_BEETLE]:   4,
  [ENTITY.FLAME_DANCER]:     5,
  [ENTITY.FROST_ARCHER]:     5,
  [ENTITY.BONE_SENTINEL]:    7,
  [ENTITY.THUNDER_LIZARD]:   8,
  [ENTITY.STONE_GARGOYLE]:   7,
  [ENTITY.IRON_REVENANT]:    9,
  [ENTITY.WAILING_BANSHEE]:  8,
  [ENTITY.BLOOD_GOLEM]:      8,
  [ENTITY.VOID_TOUCHED]:     9,
  [ENTITY.ABYSSAL_WATCHER]:  10,
  [ENTITY.OBSIDIAN_DRAKE]:   12,
  // Mimics
  [ENTITY.MIMIC]:            15,
  [ENTITY.GREATER_MIMIC]:    30,
  [ENTITY.ANCIENT_MIMIC]:    60,
  // Guardians
  [ENTITY.GUARDIAN_HOARDER]:  60,
  [ENTITY.GUARDIAN_SENTINEL]: 60,
  [ENTITY.GUARDIAN_KEEPER]:   60,
  // Kobold
  [ENTITY.KOBOLD]:           4,
};

export const HEALER_COST = 10; // gold to fully heal

export const SHOP_INVENTORY = [
  { itemId: 'minor_health_pot', price: 8 },
  { itemId: 'major_health_pot', price: 20 },
  { itemId: 'mana_potion',      price: 12 },
  { itemId: 'strength_potion',  price: 25 },
  { itemId: 'shield_potion',    price: 25 },
  { itemId: 'haste_potion',     price: 30 },
  { itemId: 'regen_potion',     price: 28 },
  { itemId: 'iron_sword',       price: 40 },
  { itemId: 'chain_mail',       price: 50 },
  { itemId: 'iron_helm',        price: 30 },
  { itemId: 'iron_gauntlets',   price: 35 },
  { itemId: 'iron_greaves',     price: 35 },
  { itemId: 'shadow_cape',      price: 40 },
  { itemId: 'long_bow',         price: 45 },
  { itemId: 'fire_staff',       price: 50 },
  { itemId: 'town_portal_scroll', price: 25 },
];

export const DUNGEON_SHOP_INVENTORY = [
  { itemId: 'minor_health_pot', price: 12 },
  { itemId: 'major_health_pot', price: 28 },
  { itemId: 'mana_potion',      price: 16 },
  { itemId: 'strength_potion',  price: 30 },
  { itemId: 'shield_potion',    price: 30 },
  { itemId: 'haste_potion',     price: 35 },
  { itemId: 'regen_potion',     price: 32 },
  { itemId: 'town_portal_scroll', price: 35 },
];

// ── Spells ───────────────────────────────────────
export const SPELLS = {
  fire_spell: {
    id: 'fire_spell', name: 'Fire Spell', key: 'f',
    manaCost: 4, damage: 5, range: 5, type: 'ranged_single',
    desc: 'Hurl a fireball at the nearest visible enemy.',
  },
  ice_shard: {
    id: 'ice_shard', name: 'Ice Shard', key: 'g',
    manaCost: 2, damage: 3, range: 6, type: 'ranged_single',
    desc: 'Launch a shard of ice at the nearest enemy.',
  },
  chain_lightning: {
    id: 'chain_lightning', name: 'Chain Lightning', key: 'h',
    manaCost: 7, damage: 4, range: 5, type: 'ranged_multi', maxTargets: 3,
    desc: 'Lightning arcs between up to 3 nearby enemies.',
  },
  heal: {
    id: 'heal', name: 'Heal', key: 'j',
    manaCost: 5, healAmount: 8, range: 0, type: 'self_heal',
    desc: 'Restore 8 HP.',
  },
};

// ── Quest Definitions ────────────────────────────
export const QUEST_TYPE = {
  KILL:       'kill',       // Kill N of enemy type
  KILL_ANY:   'kill_any',   // Kill N of any enemy
  REACH:      'reach',      // Reach floor N
  COLLECT:    'collect',    // Collect N gold
};

export const QUEST_POOL = [
  { id: 'hunt_goblins',   name: 'Goblin Hunt',       type: 'kill',     target: ENTITY.GOBLIN,    amount: 5,  goldReward: 20, xpReward: 30,  desc: 'Slay 5 Goblins' },
  { id: 'hunt_orcs',      name: 'Orc Slayer',        type: 'kill',     target: ENTITY.ORC,       amount: 3,  goldReward: 30, xpReward: 40,  desc: 'Slay 3 Orcs' },
  { id: 'hunt_spiders',   name: 'Exterminator',      type: 'kill',     target: ENTITY.SPIDER,    amount: 5,  goldReward: 18, xpReward: 25,  desc: 'Slay 5 Cave Spiders' },
  { id: 'hunt_skeletons', name: 'Bone Collector',    type: 'kill',     target: ENTITY.SKELETON,  amount: 4,  goldReward: 25, xpReward: 35,  desc: 'Slay 4 Skeletons' },
  { id: 'hunt_bats',      name: 'Bat Bane',          type: 'kill',     target: ENTITY.BAT,       amount: 6,  goldReward: 12, xpReward: 15,  desc: 'Slay 6 Cave Bats' },
  { id: 'hunt_slimes',    name: 'Ooze Cleanup',      type: 'kill',     target: ENTITY.SLIME,     amount: 4,  goldReward: 15, xpReward: 20,  desc: 'Slay 4 Slimes' },
  { id: 'hunt_wraiths',   name: 'Ghost Hunter',      type: 'kill',     target: ENTITY.WRAITH,    amount: 3,  goldReward: 35, xpReward: 50,  desc: 'Slay 3 Wraiths' },
  { id: 'hunt_trolls',    name: 'Troll Bounty',      type: 'kill',     target: ENTITY.TROLL,     amount: 2,  goldReward: 40, xpReward: 45,  desc: 'Slay 2 Trolls' },
  { id: 'hunt_mages',     name: 'Mage Hunter',       type: 'kill',     target: ENTITY.DARK_MAGE, amount: 3,  goldReward: 35, xpReward: 45,  desc: 'Slay 3 Dark Mages' },
  { id: 'hunt_mushrooms', name: 'Fungal Purge',      type: 'kill',     target: ENTITY.MUSHROOM,  amount: 4,  goldReward: 20, xpReward: 30,  desc: 'Slay 4 Fungal Guardians' },
  { id: 'massacre_10',    name: 'Bloodbath',         type: 'kill_any', target: null,             amount: 10, goldReward: 25, xpReward: 40,  desc: 'Slay 10 enemies (any type)' },
  { id: 'massacre_20',    name: 'Rampage',           type: 'kill_any', target: null,             amount: 20, goldReward: 50, xpReward: 80,  desc: 'Slay 20 enemies (any type)' },
  { id: 'reach_floor_3',  name: 'Deep Explorer',     type: 'reach',    target: 3,                amount: 3,  goldReward: 20, xpReward: 30,  desc: 'Reach dungeon floor 3' },
  { id: 'reach_floor_5',  name: 'Abyss Walker',      type: 'reach',    target: 5,                amount: 5,  goldReward: 40, xpReward: 60,  desc: 'Reach dungeon floor 5' },
  { id: 'reach_floor_8',  name: 'Depth Diver',       type: 'reach',    target: 8,                amount: 8,  goldReward: 70, xpReward: 100, desc: 'Reach dungeon floor 8' },
  { id: 'collect_50g',    name: 'Gold Rush',         type: 'collect',  target: null,             amount: 50, goldReward: 15, xpReward: 20,  desc: 'Accumulate 50 gold',   itemReward: 'minor_health_pot' },
  { id: 'collect_100g',   name: 'Fortune Seeker',    type: 'collect',  target: null,             amount: 100,goldReward: 30, xpReward: 40,  desc: 'Accumulate 100 gold',  itemReward: 'strength_potion' },
  { id: 'kill_boss',      name: 'Boss Slayer',       type: 'kill',     target: ENTITY.GOBLIN_WARLORD, amount: 1, goldReward: 60, xpReward: 80, desc: 'Defeat the Goblin Warlord', itemReward: 'oracle_helm' },
];

// ── Skill Trees ──────────────────────────────────

export const SKILL_TREES = {
  warrior: {
    might: {
      name: 'Might',
      skills: [
        { id: 'power_strike', name: 'Power Strike', maxRank: 3, type: 'passive',
          desc: ['10% chance for double melee damage', '20% chance for double melee damage', '30% chance for double melee damage'],
          icon: '⚔' },
        { id: 'cleave', name: 'Cleave', maxRank: 3, type: 'active', key: 'F', cooldown: 5,
          desc: ['Hit adjacent enemies for 50% damage', 'Hit adjacent enemies for 75% damage', 'Hit adjacent enemies for 100% damage'],
          icon: '🌀', requires: 'power_strike' },
        { id: 'execute', name: 'Execute', maxRank: 1, type: 'active', key: 'G', cooldown: 6,
          desc: ['Deal 3x damage to enemies below 30% HP'],
          icon: '💀', requires: 'cleave' },
        { id: 'weapon_mastery', name: 'Weapon Mastery', maxRank: 3, type: 'passive',
          desc: ['+1 weapon damage', '+2 weapon damage', '+3 weapon damage'],
          icon: '🗡', requires: 'execute' },
        { id: 'devastating_blow', name: 'Devastating Blow', maxRank: 1, type: 'active', key: 'V', cooldown: 10,
          desc: ['Deal 5x damage and stun for 2 turns'],
          icon: '💢', requires: 'weapon_mastery' },
      ]
    },
    fortitude: {
      name: 'Fortitude',
      skills: [
        { id: 'tough_skin', name: 'Tough Skin', maxRank: 3, type: 'passive',
          desc: ['+1 armor', '+2 armor', '+3 armor'],
          icon: '🛡' },
        { id: 'battle_cry', name: 'Battle Cry', maxRank: 1, type: 'active', key: 'H', cooldown: 12,
          desc: ['Stun all visible enemies for 2 turns'],
          icon: '📯', requires: 'tough_skin' },
        { id: 'bloodlust', name: 'Bloodlust', maxRank: 3, type: 'passive',
          desc: ['Heal 3 HP on kill', 'Heal 5 HP on kill', 'Heal 8 HP on kill'],
          icon: '🩸', requires: 'tough_skin' },
        { id: 'iron_will', name: 'Iron Will', maxRank: 3, type: 'passive',
          desc: ['5% damage reduction', '10% damage reduction', '15% damage reduction'],
          icon: '🏰', requires: 'bloodlust' },
        { id: 'last_stand', name: 'Last Stand', maxRank: 1, type: 'active', key: 'B', cooldown: 20,
          desc: ['When HP < 20%, +50% damage for 5 turns'],
          icon: '🔥', requires: 'iron_will' },
      ]
    },
    // Berserker subclass branch
    fury: {
      name: 'Fury',
      subclass: 'berserker',
      skills: [
        { id: 'rage', name: 'Rage', maxRank: 3, type: 'passive',
          desc: ['+1 damage per 3 rage stacks', '+1 damage per 2 rage stacks', '+2 damage per 2 rage stacks'],
          icon: '😤' },
        { id: 'frenzy', name: 'Frenzy', maxRank: 1, type: 'active', key: 'R', cooldown: 8,
          desc: ['Attack twice per turn for 3 turns'],
          icon: '⚡', requires: 'rage' },
        { id: 'reckless_swing', name: 'Reckless Swing', maxRank: 3, type: 'active', key: 'T', cooldown: 4,
          desc: ['200% damage, take 25% recoil', '225% damage, take 20% recoil', '250% damage, take 15% recoil'],
          icon: '🪓', requires: 'rage' },
        { id: 'bloodrage', name: 'Bloodrage', maxRank: 3, type: 'passive',
          desc: ['Below 50% HP: +30% damage', 'Below 50% HP: +40% damage', 'Below 50% HP: +50% damage'],
          icon: '🩸', requires: 'reckless_swing' },
        { id: 'unstoppable', name: 'Unstoppable', maxRank: 1, type: 'active', key: 'Y', cooldown: 15,
          desc: ['Immune to stun/slow for 5 turns'],
          icon: '🛡', requires: 'bloodrage' },
      ]
    },
    // Paladin subclass branch
    holy: {
      name: 'Holy',
      subclass: 'paladin',
      skills: [
        { id: 'holy_light', name: 'Holy Light', maxRank: 3, type: 'active', key: 'R', cooldown: 6,
          desc: ['Heal 5 HP', 'Heal 8 HP', 'Heal 12 HP'],
          icon: '✨' },
        { id: 'divine_shield', name: 'Divine Shield', maxRank: 3, type: 'active', key: 'T', cooldown: 10,
          desc: ['Block next 2 hits', 'Block next 3 hits', 'Block next 4 hits'],
          icon: '🛡', requires: 'holy_light' },
        { id: 'smite', name: 'Smite', maxRank: 1, type: 'active', key: 'Y', cooldown: 5,
          desc: ['Deal 2x power as holy damage to nearest undead'],
          icon: '⚡', requires: 'holy_light' },
        { id: 'aura_of_protection', name: 'Aura of Protection', maxRank: 3, type: 'passive',
          desc: ['+1 armor aura', '+2 armor aura', '+3 armor aura'],
          icon: '🌟', requires: 'smite' },
        { id: 'resurrection', name: 'Resurrection', maxRank: 1, type: 'passive',
          desc: ['Revive once per floor with 50% HP'],
          icon: '💫', requires: 'aura_of_protection' },
      ]
    },
  },
  mage: {
    elemental: {
      name: 'Elemental',
      skills: [
        { id: 'empower', name: 'Empower', maxRank: 3, type: 'passive',
          desc: ['+2 spell damage', '+4 spell damage', '+6 spell damage'],
          icon: '🔥' },
        { id: 'frost_mastery', name: 'Frost Mastery', maxRank: 3, type: 'passive',
          desc: ['Ice shard slows 1 turn', 'Ice shard slows 2 turns', 'Ice shard slows 3 turns'],
          icon: '❄', requires: 'empower' },
        { id: 'chain_master', name: 'Chain Master', maxRank: 3, type: 'passive',
          desc: ['Chain lightning +1 target', 'Chain lightning +2 targets', 'Chain lightning +3 targets'],
          icon: '⚡', requires: 'empower' },
        { id: 'elemental_surge', name: 'Elemental Surge', maxRank: 1, type: 'active', key: 'V', cooldown: 8,
          desc: ['Next spell deals double damage'],
          icon: '💥', requires: 'chain_master' },
        { id: 'spell_echo', name: 'Spell Echo', maxRank: 3, type: 'passive',
          desc: ['10% chance to cast spell twice', '15% chance to cast spell twice', '20% chance to cast spell twice'],
          icon: '🔁', requires: 'elemental_surge' },
      ]
    },
    arcane: {
      name: 'Arcane',
      skills: [
        { id: 'mana_flow', name: 'Mana Flow', maxRank: 3, type: 'passive',
          desc: ['+5 max mana', '+10 max mana', '+15 max mana'],
          icon: '💧' },
        { id: 'spell_shield', name: 'Spell Shield', maxRank: 3, type: 'passive',
          desc: ['10% to negate damage (3 mana)', '20% to negate damage (3 mana)', '30% to negate damage (3 mana)'],
          icon: '🔮', requires: 'mana_flow' },
        { id: 'arcane_mastery', name: 'Arcane Mastery', maxRank: 3, type: 'passive',
          desc: ['All spell costs -1', 'All spell costs -2', 'All spell costs -3'],
          icon: '✨', requires: 'mana_flow' },
        { id: 'mana_surge', name: 'Mana Surge', maxRank: 3, type: 'active', key: 'B', cooldown: 8,
          desc: ['Restore 10 mana', 'Restore 15 mana', 'Restore 20 mana'],
          icon: '💎', requires: 'arcane_mastery' },
        { id: 'arcane_barrier', name: 'Arcane Barrier', maxRank: 3, type: 'active', key: 'N', cooldown: 12,
          desc: ['Absorb next 10 damage', 'Absorb next 15 damage', 'Absorb next 20 damage'],
          icon: '🌀', requires: 'mana_surge' },
      ]
    },
    // Pyromancer subclass branch
    inferno: {
      name: 'Inferno',
      subclass: 'pyromancer',
      skills: [
        { id: 'ignite', name: 'Ignite', maxRank: 3, type: 'passive',
          desc: ['20% chance to burn (3 dmg/turn, 3 turns)', '30% chance to burn (3 dmg/turn, 3 turns)', '40% chance to burn (3 dmg/turn, 3 turns)'],
          icon: '🔥' },
        { id: 'fireball', name: 'Fireball', maxRank: 1, type: 'active', key: 'R', cooldown: 6,
          desc: ['AoE: hit all enemies in 2-tile radius for spell damage'],
          icon: '☄', requires: 'ignite' },
        { id: 'flame_wall', name: 'Flame Wall', maxRank: 3, type: 'active', key: 'T', cooldown: 8,
          desc: ['Create burning tiles (4 dmg)', 'Create burning tiles (6 dmg)', 'Create burning tiles (8 dmg)'],
          icon: '🧱', requires: 'fireball' },
        { id: 'combustion', name: 'Combustion', maxRank: 1, type: 'passive',
          desc: ['Burning enemies explode on death, 5 dmg to adjacent'],
          icon: '💣', requires: 'flame_wall' },
        { id: 'inferno_skill', name: 'Inferno', maxRank: 1, type: 'active', key: 'Y', cooldown: 15,
          desc: ['All visible enemies take 8 fire damage'],
          icon: '🌋', requires: 'combustion' },
      ]
    },
    // Necromancer subclass branch
    shadow: {
      name: 'Shadow',
      subclass: 'necromancer',
      skills: [
        { id: 'life_drain', name: 'Life Drain', maxRank: 3, type: 'active', key: 'R', cooldown: 4,
          desc: ['Steal 2 HP from target', 'Steal 3 HP from target', 'Steal 4 HP from target'],
          icon: '🩸' },
        { id: 'dark_pact', name: 'Dark Pact', maxRank: 3, type: 'active', key: 'T', cooldown: 6,
          desc: ['Sacrifice 5 HP, +8 spell dmg 3 turns', 'Sacrifice 5 HP, +10 spell dmg 3 turns', 'Sacrifice 5 HP, +12 spell dmg 3 turns'],
          icon: '📿', requires: 'life_drain' },
        { id: 'soul_harvest', name: 'Soul Harvest', maxRank: 3, type: 'passive',
          desc: ['Kills restore 2 mana', 'Kills restore 3 mana', 'Kills restore 5 mana'],
          icon: '👻', requires: 'life_drain' },
        { id: 'shadow_cloak', name: 'Shadow Cloak', maxRank: 3, type: 'active', key: 'Y', cooldown: 10,
          desc: ['Invisible for 2 turns', 'Invisible for 3 turns', 'Invisible for 4 turns'],
          icon: '🌑', requires: 'soul_harvest' },
        { id: 'death_mark', name: 'Death Mark', maxRank: 1, type: 'active', key: 'U', cooldown: 8,
          desc: ['Mark enemy: takes 50% more damage for 4 turns'],
          icon: '💀', requires: 'shadow_cloak' },
      ]
    },
  },
  archer: {
    marksmanship: {
      name: 'Marksmanship',
      skills: [
        { id: 'steady_aim', name: 'Steady Aim', maxRank: 3, type: 'passive',
          desc: ['+1 ranged damage', '+2 ranged damage', '+3 ranged damage'],
          icon: '🎯' },
        { id: 'multishot', name: 'Multishot', maxRank: 3, type: 'active', key: 'F', cooldown: 5,
          desc: ['Fire at 2 targets', 'Fire at 3 targets', 'Fire at all visible targets'],
          icon: '🏹', requires: 'steady_aim' },
        { id: 'headshot', name: 'Headshot', maxRank: 3, type: 'passive',
          desc: ['10% crit chance (2x damage)', '15% crit chance (2x damage)', '20% crit chance (2x damage)'],
          icon: '💥', requires: 'steady_aim' },
        { id: 'piercing_shot', name: 'Piercing Shot', maxRank: 1, type: 'active', key: 'V', cooldown: 6,
          desc: ['Arrow ignores all armor'],
          icon: '🔱', requires: 'headshot' },
        { id: 'eagle_eye', name: 'Eagle Eye', maxRank: 3, type: 'passive',
          desc: ['+1 attack range', '+2 attack range', '+3 attack range'],
          icon: '🦅', requires: 'piercing_shot' },
      ]
    },
    survival: {
      name: 'Survival',
      skills: [
        { id: 'evasion_skill', name: 'Evasion', maxRank: 3, type: 'passive',
          desc: ['+5% dodge chance', '+10% dodge chance', '+15% dodge chance'],
          icon: '💨' },
        { id: 'poison_arrow', name: 'Poison Arrow', maxRank: 3, type: 'active', key: 'G', cooldown: 4,
          desc: ['Poison for 2 dmg over 3 turns', 'Poison for 3 dmg over 3 turns', 'Poison for 4 dmg over 3 turns'],
          icon: '🧪', requires: 'evasion_skill' },
        { id: 'smoke_bomb', name: 'Smoke Bomb', maxRank: 1, type: 'active', key: 'H', cooldown: 10,
          desc: ['Invisible for 3 turns, enemies lose track'],
          icon: '💭', requires: 'evasion_skill' },
        { id: 'trap_mastery', name: 'Trap Mastery', maxRank: 3, type: 'active', key: 'B', cooldown: 6,
          desc: ['Place spike trap (5 dmg)', 'Place spike trap (8 dmg)', 'Place spike trap (12 dmg)'],
          icon: '🪤', requires: 'smoke_bomb' },
        { id: 'second_wind', name: 'Second Wind', maxRank: 3, type: 'active', key: 'N', cooldown: 15,
          desc: ['Heal 15% max HP', 'Heal 20% max HP', 'Heal 25% max HP'],
          icon: '💚', requires: 'trap_mastery' },
      ]
    },
    // Ranger subclass branch
    nature: {
      name: 'Nature',
      subclass: 'ranger',
      skills: [
        { id: 'nature_bond', name: 'Nature Bond', maxRank: 3, type: 'passive',
          desc: ['Regen 1 HP per turn', 'Regen 2 HP per turn', 'Regen 3 HP per turn'],
          icon: '🌿' },
        { id: 'entangle', name: 'Entangle', maxRank: 3, type: 'active', key: 'R', cooldown: 6,
          desc: ['Root enemy for 2 turns', 'Root enemy for 3 turns', 'Root enemy for 4 turns'],
          icon: '🌱', requires: 'nature_bond' },
        { id: 'rain_of_arrows', name: 'Rain of Arrows', maxRank: 1, type: 'active', key: 'T', cooldown: 8,
          desc: ['Hit all enemies in 3-tile radius'],
          icon: '🌧', requires: 'entangle' },
        { id: 'camouflage', name: 'Camouflage', maxRank: 3, type: 'passive',
          desc: ['+15% dodge in combat', '+20% dodge in combat', '+25% dodge in combat'],
          icon: '🍃', requires: 'rain_of_arrows' },
        { id: 'beast_companion', name: 'Beast Companion', maxRank: 3, type: 'active', key: 'Y', cooldown: 10,
          desc: ['Summon wolf (3 dmg/turn)', 'Summon wolf (4 dmg/turn)', 'Summon wolf (5 dmg/turn)'],
          icon: '🐺', requires: 'camouflage' },
      ]
    },
    // Assassin subclass branch
    shadow_arts: {
      name: 'Shadow Arts',
      subclass: 'assassin',
      skills: [
        { id: 'backstab', name: 'Backstab', maxRank: 3, type: 'passive',
          desc: ['Stealth attacks deal 3x damage', 'Stealth attacks deal 4x damage', 'Stealth attacks deal 5x damage'],
          icon: '🗡' },
        { id: 'fan_of_knives', name: 'Fan of Knives', maxRank: 3, type: 'active', key: 'R', cooldown: 5,
          desc: ['Hit all adjacent for 4 damage', 'Hit all adjacent for 6 damage', 'Hit all adjacent for 8 damage'],
          icon: '🔪', requires: 'backstab' },
        { id: 'mark_for_death', name: 'Mark for Death', maxRank: 3, type: 'active', key: 'T', cooldown: 8,
          desc: ['Target takes +25% damage 4 turns', 'Target takes +35% damage 4 turns', 'Target takes +50% damage 4 turns'],
          icon: '❌', requires: 'backstab' },
        { id: 'shadow_step', name: 'Shadow Step', maxRank: 1, type: 'active', key: 'Y', cooldown: 6,
          desc: ['Teleport behind nearest enemy within 3 tiles'],
          icon: '👤', requires: 'mark_for_death' },
        { id: 'death_lotus', name: 'Death Lotus', maxRank: 1, type: 'active', key: 'U', cooldown: 12,
          desc: ['5 attacks on random visible enemies for full damage'],
          icon: '🌸', requires: 'shadow_step' },
      ]
    },
  },
};

// ── Achievements ─────────────────────────────────

export const ACHIEVEMENTS = {
  // Combat
  first_blood:    { name: 'First Blood',    desc: 'Kill your first enemy',          icon: '🗡', category: 'combat' },
  monster_slayer: { name: 'Monster Slayer',  desc: 'Kill 50 enemies',               icon: '⚔', category: 'combat' },
  massacre:       { name: 'Massacre',        desc: 'Kill 200 enemies',              icon: '💀', category: 'combat' },
  elite_hunter:   { name: 'Elite Hunter',    desc: 'Defeat an elite enemy',         icon: '✦', category: 'combat' },
  boss_slayer:    { name: 'Boss Slayer',     desc: 'Defeat a miniboss',             icon: '👑', category: 'combat' },
  goblin_bane:    { name: 'Goblin Bane',     desc: 'Kill 20 goblins',              icon: '👺', category: 'combat' },
  undead_purger:  { name: 'Undead Purger',   desc: 'Kill 20 undead creatures',      icon: '☠', category: 'combat' },
  dragon_slayer:  { name: 'Dragon Slayer',   desc: 'Defeat a dragon-type boss',     icon: '🐉', category: 'combat' },

  // Exploration
  spelunker:      { name: 'Spelunker',       desc: 'Reach floor 5',                icon: '🕳', category: 'exploration' },
  deep_diver:     { name: 'Deep Diver',      desc: 'Reach floor 10',               icon: '⛏', category: 'exploration' },
  abyss_walker:   { name: 'Abyss Walker',    desc: 'Reach floor 20',               icon: '🌀', category: 'exploration' },
  explorer:       { name: 'Explorer',        desc: 'Discover 10 bestiary entries',  icon: '📖', category: 'exploration' },
  naturalist:     { name: 'Naturalist',      desc: 'Discover 25 bestiary entries',  icon: '📚', category: 'exploration' },
  portal_user:    { name: 'Town Portal',     desc: 'Use a portal to return to village', icon: '🌀', category: 'exploration' },

  // Progression
  level_5:        { name: 'Apprentice',      desc: 'Reach level 5',                icon: '⭐', category: 'progression' },
  level_10:       { name: 'Veteran',         desc: 'Reach level 10',               icon: '🌟', category: 'progression' },
  level_20:       { name: 'Legend',           desc: 'Reach level 20',               icon: '💫', category: 'progression' },
  first_skill:    { name: 'Talented',        desc: 'Learn your first skill',        icon: '📗', category: 'progression' },
  skill_master:   { name: 'Skill Master',    desc: 'Max out any skill',            icon: '📘', category: 'progression' },
  quest_complete: { name: 'Errand Runner',   desc: 'Complete your first quest',     icon: '📜', category: 'progression' },

  // Wealth
  wealthy:        { name: 'Wealthy',         desc: 'Accumulate 500 gold total',     icon: '💰', category: 'wealth' },
  rich:           { name: 'Rich',            desc: 'Accumulate 2000 gold total',    icon: '👑', category: 'wealth' },
  shopper:        { name: 'Shopper',         desc: 'Buy 10 items from the shop',    icon: '🛒', category: 'wealth' },

  // Collection
  collector:      { name: 'Collector',       desc: 'Discover 10 items in armory',   icon: '🎒', category: 'collection' },
  curator:        { name: 'Curator',         desc: 'Discover 25 items in armory',   icon: '🏛', category: 'collection' },
  chest_hunter:   { name: 'Chest Hunter',    desc: 'Open 10 chests',               icon: '📦', category: 'collection' },
  fully_equipped: { name: 'Fully Equipped',  desc: 'Fill all equipment slots',      icon: '🛡', category: 'collection' },

  // Special
  survivor:       { name: 'Survivor',        desc: 'Die and restart the game',      icon: '💔', category: 'special' },
  godlike:        { name: 'Godlike',         desc: 'Activate god mode',             icon: '😇', category: 'special', hidden: true },
  speed_runner:   { name: 'Speed Runner',    desc: 'Reach floor 5 in under 150 turns', icon: '⚡', category: 'special' },
  prestige_1:     { name: 'New Game+',       desc: 'Reach Prestige 1',             icon: '⭐', category: 'special' },
  prestige_5:     { name: 'Ascendant',       desc: 'Reach maximum Prestige',        icon: '👑', category: 'special' },
  master_angler:  { name: 'Master Angler',   desc: 'Catch 20 fish',                 icon: '🐟', category: 'special' },
  gladiator:      { name: 'Gladiator',       desc: 'Clear wave 5 in the arena',     icon: '⚔', category: 'combat' },
  arena_champion: { name: 'Arena Champion',  desc: 'Clear wave 10 in the arena',    icon: '🏆', category: 'combat' },
};
