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
};

// ── Player Classes ────────────────────────────────
export const PLAYER_CLASS = {
  WARRIOR: 'warrior',
  MAGE:    'mage',
  ARCHER:  'archer',
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

  // Fishing
  trident_deep:     { id: 'trident_deep',     name: 'Trident of the Deep', type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 5, icon: 'WT', desc: '+5 Power, Life Steal 2', tier: 3, features: [{ type: 'life_steal', value: 2 }] },

  // Consumables (stackable)
  minor_health_pot: { id: 'minor_health_pot', name: 'Health Potion',   type: ITEM_TYPE.CONSUMABLE, healAmount: 15, icon: 'PH', desc: 'Restore 15 HP',   stackable: true, maxStack: 20 },
  major_health_pot: { id: 'major_health_pot', name: 'Greater Health',  type: ITEM_TYPE.CONSUMABLE, healAmount: 30, icon: 'PH+', desc: 'Restore 30 HP',  stackable: true, maxStack: 20 },
  mana_potion:      { id: 'mana_potion',      name: 'Mana Potion',     type: ITEM_TYPE.CONSUMABLE, manaAmount: 10, icon: 'PM', desc: 'Restore 10 Mana', stackable: true, maxStack: 20 },
  antidote:         { id: 'antidote',          name: 'Antidote',        type: ITEM_TYPE.CONSUMABLE, curePoison: true, icon: 'PA', desc: 'Cure poison',   stackable: true, maxStack: 20 },
  // Effect potions
  strength_potion:  { id: 'strength_potion',  name: 'Str Potion',     type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Strength', stat: 'power',  amount: 3, turns: 15 }, icon: 'PS', desc: '+3 Power for 15 turns', stackable: true, maxStack: 20 },
  shield_potion:    { id: 'shield_potion',    name: 'Shield Potion',  type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Shield',   stat: 'armor',  amount: 3, turns: 15 }, icon: 'PD', desc: '+3 Armor for 15 turns', stackable: true, maxStack: 20 },
  haste_potion:     { id: 'haste_potion',     name: 'Haste Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Haste',    stat: 'haste',  amount: 1, turns: 10 }, icon: 'PF', desc: 'Double attack for 10 turns', stackable: true, maxStack: 20 },
  regen_potion:     { id: 'regen_potion',     name: 'Regen Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Regen',    stat: 'regen',  amount: 2, turns: 20 }, icon: 'PR', desc: 'Regen 2 HP/turn for 20 turns', stackable: true, maxStack: 20 },

  // ── Crafting Materials ────────────────────────
  bone_fragment:    { id: 'bone_fragment',    name: 'Bone Fragment',    type: 'material', icon: 'MB', desc: 'A shard of bone. Used in crafting.', stackable: true, maxStack: 50 },
  spider_silk:      { id: 'spider_silk',      name: 'Spider Silk',      type: 'material', icon: 'MS', desc: 'Strong silk thread. Used in crafting.', stackable: true, maxStack: 50 },
  iron_ore:         { id: 'iron_ore',         name: 'Iron Ore',         type: 'material', icon: 'MI', desc: 'Raw iron ore. Used in crafting.', stackable: true, maxStack: 50 },
  dark_essence:     { id: 'dark_essence',     name: 'Dark Essence',     type: 'material', icon: 'MD', desc: 'A wisp of dark energy. Used in crafting.', stackable: true, maxStack: 50 },
  dragon_scale:     { id: 'dragon_scale',     name: 'Dragon Scale',     type: 'material', icon: 'MR', desc: 'A shimmering scale. Used in crafting.', stackable: true, maxStack: 50 },
  crystal_shard:    { id: 'crystal_shard',    name: 'Crystal Shard',    type: 'material', icon: 'MC', desc: 'A glowing crystal. Used in crafting.', stackable: true, maxStack: 50 },
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
};

export const FLOOR_THEMES = {
  [FLOOR_THEME.GOBLIN_CAVE]: {
    name: 'Goblin Cave',
    wallTile: TILE.MOSS_WALL,
    floorTile: TILE.MOSS_FLOOR,
    spawnWeights: {
      [ENTITY.GOBLIN]: 5, [ENTITY.ORC]: 3, [ENTITY.GOBLIN_SHAMAN]: 2, [ENTITY.BAT]: 2, [ENTITY.GOBLIN_BERSERKER]: 2, [ENTITY.GOBLIN_SCOUT]: 3,
    },
    minFloor: 1,
    maxFloor: 3,
  },
  [FLOOR_THEME.SPIDER_CAVERN]: {
    name: 'Spider Cavern',
    wallTile: TILE.CAVE_WALL,
    floorTile: TILE.WEB_FLOOR,
    spawnWeights: {
      [ENTITY.SPIDER]: 6, [ENTITY.BAT]: 3, [ENTITY.SLIME]: 2, [ENTITY.CAVE_CRAWLER]: 3, [ENTITY.VENOM_SPITTER]: 2, [ENTITY.COCOON_HORROR]: 1,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.CRYPT]: {
    name: 'Ancient Crypt',
    wallTile: TILE.BONE_WALL,
    floorTile: TILE.BONE_FLOOR,
    spawnWeights: {
      [ENTITY.SKELETON]: 5, [ENTITY.WRAITH]: 2, [ENTITY.DARK_MAGE]: 1, [ENTITY.BAT]: 1, [ENTITY.ZOMBIE]: 4, [ENTITY.BONE_ARCHER]: 3, [ENTITY.PHANTOM]: 2, [ENTITY.DEATH_KNIGHT]: 1, [ENTITY.NECROMANCER]: 1,
    },
    minFloor: 2,
    maxFloor: 6,
  },
  [FLOOR_THEME.MUSHROOM_GROTTO]: {
    name: 'Mushroom Grotto',
    wallTile: TILE.MOSS_WALL,
    floorTile: TILE.MOSS_FLOOR,
    spawnWeights: {
      [ENTITY.MUSHROOM]: 4, [ENTITY.SLIME]: 3, [ENTITY.SPIDER]: 2, [ENTITY.GOBLIN]: 1, [ENTITY.SPORE_WALKER]: 3, [ENTITY.TOXIC_TOAD]: 2, [ENTITY.VINE_LURKER]: 2, [ENTITY.MOSS_GOLEM]: 1,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.SCORCHED_DEPTHS]: {
    name: 'Scorched Depths',
    wallTile: TILE.LAVA_WALL,
    floorTile: TILE.LAVA_FLOOR,
    spawnWeights: {
      [ENTITY.DARK_MAGE]: 3, [ENTITY.TROLL]: 2, [ENTITY.ORC]: 2, [ENTITY.GOBLIN_SHAMAN]: 1, [ENTITY.FIRE_IMP]: 4, [ENTITY.LAVA_HOUND]: 3, [ENTITY.ASH_WRAITH]: 2, [ENTITY.MAGMA_GOLEM]: 1, [ENTITY.INFERNAL_MAGE]: 1, [ENTITY.EMBER_BAT]: 2,
    },
    minFloor: 3,
    maxFloor: 99,
  },
  [FLOOR_THEME.FROZEN_HALLS]: {
    name: 'Frozen Halls',
    wallTile: TILE.ICE_WALL,
    floorTile: TILE.ICE_FLOOR,
    spawnWeights: {
      [ENTITY.WRAITH]: 3, [ENTITY.SKELETON]: 3, [ENTITY.SLIME]: 2, [ENTITY.TROLL]: 1, [ENTITY.ICE_SPIDER]: 3, [ENTITY.FROST_WRAITH]: 2, [ENTITY.FROZEN_SENTINEL]: 1, [ENTITY.SNOW_WOLF]: 3, [ENTITY.ICE_MAGE]: 1,
    },
    minFloor: 3,
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

export const BESTIARY_INFO = {
  [ENTITY.GOBLIN]:        { name: 'Goblin',        title: 'Cave Skulker',      level: 2,  element: 'EARTH',  desc: 'Small, cunning creatures that lurk in dark caves. Weak alone but dangerous in groups. Known for their glowing red eyes and crude wooden clubs.', lore: 'Born in the deepest tunnels, goblins are scavengers by nature. They build crude warrens connected by narrow passages.', habitat: 'Goblin Caves', threat: 'Low', moves: 'Club Swing, Sneak Attack', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.ORC]:           { name: 'Orc',           title: 'Iron Tusker',       level: 5,  element: 'EARTH',  desc: 'Massive, brutish warriors with thick green skin and tusked jaws. Wear crude iron armor and wield heavy axes. Territorial and aggressive.', lore: 'Orcs once roamed the surface but were driven underground by human expansion. Their rage grows with each generation.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Axe Cleave, War Cry', basePower: 4, baseHp: 14, isBoss: false },
  [ENTITY.SKELETON]:      { name: 'Skeleton',      title: 'Bone Revenant',     level: 6,  element: 'DEATH',  desc: 'Animated bones of fallen warriors, held together by dark magic. Their bony frame gives natural armor, and they feel no pain or fear.', lore: 'The cursed remains of adventurers who perished in the crypt. Bound to eternal patrol by necromantic wards.', habitat: 'Crypt', threat: 'Moderate', moves: 'Bone Strike, Shield Block', basePower: 3, baseHp: 8, isBoss: false },
  [ENTITY.SPIDER]:        { name: 'Cave Spider',   title: 'Silk Stalker',      level: 4,  element: 'POISON', desc: 'Giant arachnids the size of a dog. Fast and venomous, they strike quickly with poisoned fangs. Fragile but dangerous in numbers.', lore: 'These spiders weave vast web networks across entire cavern systems. Their silk is prized by alchemists.', habitat: 'Spider Cavern', threat: 'Low-Moderate', moves: 'Poison Bite, Web Snare', basePower: 3, baseHp: 5, isBoss: false },
  [ENTITY.TROLL]:         { name: 'Troll',         title: 'Stone Crusher',     level: 10, element: 'EARTH',  desc: 'Towering brutes with thick, regenerating hide. Immensely strong with devastating club attacks. The most physically powerful dungeon dwellers.', lore: 'Ancient creatures as old as the mountains themselves. Their hide slowly turns to stone as they age.', habitat: 'Deep Caves', threat: 'High', moves: 'Crushing Blow, Regenerate', basePower: 5, baseHp: 24, isBoss: false },
  [ENTITY.DARK_MAGE]:     { name: 'Dark Mage',     title: 'Shadow Weaver',     level: 9,  element: 'ARCANE', desc: 'Corrupted sorcerers who delved too deep into forbidden magic. They hurl shadow bolts from range and are protected by arcane wards.', lore: 'Once scholars of the arcane academy, they sought power in forbidden tomes hidden within the crypt.', habitat: 'Crypt', threat: 'High', moves: 'Shadow Bolt, Arcane Ward', basePower: 6, baseHp: 10, isBoss: false },
  [ENTITY.BAT]:           { name: 'Cave Bat',      title: 'Echo Screamer',     level: 1,  element: 'WIND',   desc: 'Swarms of giant bats infest every corner of the caves. Weak individually but their erratic flight makes them annoying. They screech in the dark.', lore: 'Cave bats navigate using echolocation. Their screeches can disorient unwary adventurers.', habitat: 'All Caves', threat: 'Minimal', moves: 'Sonic Screech, Dive', basePower: 1, baseHp: 4, isBoss: false },
  [ENTITY.SLIME]:         { name: 'Slime',         title: 'Acid Blob',         level: 3,  element: 'POISON', desc: 'Amorphous blobs of acidic gel that dissolve organic matter. Highly resistant to physical attacks thanks to their gelatinous body. Slow but persistent.', lore: 'Slimes are byproducts of magical runoff. They mindlessly consume everything in their path.', habitat: 'Damp Caverns', threat: 'Low', moves: 'Acid Touch, Absorb', basePower: 1, baseHp: 8, isBoss: false },
  [ENTITY.WRAITH]:        { name: 'Wraith',        title: 'Soul Reaper',       level: 8,  element: 'SHADOW', desc: 'Vengeful spirits of the restless dead. They phase through walls and drain life force with their icy touch. Immune to mundane defenses.', lore: 'Wraiths are born from souls consumed by rage and regret. They haunt the places where they died.', habitat: 'Crypt', threat: 'High', moves: 'Life Drain, Phase Shift', basePower: 5, baseHp: 12, isBoss: false },
  [ENTITY.GOBLIN_SHAMAN]: { name: 'Goblin Shaman', title: 'Hex Caster',        level: 5,  element: 'ARCANE', desc: 'Goblin elders who discovered crude magic. They fling hexes from afar and empower nearby goblins. More dangerous than they appear.', lore: 'Shamans learn magic from stolen scrolls and broken wands. Their spells are crude but effective.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Hex Bolt, Empower Allies', basePower: 4, baseHp: 7, isBoss: false },
  [ENTITY.MUSHROOM]:         { name: 'Fungal Guardian',   title: 'Spore Sentinel',    level: 7,  element: 'NATURE', desc: 'Sentient mushroom colonies that defend their territory with toxic spore clouds. Tough and regenerative, they thrive in damp caverns.', lore: 'Part of a vast underground mycelial network. Each guardian is merely an extension of a greater organism.', habitat: 'Mushroom Grotto', threat: 'Moderate', moves: 'Spore Cloud, Root Lash', basePower: 2, baseHp: 10, isBoss: false },
  [ENTITY.GOBLIN_BERSERKER]: { name: 'Goblin Berserker',  title: 'Frenzy Blade',      level: 5,  element: 'EARTH',  desc: 'Crazed goblin wielding a massive axe with reckless abandon. Enters a frenzy in close combat, sometimes striking twice in rapid succession.', lore: 'These goblins drink a potent war-brew before battle, sending them into an unstoppable rage.', habitat: 'Goblin Caves', threat: 'Moderate', moves: 'Frenzy Strike, Double Chop', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.GOBLIN_WARLORD]:   { name: 'Goblin Warlord',    title: 'Warlord Supreme',   level: 12, element: 'EARTH',  desc: 'A massive goblin chieftain clad in stolen armor. Commands lesser goblins through brute force and cunning. Double-strikes with terrifying speed.', lore: 'Rose to power by defeating every rival in single combat. Wears trophies from fallen adventurers.', habitat: 'Goblin Throne Room', threat: 'Very High', moves: 'Double Strike, Rally Goblins, Armor Slam', basePower: 6, baseHp: 40, isBoss: true },
  [ENTITY.SPIDER_QUEEN]:     { name: 'Spider Queen',      title: 'Broodmother',       level: 15, element: 'POISON', desc: 'The enormous matriarch of the spider nest. Her venomous bite is legendary, and webs fill the chamber around her throne.', lore: 'The queen has lived for centuries, growing ever larger. Her brood spans the entire cavern system.', habitat: 'Spider Throne', threat: 'Very High', moves: 'Venom Fang, Web Prison, Summon Brood', basePower: 7, baseHp: 35, isBoss: true },
  [ENTITY.LICH]:             { name: 'Lich',              title: 'Dread Archon',      level: 20, element: 'DEATH',  desc: 'An undead sorcerer who traded mortality for dark power. Hurls necrotic bolts that bypass armor and drain the very life force of victims.', lore: 'Once the crypt\'s head priest, he performed the forbidden ritual of undeath to guard its secrets forever.', habitat: 'Inner Sanctum', threat: 'Extreme', moves: 'Necrotic Bolt, Soul Siphon, Dark Resurrection', basePower: 9, baseHp: 30, isBoss: true },
  [ENTITY.MYCELIUM_LORD]:    { name: 'Mycelium Lord',     title: 'Fungal Titan',      level: 18, element: 'NATURE', desc: 'A towering fungal titan connected to the entire grotto. Regenerates rapidly through its mycelial network and crushes intruders with massive tendrils.', lore: 'The consciousness of the entire grotto made manifest. It has grown for a thousand years undisturbed.', habitat: 'Heart of the Grotto', threat: 'Extreme', moves: 'Tendril Crush, Spore Eruption, Regenerate', basePower: 5, baseHp: 45, isBoss: true },
  [ENTITY.FIRE_ELEMENTAL]:   { name: 'Fire Elemental',    title: 'Inferno Lord',      level: 22, element: 'FIRE',   desc: 'A living inferno of pure flame, born from the scorched depths. Blasts fire in all directions and incinerates anything that draws near.', lore: 'Summoned by ancient dwarven smiths to power their great forges, now unbound and consumed by rage.', habitat: 'Scorched Core', threat: 'Extreme', moves: 'Flame Blast, Inferno Wave, Molten Eruption', basePower: 8, baseHp: 38, isBoss: true },
  [ENTITY.FROST_GIANT]:      { name: 'Frost Giant',       title: 'Glacial Warden',    level: 25, element: 'ICE',    desc: 'A colossal being of ice and fury dwelling in the frozen halls. Ground-shaking slams can crush adventurers instantly. Nearly impervious to damage.', lore: 'The last of the frost giants, frozen in slumber for eons. Awakened by the tremors of deep mining.', habitat: 'Frozen Throne', threat: 'Extreme', moves: 'Ground Slam, Frost Breath, Avalanche', basePower: 7, baseHp: 50, isBoss: true },
  // New monsters
  [ENTITY.GOBLIN_SCOUT]:     { name: 'Goblin Scout',      title: 'Tunnel Runner',     level: 1,  element: 'EARTH',  desc: 'A nimble goblin trained in reconnaissance. Darts through tunnels with surprising speed, alerting larger threats to intruders.', lore: 'Scouts are chosen from the smallest goblins, prized for their ability to squeeze through narrow crevices.', habitat: 'Goblin Caves', threat: 'Low', moves: 'Quick Jab, Alert Call', basePower: 2, baseHp: 5, isBoss: false },
  [ENTITY.GOBLIN_CHIEF]:     { name: 'Goblin Chief',      title: 'Ironhide Tyrant',   level: 12, element: 'EARTH',  desc: 'A battle-scarred goblin who rules through intimidation and cunning. Wears a patchwork of stolen armor and wields a jagged iron blade.', lore: 'The chief earned his throne by defeating a dozen challengers in a single night. His scars are his crown.', habitat: 'Goblin Stronghold', threat: 'Very High', moves: 'Iron Slash, War Stomp, Rally Troops', basePower: 6, baseHp: 35, isBoss: true },
  [ENTITY.CAVE_CRAWLER]:     { name: 'Cave Crawler',      title: 'Skittering Horror',  level: 2,  element: 'POISON', desc: 'A giant centipede-like creature with dozens of legs and venomous mandibles. Scuttles across walls and ceilings with unsettling speed.', lore: 'Cave crawlers shed their exoskeletons monthly. The discarded husks litter the tunnels like hollow ghosts.', habitat: 'Spider Cavern', threat: 'Low', moves: 'Mandible Bite, Wall Skitter', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.VENOM_SPITTER]:    { name: 'Venom Spitter',     title: 'Acid Archer',       level: 3,  element: 'POISON', desc: 'A bloated spider that launches globs of corrosive venom from a distance. Its sacs pulse with a sickly green glow in the darkness.', lore: 'Evolved to hunt from safety, these spiders dissolve prey before approaching. Their venom eats through iron.', habitat: 'Spider Cavern', threat: 'Low-Moderate', moves: 'Venom Spit, Acid Pool', basePower: 3, baseHp: 4, isBoss: false },
  [ENTITY.COCOON_HORROR]:    { name: 'Cocoon Horror',     title: 'Silk Abomination',  level: 6,  element: 'POISON', desc: 'A nightmarish fusion of multiple creatures wrapped in thick webbing. Bursts from cocoons when prey draws near, striking with multiple limbs.', lore: 'The Spider Queen feeds captured adventurers to her brood. What emerges is neither spider nor human.', habitat: 'Spider Cavern', threat: 'Moderate', moves: 'Limb Flurry, Web Burst, Paralyzing Shriek', basePower: 4, baseHp: 12, isBoss: false },
  [ENTITY.ZOMBIE]:           { name: 'Zombie',            title: 'Shambling Corpse',  level: 3,  element: 'DEATH',  desc: 'A rotting corpse animated by lingering necromantic energy. Slow but relentless, it feels no pain and never tires.', lore: 'The crypt\'s failed experiments in resurrection. These mindless husks wander endlessly, drawn to the warmth of the living.', habitat: 'Crypt', threat: 'Low', moves: 'Claw Swipe, Infectious Bite', basePower: 2, baseHp: 8, isBoss: false },
  [ENTITY.BONE_ARCHER]:      { name: 'Bone Archer',       title: 'Marrow Shot',       level: 5,  element: 'DEATH',  desc: 'A skeleton reassembled with a crude bow made of ribs and sinew. Fires sharpened bone shards from the shadows with eerie precision.', lore: 'These skeletons retain muscle memory from life. The best archers in death were the finest marksmen alive.', habitat: 'Crypt', threat: 'Moderate', moves: 'Bone Arrow, Ricochet Shot', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.PHANTOM]:          { name: 'Phantom',           title: 'Fading Echo',       level: 7,  element: 'SHADOW', desc: 'A translucent apparition that flickers between visibility. Its touch drains warmth and willpower, leaving victims in a stupor.', lore: 'Phantoms are the echoes of souls torn from their bodies by violent death. They seek to feel alive again.', habitat: 'Crypt', threat: 'Moderate', moves: 'Spectral Touch, Fade, Chill Aura', basePower: 4, baseHp: 10, isBoss: false },
  [ENTITY.DEATH_KNIGHT]:     { name: 'Death Knight',      title: 'Dread Champion',    level: 12, element: 'DEATH',  desc: 'A heavily armored undead warrior wielding a cursed greatsword. Once a noble paladin, now enslaved by dark magic to guard the crypt forever.', lore: 'The knight remembers fragments of honor. In rare moments of clarity, a mournful wail escapes its helm.', habitat: 'Crypt', threat: 'High', moves: 'Cursed Cleave, Shield Wall, Dark Charge', basePower: 6, baseHp: 20, isBoss: false },
  [ENTITY.NECROMANCER]:      { name: 'Necromancer',       title: 'Bone Caller',       level: 11, element: 'DEATH',  desc: 'A robed figure crackling with necrotic energy. Raises fallen enemies to fight again and hurls bolts of pure death from skeletal hands.', lore: 'Apprentices who followed the Lich into darkness. They serve willingly, hoping to one day achieve undeath.', habitat: 'Crypt', threat: 'High', moves: 'Death Bolt, Raise Dead, Bone Shield', basePower: 7, baseHp: 14, isBoss: false },
  [ENTITY.SPORE_WALKER]:     { name: 'Spore Walker',      title: 'Pollen Drifter',    level: 3,  element: 'NATURE', desc: 'A shambling mass of fungal growth on two stumpy legs. Releases clouds of hallucinogenic spores that confuse and disorient prey.', lore: 'Spore walkers are the mycelial network\'s immune system, hunting down anything that threatens the grotto.', habitat: 'Mushroom Grotto', threat: 'Low', moves: 'Spore Puff, Stumble Slam', basePower: 2, baseHp: 7, isBoss: false },
  [ENTITY.TOXIC_TOAD]:       { name: 'Toxic Toad',        title: 'Bile Croaker',      level: 3,  element: 'POISON', desc: 'A massive amphibian covered in pustules of toxic slime. Its croak sends ripples of nausea through nearby creatures.', lore: 'These toads thrive in the damp grotto, feeding on mushrooms that make their skin increasingly poisonous.', habitat: 'Mushroom Grotto', threat: 'Low', moves: 'Toxic Tongue, Bile Splash', basePower: 2, baseHp: 6, isBoss: false },
  [ENTITY.VINE_LURKER]:      { name: 'Vine Lurker',       title: 'Creeping Snare',    level: 5,  element: 'NATURE', desc: 'A predatory plant that disguises itself as harmless foliage. Lashes out with barbed vines to drag victims into its thorny embrace.', lore: 'Vine lurkers evolved alongside the mycelial network. They share nutrients with the fungal collective.', habitat: 'Mushroom Grotto', threat: 'Moderate', moves: 'Vine Lash, Root Snare, Thorn Embrace', basePower: 3, baseHp: 9, isBoss: false },
  [ENTITY.MOSS_GOLEM]:       { name: 'Moss Golem',        title: 'Living Cairn',      level: 10, element: 'NATURE', desc: 'A towering construct of stone and moss animated by the grotto\'s collective will. Incredibly durable and capable of devastating slam attacks.', lore: 'Moss golems form when the mycelial network detects a significant threat. They crumble once the danger passes.', habitat: 'Mushroom Grotto', threat: 'High', moves: 'Boulder Slam, Moss Shield, Regenerate', basePower: 4, baseHp: 22, isBoss: false },
  [ENTITY.FIRE_IMP]:         { name: 'Fire Imp',          title: 'Cinder Trickster',  level: 4,  element: 'FIRE',   desc: 'A small, cackling demon wreathed in flickering flames. Hurls fireballs with reckless glee and dances between attacks.', lore: 'Fire imps are drawn to volcanic vents from the lower planes. They delight in burning anything they find.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Fire Toss, Ember Dance', basePower: 4, baseHp: 8, isBoss: false },
  [ENTITY.LAVA_HOUND]:       { name: 'Lava Hound',        title: 'Molten Tracker',    level: 7,  element: 'FIRE',   desc: 'A hulking canine forged from cooling magma. Its bite sears flesh and its footsteps leave smoldering prints in solid stone.', lore: 'Lava hounds are born from pools of cooling magma. They hunt in packs, herding prey toward volcanic fissures.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Searing Bite, Magma Howl, Flame Charge', basePower: 4, baseHp: 14, isBoss: false },
  [ENTITY.ASH_WRAITH]:       { name: 'Ash Wraith',        title: 'Cinder Specter',    level: 9,  element: 'FIRE',   desc: 'The burning ghost of a creature consumed by volcanic fire. Trails ash and embers as it drifts through the scorched corridors.', lore: 'When creatures die in the scorched depths, their agony sometimes crystallizes into these vengeful spirits.', habitat: 'Scorched Depths', threat: 'High', moves: 'Ash Cloud, Ember Touch, Immolate', basePower: 6, baseHp: 15, isBoss: false },
  [ENTITY.MAGMA_GOLEM]:      { name: 'Magma Golem',       title: 'Molten Colossus',   level: 11, element: 'FIRE',   desc: 'A massive humanoid of semi-molten rock. Lava oozes from cracks in its obsidian shell, and its fists can shatter stone walls.', lore: 'Ancient dwarven constructs designed to work the deepest forges. With no masters left, they attack all intruders.', habitat: 'Scorched Depths', threat: 'High', moves: 'Lava Fist, Eruption, Molten Shell', basePower: 5, baseHp: 20, isBoss: false },
  [ENTITY.INFERNAL_MAGE]:    { name: 'Infernal Mage',     title: 'Flame Weaver',      level: 11, element: 'FIRE',   desc: 'A sorcerer who has merged with infernal fire, their body half-consumed by living flame. Casts devastating fire spells from a distance.', lore: 'These mages sought to master fire but were mastered by it instead. Their humanity burns away more each day.', habitat: 'Scorched Depths', threat: 'High', moves: 'Infernal Bolt, Fire Wall, Pyroclasm', basePower: 7, baseHp: 12, isBoss: false },
  [ENTITY.EMBER_BAT]:        { name: 'Ember Bat',         title: 'Spark Wing',        level: 2,  element: 'FIRE',   desc: 'A bat with wings that glow like hot coals. Swoops through the scorched tunnels leaving trails of sparks in the superheated air.', lore: 'Ember bats evolved in volcanic caves, their wings hardened by centuries of extreme heat into living embers.', habitat: 'Scorched Depths', threat: 'Low', moves: 'Spark Dive, Wing Scorch', basePower: 2, baseHp: 5, isBoss: false },
  [ENTITY.ICE_SPIDER]:       { name: 'Ice Spider',        title: 'Frost Weaver',      level: 3,  element: 'ICE',    desc: 'A pale spider adapted to frozen caves. Its webs are made of crystallized ice that shatters into razor shards when disturbed.', lore: 'Ice spiders spin webs that never decay in the frozen halls. Some webs are centuries old, filling entire passages.', habitat: 'Frozen Halls', threat: 'Low', moves: 'Frost Bite, Ice Web', basePower: 3, baseHp: 6, isBoss: false },
  [ENTITY.FROST_WRAITH]:     { name: 'Frost Wraith',      title: 'Frozen Specter',    level: 8,  element: 'ICE',    desc: 'A wraith bound to the frozen halls, trailing crystals of supernatural ice. Its presence drops the temperature to deadly levels.', lore: 'These spirits were once explorers who froze to death in the halls. Their regret keeps them tethered to the ice.', habitat: 'Frozen Halls', threat: 'High', moves: 'Freezing Touch, Blizzard Veil, Ice Drain', basePower: 5, baseHp: 11, isBoss: false },
  [ENTITY.FROZEN_SENTINEL]:  { name: 'Frozen Sentinel',   title: 'Glacial Guardian',  level: 10, element: 'ICE',    desc: 'A towering suit of ice-encrusted armor animated by ancient frost magic. Moves with grinding slowness but hits with the force of an avalanche.', lore: 'Built by the frost giant to guard his domain. Each sentinel is carved from a single block of enchanted glacier ice.', habitat: 'Frozen Halls', threat: 'High', moves: 'Glacier Smash, Frost Armor, Ice Slam', basePower: 5, baseHp: 18, isBoss: false },
  [ENTITY.SNOW_WOLF]:        { name: 'Snow Wolf',         title: 'Pale Fang',         level: 3,  element: 'ICE',    desc: 'A large wolf with fur as white as fresh snow and eyes like chips of blue ice. Hunts in packs with deadly coordination.', lore: 'Snow wolves are the only warm-blooded creatures that thrive in the frozen halls. They serve the frost giant as loyal guardians.', habitat: 'Frozen Halls', threat: 'Low-Moderate', moves: 'Frost Bite, Pack Howl', basePower: 3, baseHp: 7, isBoss: false },
  [ENTITY.ICE_MAGE]:         { name: 'Ice Mage',          title: 'Glacier Sage',      level: 9,  element: 'ICE',    desc: 'A spellcaster who has mastered cryomancy. Encases victims in ice and shatters them with follow-up blasts of frozen magic.', lore: 'These mages came to study the frost giant and were seduced by the perfection of absolute cold.', habitat: 'Frozen Halls', threat: 'High', moves: 'Ice Lance, Freeze Ray, Shatter', basePower: 6, baseHp: 12, isBoss: false },
  [ENTITY.SHADOW_STALKER]:   { name: 'Shadow Stalker',    title: 'Umbral Hunter',     level: 7,  element: 'SHADOW', desc: 'A creature made of living shadow that slips between darkness and reality. Strikes from blind spots with razor-sharp claws of condensed darkness.', lore: 'Shadow stalkers are born in places where darkness has pooled for centuries. They feed on fear and light.', habitat: 'Deep Caves', threat: 'Moderate', moves: 'Shadow Strike, Vanish, Dark Rend', basePower: 5, baseHp: 10, isBoss: false },
  [ENTITY.CRYSTAL_GOLEM]:    { name: 'Crystal Golem',     title: 'Prismatic Warden',  level: 11, element: 'ARCANE', desc: 'A golem carved from massive crystals that refract light into blinding rainbows. Its crystalline body is nearly indestructible and deflects magic.', lore: 'Ancient arcane constructs built to guard treasure vaults. The crystals that form their body amplify magical energy.', habitat: 'Deep Caves', threat: 'High', moves: 'Crystal Smash, Prismatic Beam, Reflect', basePower: 5, baseHp: 22, isBoss: false },
  [ENTITY.DEMON_LORD]:       { name: 'Demon Lord',        title: 'Archfiend',         level: 24, element: 'FIRE',   desc: 'A towering demon wreathed in hellfire with massive horns and wings of shadow. Commands infernal legions and wields devastating dark fire magic.', lore: 'Sealed beneath the dungeon millennia ago by a coalition of heroes. The weakening wards have allowed him to stir.', habitat: 'Infernal Sanctum', threat: 'Extreme', moves: 'Hellfire Blast, Shadow Flame, Demon Summon, Infernal Roar', basePower: 9, baseHp: 55, isBoss: true },
  [ENTITY.DRAGON_WHELP]:     { name: 'Dragon Whelp',      title: 'Young Flame',       level: 8,  element: 'FIRE',   desc: 'A juvenile dragon the size of a horse, already capable of breathing scorching flames. Aggressive and territorial despite its youth.', lore: 'Dragon whelps are sent into dungeons by their parents to hunt and grow strong. Only the fiercest survive.', habitat: 'Scorched Depths', threat: 'Moderate', moves: 'Fire Breath, Claw Rake, Tail Swipe', basePower: 5, baseHp: 16, isBoss: false },
  [ENTITY.ANCIENT_WYRM]:     { name: 'Ancient Wyrm',      title: 'World Ender',       level: 28, element: 'FIRE',   desc: 'A dragon of immense age and terrible power. Its scales are harder than adamantine, and its breath can melt stone. The apex predator of the deep.', lore: 'This wyrm has slumbered beneath the mountain since before recorded history. Its dreams shape the very tunnels around it.', habitat: 'Dragon\'s Maw', threat: 'Extreme', moves: 'Inferno Breath, Tail Crush, Wing Gale, Ancient Fury', basePower: 10, baseHp: 60, isBoss: true },
};

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
export const BACKPACK_SIZE = 30;

// ── Boss Mapping ──────────────────────────────────
export const BOSS_FOR_THEME = {
  [FLOOR_THEME.GOBLIN_CAVE]:     ENTITY.GOBLIN_WARLORD,
  [FLOOR_THEME.SPIDER_CAVERN]:   ENTITY.SPIDER_QUEEN,
  [FLOOR_THEME.CRYPT]:           ENTITY.LICH,
  [FLOOR_THEME.MUSHROOM_GROTTO]: ENTITY.MYCELIUM_LORD,
  [FLOOR_THEME.SCORCHED_DEPTHS]: ENTITY.FIRE_ELEMENTAL,
  [FLOOR_THEME.FROZEN_HALLS]:    ENTITY.FROST_GIANT,
};

export const ELITE_PREFIXES = ['Savage', 'Frenzied', 'Ancient', 'Corrupted', 'Enraged', 'Cursed', 'Venomous', 'Spectral', 'Blazing', 'Frozen'];

// ── Boss QoL Skills ────────────────────────────
export const BOSS_SKILLS = {
  town_portal:  { id: 'town_portal',  name: 'Town Portal',  floor: 5,  type: 'active',  key: 'Q', desc: 'Open a portal to the village. A return portal lets you come back.' },
  gold_magnet:  { id: 'gold_magnet',  name: 'Gold Magnet',  floor: 10, type: 'passive', desc: 'Loot from kills is collected automatically.' },
  cartographer: { id: 'cartographer', name: 'Cartographer', floor: 15, type: 'passive', desc: 'Dungeon maps are fully revealed on entry.' },
  second_life:  { id: 'second_life',  name: 'Second Life',  floor: 20, type: 'passive', desc: 'Revive once on death with 50% HP.' },
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
  FOUNTAIN:      'fountain_room',
  CRYPT_CHAMBER: 'crypt_chamber',
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
];

export const DUNGEON_SHOP_INVENTORY = [
  { itemId: 'minor_health_pot', price: 12 },
  { itemId: 'major_health_pot', price: 28 },
  { itemId: 'mana_potion',      price: 16 },
  { itemId: 'strength_potion',  price: 30 },
  { itemId: 'shield_potion',    price: 30 },
  { itemId: 'haste_potion',     price: 35 },
  { itemId: 'regen_potion',     price: 32 },
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
