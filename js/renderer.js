import { TILE_SIZE, VIEW_W, VIEW_H, BACKPACK_SIZE, ENTITY, PLAYER_CLASS, EQUIP_SLOT, ITEM_TYPE, SPELLS, TILE, TILE_PROPS, BASE_STATS, GOLD_REWARDS, FLOOR_THEMES, BOSS_FOR_THEME } from './constants.js';

// Lookups for bestiary
const BASE_STATS_LOOKUP = BASE_STATS;
const GOLD_LOOKUP = GOLD_REWARDS;
import { getTileSprite, getPlayerSprite, getEnemySprite, getItemSprite, getFireballSprite, getArrowSprite, getIceShardSprite, getLightningSprite, getTorchSprite, getTorchFrame, getChestClosedSprite, getChestOpenSprite } from './sprites.js';
import { state, getPlayerPower, getPlayerArmor, getBestiaryEntries, getFloorThemeName, allocateStat, getEnemyName, getShopInventory, buyItem, sellItem, healPlayer, closeHealer, closeShop, getActiveChest, takeChestItem, takeChestGold, closeChest } from './engine.js';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = VIEW_W * TILE_SIZE;
canvas.height = VIEW_H * TILE_SIZE;
ctx.imageSmoothingEnabled = false;  // crisp pixel-art scaling

// ── Camera ───────────────────────────────────

function getCamera() {
  const p = state.player;
  let camX = p.x - Math.floor(VIEW_W / 2);
  let camY = p.y - Math.floor(VIEW_H / 2);

  camX = Math.max(0, Math.min(camX, state.mapW - VIEW_W));
  camY = Math.max(0, Math.min(camY, state.mapH - VIEW_H));

  return { camX, camY };
}

// ── Render ───────────────────────────────────

export function render() {
  if (state.phase === 'class_select') return;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { camX, camY } = getCamera();

  // Draw tiles
  for (let vy = 0; vy < VIEW_H; vy++) {
    for (let vx = 0; vx < VIEW_W; vx++) {
      const mx = camX + vx;
      const my = camY + vy;

      if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;

      const visible = state.visibility[my][mx];
      const revealed = state.revealed[my][mx];

      if (!revealed) continue;

      const tile = state.map[my][mx];
      const sprite = getTileSprite(tile);
      const sx = vx * TILE_SIZE;
      const sy = vy * TILE_SIZE;

      ctx.drawImage(sprite, sx, sy);

      if (!visible) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Draw torches on dungeon walls (walls adjacent to floor on their south side)
  if (state.mode === 'dungeon') {
    const torchSprite = getTorchSprite();
    for (let vy = 0; vy < VIEW_H; vy++) {
      for (let vx = 0; vx < VIEW_W; vx++) {
        const mx = camX + vx;
        const my = camY + vy;
        if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;
        if (!state.revealed[my][mx]) continue;

        const tile = state.map[my][mx];
        const props = TILE_PROPS[tile];
        if (!props || props.walkable) continue; // only walls

        // Place torch if the tile below is a walkable floor
        const belowY = my + 1;
        if (belowY >= state.mapH) continue;
        const belowTile = state.map[belowY][mx];
        const belowProps = TILE_PROPS[belowTile];
        if (!belowProps || !belowProps.walkable) continue;

        // Only place torches at regular intervals (every 3-4 tiles) for a natural look
        if ((mx + my * 7) % 4 !== 0) continue;

        const sx = vx * TILE_SIZE;
        const sy = vy * TILE_SIZE;

        if (state.visibility[my][mx]) {
          ctx.drawImage(torchSprite, sx, sy);
        } else {
          // Dimmed torch in fog
          ctx.globalAlpha = 0.4;
          ctx.drawImage(torchSprite, sx, sy);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Draw ground items (only visible)
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    const sx = (gi.x - camX) * TILE_SIZE;
    const sy = (gi.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const sprite = getItemSprite(gi.item.icon);
    ctx.drawImage(sprite, sx, sy);
  }

  // Draw chests
  for (const chest of state.chests) {
    if (!state.visibility[chest.y] || !state.visibility[chest.y][chest.x]) continue;
    const sx = (chest.x - camX) * TILE_SIZE;
    const sy = (chest.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const sprite = chest.opened ? getChestOpenSprite() : getChestClosedSprite();
    ctx.drawImage(sprite, sx, sy);
  }

  // Draw enemies (only visible)
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    const sx = (enemy.x - camX) * TILE_SIZE;
    const sy = (enemy.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(getEnemySprite(enemy.type), sx, sy);

    // Boss gold border indicator
    if (enemy.isBoss) {
      ctx.strokeStyle = '#e0c040';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }

    // HP bar above enemy
    const hpPct = enemy.hp / enemy.maxHp;
    ctx.fillStyle = '#300';
    ctx.fillRect(sx + 4, sy - 4, TILE_SIZE - 8, 3);
    ctx.fillStyle = hpPct > 0.5 ? '#0c0' : hpPct > 0.25 ? '#cc0' : '#c00';
    ctx.fillRect(sx + 4, sy - 4, (TILE_SIZE - 8) * hpPct, 3);
  }

  // Draw projectiles
  for (const proj of state.projectiles) {
    const sx = (proj.x - camX) * TILE_SIZE;
    const sy = (proj.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    if (proj.type === 'fire') {
      ctx.drawImage(getFireballSprite(), sx, sy);
    } else if (proj.type === 'arrow') {
      ctx.drawImage(getArrowSprite(), sx, sy);
    } else if (proj.type === 'ice') {
      ctx.drawImage(getIceShardSprite(), sx, sy);
    } else if (proj.type === 'lightning') {
      ctx.drawImage(getLightningSprite(), sx, sy);
    }
  }

  // Draw player
  {
    const sx = (state.player.x - camX) * TILE_SIZE;
    const sy = (state.player.y - camY) * TILE_SIZE;
    ctx.drawImage(getPlayerSprite(state.playerClass), sx, sy);
  }

  updateUI();
}

// ── Equipment Slot Labels ───────────────────

const SLOT_LABELS = {
  [EQUIP_SLOT.WEAPON]:  'Weapon',
  [EQUIP_SLOT.HELMET]:  'Helmet',
  [EQUIP_SLOT.CHEST]:   'Chest',
  [EQUIP_SLOT.GLOVES]:  'Gloves',
  [EQUIP_SLOT.BOOTS]:   'Boots',
  [EQUIP_SLOT.CAPE]:    'Cape',
};

// ── UI Updates ───────────────────────────────

function updateUI() {
  const p = state.player;

  // Class display
  const classEl = document.getElementById('class-display');
  if (classEl) {
    const classNames = { warrior: 'Warrior', mage: 'Mage', archer: 'Archer' };
    classEl.textContent = classNames[state.playerClass] || 'Adventurer';
  }

  // Floor display
  const floorEl = document.getElementById('floor-display');
  if (state.floor === 0) {
    floorEl.textContent = 'Village';
  } else {
    const themeName = getFloorThemeName();
    floorEl.textContent = themeName ? `${themeName} — Floor ${state.floor}` : `Dungeon Floor ${state.floor}`;
  }

  // HP bar (HUD overlay)
  const hpPct = (p.hp / p.maxHp) * 100;
  const hudHpFill = document.getElementById('hud-hp-fill');
  const hudHpText = document.getElementById('hud-hp-text');
  if (hudHpFill) {
    hudHpFill.style.width = hpPct + '%';
    hudHpText.textContent = `${p.hp}/${p.maxHp}`;
  }

  // Mana bar (HUD overlay)
  const hudManaRow = document.getElementById('hud-mana-row');
  if (p.maxMana > 0) {
    if (hudManaRow) {
      hudManaRow.style.display = 'flex';
      const hudManaFill = document.getElementById('hud-mana-fill');
      const hudManaText = document.getElementById('hud-mana-text');
      const manaPct = (p.mana / p.maxMana) * 100;
      hudManaFill.style.width = manaPct + '%';
      hudManaText.textContent = `${p.mana}/${p.maxMana}`;
    }
  } else {
    if (hudManaRow) hudManaRow.style.display = 'none';
  }

  // XP bar (HUD overlay)
  const xpPct = (p.xp / p.xpToLevel) * 100;
  const hudXpFill = document.getElementById('hud-xp-fill');
  const hudXpText = document.getElementById('hud-xp-text');
  if (hudXpFill) {
    hudXpFill.style.width = xpPct + '%';
    hudXpText.textContent = `${p.xp}/${p.xpToLevel}`;
  }

  // Combat stats
  document.getElementById('level-text').textContent = p.level;
  document.getElementById('power-text').textContent = getPlayerPower();
  document.getElementById('armor-text').textContent = getPlayerArmor();
  document.getElementById('gold-text').textContent = p.gold;

  // Equipment slots (all 6)
  const equipGrid = document.getElementById('equip-grid');
  equipGrid.innerHTML = '';
  for (const slot of Object.values(EQUIP_SLOT)) {
    const div = document.createElement('div');
    div.className = 'equip-slot';
    const item = p.equipment[slot];
    if (item) {
      div.innerHTML = `
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
        <span class="slot-item">${item.icon} ${item.name}</span>
      `;
    } else {
      div.innerHTML = `
        <span class="slot-label">${SLOT_LABELS[slot]}</span>
        <span class="slot-item empty">- empty -</span>
      `;
    }
    equipGrid.appendChild(div);
  }

  // Inventory grid (cube grid)
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';
  for (let i = 0; i < BACKPACK_SIZE; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    if (i < p.inventory.length) {
      const item = p.inventory[i];
      slot.classList.add('type-' + (item.type || 'consumable'));
      if (item.tier) slot.classList.add('tier-' + item.tier);
      const count = item.count || 1;
      // Draw item sprite as canvas
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 32;
      spriteCanvas.height = 32;
      spriteCanvas.className = 'inv-sprite';
      const sctx = spriteCanvas.getContext('2d');
      sctx.drawImage(getItemSprite(item.icon), 0, 0);
      slot.appendChild(spriteCanvas);
      if (count > 1) {
        const countEl = document.createElement('span');
        countEl.className = 'inv-count';
        countEl.textContent = count;
        slot.appendChild(countEl);
      }
      slot.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('useItem', { detail: i }));
      });
      slot.addEventListener('mouseenter', (e) => showItemTooltip(e, item));
      slot.addEventListener('mousemove', (e) => positionTooltip(e));
      slot.addEventListener('mouseleave', hideItemTooltip);
    } else {
      slot.className = 'inv-slot empty-slot';
    }
    grid.appendChild(slot);
  }

  // Stat points panel
  updateStatsAllocPanel();

  // Spells panel (mage only)
  updateSpellsPanel();

  // Active effects display
  updateEffectsDisplay();

  // Message log
  const msgLog = document.getElementById('message-log');
  msgLog.innerHTML = '';
  const recent = state.messages.slice(-20);
  for (const msg of recent) {
    const div = document.createElement('div');
    div.className = `msg msg-${msg.type}`;
    div.textContent = msg.text;
    msgLog.appendChild(div);
  }
  msgLog.scrollTop = msgLog.scrollHeight;

  // Bestiary overlay
  updateBestiary();

  // Minimap overlay
  updateMinimap();

  // Healer overlay
  updateHealerOverlay();

  // Shop overlay
  updateShopOverlay();

  // Chest overlay
  updateChestOverlay();
}

// ── Stats Allocation Panel ──────────────────

function updateStatsAllocPanel() {
  const panel = document.getElementById('stats-alloc-panel');
  if (!panel) return;

  const p = state.player;
  if (!p || p.statPoints <= 0) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';
  document.getElementById('stat-points-count').textContent = p.statPoints;

  const grid = document.getElementById('stats-alloc-grid');
  grid.innerHTML = '';

  const stats = [
    { key: 'hp', label: 'Max HP', value: p.maxHp, bonus: '+3' },
    { key: 'power', label: 'Power', value: p.power, bonus: '+1' },
    { key: 'armor', label: 'Armor', value: p.armor, bonus: '+1' },
  ];
  if (p.maxMana > 0) {
    stats.push({ key: 'mana', label: 'Max Mana', value: p.maxMana, bonus: '+5' });
  }

  for (const s of stats) {
    const row = document.createElement('div');
    row.className = 'stat-alloc-row';
    row.innerHTML = `
      <span class="stat-alloc-name">${s.label}</span>
      <span class="stat-alloc-val">${s.value}</span>
      <button class="stat-alloc-btn">${s.bonus}</button>
    `;
    const btn = row.querySelector('.stat-alloc-btn');
    btn.addEventListener('click', () => {
      allocateStat(s.key);
      render();
    });
    grid.appendChild(row);
  }
}

// ── Active Effects Display ─────────────────

function updateEffectsDisplay() {
  let container = document.getElementById('effects-display');
  const p = state.player;
  if (!p || !p.effects || p.effects.length === 0) {
    if (container) container.style.display = 'none';
    return;
  }
  if (!container) return;
  container.style.display = '';
  container.innerHTML = '';
  for (const eff of p.effects) {
    const div = document.createElement('div');
    div.className = 'effect-badge';
    div.textContent = `${eff.name} (${eff.turns}t)`;
    container.appendChild(div);
  }
}

// ── Spells Panel Rendering ──────────────────

function updateSpellsPanel() {
  const panel = document.getElementById('spells-panel');
  if (!panel) return;

  if (state.playerClass !== PLAYER_CLASS.MAGE) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';
  const grid = document.getElementById('spells-grid');
  grid.innerHTML = '';

  for (const spell of Object.values(SPELLS)) {
    const div = document.createElement('div');
    const canCast = state.player.mana >= spell.manaCost;
    div.className = 'spell-slot' + (canCast ? '' : ' disabled');
    div.innerHTML = `
      <span class="spell-key">${spell.key.toUpperCase()}</span>
      <span class="spell-name">${spell.name}</span>
      <span class="spell-cost">${spell.manaCost} MP</span>
    `;
    grid.appendChild(div);
  }
}

// ── Bestiary Rendering ──────────────────────

function updateBestiary() {
  const overlay = document.getElementById('bestiary-overlay');
  if (!state.showBestiary) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const content = document.getElementById('bestiary-content');
  const entries = getBestiaryEntries();

  // Build a map of type -> entry for quick lookup
  const entryMap = {};
  for (const e of entries) entryMap[e.type] = e;

  // Area theme colors for headers
  const areaColors = {
    goblin_cave: '#6a8a4a',
    spider_cavern: '#8a6a8a',
    crypt: '#8a8a7a',
    mushroom_grotto: '#5a8a6a',
    scorched_depths: '#a06040',
    frozen_halls: '#5a7aa0',
  };

  // Floor range descriptions
  const floorDesc = (t) => `Floors ${t.minFloor}–${t.maxFloor === 99 ? '∞' : t.maxFloor}`;

  content.innerHTML = '';

  for (const [themeKey, theme] of Object.entries(FLOOR_THEMES)) {
    // Collect monsters for this area (from spawnWeights + boss)
    const areaMonsters = Object.keys(theme.spawnWeights);
    const boss = BOSS_FOR_THEME[themeKey];
    if (boss) areaMonsters.push(boss);

    // Area header with theme tile preview
    const section = document.createElement('div');
    section.className = 'bestiary-area';

    const headerColor = areaColors[themeKey] || '#888';

    // Area header
    const header = document.createElement('div');
    header.className = 'bestiary-area-header';

    // Draw floor tile preview
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = 32;
    tileCanvas.height = 32;
    tileCanvas.className = 'bestiary-area-tile';
    const tctx = tileCanvas.getContext('2d');
    const floorSprite = getTileSprite(theme.floorTile);
    tctx.drawImage(floorSprite, 0, 0);

    const wallCanvas = document.createElement('canvas');
    wallCanvas.width = 32;
    wallCanvas.height = 32;
    wallCanvas.className = 'bestiary-area-tile';
    const wctx = wallCanvas.getContext('2d');
    const wallSprite = getTileSprite(theme.wallTile);
    wctx.drawImage(wallSprite, 0, 0);

    const headerInfo = document.createElement('div');
    headerInfo.className = 'bestiary-area-info';
    headerInfo.innerHTML = `
      <div class="bestiary-area-name" style="color:${headerColor}">${theme.name}</div>
      <div class="bestiary-area-floors">${floorDesc(theme)} &middot; ${areaMonsters.length} creatures</div>
    `;

    header.appendChild(wallCanvas);
    header.appendChild(tileCanvas);
    header.appendChild(headerInfo);
    section.appendChild(header);

    // Render monsters in this area
    const grid = document.createElement('div');
    grid.className = 'bestiary-area-grid';

    for (const monsterType of areaMonsters) {
      const entry = entryMap[monsterType];
      if (!entry) continue;

      const isBoss = monsterType === boss;
      const card = document.createElement('div');

      if (entry.discovered) {
        card.className = 'bestiary-card' + (isBoss ? ' bestiary-boss' : '');

        // Sprite
        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = 32;
        spriteCanvas.height = 32;
        spriteCanvas.className = 'bestiary-card-sprite';
        const sctx = spriteCanvas.getContext('2d');
        sctx.drawImage(getEnemySprite(entry.type), 0, 0);

        // Info
        const info = document.createElement('div');
        info.className = 'bestiary-card-info';
        info.innerHTML = `
          <div class="bestiary-card-top">
            <span class="bestiary-card-name">${entry.name}</span>
            ${isBoss ? '<span class="bestiary-boss-tag">BOSS</span>' : ''}
          </div>
          <div class="bestiary-card-stats">
            <span>HP ${entry.baseHp}</span>
            <span>Pow ${entry.basePower}</span>
            <span>XP ${BASE_STATS_LOOKUP[entry.type]?.xpReward || '?'}</span>
            <span class="bestiary-gold-stat">${GOLD_LOOKUP[entry.type] || '?'}g</span>
          </div>
          <div class="bestiary-card-kills">Defeated: ${entry.kills}</div>
          <div class="bestiary-card-desc">${entry.desc}</div>
        `;

        card.appendChild(spriteCanvas);
        card.appendChild(info);
      } else {
        card.className = 'bestiary-card undiscovered';
        card.innerHTML = `
          <div class="bestiary-card-sprite-unknown">?</div>
          <div class="bestiary-card-info">
            <div class="bestiary-card-top">
              <span class="bestiary-card-name">???</span>
              ${isBoss ? '<span class="bestiary-boss-tag">BOSS</span>' : ''}
            </div>
            <div class="bestiary-card-desc">Defeat this creature to learn about it.</div>
          </div>
        `;
      }

      grid.appendChild(card);
    }

    section.appendChild(grid);
    content.appendChild(section);
  }

  // Count totals
  const total = entries.length;
  const discovered = entries.filter(e => e.discovered).length;
  const totalKills = entries.reduce((sum, e) => sum + e.kills, 0);
  const footer = document.createElement('div');
  footer.className = 'bestiary-footer';
  footer.textContent = `Discovered: ${discovered}/${total} · Total Kills: ${totalKills}`;
  content.appendChild(footer);
}

// ── Healer Overlay ──────────────────────────

function updateHealerOverlay() {
  const overlay = document.getElementById('healer-overlay');
  if (!state.showHealer) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  const status = document.getElementById('healer-status');
  const goldEl = document.getElementById('healer-gold');

  if (p.hp >= p.maxHp && p.mana >= p.maxMana) {
    status.textContent = 'You are already in perfect health!';
  } else {
    status.textContent = `HP: ${p.hp}/${p.maxHp}` + (p.maxMana > 0 ? ` | Mana: ${p.mana}/${p.maxMana}` : '');
  }
  goldEl.textContent = `Your gold: ${p.gold}`;
}

// ── Shop Overlay ────────────────────────────

let shopTab = 'buy';

function updateShopOverlay() {
  const overlay = document.getElementById('shop-overlay');
  if (!state.showShop) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  document.getElementById('shop-gold').textContent = `Your gold: ${p.gold}`;

  const buyList = document.getElementById('shop-buy-list');
  const sellList = document.getElementById('shop-sell-list');

  if (shopTab === 'buy') {
    buyList.style.display = '';
    sellList.style.display = 'none';
    document.getElementById('shop-tab-buy').classList.add('active');
    document.getElementById('shop-tab-sell').classList.remove('active');

    buyList.innerHTML = '';
    const items = getShopInventory();
    for (const entry of items) {
      const div = document.createElement('div');
      div.className = 'shop-item';
      const canBuy = p.gold >= entry.price && p.inventory.length < 30;
      div.innerHTML = `
        <span class="shop-item-name">${entry.item.icon} ${entry.item.name}</span>
        <span class="shop-item-desc">${entry.item.desc}</span>
        <span class="shop-item-price">${entry.price}g</span>
        <button class="shop-buy-btn" ${canBuy ? '' : 'disabled'}>Buy</button>
      `;
      div.querySelector('.shop-buy-btn').addEventListener('click', () => {
        buyItem(entry.index);
        render();
      });
      buyList.appendChild(div);
    }
  } else {
    buyList.style.display = 'none';
    sellList.style.display = '';
    document.getElementById('shop-tab-buy').classList.remove('active');
    document.getElementById('shop-tab-sell').classList.add('active');

    sellList.innerHTML = '';
    if (p.inventory.length === 0) {
      sellList.innerHTML = '<div class="shop-item"><span style="color:#666">No items to sell</span></div>';
    } else {
      for (let i = 0; i < p.inventory.length; i++) {
        const item = p.inventory[i];
        const div = document.createElement('div');
        div.className = 'shop-item';
        const count = item.count || 1;
        const countStr = count > 1 ? ` (x${count})` : '';
        div.innerHTML = `
          <span class="shop-item-name">${item.icon} ${item.name}${countStr}</span>
          <span class="shop-item-desc">${item.desc}</span>
          <button class="shop-sell-btn">Sell</button>
        `;
        const idx = i;
        div.querySelector('.shop-sell-btn').addEventListener('click', () => {
          sellItem(idx);
          render();
        });
        sellList.appendChild(div);
      }
    }
  }
}

// Shop tab switching
document.getElementById('shop-tab-buy').addEventListener('click', () => {
  shopTab = 'buy';
  render();
});
document.getElementById('shop-tab-sell').addEventListener('click', () => {
  shopTab = 'sell';
  render();
});

// ── Chest Overlay ───────────────────────────

function updateChestOverlay() {
  const overlay = document.getElementById('chest-overlay');
  if (!state.showChest) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const chest = getActiveChest();
  if (!chest) return;

  const goldEl = document.getElementById('chest-gold');
  if (chest.gold > 0) {
    goldEl.innerHTML = `<span class="chest-gold-amount">Gold: ${chest.gold}</span> <button class="chest-take-gold-btn">Take Gold</button>`;
    goldEl.querySelector('.chest-take-gold-btn').addEventListener('click', () => {
      takeChestGold();
      render();
    });
  } else {
    goldEl.textContent = 'Gold: taken';
    goldEl.style.color = '#555';
  }

  const listEl = document.getElementById('chest-items-list');
  listEl.innerHTML = '';

  if (chest.items.length === 0) {
    listEl.innerHTML = '<div class="chest-item"><span style="color:#555">No items remaining</span></div>';
  } else {
    for (let i = 0; i < chest.items.length; i++) {
      const item = chest.items[i];
      const div = document.createElement('div');
      div.className = 'chest-item';

      // Tier color
      const tierColors = { 1: '#aaa', 2: '#4488ee', 3: '#e0a040' };
      const tierNames = { 1: 'Common', 2: 'Uncommon', 3: 'Rare' };
      const tierHtml = item.tier ? `<span class="chest-item-tier" style="color:${tierColors[item.tier]}">[${tierNames[item.tier]}]</span> ` : '';

      div.innerHTML = `
        <div class="chest-item-info">
          ${tierHtml}<span class="chest-item-name">${item.icon} ${item.name}</span>
          <span class="chest-item-desc">${item.desc || ''}</span>
        </div>
        <button class="chest-take-btn">Take</button>
      `;
      const idx = i;
      div.querySelector('.chest-take-btn').addEventListener('click', () => {
        takeChestItem(idx);
        render();
      });
      listEl.appendChild(div);
    }
  }

  // Hide take all if empty
  const takeAllBtn = document.getElementById('take-all-chest');
  if (chest.items.length === 0 && chest.gold <= 0) {
    takeAllBtn.style.display = 'none';
  } else {
    takeAllBtn.style.display = '';
  }
}

// ── Item Tooltip ────────────────────────────

const tooltip = document.getElementById('item-tooltip');

function showItemTooltip(e, item) {
  let html = '';

  // Tier badge
  if (item.tier) {
    const tierNames = { 1: 'Common', 2: 'Uncommon', 3: 'Rare' };
    html += `<div class="tooltip-tier tier-${item.tier}">${tierNames[item.tier] || ''}</div>`;
  }

  // Name
  html += `<div class="tooltip-name">${item.icon} ${item.name}</div>`;

  // Type
  const typeLabels = { weapon: 'Weapon', helmet: 'Helmet', chest: 'Chest Armor', gloves: 'Gloves', boots: 'Boots', cape: 'Cape', consumable: 'Consumable' };
  html += `<div class="tooltip-type">${typeLabels[item.type] || item.type}</div>`;

  // Stats
  const stats = [];
  if (item.power) stats.push(`+${item.power} Power`);
  if (item.armor) stats.push(`+${item.armor} Armor`);
  if (item.spellBonus) stats.push(`+${item.spellBonus} Spell Damage`);
  if (item.rangeBonus) stats.push(`+${item.rangeBonus} Range`);
  if (item.manaBonus) stats.push(`+${item.manaBonus} Max Mana`);
  if (item.healAmount) stats.push(`Restores ${item.healAmount} HP`);
  if (item.effect) stats.push(`${item.effect.name}: +${item.effect.amount} ${item.effect.stat} (${item.effect.turns} turns)`);
  if (item.count && item.count > 1) stats.push(`Count: ${item.count}`);

  if (stats.length > 0) {
    html += '<div class="tooltip-stats">';
    for (const s of stats) html += `<div class="tooltip-stat">${s}</div>`;
    html += '</div>';
  }

  // Description
  if (item.desc) {
    html += `<div class="tooltip-desc">${item.desc}</div>`;
  }

  tooltip.innerHTML = html;
  tooltip.classList.remove('hidden');
  positionTooltip(e);
}

function positionTooltip(e) {
  const pad = 12;
  let x = e.clientX + pad;
  let y = e.clientY + pad;

  const rect = tooltip.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) x = e.clientX - rect.width - pad;
  if (y + rect.height > window.innerHeight) y = e.clientY - rect.height - pad;

  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function hideItemTooltip() {
  tooltip.classList.add('hidden');
}

// ── Minimap Rendering ───────────────────────

function updateMinimap() {
  const overlay = document.getElementById('minimap-overlay');
  if (!state.showMinimap) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const minimapCanvas = document.getElementById('minimap-canvas');
  const mctx = minimapCanvas.getContext('2d');

  // Scale: each map tile = 4px on minimap
  const SCALE = 4;
  minimapCanvas.width = state.mapW * SCALE;
  minimapCanvas.height = state.mapH * SCALE;

  // Limit canvas display size
  const maxDisplay = 500;
  const ratio = Math.min(maxDisplay / minimapCanvas.width, maxDisplay / minimapCanvas.height, 1);
  minimapCanvas.style.width = Math.floor(minimapCanvas.width * ratio) + 'px';
  minimapCanvas.style.height = Math.floor(minimapCanvas.height * ratio) + 'px';

  mctx.fillStyle = '#000';
  mctx.fillRect(0, 0, minimapCanvas.width, minimapCanvas.height);

  // Tile colors
  const wallColor = '#3a3a4a';
  const floorColor = '#1a2a1a';
  const stairsColor = '#e0c040';
  const entranceColor = '#40a060';

  // Draw revealed tiles
  for (let y = 0; y < state.mapH; y++) {
    for (let x = 0; x < state.mapW; x++) {
      if (!state.revealed[y][x]) continue;

      const tile = state.map[y][x];
      const props = TILE_PROPS[tile];
      if (!props) continue;

      if (tile === TILE.CAVE_STAIRS) {
        mctx.fillStyle = stairsColor;
      } else if (tile === TILE.CAVE_ENTRANCE) {
        mctx.fillStyle = entranceColor;
      } else if (props.walkable) {
        mctx.fillStyle = floorColor;
      } else {
        mctx.fillStyle = wallColor;
      }

      // Dim non-visible tiles
      if (!state.visibility[y][x]) {
        mctx.globalAlpha = 0.4;
      } else {
        mctx.globalAlpha = 1;
      }

      mctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }

  mctx.globalAlpha = 1;

  // Draw visible enemies
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    mctx.fillStyle = enemy.isBoss ? '#e0c040' : '#e04040';
    mctx.fillRect(enemy.x * SCALE, enemy.y * SCALE, SCALE, SCALE);
  }

  // Draw ground items (visible)
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    mctx.fillStyle = '#40c040';
    mctx.fillRect(gi.x * SCALE, gi.y * SCALE, SCALE, SCALE);
  }

  // Draw player
  mctx.fillStyle = '#4080ff';
  mctx.fillRect(state.player.x * SCALE, state.player.y * SCALE, SCALE, SCALE);

  // Legend
  const legendEl = document.getElementById('minimap-legend');
  legendEl.innerHTML = `
    <div class="legend-item"><span class="legend-swatch" style="background:#4080ff"></span> You</div>
    <div class="legend-item"><span class="legend-swatch" style="background:#e04040"></span> Enemy</div>
    <div class="legend-item"><span class="legend-swatch" style="background:#e0c040"></span> Boss</div>
    <div class="legend-item"><span class="legend-swatch" style="background:#40c040"></span> Item</div>
    <div class="legend-item"><span class="legend-swatch" style="background:#e0c040;border-color:#e0c040"></span> Stairs</div>
  `;

  // Monsters on this floor
  const monstersEl = document.getElementById('minimap-monsters');
  const alive = state.enemies.filter(e => e.hp > 0);
  if (alive.length === 0) {
    monstersEl.innerHTML = '<h3>Monsters</h3><div class="minimap-monster-row"><span style="color:#666">No monsters remaining</span></div>';
    return;
  }

  // Count by type
  const counts = {};
  for (const e of alive) {
    const name = getEnemyName(e);
    const key = name + (e.isBoss ? '_boss' : '');
    if (!counts[key]) counts[key] = { name, count: 0, isBoss: e.isBoss, visible: false };
    counts[key].count++;
    if (state.visibility[e.y] && state.visibility[e.y][e.x]) counts[key].visible = true;
  }

  let html = '<h3>Monsters on Floor</h3>';
  for (const info of Object.values(counts)) {
    const nameClass = info.isBoss ? 'minimap-monster-boss' : 'minimap-monster-name';
    const vis = info.visible ? '' : ' (hidden)';
    html += `<div class="minimap-monster-row">
      <span class="${nameClass}">${info.isBoss ? '* ' : ''}${info.name}</span>
      <span class="minimap-monster-count">x${info.count}${vis}</span>
    </div>`;
  }
  monstersEl.innerHTML = html;
}

// ── Torch Animation Loop ───────────────────
let lastTorchFrame = -1;
function torchAnimLoop() {
  requestAnimationFrame(torchAnimLoop);
  const frame = getTorchFrame();
  if (frame !== lastTorchFrame && state.phase !== 'class_select' && state.mode === 'dungeon') {
    lastTorchFrame = frame;
    renderCanvas();
  }
}
torchAnimLoop();

// Separate canvas-only render for animation (avoids full UI rebuild)
function renderCanvas() {
  if (state.phase === 'class_select') return;

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { camX, camY } = getCamera();

  // Draw tiles
  for (let vy = 0; vy < VIEW_H; vy++) {
    for (let vx = 0; vx < VIEW_W; vx++) {
      const mx = camX + vx;
      const my = camY + vy;
      if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;
      const visible = state.visibility[my][mx];
      const revealed = state.revealed[my][mx];
      if (!revealed) continue;
      const tile = state.map[my][mx];
      const sprite = getTileSprite(tile);
      const sx = vx * TILE_SIZE;
      const sy = vy * TILE_SIZE;
      ctx.drawImage(sprite, sx, sy);
      if (!visible) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(sx, sy, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Draw torches
  if (state.mode === 'dungeon') {
    const torchSprite = getTorchSprite();
    for (let vy = 0; vy < VIEW_H; vy++) {
      for (let vx = 0; vx < VIEW_W; vx++) {
        const mx = camX + vx;
        const my = camY + vy;
        if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;
        if (!state.revealed[my][mx]) continue;
        const tile = state.map[my][mx];
        const props = TILE_PROPS[tile];
        if (!props || props.walkable) continue;
        const belowY = my + 1;
        if (belowY >= state.mapH) continue;
        const belowTile = state.map[belowY][mx];
        const belowProps = TILE_PROPS[belowTile];
        if (!belowProps || !belowProps.walkable) continue;
        if ((mx + my * 7) % 4 !== 0) continue;
        const sx = vx * TILE_SIZE;
        const sy = vy * TILE_SIZE;
        if (state.visibility[my][mx]) {
          ctx.drawImage(torchSprite, sx, sy);
        } else {
          ctx.globalAlpha = 0.4;
          ctx.drawImage(torchSprite, sx, sy);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Draw ground items
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    const sx = (gi.x - camX) * TILE_SIZE;
    const sy = (gi.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(getItemSprite(gi.item.icon), sx, sy);
  }

  // Draw chests
  for (const chest of state.chests) {
    if (!state.visibility[chest.y] || !state.visibility[chest.y][chest.x]) continue;
    const sx = (chest.x - camX) * TILE_SIZE;
    const sy = (chest.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(chest.opened ? getChestOpenSprite() : getChestClosedSprite(), sx, sy);
  }

  // Draw enemies
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    const sx = (enemy.x - camX) * TILE_SIZE;
    const sy = (enemy.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(getEnemySprite(enemy.type), sx, sy);
    if (enemy.isBoss) {
      ctx.strokeStyle = '#e0c040';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, TILE_SIZE - 2, TILE_SIZE - 2);
    }
    const hpPct = enemy.hp / enemy.maxHp;
    ctx.fillStyle = '#300';
    ctx.fillRect(sx + 4, sy - 4, TILE_SIZE - 8, 3);
    ctx.fillStyle = hpPct > 0.5 ? '#0c0' : hpPct > 0.25 ? '#cc0' : '#c00';
    ctx.fillRect(sx + 4, sy - 4, (TILE_SIZE - 8) * hpPct, 3);
  }

  // Draw projectiles
  for (const proj of state.projectiles) {
    const sx = (proj.x - camX) * TILE_SIZE;
    const sy = (proj.y - camY) * TILE_SIZE;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    if (proj.type === 'fire') ctx.drawImage(getFireballSprite(), sx, sy);
    else if (proj.type === 'arrow') ctx.drawImage(getArrowSprite(), sx, sy);
    else if (proj.type === 'ice') ctx.drawImage(getIceShardSprite(), sx, sy);
    else if (proj.type === 'lightning') ctx.drawImage(getLightningSprite(), sx, sy);
  }

  // Draw player
  const psx = (state.player.x - camX) * TILE_SIZE;
  const psy = (state.player.y - camY) * TILE_SIZE;
  ctx.drawImage(getPlayerSprite(state.playerClass), psx, psy);
}
