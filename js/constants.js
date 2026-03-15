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
    maxHp: 35, hp: 35, power: 3, armor: 1, maxMana: 0, mana: 0,
    xp: 0, level: 1, xpToLevel: 20,
  },
  [PLAYER_CLASS.MAGE]: {
    name: 'Mage', desc: 'Wields fire magic. Ranged spells cost mana.',
    maxHp: 22, hp: 22, power: 1, armor: 0, maxMana: 20, mana: 20,
    xp: 0, level: 1, xpToLevel: 20,
  },
  [PLAYER_CLASS.ARCHER]: {
    name: 'Archer', desc: 'Shoots arrows from range. Fast and precise.',
    maxHp: 26, hp: 26, power: 2, armor: 0, maxMana: 0, mana: 0,
    xp: 0, level: 1, xpToLevel: 20,
  },
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
  fire_staff:     { id: 'fire_staff',     name: 'Fire Staff',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 3, icon: 'WS', desc: '+3 Power, +4 Spell Dmg', spellBonus: 4, tier: 2 },
  war_axe:        { id: 'war_axe',        name: 'War Axe',        type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 5, icon: 'WA', desc: '+5 Power', tier: 2 },
  shadow_dagger:  { id: 'shadow_dagger',  name: 'Shadow Dagger',  type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 7, icon: 'WD', desc: '+7 Power', tier: 3 },
  long_bow:       { id: 'long_bow',       name: 'Long Bow',       type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 4, icon: 'WB', desc: '+4 Power, +2 Range', rangeBonus: 2, tier: 2 },
  bone_club:      { id: 'bone_club',      name: 'Bone Club',      type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 3, icon: 'WC', desc: '+3 Power', tier: 1 },
  frost_wand:     { id: 'frost_wand',     name: 'Frost Wand',     type: ITEM_TYPE.WEAPON, slot: EQUIP_SLOT.WEAPON, power: 2, icon: 'WF', desc: '+2 Power, +3 Spell Dmg', spellBonus: 3, tier: 2 },

  // Helmets
  leather_cap:    { id: 'leather_cap',    name: 'Leather Cap',    type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 1, icon: 'H1', desc: '+1 Armor', tier: 1 },
  iron_helm:      { id: 'iron_helm',      name: 'Iron Helm',      type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 2, icon: 'H2', desc: '+2 Armor', tier: 2 },
  skull_helm:     { id: 'skull_helm',     name: 'Skull Helm',     type: ITEM_TYPE.HELMET, slot: EQUIP_SLOT.HELMET, armor: 3, icon: 'H3', desc: '+3 Armor', tier: 3 },

  // Chest
  leather_tunic:  { id: 'leather_tunic',  name: 'Leather Tunic',  type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 1, icon: 'C1', desc: '+1 Armor', tier: 1 },
  chain_mail:     { id: 'chain_mail',     name: 'Chain Mail',     type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 3, icon: 'C2', desc: '+3 Armor', tier: 2 },
  plate_armor:    { id: 'plate_armor',    name: 'Plate Armor',    type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 5, icon: 'C3', desc: '+5 Armor', tier: 3 },
  mage_robe:      { id: 'mage_robe',     name: 'Mage Robe',      type: ITEM_TYPE.CHEST,  slot: EQUIP_SLOT.CHEST, armor: 1, icon: 'CR', desc: '+1 Armor, +5 Max Mana', manaBonus: 5, tier: 2 },

  // Gloves
  leather_gloves: { id: 'leather_gloves', name: 'Leather Gloves', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, icon: 'G1', desc: '+1 Armor', tier: 1 },
  iron_gauntlets: { id: 'iron_gauntlets', name: 'Iron Gauntlets', type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 2, icon: 'G2', desc: '+2 Armor', tier: 2 },
  spiked_gloves:  { id: 'spiked_gloves',  name: 'Spiked Gloves',  type: ITEM_TYPE.GLOVES, slot: EQUIP_SLOT.GLOVES, armor: 1, powerBonus: 1, icon: 'G3', desc: '+1 Armor, +1 Power', tier: 2 },

  // Boots
  sandals:        { id: 'sandals',        name: 'Sandals',        type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 0, icon: 'B1', desc: 'Light footwear', tier: 1 },
  leather_boots:  { id: 'leather_boots',  name: 'Leather Boots',  type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 1, icon: 'B2', desc: '+1 Armor', tier: 1 },
  iron_greaves:   { id: 'iron_greaves',   name: 'Iron Greaves',   type: ITEM_TYPE.BOOTS,  slot: EQUIP_SLOT.BOOTS, armor: 2, icon: 'B3', desc: '+2 Armor', tier: 2 },

  // Capes
  worn_cloak:     { id: 'worn_cloak',     name: 'Worn Cloak',     type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 1, icon: 'K1', desc: '+1 Armor', tier: 1 },
  shadow_cape:    { id: 'shadow_cape',    name: 'Shadow Cape',    type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 2, icon: 'K2', desc: '+2 Armor', tier: 2 },
  fire_cloak:     { id: 'fire_cloak',     name: 'Fire Cloak',     type: ITEM_TYPE.CAPE,   slot: EQUIP_SLOT.CAPE, armor: 1, icon: 'KF', desc: '+1 Armor, +2 Spell Dmg', spellBonus: 2, tier: 2 },

  // Consumables (stackable)
  minor_health_pot: { id: 'minor_health_pot', name: 'Health Potion',   type: ITEM_TYPE.CONSUMABLE, healAmount: 15, icon: 'PH', desc: 'Restore 15 HP',   stackable: true, maxStack: 5 },
  major_health_pot: { id: 'major_health_pot', name: 'Greater Health',  type: ITEM_TYPE.CONSUMABLE, healAmount: 30, icon: 'PH+', desc: 'Restore 30 HP',  stackable: true, maxStack: 5 },
  mana_potion:      { id: 'mana_potion',      name: 'Mana Potion',     type: ITEM_TYPE.CONSUMABLE, manaAmount: 10, icon: 'PM', desc: 'Restore 10 Mana', stackable: true, maxStack: 5 },
  antidote:         { id: 'antidote',          name: 'Antidote',        type: ITEM_TYPE.CONSUMABLE, curePoison: true, icon: 'PA', desc: 'Cure poison',   stackable: true, maxStack: 5 },
  // Effect potions
  strength_potion:  { id: 'strength_potion',  name: 'Str Potion',     type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Strength', stat: 'power',  amount: 3, turns: 15 }, icon: 'PS', desc: '+3 Power for 15 turns', stackable: true, maxStack: 5 },
  shield_potion:    { id: 'shield_potion',    name: 'Shield Potion',  type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Shield',   stat: 'armor',  amount: 3, turns: 15 }, icon: 'PD', desc: '+3 Armor for 15 turns', stackable: true, maxStack: 5 },
  haste_potion:     { id: 'haste_potion',     name: 'Haste Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Haste',    stat: 'haste',  amount: 1, turns: 10 }, icon: 'PF', desc: 'Double attack for 10 turns', stackable: true, maxStack: 5 },
  regen_potion:     { id: 'regen_potion',     name: 'Regen Potion',   type: ITEM_TYPE.CONSUMABLE, effect: { name: 'Regen',    stat: 'regen',  amount: 2, turns: 20 }, icon: 'PR', desc: 'Regen 2 HP/turn for 20 turns', stackable: true, maxStack: 5 },
};

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
      [ENTITY.GOBLIN]: 5, [ENTITY.ORC]: 3, [ENTITY.GOBLIN_SHAMAN]: 2, [ENTITY.BAT]: 2, [ENTITY.GOBLIN_BERSERKER]: 2,
    },
    minFloor: 1,
    maxFloor: 3,
  },
  [FLOOR_THEME.SPIDER_CAVERN]: {
    name: 'Spider Cavern',
    wallTile: TILE.CAVE_WALL,
    floorTile: TILE.WEB_FLOOR,
    spawnWeights: {
      [ENTITY.SPIDER]: 6, [ENTITY.BAT]: 3, [ENTITY.SLIME]: 2,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.CRYPT]: {
    name: 'Ancient Crypt',
    wallTile: TILE.BONE_WALL,
    floorTile: TILE.BONE_FLOOR,
    spawnWeights: {
      [ENTITY.SKELETON]: 5, [ENTITY.WRAITH]: 2, [ENTITY.DARK_MAGE]: 1, [ENTITY.BAT]: 1,
    },
    minFloor: 2,
    maxFloor: 6,
  },
  [FLOOR_THEME.MUSHROOM_GROTTO]: {
    name: 'Mushroom Grotto',
    wallTile: TILE.MOSS_WALL,
    floorTile: TILE.MOSS_FLOOR,
    spawnWeights: {
      [ENTITY.MUSHROOM]: 4, [ENTITY.SLIME]: 3, [ENTITY.SPIDER]: 2, [ENTITY.GOBLIN]: 1,
    },
    minFloor: 1,
    maxFloor: 4,
  },
  [FLOOR_THEME.SCORCHED_DEPTHS]: {
    name: 'Scorched Depths',
    wallTile: TILE.LAVA_WALL,
    floorTile: TILE.LAVA_FLOOR,
    spawnWeights: {
      [ENTITY.DARK_MAGE]: 3, [ENTITY.TROLL]: 2, [ENTITY.ORC]: 2, [ENTITY.GOBLIN_SHAMAN]: 1,
    },
    minFloor: 3,
    maxFloor: 99,
  },
  [FLOOR_THEME.FROZEN_HALLS]: {
    name: 'Frozen Halls',
    wallTile: TILE.ICE_WALL,
    floorTile: TILE.ICE_FLOOR,
    spawnWeights: {
      [ENTITY.WRAITH]: 3, [ENTITY.SKELETON]: 3, [ENTITY.SLIME]: 2, [ENTITY.TROLL]: 1,
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
  ],
  [ENTITY.SKELETON]: [
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'bone_club',        chance: 0.15 },
    { itemId: 'iron_helm',        chance: 0.10 },
    { itemId: 'leather_boots',    chance: 0.10 },
    { itemId: 'worn_cloak',       chance: 0.08 },
    { itemId: 'skull_helm',       chance: 0.04 },
  ],
  [ENTITY.SPIDER]: [
    { itemId: 'antidote',         chance: 0.40 },
    { itemId: 'minor_health_pot', chance: 0.25 },
    { itemId: 'leather_gloves',   chance: 0.06 },
    { itemId: 'leather_boots',    chance: 0.06 },
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
  ],
  [ENTITY.SPIDER_QUEEN]: [
    { itemId: 'shadow_dagger',    chance: 0.35 },
    { itemId: 'shadow_cape',      chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'antidote',         chance: 0.50 },
    { itemId: 'spiked_gloves',    chance: 0.25 },
  ],
  [ENTITY.LICH]: [
    { itemId: 'fire_staff',       chance: 0.35 },
    { itemId: 'frost_wand',       chance: 0.30 },
    { itemId: 'skull_helm',       chance: 0.35 },
    { itemId: 'mage_robe',        chance: 0.30 },
    { itemId: 'mana_potion',      chance: 0.60 },
    { itemId: 'major_health_pot', chance: 0.40 },
  ],
  [ENTITY.MYCELIUM_LORD]: [
    { itemId: 'plate_armor',      chance: 0.30 },
    { itemId: 'iron_greaves',     chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'antidote',         chance: 0.50 },
    { itemId: 'spiked_gloves',    chance: 0.25 },
  ],
  [ENTITY.FIRE_ELEMENTAL]: [
    { itemId: 'fire_staff',       chance: 0.35 },
    { itemId: 'fire_cloak',       chance: 0.35 },
    { itemId: 'steel_blade',      chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'plate_armor',      chance: 0.20 },
  ],
  [ENTITY.FROST_GIANT]: [
    { itemId: 'frost_wand',       chance: 0.35 },
    { itemId: 'plate_armor',      chance: 0.30 },
    { itemId: 'skull_helm',       chance: 0.25 },
    { itemId: 'iron_greaves',     chance: 0.30 },
    { itemId: 'major_health_pot', chance: 0.60 },
    { itemId: 'shadow_cape',      chance: 0.25 },
  ],
};

// ── Bestiary Data ────────────────────────────────
export const BESTIARY_INFO = {
  [ENTITY.GOBLIN]:        { name: 'Goblin',        desc: 'Small, cunning creatures that lurk in dark caves. Weak alone but dangerous in groups. Known for their glowing red eyes and crude wooden clubs.', basePower: 2, baseHp: 6 },
  [ENTITY.ORC]:           { name: 'Orc',           desc: 'Massive, brutish warriors with thick green skin and tusked jaws. Wear crude iron armor and wield heavy axes. Territorial and aggressive.', basePower: 4, baseHp: 14 },
  [ENTITY.SKELETON]:      { name: 'Skeleton',      desc: 'Animated bones of fallen warriors, held together by dark magic. Their bony frame gives natural armor, and they feel no pain or fear.', basePower: 3, baseHp: 8 },
  [ENTITY.SPIDER]:        { name: 'Cave Spider',   desc: 'Giant arachnids the size of a dog. Fast and venomous, they strike quickly with poisoned fangs. Fragile but dangerous in numbers.', basePower: 3, baseHp: 5 },
  [ENTITY.TROLL]:         { name: 'Troll',         desc: 'Towering brutes with thick, regenerating hide. Immensely strong with devastating club attacks. The most physically powerful dungeon dwellers.', basePower: 5, baseHp: 24 },
  [ENTITY.DARK_MAGE]:     { name: 'Dark Mage',     desc: 'Corrupted sorcerers who delved too deep into forbidden magic. They hurl shadow bolts from range and are protected by arcane wards.', basePower: 6, baseHp: 10 },
  [ENTITY.BAT]:           { name: 'Cave Bat',      desc: 'Swarms of giant bats infest every corner of the caves. Weak individually but their erratic flight makes them annoying. They screech in the dark.', basePower: 1, baseHp: 4 },
  [ENTITY.SLIME]:         { name: 'Slime',         desc: 'Amorphous blobs of acidic gel that dissolve organic matter. Highly resistant to physical attacks thanks to their gelatinous body. Slow but persistent.', basePower: 1, baseHp: 8 },
  [ENTITY.WRAITH]:        { name: 'Wraith',        desc: 'Vengeful spirits of the restless dead. They phase through walls and drain life force with their icy touch. Immune to mundane defenses.', basePower: 5, baseHp: 12 },
  [ENTITY.GOBLIN_SHAMAN]: { name: 'Goblin Shaman', desc: 'Goblin elders who discovered crude magic. They fling hexes from afar and empower nearby goblins. More dangerous than they appear.', basePower: 4, baseHp: 7 },
  [ENTITY.MUSHROOM]:         { name: 'Fungal Guardian',   desc: 'Sentient mushroom colonies that defend their territory with toxic spore clouds. Tough and regenerative, they thrive in damp caverns.', basePower: 2, baseHp: 10 },
  [ENTITY.GOBLIN_BERSERKER]: { name: 'Goblin Berserker',  desc: 'Crazed goblin wielding a massive axe with reckless abandon. Enters a frenzy in close combat, sometimes striking twice in rapid succession.', basePower: 4, baseHp: 8 },
  [ENTITY.GOBLIN_WARLORD]:   { name: 'Goblin Warlord',    desc: 'A massive goblin chieftain clad in stolen armor. Commands lesser goblins through brute force and cunning. Double-strikes with terrifying speed.', basePower: 6, baseHp: 40 },
  [ENTITY.SPIDER_QUEEN]:     { name: 'Spider Queen',      desc: 'The enormous matriarch of the spider nest. Her venomous bite is legendary, and webs fill the chamber around her throne.', basePower: 7, baseHp: 35 },
  [ENTITY.LICH]:             { name: 'Lich',              desc: 'An undead sorcerer who traded mortality for dark power. Hurls necrotic bolts that bypass armor and drain the very life force of victims.', basePower: 9, baseHp: 30 },
  [ENTITY.MYCELIUM_LORD]:    { name: 'Mycelium Lord',     desc: 'A towering fungal titan connected to the entire grotto. Regenerates rapidly through its mycelial network and crushes intruders with massive tendrils.', basePower: 5, baseHp: 45 },
  [ENTITY.FIRE_ELEMENTAL]:   { name: 'Fire Elemental',    desc: 'A living inferno of pure flame, born from the scorched depths. Blasts fire in all directions and incinerates anything that draws near.', basePower: 8, baseHp: 38 },
  [ENTITY.FROST_GIANT]:      { name: 'Frost Giant',       desc: 'A colossal being of ice and fury dwelling in the frozen halls. Ground-shaking slams can crush adventurers instantly. Nearly impervious to damage.', basePower: 7, baseHp: 50 },
};

// ── Ranged Attack Constants ──────────────────────
export const FIRE_SPELL_COST = 4;
export const FIRE_SPELL_RANGE = 5;
export const FIRE_SPELL_POWER = 5;
export const BOW_RANGE = 6;

// ── Map Sizes ─────────────────────────────────────
export const VILLAGE_W = 22;
export const VILLAGE_H = 16;
export const DUNGEON_W = 40;
export const DUNGEON_H = 30;

// ── Rendering ─────────────────────────────────────
export const TILE_SIZE = 32;
export const VIEW_W = 25;
export const VIEW_H = 17;

// ── Enemy AI ─────────────────────────────────────
export const GOBLIN_SIGHT_RANGE = 5;
export const ORC_SIGHT_RANGE = 6;

// ── Dungeon Gen ───────────────────────────────────
export const MIN_ROOM_SIZE = 4;
export const MAX_ROOM_SIZE = 8;
export const MAX_ROOMS = 9;

export const ITEMS_PER_FLOOR_MIN = 1;
export const ITEMS_PER_FLOOR_MAX = 3;

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
