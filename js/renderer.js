import { TILE_SIZE, VIEW_W, VIEW_H, BACKPACK_SIZE, ENTITY, PLAYER_CLASS, EQUIP_SLOT, ITEM_TYPE, SPELLS, TILE, TILE_PROPS, BASE_STATS, GOLD_REWARDS, FLOOR_THEMES, BOSS_FOR_THEME, ATTR_LABELS, ATTR_DESCRIPTIONS, ATTR_BONUSES, ELEMENT_COLORS, ITEMS, FEATURE_INFO, SKILL_TREES, ACHIEVEMENTS, BOSS_SKILLS, ITEM_SETS, PRESTIGE, CRAFTING_RECIPES, MONSTER_CATEGORIES, BESTIARY_INFO, SUBCLASS, SUBCLASS_INFO, TOWN_UPGRADES, PHASE_BOSSES, BOSS_CAVE_BOSSES, DIFFICULTY, CLASS_UNLOCK_CONDITIONS, CLASS_STATS, VILLAGE_BUILDINGS, ALCHEMY_RECIPES, HERO_COLORS, BESTIARY_BONUSES } from './constants.js?v=47';
import { t } from './i18n.js';

// Lookups for bestiary
const BASE_STATS_LOOKUP = BASE_STATS;
const GOLD_LOOKUP = GOLD_REWARDS;
import { getTileSprite, getPlayerSprite, getEnemySprite, getItemSprite, getFireballSprite, getArrowSprite, getIceShardSprite, getLightningSprite, getTorchSprite, getTorchFrame, getChestClosedSprite, getChestOpenSprite, clearPlayerSpriteCache } from './sprites.js?v=47';
import { state, getPlayerPower, getPlayerArmor, getBestiaryEntries, getArmoryEntries, getFloorThemeName, allocateStat, getEnemyName, getShopInventory, buyItem, sellItem, getSellPrice, isTrashItem, sellAllTrash, healPlayer, closeHealer, closeShop, getActiveChest, takeChestItem, takeChestGold, dropItem, destroyItem, useItem, unequipItem, getPlayerDodgeChance, getPlayerShopDiscount, getDiscountedPrice, playerHasAllSeeingEye, getAvailableQuests, getActiveQuests, acceptQuest, abandonQuest, turnInQuest, closeQuestBoard, toggleCharSheet, closeCharSheet, toggleSkillTree, getSkillRank, canLearnSkill, learnSkill, getSkillTree, getAchievements, checkAchievements, getActiveSetBonuses, gameSettings, damageNumbers, craftItem, closeBlacksmith, selectSubclass, isSubclassBranchUnlocked, getTownUpgradeLevel, upgradeTownBuilding, getAvailableCraftingRecipes, getRunHistory, closeRunHistory, SAVE_SLOTS, saveToSlot, loadFromSlot, deleteSlot, getSlotInfo, setDifficulty, purchaseBuilding, closeVillageExpansion, setHeroName, setHeroColor, enterBeach, enterTown, exitBeach, exitTown, alchemyCraft, getBestiaryDamageBonus, cleanSpeechBubbles, getFloorMapNotes } from './engine.js?v=47';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

function getTS() { return gameSettings.tileSize; }
function getViewW() { return window._dynamicViewW || Math.floor((VIEW_W * TILE_SIZE) / getTS()); }
function getViewH() { return window._dynamicViewH || Math.floor((VIEW_H * TILE_SIZE) / getTS()); }

export function resizeCanvas() {
  const ts = getTS();
  // Calculate available space
  const wrapper = document.getElementById('canvas-container');
  const uiPanel = document.getElementById('ui-panel');
  const msgLog = document.getElementById('message-log');
  const availW = wrapper ? wrapper.clientWidth : VIEW_W * TILE_SIZE;
  const msgH = msgLog ? msgLog.offsetHeight + 4 : 84;
  const availH = (window.innerHeight - 24 - msgH); // padding + message log
  // Fit as many tiles as possible
  const tilesW = Math.max(10, Math.floor(availW / ts));
  const tilesH = Math.max(8, Math.floor(availH / ts));
  canvas.width = tilesW * ts;
  canvas.height = tilesH * ts;
  ctx.imageSmoothingEnabled = false;
  // Store dynamic view size
  window._dynamicViewW = tilesW;
  window._dynamicViewH = tilesH;
}

canvas.width = VIEW_W * TILE_SIZE;
canvas.height = VIEW_H * TILE_SIZE;
ctx.imageSmoothingEnabled = false;  // crisp pixel-art scaling

// ── Camera ───────────────────────────────────

function getCamera() {
  const p = state.player;
  const vw = getViewW();
  const vh = getViewH();
  let camX = p.x - Math.floor(vw / 2);
  let camY = p.y - Math.floor(vh / 2);

  camX = Math.max(0, Math.min(camX, state.mapW - vw));
  camY = Math.max(0, Math.min(camY, state.mapH - vh));

  return { camX, camY };
}

// ── Hero Customization ───────────────────────
function updateHeroCustomization() {
  const nameInput = document.getElementById('hero-name-input');
  if (nameInput && !nameInput.dataset.bound) {
    nameInput.dataset.bound = '1';
    nameInput.addEventListener('input', () => setHeroName(nameInput.value));
    nameInput.value = state.heroName || 'Hero';
  }
  // Color buttons
  document.querySelectorAll('.hero-color-btn').forEach(btn => {
    const colorId = btn.dataset.colorId;
    btn.classList.toggle('active', colorId === (state.heroColor || 'default'));
  });
}

// ── Render ───────────────────────────────────
export function render() {
  if (state.phase === 'class_select') return;

  const ts = getTS();
  const vw = getViewW();
  const vh = getViewH();
  const S = TILE_SIZE; // sprite source size (always 48)

  // Resize canvas if tile size changed
  if (canvas.width !== vw * ts || canvas.height !== vh * ts) {
    resizeCanvas();
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { camX, camY } = getCamera();

  // Draw tiles
  for (let vy = 0; vy < vh; vy++) {
    for (let vx = 0; vx < vw; vx++) {
      const mx = camX + vx;
      const my = camY + vy;

      if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;

      const visible = state.visibility[my][mx];
      const revealed = state.revealed[my][mx];

      if (!revealed) continue;

      const tile = state.map[my][mx];
      const sprite = getTileSprite(tile, mx, my);
      const sx = vx * ts;
      const sy = vy * ts;

      ctx.drawImage(sprite, 0, 0, S, S, sx, sy, ts, ts);

      if (!visible) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(sx, sy, ts, ts);
      }
    }
  }

  // Draw torches on dungeon walls (walls adjacent to floor on their south side)
  if (state.mode === 'dungeon' || state.mode === 'arena') {
    const torchSprite = getTorchSprite();
    for (let vy = 0; vy < vh; vy++) {
      for (let vx = 0; vx < vw; vx++) {
        const mx = camX + vx;
        const my = camY + vy;
        if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;
        if (!state.revealed[my][mx]) continue;

        const tile = state.map[my][mx];
        const props = TILE_PROPS[tile];
        if (!props || props.walkable) continue; // only walls

        const belowY = my + 1;
        if (belowY >= state.mapH) continue;
        const belowTile = state.map[belowY][mx];
        const belowProps = TILE_PROPS[belowTile];
        if (!belowProps || !belowProps.walkable) continue;

        if ((mx + my * 7) % 4 !== 0) continue;

        const sx = vx * ts;
        const sy = vy * ts;

        if (state.visibility[my][mx]) {
          ctx.drawImage(torchSprite, 0, 0, S, S, sx, sy, ts, ts);
        } else {
          ctx.globalAlpha = 0.4;
          ctx.drawImage(torchSprite, 0, 0, S, S, sx, sy, ts, ts);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Draw ground items (only visible)
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    const sx = (gi.x - camX) * ts;
    const sy = (gi.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const sprite = getItemSprite(gi.item.icon);
    ctx.drawImage(sprite, 0, 0, S, S, sx, sy, ts, ts);
  }

  // Draw dens (monster breeding dens)
  if (state.dens) {
    for (const den of state.dens) {
      if (den.destroyed) continue;
      if (!state.visibility[den.y] || !state.visibility[den.y][den.x]) continue;
      const sx = (den.x - camX) * ts;
      const sy = (den.y - camY) * ts;
      if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;

      // Pulsing glow when about to spawn
      if (den.spawnTimer <= 1) {
        ctx.fillStyle = 'rgba(255, 100, 50, 0.3)';
        ctx.fillRect(sx - 2, sy - 2, ts + 4, ts + 4);
      }

      // Den body (nest/mound shape) colored by theme
      const denColors = {
        den_goblin: '#8a6030', den_spider: '#604a60', den_crypt: '#a0a0b0',
        den_mushroom: '#408040', den_fire: '#c04020', den_ice: '#4080c0',
      };
      const baseColor = denColors[den.type] || '#806040';
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.ellipse(sx + ts / 2, sy + ts * 0.6, ts * 0.4, ts * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(sx + ts / 2, sy + ts * 0.5, ts * 0.2, ts * 0.15, 0, 0, Math.PI * 2);
      ctx.fill();

      // HP bar
      const hpPct = den.hp / den.maxHp;
      const barY = sy - 6;
      ctx.fillStyle = '#300';
      ctx.fillRect(sx + 4, barY, ts - 8, 4);
      ctx.fillStyle = hpPct > 0.5 ? '#0c0' : hpPct > 0.25 ? '#cc0' : '#c00';
      ctx.fillRect(sx + 4, barY, (ts - 8) * hpPct, 4);

      // Den name label
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(den.name, sx + ts / 2 + 1, barY - 1);
      ctx.fillStyle = '#f0c060';
      ctx.fillText(den.name, sx + ts / 2, barY - 2);
    }
  }

  // Draw chests
  for (const chest of state.chests) {
    if (!state.visibility[chest.y] || !state.visibility[chest.y][chest.x]) continue;
    const sx = (chest.x - camX) * ts;
    const sy = (chest.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const sprite = chest.opened ? getChestOpenSprite() : getChestClosedSprite();
    ctx.drawImage(sprite, 0, 0, S, S, sx, sy, ts, ts);
  }

  // Draw enemies (only visible)
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    const sx = (enemy.x - camX) * ts;
    const sy = (enemy.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const bossSize = enemy.bossSize || 1;
    const drawW = ts * bossSize;
    const drawH = ts * bossSize;
    ctx.drawImage(getEnemySprite(enemy.type), 0, 0, S, S, sx, sy, drawW, drawH);

    // Guardian orange+gold border indicator
    if (enemy.isGuardian) {
      ctx.strokeStyle = '#e0a020';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx, sy, ts, ts);
      ctx.fillStyle = 'rgba(220, 160, 30, 0.15)';
      ctx.fillRect(sx, sy, ts, ts);
    }
    // Boss gold border indicator
    else if (enemy.isBoss) {
      ctx.strokeStyle = '#e0c040';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
    }
    // Miniboss purple glow
    else if (enemy.isMiniboss) {
      ctx.strokeStyle = '#c060e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
      ctx.fillStyle = 'rgba(180, 80, 220, 0.12)';
      ctx.fillRect(sx, sy, ts, ts);
    }
    // Elite cyan glow
    else if (enemy.isElite) {
      ctx.strokeStyle = '#40c0e0';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
      ctx.fillStyle = 'rgba(60, 180, 220, 0.10)';
      ctx.fillRect(sx, sy, ts, ts);
    }

    const barY = sy - 6;

    // HP bar above enemy (conditional)
    if (gameSettings.showEnemyHpBars) {
      const hpPct = enemy.hp / enemy.maxHp;
      ctx.fillStyle = '#300';
      ctx.fillRect(sx + 4, barY, drawW - 8, 4);
      ctx.fillStyle = hpPct > 0.5 ? '#0c0' : hpPct > 0.25 ? '#cc0' : '#c00';
      ctx.fillRect(sx + 4, barY, (drawW - 8) * hpPct, 4);
    }

    // Guardian name label
    if (enemy.isGuardian && enemy.guardianName) {
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(enemy.guardianName, sx + ts / 2 + 1, barY - 1);
      ctx.fillStyle = '#e0a020';
      ctx.fillText(enemy.guardianName, sx + ts / 2, barY - 2);
      ctx.textAlign = 'start';
    }
    // Elite/Miniboss name label
    else if (enemy.isElite || enemy.isMiniboss) {
      ctx.fillStyle = enemy.isMiniboss ? '#c060e0' : '#40c0e0';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(enemy.elitePrefix || 'Elite', sx + ts / 2, barY - 2);
      ctx.textAlign = 'start';
    }

    // Phase boss visual indicator
    if (enemy.isPhaseBoss) {
      const phase = (enemy.bossPhase || 0) + 1;
      // Pulsing border — white when transitioning, red/gold otherwise
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      const borderColor = enemy.phaseInvulnerable > 0
        ? `rgba(255,255,255,${pulse})`
        : enemy.isBossCaveBoss ? `rgba(255,180,20,${pulse})` : `rgba(255,40,40,${pulse})`;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = enemy.isBossCaveBoss ? 3 : 2;
      ctx.strokeRect(sx, sy, drawW, drawH);
      ctx.lineWidth = 1;

      // Phase indicator dots (one dot per phase, filled = current)
      const totalPhases = enemy.isBossCaveBoss
        ? (BOSS_CAVE_BOSSES[enemy.bossCaveIndex]?.phases?.length || 3)
        : 3;
      const dotSpacing = 8;
      const dotsW = (totalPhases - 1) * dotSpacing + 6;
      const dotStartX = sx + drawW / 2 - dotsW / 2;
      for (let pi = 0; pi < totalPhases; pi++) {
        ctx.fillStyle = pi < phase ? (enemy.isBossCaveBoss ? '#ffa020' : '#ff4040') : '#333';
        ctx.beginPath();
        ctx.arc(dotStartX + pi * dotSpacing + 3, barY - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = pi < phase ? '#fff' : '#666';
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // Phase label
      ctx.fillStyle = enemy.isBossCaveBoss ? '#ffd040' : '#ff4';
      ctx.font = `bold ${enemy.isBossCaveBoss ? 10 : 9}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(`PHASE ${phase}`, sx + drawW / 2, barY - 10);
      ctx.textAlign = 'start';

      // Boss Cave: show boss name above the phase label
      if (enemy.isBossCaveBoss && enemy.phaseName) {
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';
        ctx.fillText(enemy.phaseName, sx + drawW / 2 + 1, barY - 21);
        ctx.fillStyle = '#ffd040';
        ctx.fillText(enemy.phaseName, sx + drawW / 2, barY - 22);
        ctx.textAlign = 'start';
      }
    }
  }

  // Draw projectiles
  for (const proj of state.projectiles) {
    const sx = (proj.x - camX) * ts;
    const sy = (proj.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    if (proj.type === 'fire') {
      ctx.drawImage(getFireballSprite(), 0, 0, S, S, sx, sy, ts, ts);
    } else if (proj.type === 'arrow') {
      ctx.drawImage(getArrowSprite(), 0, 0, S, S, sx, sy, ts, ts);
    } else if (proj.type === 'ice') {
      ctx.drawImage(getIceShardSprite(), 0, 0, S, S, sx, sy, ts, ts);
    } else if (proj.type === 'lightning') {
      ctx.drawImage(getLightningSprite(), 0, 0, S, S, sx, sy, ts, ts);
    }
  }

  // Draw player
  {
    const sx = (state.player.x - camX) * ts;
    const sy = (state.player.y - camY) * ts;
    ctx.drawImage(getPlayerSprite(state.playerClass), 0, 0, S, S, sx, sy, ts, ts);
    // Hero name above player
    if (state.heroName && state.heroName !== 'Hero') {
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000';
      ctx.fillText(state.heroName, sx + ts / 2 + 1, sy - 3);
      ctx.fillStyle = '#fff';
      ctx.fillText(state.heroName, sx + ts / 2, sy - 4);
      ctx.textAlign = 'start';
    }
  }

  // Draw damage numbers
  if (damageNumbers.length > 0) {
    for (let i = damageNumbers.length - 1; i >= 0; i--) {
      const dn = damageNumbers[i];
      dn.age++;
      if (dn.age >= dn.maxAge) {
        damageNumbers.splice(i, 1);
        continue;
      }
      const progress = dn.age / dn.maxAge;
      const alpha = 1 - progress;
      const floatY = progress * 30;

      const dnx = (dn.x - camX) * ts + ts / 2;
      const dny = (dn.y - camY) * ts - floatY;

      ctx.globalAlpha = alpha;
      ctx.fillStyle = dn.color;
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(dn.text, dnx, dny);
      ctx.globalAlpha = 1;
      ctx.textAlign = 'start';
    }
  }

  // Draw speech bubbles as DOM overlay
  renderSpeechBubbles(camX, camY, ts);

  // Boss Cave: room name banner when a boss cave boss is visible on screen
  if (state.inBossCave) {
    const visibleBoss = state.enemies.find(e => e.isBossCaveBoss && e.hp > 0);
    if (visibleBoss) {
      const bossData = BOSS_CAVE_BOSSES[visibleBoss.bossCaveIndex];
      const phaseIdx = visibleBoss.bossPhase || 0;
      const roomName = bossData?.roomName || '';
      const bossName = bossData?.name || '';
      const totalPhases = bossData?.phases?.length || 3;
      // Draw boss banner at bottom of canvas
      const bw = canvas.width, bh = 48;
      const by = canvas.height - bh - 2;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, by, bw, bh);
      ctx.strokeStyle = '#c08020';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, by, bw, bh);
      // Room name
      ctx.fillStyle = '#a08030';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(roomName.toUpperCase(), bw / 2, by + 13);
      // Boss name
      ctx.fillStyle = '#ffd040';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(bossName, bw / 2, by + 30);
      // Phase pip bar
      const pipW = 10, pipGap = 4;
      const totalPipW = totalPhases * (pipW + pipGap) - pipGap;
      const pipStartX = bw / 2 - totalPipW / 2;
      for (let pi = 0; pi < totalPhases; pi++) {
        ctx.fillStyle = pi <= phaseIdx ? '#ff6020' : '#333';
        ctx.fillRect(pipStartX + pi * (pipW + pipGap), by + 38, pipW, 6);
        if (pi <= phaseIdx) {
          ctx.fillStyle = 'rgba(255,160,60,0.5)';
          ctx.fillRect(pipStartX + pi * (pipW + pipGap), by + 38, pipW, 3);
        }
      }
      // HP bar
      const hpPct = Math.max(0, visibleBoss.hp / visibleBoss.maxHp);
      const hpBarW = Math.min(bw - 100, 300);
      const hpBarX = bw / 2 - hpBarW / 2;
      ctx.fillStyle = '#400';
      ctx.fillRect(hpBarX, by + 38, hpBarW, 6);
      ctx.fillStyle = hpPct > 0.5 ? '#cc4000' : hpPct > 0.25 ? '#ee6000' : '#ff2000';
      ctx.fillRect(hpBarX, by + 38, hpBarW * hpPct, 6);
      ctx.strokeStyle = '#800';
      ctx.strokeRect(hpBarX, by + 38, hpBarW, 6);
      ctx.textAlign = 'start';
      ctx.lineWidth = 1;
    }
  }

  // Show talent tree overlay based on state
  const talentOverlay = document.getElementById('talent-tree-overlay');
  if (talentOverlay) talentOverlay.classList.toggle('hidden', !state.showTalentTree);

  updateUI();
}

// ── Speech Bubble DOM Overlay ───────────────
let _bubbleContainer = null;
function getSpeechBubbleContainer() {
  if (!_bubbleContainer) {
    _bubbleContainer = document.createElement('div');
    _bubbleContainer.id = 'speech-bubble-layer';
    _bubbleContainer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;';
    const wrapper = document.getElementById('canvas-wrapper');
    if (wrapper) wrapper.style.position = 'relative';
    if (wrapper) wrapper.appendChild(_bubbleContainer);
  }
  return _bubbleContainer;
}

function renderSpeechBubbles(camX, camY, ts) {
  cleanSpeechBubbles();
  const container = getSpeechBubbleContainer();
  container.innerHTML = '';
  if (!state.speechBubbles || state.speechBubbles.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const wrapperRect = (canvas.parentElement || canvas).getBoundingClientRect();
  const now = Date.now();
  for (const b of state.speechBubbles) {
    if (b.expiresAt < now) continue;
    // Convert world coords to canvas pixel coords
    const px = (b.x - camX) * ts + ts / 2;
    const py = (b.y - camY) * ts - 6;
    if (px < -20 || px > canvas.width + 20 || py < -30 || py > canvas.height) continue;
    // Scale to actual canvas display size
    const scaleX = canvas.offsetWidth / canvas.width || 1;
    const scaleY = canvas.offsetHeight / canvas.height || 1;
    const el = document.createElement('div');
    const typeClass = b.type === 'boss' ? 'boss' : 'enemy';
    el.className = `speech-bubble ${typeClass}`;
    el.textContent = b.text;
    el.style.left = Math.round(px * scaleX) + 'px';
    el.style.top  = Math.round(py * scaleY) + 'px';
    container.appendChild(el);
  }
}

// ── Equipment Slot Labels ───────────────────

function getSlotLabel(slot) {
  const map = {
    [EQUIP_SLOT.WEAPON]:  'slot.weapon',
    [EQUIP_SLOT.HELMET]:  'slot.helmet',
    [EQUIP_SLOT.CHEST]:   'slot.chest',
    [EQUIP_SLOT.GLOVES]:  'slot.gloves',
    [EQUIP_SLOT.BOOTS]:   'slot.boots',
    [EQUIP_SLOT.CAPE]:    'slot.cape',
  };
  return t(map[slot] || 'slot.weapon');
}

// ── UI Updates ───────────────────────────────

function updateUI() {
  const p = state.player;

  // Class display
  const classEl = document.getElementById('class-display');
  if (classEl) {
    if (state.player && state.player.subclass && SUBCLASS_INFO[state.player.subclass]) {
      classEl.textContent = SUBCLASS_INFO[state.player.subclass].name;
    } else {
      const classKey = { warrior: 'class.warrior', mage: 'class.mage', archer: 'class.archer' };
      const classNameFallback = CLASS_STATS[state.playerClass]?.name || 'Adventurer';
      classEl.textContent = t(classKey[state.playerClass]) || classNameFallback;
    }
  }

  // Floor display
  const floorEl = document.getElementById('floor-display');
  if (state.mode === 'arena') {
    floorEl.textContent = t('ui.arena_wave', { wave: state.arenaWave, enemies: state.arenaEnemiesRemaining });
  } else if (state.floor === 0) {
    floorEl.textContent = t('ui.village');
  } else {
    const themeName = getFloorThemeName();
    floorEl.textContent = themeName ? t('ui.theme_floor', { theme: themeName, floor: state.floor }) : t('ui.dungeon_floor', { floor: state.floor });
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

  // Level-up / stat/skill notification in sidebar
  updateLevelUpNotification(p);

  // Equipment slots (all 6)
  const equipGrid = document.getElementById('equip-grid');
  equipGrid.innerHTML = '';
  for (const slot of Object.values(EQUIP_SLOT)) {
    const div = document.createElement('div');
    div.className = 'equip-slot';
    const item = p.equipment[slot];
    if (item) {
      if (item.setId && ITEM_SETS[item.setId]) {
        div.classList.add('set-item');
        div.style.borderColor = ITEM_SETS[item.setId].color;
      }
      div.innerHTML = `
        <span class="slot-label">${getSlotLabel(slot)}</span>
        <span class="slot-item">${item.icon} ${item.name}</span>
      `;
      div.style.cursor = 'pointer';
      div.addEventListener('click', () => {
        showItemPopup(item, slot, 'equipment');
      });
    } else {
      div.innerHTML = `
        <span class="slot-label">${getSlotLabel(slot)}</span>
        <span class="slot-item empty">${t('ui.empty')}</span>
      `;
    }
    equipGrid.appendChild(div);
  }

  // Set bonus summary
  updateSetBonusSummary();

  // Inventory grid with tab filtering
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  const GEAR_TYPES = new Set(['weapon', 'helmet', 'chest', 'gloves', 'boots', 'cape']);
  const activeTab = window._invTab || 'all';

  // Update tab button active state
  const tabBtns = document.querySelectorAll('.inv-tab');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === activeTab);
  });

  // Filter inventory items by active tab
  const filteredItems = [];
  for (let i = 0; i < p.inventory.length; i++) {
    const item = p.inventory[i];
    const t = item.type || 'consumable';
    let show = false;
    if (activeTab === 'all') show = true;
    else if (activeTab === 'gear') show = GEAR_TYPES.has(t);
    else if (activeTab === 'potions') show = (t === 'consumable');
    else if (activeTab === 'ingredients') show = (t === 'material');
    else if (activeTab === 'others') show = !GEAR_TYPES.has(t) && t !== 'consumable' && t !== 'material';
    if (show) filteredItems.push({ item, origIdx: i });
  }

  // Show filtered items + empty slots to fill the grid
  const slotsToShow = Math.max(filteredItems.length, 24);
  for (let i = 0; i < slotsToShow; i++) {
    const slot = document.createElement('div');
    slot.className = 'inv-slot';
    if (i < filteredItems.length) {
      const { item, origIdx } = filteredItems[i];
      slot.classList.add('type-' + (item.type || 'consumable'));
      if (item.tier) slot.classList.add('tier-' + item.tier);
      if (item.setId && ITEM_SETS[item.setId]) {
        slot.classList.add('set-item');
        slot.style.borderColor = ITEM_SETS[item.setId].color;
      }
      const count = item.count || 1;
      // Draw item sprite as canvas
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = TILE_SIZE;
      spriteCanvas.height = TILE_SIZE;
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
        showItemPopup(item, origIdx, 'inventory');
      });
      slot.addEventListener('mouseenter', (e) => showItemTooltip(e, item));
      slot.addEventListener('mousemove', (e) => positionTooltip(e));
      slot.addEventListener('mouseleave', hideItemTooltip);
    } else {
      slot.className = 'inv-slot empty-slot';
    }
    grid.appendChild(slot);
  }

  // Hide stats-alloc from sidebar (moved to character sheet)
  const statsAllocPanel = document.getElementById('stats-alloc-panel');
  if (statsAllocPanel) statsAllocPanel.style.display = 'none';

  // Character sheet overlay
  updateCharacterSheet();

  // Skill tree overlay
  updateSkillTreeOverlay();

  // Subclass selection overlay
  updateSubclassOverlay();

  // Achievement overlay
  updateAchievementOverlay();

  // Achievement toast
  updateAchievementToast();

  // Spells panel (mage only) — now shows abilities for all classes
  updateSpellsPanel();

  // Boss skills panel
  updateBossSkillsPanel();

  // Prestige badge
  updatePrestigeBadge();

  // Prestige overlay
  updatePrestigeOverlay();

  // Fishing overlay
  updateFishingOverlay();

  // Arena overlays
  updateArenaOverlay();
  updateArenaWaveOverlay();

  // Run history overlay
  updateRunHistoryOverlay();

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

  // Side minimap in panel
  updateSideMinimap();

  // Bestiary overlay
  updateBestiary();

  // Armory overlay
  updateArmory();

  // Minimap overlay
  updateMinimap();

  // Floor Warp overlay
  updateFloorWarpOverlay();

  // Spell Book overlay
  updateSpellBookOverlay();

  // Village Expansion overlay
  updateVillageExpansionOverlay();

  // Class select unlock info
  updateClassSelectUnlockInfo();

  // Hero customization
  updateHeroCustomization();

  // Healer overlay
  updateHealerOverlay();

  // Shop overlay
  updateShopOverlay();

  // Blacksmith overlay
  updateBlacksmithOverlay();

  // Chest overlay
  updateChestOverlay();

  // Quest board overlay
  updateQuestBoardOverlay();

  // Settings overlay
  const settingsOverlay = document.getElementById('settings-overlay');
  if (state.showSettings) {
    settingsOverlay.classList.remove('hidden');
    const gm = document.getElementById('godmode-status');
    if (gm) {
      gm.textContent = state.godMode ? t('settings.godmode_on') : t('settings.godmode_off');
      gm.style.color = state.godMode ? '#60e060' : '#888';
    }
    // Render save slots
    const slotsList = document.getElementById('save-slots-list');
    if (slotsList) {
      slotsList.innerHTML = '';
      for (let slot = 1; slot <= SAVE_SLOTS; slot++) {
        const info = getSlotInfo(slot);
        const row = document.createElement('div');
        row.className = 'save-slot-row';
        const classIcon = { warrior: '⚔️', mage: '🔮', archer: '🏹' }[info?.playerClass] || '🎮';
        const dateStr = info?.savedAt
          ? new Date(info.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
          : null;
        row.innerHTML = info
          ? `<div class="save-slot-info">
               <span class="save-slot-num">Slot ${slot}</span>
               <span class="save-slot-char">${classIcon} ${info.name} <em>(${info.playerClass})</em></span>
               <span class="save-slot-meta">Lv ${info.level} · Floor ${info.floor} · ${info.gold}g</span>
               ${dateStr ? `<span class="save-slot-date">${dateStr}</span>` : ''}
             </div>
             <div class="save-slot-btns">
               <button class="save-slot-btn save-btn" data-slot="${slot}">Save</button>
               <button class="save-slot-btn load-btn" data-slot="${slot}">Load</button>
               <button class="save-slot-btn del-btn" data-slot="${slot}">🗑</button>
             </div>`
          : `<div class="save-slot-info">
               <span class="save-slot-num">Slot ${slot}</span>
               <span class="save-slot-empty">— Empty —</span>
             </div>
             <div class="save-slot-btns">
               <button class="save-slot-btn save-btn" data-slot="${slot}">Save</button>
             </div>`;
        // Wire events
        row.querySelectorAll('.save-btn').forEach(btn => btn.addEventListener('click', () => {
          if (state.player) { saveToSlot(+btn.dataset.slot); render(); }
        }));
        row.querySelectorAll('.load-btn').forEach(btn => btn.addEventListener('click', () => {
          if (confirm(`Load slot ${btn.dataset.slot}? Unsaved progress will be lost.`)) {
            if (loadFromSlot(+btn.dataset.slot)) { state.showSettings = false; render(); }
          }
        }));
        row.querySelectorAll('.del-btn').forEach(btn => btn.addEventListener('click', () => {
          if (confirm(`Delete slot ${btn.dataset.slot}?`)) { deleteSlot(+btn.dataset.slot); render(); }
        }));
        slotsList.appendChild(row);
      }
    }
  } else {
    settingsOverlay.classList.add('hidden');
  }
}

// ── Stats Allocation Panel ──────────────────

function updateStatsAllocPanel() {
  const panel = document.getElementById('stats-alloc-panel');
  if (!panel) return;

  const p = state.player;
  if (!p || !p.attrs) {
    panel.style.display = 'none';
    return;
  }

  // Always show the character sheet, but only show + buttons when points available
  panel.style.display = '';
  // Show/hide the points badge in heading
  const heading = panel.querySelector('h3');
  if (heading) heading.innerHTML = p.statPoints > 0
    ? `Attributes <span class="attr-points-badge">${p.statPoints} pts</span>`
    : 'Attributes';

  const grid = document.getElementById('stats-alloc-grid');
  grid.innerHTML = '';

  const attrKeys = ['str', 'agi', 'int', 'vit', 'cha'];
  for (const key of attrKeys) {
    const row = document.createElement('div');
    row.className = 'attr-row';

    const val = p.attrs[key];
    const label = ATTR_LABELS[key];
    const desc = ATTR_DESCRIPTIONS[key];

    row.innerHTML = `
      <div class="attr-main">
        <span class="attr-abbr">${key.toUpperCase()}</span>
        <span class="attr-name">${label}</span>
        <span class="attr-val">${val}</span>
        ${p.statPoints > 0 ? '<button class="attr-plus-btn">+</button>' : ''}
      </div>
      <div class="attr-desc">${desc}</div>
    `;

    if (p.statPoints > 0) {
      const btn = row.querySelector('.attr-plus-btn');
      btn.addEventListener('click', () => {
        allocateStat(key);
        render();
      });
    }
    grid.appendChild(row);
  }

  // Show derived stats summary
  const derived = document.createElement('div');
  derived.className = 'derived-stats';
  const dodge = getPlayerDodgeChance();
  const discount = getPlayerShopDiscount();
  derived.innerHTML = `
    <div class="derived-row"><span>${t('ui.dodge')}</span><span>${dodge}%</span></div>
    <div class="derived-row"><span>${t('ui.shop_discount')}</span><span>${discount}%</span></div>
  `;
  grid.appendChild(derived);
}

// ── Character Sheet Overlay ────────────────

function updateCharacterSheet() {
  const overlay = document.getElementById('charsheet-overlay');
  if (!overlay) return;
  if (!state.showCharSheet) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  if (!p) return;

  // Portrait
  const portraitEl = document.getElementById('charsheet-portrait');
  portraitEl.innerHTML = '';
  const pc = document.createElement('canvas');
  pc.width = TILE_SIZE; pc.height = TILE_SIZE;
  const pctx = pc.getContext('2d');
  pctx.drawImage(getPlayerSprite(state.playerClass), 0, 0);
  portraitEl.appendChild(pc);

  // Info
  const classKey = { warrior: 'class.warrior', mage: 'class.mage', archer: 'class.archer' };
  const infoEl = document.getElementById('charsheet-info');
  infoEl.innerHTML = `
    <div class="cs-name">${t(classKey[state.playerClass] || 'class.adventurer')}</div>
    <div class="cs-class">${t('ui.level')} ${p.level} | ${t('ui.floor')} ${state.floor}</div>
    <div class="cs-stats">
      <span>${t('ui.hp')} <strong>${p.hp}/${p.maxHp}</strong></span>
      <span>${t('ui.pow')} <strong>${getPlayerPower()}</strong></span>
      <span>${t('ui.arm')} <strong>${getPlayerArmor()}</strong></span>
      <span>${t('ui.gold')} <strong>${p.gold}</strong></span>
    </div>
  `;

  // Equipment
  const equipEl = document.getElementById('charsheet-equip');
  equipEl.innerHTML = `<h4>${t('ui.equipment')}</h4>`;
  for (const slot of Object.values(EQUIP_SLOT)) {
    const item = p.equipment[slot];
    const row = document.createElement('div');
    row.className = 'cs-equip-slot';
    if (item) {
      const sc = document.createElement('canvas');
      sc.width = TILE_SIZE; sc.height = TILE_SIZE;
      const sctx = sc.getContext('2d');
      sctx.drawImage(getItemSprite(item.icon), 0, 0);
      row.appendChild(sc);
      row.innerHTML += `<span class="cs-equip-label">${getSlotLabel(slot)}</span><span class="cs-equip-name">${item.name}</span>`;
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        showItemPopup(item, slot, 'equipment');
      });
    } else {
      row.innerHTML = `<span class="cs-equip-label">${getSlotLabel(slot)}</span><span class="cs-equip-name empty">${t('ui.empty')}</span>`;
    }
    equipEl.appendChild(row);
  }

  // Attributes
  const pointsEl = document.getElementById('charsheet-points');
  if (p.statPoints > 0) {
    pointsEl.style.display = '';
    pointsEl.textContent = p.statPoints + ' pts';
  } else {
    pointsEl.style.display = 'none';
  }

  const attrsEl = document.getElementById('charsheet-attrs');
  attrsEl.innerHTML = '';
  const attrKeys = ['str', 'agi', 'int', 'vit', 'cha'];
  for (const key of attrKeys) {
    const val = p.attrs[key];
    const label = ATTR_LABELS[key];
    const desc = ATTR_DESCRIPTIONS[key];

    const row = document.createElement('div');
    row.className = 'cs-attr-row';
    row.innerHTML = `
      <span class="cs-attr-abbr">${key.toUpperCase()}</span>
      <span class="cs-attr-name">${label}</span>
      <span class="cs-attr-val">${val}</span>
    `;
    if (p.statPoints > 0) {
      const btn = document.createElement('button');
      btn.className = 'cs-attr-plus';
      btn.textContent = '+';
      btn.addEventListener('click', () => {
        allocateStat(key);
        render();
      });
      row.appendChild(btn);
    }
    attrsEl.appendChild(row);

    const descEl = document.createElement('div');
    descEl.className = 'cs-attr-desc';
    descEl.textContent = desc;
    attrsEl.appendChild(descEl);
  }

  // Derived stats
  const derivedEl = document.getElementById('charsheet-derived');
  derivedEl.innerHTML = '';
  const dodge = getPlayerDodgeChance();
  const discount = getPlayerShopDiscount();
  derivedEl.innerHTML = `
    <div class="cs-derived-row"><span>${t('ui.dodge_chance')}</span><span>${dodge}%</span></div>
    <div class="cs-derived-row"><span>${t('ui.shop_discount')}</span><span>${discount}%</span></div>
  `;
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

// ── Skill Tree Overlay Rendering ────────────

function updateSkillTreeOverlay() {
  const overlay = document.getElementById('skilltree-overlay');
  if (!overlay) return;
  if (!state.showSkillTree) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  if (!p) return;

  // Update skill points display
  document.getElementById('skill-points-display').textContent = `${p.skillPoints || 0} SP`;

  const body = document.getElementById('skilltree-body');
  body.innerHTML = '';

  const tree = getSkillTree();
  if (!tree || Object.keys(tree).length === 0) return;

  // Create a 2-column grid for 4 branches
  const grid = document.createElement('div');
  grid.className = 'st-grid';

  for (const [branchKey, branch] of Object.entries(tree)) {
    const isLocked = !isSubclassBranchUnlocked(branchKey);
    const isSubclassBranch = !!branch.subclass;

    const branchDiv = document.createElement('div');
    branchDiv.className = 'st-branch' + (isLocked ? ' st-locked' : '') + (isSubclassBranch ? ' st-subclass-branch' : '');

    const branchTitle = document.createElement('h3');
    branchTitle.className = 'st-branch-title';
    branchTitle.textContent = branch.name;
    if (isSubclassBranch) {
      const tag = document.createElement('span');
      tag.className = 'st-subclass-tag';
      tag.textContent = isLocked ? ' (Locked - Level 5)' : ` (${SUBCLASS_INFO[branch.subclass]?.name || ''})`;
      branchTitle.appendChild(tag);
    }
    branchDiv.appendChild(branchTitle);

    if (isLocked) {
      const lockMsg = document.createElement('div');
      lockMsg.className = 'st-lock-msg';
      lockMsg.textContent = `Choose ${branch.subclass === 'berserker' || branch.subclass === 'paladin' ? 'Warrior' : branch.subclass === 'pyromancer' || branch.subclass === 'necromancer' ? 'Mage' : 'Archer'} specialization at Level 5 to unlock`;
      branchDiv.appendChild(lockMsg);
    } else {
      for (const skill of branch.skills) {
        const rank = getSkillRank(skill.id);
        const canLearnThis = canLearnSkill(skill.id);
        const maxed = rank >= skill.maxRank;

        const skillDiv = document.createElement('div');
        skillDiv.className = 'st-skill' + (rank > 0 ? ' st-learned' : '') + (maxed ? ' st-maxed' : '') + (canLearnThis ? ' st-available' : '');

        const header = document.createElement('div');
        header.className = 'st-skill-header';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'st-skill-name';
        nameSpan.textContent = `${skill.icon || ''} ${skill.name}`;
        header.appendChild(nameSpan);

        const rankSpan = document.createElement('span');
        rankSpan.className = 'st-skill-rank';
        rankSpan.textContent = `${rank}/${skill.maxRank}`;
        header.appendChild(rankSpan);

        if (skill.type === 'active' && skill.key) {
          const keySpan = document.createElement('span');
          keySpan.className = 'st-skill-key';
          keySpan.textContent = skill.key;
          header.appendChild(keySpan);
        }

        skillDiv.appendChild(header);

        const descDiv = document.createElement('div');
        descDiv.className = 'st-skill-desc';
        const descIdx = Math.min(rank > 0 ? rank - 1 : 0, skill.desc.length - 1);
        descDiv.textContent = skill.desc[descIdx];
        if (rank > 0 && rank < skill.maxRank && skill.desc[rank]) {
          descDiv.textContent += ` \u2192 ${skill.desc[rank]}`;
        }
        skillDiv.appendChild(descDiv);

        if (skill.type === 'active') {
          const cdDiv = document.createElement('div');
          cdDiv.className = 'st-skill-meta';
          cdDiv.textContent = `${t('skilltree.active')} | ${t('skilltree.cd', { n: skill.cooldown })}`;
          if (rank > 0 && p.skillCooldowns && p.skillCooldowns[skill.id] > 0) {
            cdDiv.textContent += ` ${t('skilltree.cd_left', { n: p.skillCooldowns[skill.id] })}`;
          }
          skillDiv.appendChild(cdDiv);
        } else {
          const typeDiv = document.createElement('div');
          typeDiv.className = 'st-skill-meta';
          typeDiv.textContent = t('skilltree.passive');
          skillDiv.appendChild(typeDiv);
        }

        if (canLearnThis) {
          const btn = document.createElement('button');
          btn.className = 'st-learn-btn';
          btn.textContent = rank > 0 ? t('skilltree.upgrade') : t('skilltree.learn');
          btn.addEventListener('click', () => {
            learnSkill(skill.id);
            updateSkillTreeOverlay();
          });
          skillDiv.appendChild(btn);
        }

        branchDiv.appendChild(skillDiv);
      }
    }

    grid.appendChild(branchDiv);
  }

  body.appendChild(grid);
}

// ── Subclass Selection Overlay ────────────

function updateSubclassOverlay() {
  const overlay = document.getElementById('subclass-overlay');
  if (!overlay) return;
  if (!state.showSubclassSelect) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const body = document.getElementById('subclass-body');
  if (!body) return;
  body.innerHTML = '';

  const cls = state.playerClass;
  const options = Object.entries(SUBCLASS_INFO).filter(([, info]) => info.baseClass === cls);

  for (const [subId, info] of options) {
    const card = document.createElement('div');
    card.className = 'subclass-card';

    const title = document.createElement('h2');
    title.className = 'subclass-name';
    title.textContent = info.name;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.className = 'subclass-desc';
    desc.textContent = info.desc;
    card.appendChild(desc);

    const bonuses = document.createElement('div');
    bonuses.className = 'subclass-bonuses';
    const bonusLabels = [];
    if (info.statBonuses.power) bonusLabels.push(`+${info.statBonuses.power} Power`);
    if (info.statBonuses.armor) bonusLabels.push(`+${info.statBonuses.armor} Armor`);
    if (info.statBonuses.maxHp) bonusLabels.push(`+${info.statBonuses.maxHp} Max HP`);
    if (info.statBonuses.maxMana) bonusLabels.push(`+${info.statBonuses.maxMana} Max Mana`);
    if (info.statBonuses.spellBonus) bonusLabels.push(`+${info.statBonuses.spellBonus} Spell Dmg`);
    if (info.statBonuses.rangedBonus) bonusLabels.push(`+${info.statBonuses.rangedBonus} Ranged Dmg`);
    if (info.statBonuses.critBonus) bonusLabels.push(`+${info.statBonuses.critBonus}% Crit`);
    bonuses.textContent = bonusLabels.join(' | ');
    card.appendChild(bonuses);

    const btn = document.createElement('button');
    btn.className = 'subclass-select-btn';
    btn.textContent = `Choose ${info.name}`;
    btn.addEventListener('click', () => {
      selectSubclass(subId);
      updateSubclassOverlay();
      updateSkillTreeOverlay();
    });
    card.appendChild(btn);

    body.appendChild(card);
  }
}

// ── Achievement Overlay Rendering ────────────

let achActiveTab = 'all';

function updateAchievementOverlay() {
  const overlay = document.getElementById('achievement-overlay');
  if (!state.showAchievements) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const achievements = getAchievements();
  const unlocked = achievements.filter(a => a.unlocked).length;
  const total = Object.keys(ACHIEVEMENTS).length;

  document.getElementById('achievement-count').textContent = `${unlocked}/${total}`;

  // Tab handling
  const tabs = overlay.querySelectorAll('.ach-tab');
  tabs.forEach(tab => {
    const cat = tab.dataset.category;
    tab.classList.toggle('active', cat === achActiveTab);
    tab.onclick = () => {
      achActiveTab = cat;
      updateAchievementOverlay();
    };
  });

  // Filter
  const filtered = achActiveTab === 'all'
    ? achievements
    : achievements.filter(a => a.category === achActiveTab);

  const list = document.getElementById('achievement-list');
  list.innerHTML = '';

  for (const ach of filtered) {
    const div = document.createElement('div');
    div.className = `ach-entry${ach.unlocked ? ' ach-unlocked' : ' ach-locked'}`;
    div.innerHTML = `
      <span class="ach-icon">${ach.unlocked ? ach.icon : '?'}</span>
      <div class="ach-info">
        <div class="ach-name">${ach.unlocked ? ach.name : (ach.hidden ? '???' : ach.name)}</div>
        <div class="ach-desc">${ach.unlocked ? ach.desc : (ach.hidden ? t('ach.hidden') : ach.desc)}</div>
      </div>
      ${ach.unlocked ? '<span class="ach-check">✓</span>' : ''}
    `;
    list.appendChild(div);
  }
}

function updateAchievementToast() {
  const toastEl = document.getElementById('achievement-toast');
  if (!state.achievementToast) {
    toastEl.classList.add('hidden');
    return;
  }
  const toast = state.achievementToast;
  toastEl.classList.remove('hidden');
  toastEl.innerHTML = `<span class="toast-icon">${toast.icon}</span> ${t('ach.toast', { name: toast.name })}`;
}

// ── Spells Panel Rendering ──────────────────

function updateSpellsPanel() {
  const panel = document.getElementById('spells-panel');
  if (!panel) return;

  const grid = document.getElementById('spells-grid');
  grid.innerHTML = '';
  const h3 = panel.querySelector('h3');

  if (state.playerClass === PLAYER_CLASS.MAGE) {
    panel.style.display = '';
    if (h3) h3.textContent = t('ui.spells');
    for (const spell of Object.values(SPELLS)) {
      const amRank = getSkillRank('arcane_mastery');
      const cost = Math.max(1, spell.manaCost - (amRank > 0 ? amRank : 0));
      const div = document.createElement('div');
      const canCast = state.player.mana >= cost;
      div.className = 'spell-slot' + (canCast ? '' : ' disabled');
      div.innerHTML = `
        <span class="spell-key">${spell.key.toUpperCase()}</span>
        <span class="spell-name">${spell.name}</span>
        <span class="spell-cost">${cost} MP</span>
      `;
      grid.appendChild(div);
    }
  } else {
    // Show active skills for warrior/archer
    const tree = SKILL_TREES[state.playerClass];
    if (!tree) { panel.style.display = 'none'; return; }
    const activeSkills = [];
    for (const branch of Object.values(tree)) {
      for (const skill of branch.skills) {
        if (skill.type === 'active' && getSkillRank(skill.id) > 0) {
          activeSkills.push(skill);
        }
      }
    }
    if (activeSkills.length === 0) { panel.style.display = 'none'; return; }
    panel.style.display = '';
    if (h3) h3.textContent = t('ui.abilities');
    for (const skill of activeSkills) {
      const cd = (state.player.skillCooldowns && state.player.skillCooldowns[skill.id]) || 0;
      const div = document.createElement('div');
      div.className = 'spell-slot' + (cd > 0 ? ' disabled' : '');
      div.innerHTML = `
        <span class="spell-key">${skill.key}</span>
        <span class="spell-name">${skill.name}</span>
        <span class="spell-cost">${cd > 0 ? cd + ' CD' : t('tag.ready')}</span>
      `;
      grid.appendChild(div);
    }
  }
}

// ── Boss Skills Panel ───────────────────────

function updateBossSkillsPanel() {
  const panel = document.getElementById('boss-skills-panel');
  if (!panel) return;

  const grid = document.getElementById('boss-skills-grid');
  grid.innerHTML = '';

  if (!state.bossSkills || Object.keys(state.bossSkills).length === 0) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';
  for (const skill of Object.values(BOSS_SKILLS)) {
    if (!state.bossSkills[skill.id] && state.bossSkills[skill.id] !== false) continue;
    const consumed = state.bossSkills[skill.id] === false;
    const div = document.createElement('div');
    div.className = 'boss-skill-slot';
    let tagClass, tagText;
    if (consumed) {
      tagClass = 'consumed-tag';
      tagText = t('tag.used');
    } else if (skill.type === 'active') {
      tagClass = 'active-tag';
      tagText = skill.key;
    } else {
      tagClass = 'passive-tag';
      tagText = t('tag.passive');
    }
    div.innerHTML = `
      <span class="boss-skill-name">${skill.name}</span>
      <span class="boss-skill-tag ${tagClass}">${tagText}</span>
    `;
    div.title = skill.desc;
    grid.appendChild(div);
  }
}

// ── Set Bonus Summary ──────────────────────

function updateSetBonusSummary() {
  // Remove existing summary if present
  const existing = document.getElementById('set-bonus-summary');
  if (existing) existing.remove();

  const setBonuses = getActiveSetBonuses(state.player);
  if (setBonuses.length === 0) return;

  const container = document.createElement('div');
  container.id = 'set-bonus-summary';
  container.className = 'set-bonus-summary';

  for (const sb of setBonuses) {
    const setDiv = document.createElement('div');
    setDiv.className = 'set-bonus-entry';

    const header = document.createElement('div');
    header.className = 'set-bonus-name';
    header.style.color = sb.setDef.color;
    header.textContent = `${sb.setDef.name} (${sb.piecesEquipped}/${sb.piecesTotal})`;
    setDiv.appendChild(header);

    for (const [threshold, bonus] of Object.entries(sb.setDef.bonuses)) {
      const bonusRow = document.createElement('div');
      const isActive = sb.piecesEquipped >= parseInt(threshold);
      bonusRow.className = isActive ? 'set-bonus-row set-active' : 'set-bonus-row set-inactive';
      bonusRow.textContent = bonus.label;
      setDiv.appendChild(bonusRow);
    }

    container.appendChild(setDiv);
  }

  const equipPanel = document.getElementById('equip-panel');
  equipPanel.appendChild(container);
}

// ── Prestige Badge ─────────────────────────

function updatePrestigeBadge() {
  const badge = document.getElementById('prestige-badge');
  if (!badge) return;

  if (state.prestigeLevel > 0) {
    const title = PRESTIGE.TITLES[state.prestigeLevel] || '';
    const color = PRESTIGE.TITLE_COLORS[state.prestigeLevel] || '#ccc';
    badge.style.display = '';
    badge.style.color = color;
    badge.style.borderColor = color;
    badge.textContent = `NG+${state.prestigeLevel} ${title}`;
    badge.className = 'prestige-badge';
  } else {
    badge.style.display = 'none';
  }
}

// ── Prestige Overlay ───────────────────────

function updatePrestigeOverlay() {
  const overlay = document.getElementById('prestige-overlay');
  if (!overlay) return;

  if (state.showPrestige) {
    overlay.classList.remove('hidden');

    const currentLevel = state.prestigeLevel;
    const nextLevel = currentLevel + 1;
    const currentTitle = PRESTIGE.TITLES[currentLevel] || 'None';
    const nextTitle = PRESTIGE.TITLES[nextLevel] || '???';
    const currentColor = PRESTIGE.TITLE_COLORS[currentLevel] || '#888';
    const nextColor = PRESTIGE.TITLE_COLORS[nextLevel] || '#ccc';

    const currentEl = document.getElementById('prestige-current');
    currentEl.textContent = currentLevel > 0 ? `NG+${currentLevel} ${currentTitle}` : t('prestige.no_prestige');
    currentEl.style.color = currentColor;

    const nextEl = document.getElementById('prestige-next');
    nextEl.textContent = `NG+${nextLevel} ${nextTitle}`;
    nextEl.style.color = nextColor;

    const rewards = document.getElementById('prestige-rewards');
    const pl = PRESTIGE.PER_LEVEL;
    rewards.innerHTML = `
      <div class="prestige-reward">${t('prestige.power', { n: pl.powerBonus * nextLevel })}</div>
      <div class="prestige-reward">${t('prestige.hp', { n: pl.hpBonus * nextLevel })}</div>
      <div class="prestige-reward">${t('prestige.xp', { n: pl.xpBoostPercent * nextLevel })}</div>
      <div class="prestige-reward prestige-warning-text">${t('prestige.enemy_scaling', { n: Math.round(PRESTIGE.ENEMY_SCALING.hpMultiplier * 100 * nextLevel) })}</div>
    `;
  } else {
    overlay.classList.add('hidden');
  }
}

// ── Fishing Overlay ──────────────────────────

function updateFishingOverlay() {
  const overlay = document.getElementById('fishing-overlay');
  if (!overlay) return;

  if (state.showFishing) {
    overlay.classList.remove('hidden');
    const statusEl = document.getElementById('fishing-status');
    const catchEl = document.getElementById('fishing-catch');
    const castBtn = document.getElementById('cast-line-btn');
    const reelBtn = document.getElementById('reel-in-btn');

    switch (state.fishingPhase) {
      case 'idle':
        statusEl.textContent = t('fishing.idle');
        statusEl.className = 'fishing-status';
        castBtn.style.display = '';
        reelBtn.style.display = 'none';
        catchEl.style.display = 'none';
        break;
      case 'waiting':
        statusEl.textContent = t('fishing.waiting');
        statusEl.className = 'fishing-status';
        castBtn.style.display = 'none';
        reelBtn.style.display = 'none';
        catchEl.style.display = 'none';
        break;
      case 'bite':
        statusEl.textContent = t('fishing.bite');
        statusEl.className = 'fishing-status bite';
        castBtn.style.display = 'none';
        reelBtn.style.display = '';
        catchEl.style.display = 'none';
        break;
      case 'caught':
        statusEl.textContent = t('fishing.caught');
        statusEl.className = 'fishing-status';
        castBtn.style.display = '';
        castBtn.textContent = t('fishing.cast_again');
        reelBtn.style.display = 'none';
        if (state.fishingCatch) {
          catchEl.style.display = '';
          const c = state.fishingCatch;
          catchEl.className = 'fishing-catch' + (c.rarity === 'legendary' ? ' legendary' : c.rarity === 'rare' ? ' rare' : '');
          catchEl.innerHTML = `<strong>${c.name}</strong><br><span style="font-size:11px;color:#888">${c.desc}</span>`;
        }
        break;
      case 'missed':
        statusEl.textContent = t('fishing.missed');
        statusEl.className = 'fishing-status';
        castBtn.style.display = '';
        castBtn.textContent = t('fishing.cast_again');
        reelBtn.style.display = 'none';
        catchEl.style.display = 'none';
        break;
    }
  } else {
    overlay.classList.add('hidden');
    // Reset cast button text
    const castBtn = document.getElementById('cast-line-btn');
    if (castBtn) castBtn.textContent = t('fishing.cast');
  }
}

// ── Arena Overlay ────────────────────────────

function updateArenaOverlay() {
  const overlay = document.getElementById('arena-overlay');
  if (!overlay) return;

  if (state.showArena) {
    overlay.classList.remove('hidden');
    const bestWaveEl = document.getElementById('arena-best-wave');
    if (state.arenaBestWave > 0) {
      bestWaveEl.textContent = t('arena.best_wave', { n: state.arenaBestWave });
      bestWaveEl.style.display = '';
    } else {
      bestWaveEl.style.display = 'none';
    }
    // Town upgrade section
    renderTownUpgradeSection(overlay, 'arena');
  } else {
    overlay.classList.add('hidden');
  }
}

// ── Run History Overlay ────────────────────────
function updateRunHistoryOverlay() {
  const overlay = document.getElementById('history-overlay');
  if (!overlay) return;
  if (!state.showRunHistory) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const list = document.getElementById('history-list');
  if (!list) return;
  list.innerHTML = '';

  const history = getRunHistory();
  if (history.length === 0) {
    list.innerHTML = '<div class="history-empty">No runs recorded yet.</div>';
    return;
  }

  for (const run of history) {
    const div = document.createElement('div');
    div.className = 'history-entry';
    const date = new Date(run.timestamp);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const cls = run.playerClass ? run.playerClass.charAt(0).toUpperCase() + run.playerClass.slice(1) : '?';
    const sub = run.subclass ? ` (${run.subclass})` : '';
    div.innerHTML = `
      <div class="history-header">
        <span class="history-date">${dateStr}</span>
        <span class="history-class">${cls}${sub} Lv.${run.level || 1}</span>
      </div>
      <div class="history-details">
        <span>Floor ${run.floorReached}</span>
        <span>${run.kills || 0} kills</span>
        <span>${run.goldEarned || 0}g earned</span>
        <span>${run.turns || 0} turns</span>
      </div>
      <div class="history-cause">${run.cause || 'Unknown'}</div>
    `;
    list.appendChild(div);
  }
}

function updateArenaWaveOverlay() {
  const overlay = document.getElementById('arena-wave-overlay');
  if (!overlay) return;

  if (state.arenaWaveCleared) {
    overlay.classList.remove('hidden');
    const titleEl = document.getElementById('arena-wave-title');
    titleEl.textContent = t('arena.wave_cleared', { n: state.arenaWave });
    const rewardsEl = document.getElementById('arena-wave-rewards');
    let html = `<div class="reward-line reward-gold">${t('arena.total_gold', { n: state.arenaRewards.gold })}</div>`;
    if (state.arenaRewards.items.length > 0) {
      for (const item of state.arenaRewards.items) {
        html += `<div class="reward-line reward-item">${item}</div>`;
      }
    }
    rewardsEl.innerHTML = html;
  } else {
    overlay.classList.add('hidden');
  }
}

// ── Side Minimap (Right Panel) ──────────────

function updateSideMinimap() {
  const panel = document.getElementById('side-minimap-panel');
  if (!panel) return;

  if (!state.map || !state.revealed || !state.player) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = '';

  const canvas = document.getElementById('side-minimap-canvas');
  const mctx = canvas.getContext('2d');

  // Scale to fit panel width (~240px usable)
  const panelWidth = 236;
  const SCALE = Math.max(2, Math.floor(panelWidth / state.mapW));
  canvas.width = state.mapW * SCALE;
  canvas.height = state.mapH * SCALE;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';

  mctx.fillStyle = '#000';
  mctx.fillRect(0, 0, canvas.width, canvas.height);

  const wallColor = '#3a3a4a';
  const floorColor = '#1a2a1a';
  const stairsColor = '#e0c040';
  const entranceColor = '#40a060';
  const grassColor = '#1a3a1a';
  const dirtColor = '#3a2a1a';
  const hutColor = '#5a4a2a';
  const healerColor = '#40c080';
  const merchantColor = '#c0a040';

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
      } else if (tile === TILE.HEALER) {
        mctx.fillStyle = healerColor;
      } else if (tile === TILE.MERCHANT) {
        mctx.fillStyle = merchantColor;
      } else if (tile === TILE.QUEST_BOARD) {
        mctx.fillStyle = '#c08040';
      } else if (tile === TILE.DUNGEON_MERCHANT) {
        mctx.fillStyle = '#e0c040';
      } else if (tile === TILE.PILLAR) {
        mctx.fillStyle = '#6a6a7a';
      } else if (tile === TILE.WATER) {
        mctx.fillStyle = '#2a4a6a';
      } else if (tile === TILE.CARPET) {
        mctx.fillStyle = '#8a3030';
      } else if (tile === TILE.FOUNTAIN) {
        mctx.fillStyle = '#3a6a9a';
      } else if (tile === TILE.BOOKSHELF) {
        mctx.fillStyle = '#4a3010';
      } else if (tile === TILE.GRASS) {
        mctx.fillStyle = grassColor;
      } else if (tile === TILE.DIRT) {
        mctx.fillStyle = dirtColor;
      } else if (tile === TILE.HUT) {
        mctx.fillStyle = hutColor;
      } else if (props.walkable) {
        mctx.fillStyle = floorColor;
      } else {
        mctx.fillStyle = wallColor;
      }

      if (!state.visibility[y][x]) {
        mctx.globalAlpha = 0.35;
      } else {
        mctx.globalAlpha = 1;
      }

      mctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  }

  mctx.globalAlpha = 1;

  // Draw chests
  if (state.chests) {
    for (const ch of state.chests) {
      if (!state.revealed[ch.y] || !state.revealed[ch.y][ch.x]) continue;
      mctx.fillStyle = ch.opened ? '#4a3a1a' : '#c0a040';
      mctx.fillRect(ch.x * SCALE, ch.y * SCALE, SCALE, SCALE);
    }
  }

  // Draw dens on minimap
  if (state.dens) {
    for (const den of state.dens) {
      if (den.destroyed) continue;
      if (!state.revealed[den.y] || !state.revealed[den.y][den.x]) continue;
      mctx.fillStyle = '#c06030';
      mctx.fillRect(den.x * SCALE, den.y * SCALE, SCALE, SCALE);
    }
  }

  // Draw enemies — only visible ones unless All-Seeing Eye equipped
  const hasEye = playerHasAllSeeingEye();
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const inFOV = state.visibility[enemy.y] && state.visibility[enemy.y][enemy.x];
    if (!inFOV && !hasEye) continue;
    mctx.globalAlpha = inFOV ? 1 : 0.45;
    mctx.fillStyle = enemy.isGuardian ? '#e0a020' : enemy.isBoss ? '#e0c040' : '#e04040';
    mctx.fillRect(enemy.x * SCALE, enemy.y * SCALE, SCALE, SCALE);
  }
  mctx.globalAlpha = 1;

  // Draw ground items
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    mctx.fillStyle = '#40c040';
    mctx.fillRect(gi.x * SCALE, gi.y * SCALE, SCALE, SCALE);
  }

  // Draw player
  mctx.fillStyle = '#4080ff';
  const ps = Math.max(SCALE, 3);
  mctx.fillRect(state.player.x * SCALE, state.player.y * SCALE, ps, ps);

  // Compact legend
  const legendEl = document.getElementById('side-minimap-legend');
  legendEl.innerHTML = `
    <span class="sml-item"><span class="sml-dot" style="background:#4080ff"></span>${t('legend.you')}</span>
    <span class="sml-item"><span class="sml-dot" style="background:#e04040"></span>${t('legend.foe')}</span>
    <span class="sml-item"><span class="sml-dot" style="background:#40c040"></span>${t('legend.item')}</span>
    <span class="sml-item"><span class="sml-dot" style="background:#e0c040"></span>${t('legend.exit')}</span>
  `;
}

// ── Bestiary Rendering ──────────────────────

let bestiarySelectedType = null;
let bestiaryTab = 'creatures';

function updateBestiary() {
  const overlay = document.getElementById('bestiary-overlay');
  if (!state.showBestiary) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  // Player portrait in header
  const portraitEl = document.getElementById('bestiary-player-portrait');
  if (portraitEl && state.player) {
    portraitEl.innerHTML = '';
    const pc = document.createElement('canvas');
    pc.width = TILE_SIZE; pc.height = TILE_SIZE;
    pc.style.width = '28px'; pc.style.height = '28px';
    pc.style.imageRendering = 'pixelated';
    const pctx = pc.getContext('2d');
    pctx.drawImage(getPlayerSprite(state.playerClass), 0, 0);
    portraitEl.appendChild(pc);
  }

  const entries = getBestiaryEntries();
  const total = entries.length;
  const discovered = entries.filter(e => e.discovered).length;

  // Update creature count in tab
  const countEl = document.getElementById('bestiary-count');
  countEl.textContent = `(${discovered} / ${total})`;

  // Filter based on active tab
  let filtered;
  if (bestiaryTab === 'bosses') {
    filtered = entries.filter(e => e.isBoss);
  } else {
    filtered = entries;
  }

  // Sort: discovered first, then by level
  filtered.sort((a, b) => {
    if (a.discovered && !b.discovered) return -1;
    if (!a.discovered && b.discovered) return 1;
    return (a.level || 0) - (b.level || 0);
  });

  // Auto-select first discovered if none selected
  if (!bestiarySelectedType) {
    const first = filtered.find(e => e.discovered);
    if (first) bestiarySelectedType = first.type;
  }

  // Render left list
  const listPanel = document.getElementById('bestiary-list');
  listPanel.innerHTML = '';

  // Group by category for creatures tab
  const CATEGORY_ORDER = ['Goblinoid', 'Undead', 'Beast', 'Nature', 'Fire', 'Ice', 'Construct', 'Arcane', 'Dragon'];
  const CATEGORY_COLORS = { Goblinoid: '#8a7a50', Undead: '#6a8a6a', Beast: '#8a6a40', Nature: '#4a9a4a', Fire: '#e06020', Ice: '#80c0e0', Construct: '#8a8a9a', Arcane: '#6060c0', Dragon: '#e06030' };

  if (bestiaryTab === 'creatures' || bestiaryTab === 'bosses') {
    // Group entries by category
    const grouped = {};
    for (const entry of filtered) {
      const info = BESTIARY_INFO[entry.type];
      const cat = info?.category || 'Beast';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(entry);
    }

    // Render with category headers
    for (const cat of CATEGORY_ORDER) {
      if (!grouped[cat] || grouped[cat].length === 0) continue;
      const header = document.createElement('div');
      header.className = 'bst-category-header';
      header.style.borderLeftColor = CATEGORY_COLORS[cat] || '#888';
      header.innerHTML = `<span class="bst-cat-dot" style="background:${CATEGORY_COLORS[cat] || '#888'}"></span>${cat} <span class="bst-cat-count">(${grouped[cat].length})</span>`;
      listPanel.appendChild(header);
      for (const entry of grouped[cat]) {
        listPanel.appendChild(buildBestiarySlot(entry));
      }
    }
  } else {
    for (const entry of filtered) {
      listPanel.appendChild(buildBestiarySlot(entry));
    }
  }

  function buildBestiarySlot(entry) {
    const slot = document.createElement('div');
    const isSelected = entry.type === bestiarySelectedType;
    slot.className = 'bst-slot' + (isSelected ? ' bst-selected' : '') + (entry.discovered ? '' : ' bst-undiscovered');

    if (entry.discovered) {
      // Sprite portrait
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = TILE_SIZE;
      spriteCanvas.height = TILE_SIZE;
      spriteCanvas.className = 'bst-slot-sprite';
      const sctx = spriteCanvas.getContext('2d');
      sctx.drawImage(getEnemySprite(entry.type), 0, 0);

      // Element icon
      const elemColor = ELEMENT_COLORS[entry.element] || '#888';
      const elemDot = document.createElement('span');
      elemDot.className = 'bst-elem-dot';
      elemDot.style.background = elemColor;
      elemDot.title = entry.element;

      const info = document.createElement('div');
      info.className = 'bst-slot-info';
      info.innerHTML = `
        <div class="bst-slot-name">${entry.name}</div>
        <div class="bst-slot-level">Level ${entry.level}${entry.isBoss ? ' <span class="bestiary-boss-tag">BOSS</span>' : ''}</div>
      `;

      slot.appendChild(elemDot);
      slot.appendChild(spriteCanvas);
      slot.appendChild(info);

      slot.addEventListener('click', () => {
        bestiarySelectedType = entry.type;
        updateBestiary();
      });
    } else {
      slot.innerHTML = `
        <span class="bst-elem-dot" style="background:#333"></span>
        <div class="bst-slot-unknown">?</div>
        <div class="bst-slot-info">
          <div class="bst-slot-name">???</div>
          <div class="bst-slot-level">Level ??</div>
        </div>
      `;
    }

    return slot;
  }

  // Render right detail panel
  const detailPanel = document.getElementById('bestiary-detail');
  const selected = entries.find(e => e.type === bestiarySelectedType);

  if (!selected || !selected.discovered) {
    detailPanel.innerHTML = '<div class="bestiary-detail-empty">Select a discovered creature</div>';
    return;
  }

  // Build large sprite (scaled up)
  const largeSpriteCanvas = document.createElement('canvas');
  largeSpriteCanvas.width = 128;
  largeSpriteCanvas.height = 128;
  largeSpriteCanvas.className = 'bst-detail-sprite';
  const lctx = largeSpriteCanvas.getContext('2d');
  lctx.imageSmoothingEnabled = false;
  lctx.drawImage(getEnemySprite(selected.type), 0, 0, TILE_SIZE, TILE_SIZE, 0, 0, 128, 128);

  const elemColor = ELEMENT_COLORS[selected.element] || '#888';
  const xpReward = BASE_STATS_LOOKUP[selected.type]?.xpReward || '?';
  const goldReward = GOLD_LOOKUP[selected.type] || '?';

  const categoryLabel = BESTIARY_INFO[selected.type]?.category || 'Beast';
  const catColor = { Goblinoid: '#8a7a50', Undead: '#6a8a6a', Beast: '#8a6a40', Nature: '#4a9a4a', Fire: '#e06020', Ice: '#80c0e0', Construct: '#8a8a9a', Arcane: '#6060c0', Dragon: '#e06030' }[categoryLabel] || '#888';

  detailPanel.innerHTML = `
    <div class="bst-detail-title">${selected.title || selected.name} <span class="bst-detail-category" style="color:${catColor}">${categoryLabel}</span></div>
    <div class="bst-detail-sprite-area">
      <div class="bst-detail-sprite-wrap" id="bst-sprite-target"></div>
    </div>
    <div class="bst-detail-lore-cols">
      <div class="bst-detail-lore-col">
        <div class="bst-detail-label">LORE</div>
        <div class="bst-detail-text">${selected.lore || selected.desc}</div>
      </div>
      <div class="bst-detail-lore-col">
        <div class="bst-detail-label">HABITAT</div>
        <div class="bst-detail-text">${selected.habitat || 'Unknown'}</div>
        <div class="bst-detail-label" style="margin-top:6px">THREAT</div>
        <div class="bst-detail-text">${selected.threat || 'Unknown'}</div>
        <div class="bst-detail-label" style="margin-top:6px">KNOWN MOVES</div>
        <div class="bst-detail-text">${selected.moves || 'Unknown'}</div>
      </div>
    </div>
    <div class="bst-detail-stats">
      <div class="bst-stat"><span class="bst-stat-icon bst-hp-icon"></span><span class="bst-stat-label">HP:</span> <span class="bst-stat-val bst-hp-val">${selected.baseHp}</span></div>
      <div class="bst-stat"><span class="bst-stat-icon bst-atk-icon"></span><span class="bst-stat-label">ATTACK:</span> <span class="bst-stat-val bst-atk-val">${selected.basePower}</span></div>
      <div class="bst-stat"><span class="bst-stat-icon bst-def-icon"></span><span class="bst-stat-label">DEFENSE:</span> <span class="bst-stat-val bst-def-val">${BASE_STATS_LOOKUP[selected.type]?.armor || 0}</span></div>
      <div class="bst-stat"><span class="bst-stat-icon bst-elem-icon" style="background:${elemColor}"></span><span class="bst-stat-label">ELEMENT:</span> <span class="bst-stat-val" style="color:${elemColor}">${selected.element}</span></div>
    </div>
    <div class="bst-detail-footer">
      <span>XP Reward: ${xpReward}</span>
      <span class="bestiary-gold-stat">Gold: ${goldReward}</span>
      <span class="bst-kills-stat">Defeated: ${selected.kills}</span>
    </div>
    ${(() => {
      const cat = BESTIARY_INFO[selected.type]?.category;
      const bon = cat && BESTIARY_BONUSES[cat];
      if (!bon) return '';
      const catKills = Object.entries(state.bestiary || {})
        .filter(([t]) => BESTIARY_INFO[t]?.category === cat)
        .reduce((sum, [,b]) => sum + (b.kills || 0), 0);
      const pct = Math.min(100, Math.floor(catKills / bon.killsNeeded * 100));
      const unlocked = catKills >= bon.killsNeeded;
      return `<div class="bst-bonus-row ${unlocked ? 'bst-bonus-unlocked' : ''}">
        <div class="bst-bonus-label">${unlocked ? '✅' : '🔒'} Hunter Bonus: ${bon.desc}</div>
        <div class="bst-bonus-bar"><div class="bst-bonus-fill" style="width:${pct}%"></div></div>
        <div class="bst-bonus-progress">${catKills}/${bon.killsNeeded} ${cat} kills</div>
      </div>`;
    })()}
  `;

  // Append the pre-rendered canvas
  document.getElementById('bst-sprite-target').appendChild(largeSpriteCanvas);
}

// Tab switching
document.getElementById('bestiary-tab-creatures')?.addEventListener('click', () => {
  bestiaryTab = 'creatures';
  document.querySelectorAll('.bestiary-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('bestiary-tab-creatures').classList.add('active');
  updateBestiary();
});
document.getElementById('bestiary-tab-bosses')?.addEventListener('click', () => {
  bestiaryTab = 'bosses';
  document.querySelectorAll('.bestiary-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('bestiary-tab-bosses').classList.add('active');
  updateBestiary();
});
document.getElementById('bestiary-tab-lore')?.addEventListener('click', () => {
  bestiaryTab = 'creatures';
  document.querySelectorAll('.bestiary-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('bestiary-tab-lore').classList.add('active');
  updateBestiary();
});
document.getElementById('bestiary-tab-map')?.addEventListener('click', () => {
  bestiaryTab = 'creatures';
  document.querySelectorAll('.bestiary-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('bestiary-tab-map').classList.add('active');
  updateBestiary();
});

// ── Armory Rendering ──────────────────────────

let armorySelectedId = null;
let armoryTab = 'all';

const TIER_COLORS = { 1: '#888', 2: '#4a9', 3: '#4a9ae0', 4: '#c060e0', 5: '#e08030' };
const TIER_NAMES = { 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Epic', 5: 'Legendary' };
const TYPE_LABELS = {
  [ITEM_TYPE.WEAPON]: 'Weapon',
  [ITEM_TYPE.HELMET]: 'Helmet',
  [ITEM_TYPE.CHEST]: 'Chest Armor',
  [ITEM_TYPE.GLOVES]: 'Gloves',
  [ITEM_TYPE.BOOTS]: 'Boots',
  [ITEM_TYPE.CAPE]: 'Cape',
  [ITEM_TYPE.CONSUMABLE]: 'Consumable',
};

function updateArmory() {
  const overlay = document.getElementById('armory-overlay');
  if (!state.showArmory) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const entries = getArmoryEntries();
  const total = entries.length;
  const discovered = entries.filter(e => e.discovered).length;

  const countEl = document.getElementById('armory-count');
  countEl.textContent = `(${discovered}/${total})`;

  // Filter by tab
  let filtered;
  if (armoryTab === 'weapons') {
    filtered = entries.filter(e => e.type === ITEM_TYPE.WEAPON);
  } else if (armoryTab === 'armor') {
    filtered = entries.filter(e =>
      e.type === ITEM_TYPE.HELMET || e.type === ITEM_TYPE.CHEST ||
      e.type === ITEM_TYPE.GLOVES || e.type === ITEM_TYPE.BOOTS ||
      e.type === ITEM_TYPE.CAPE
    );
  } else if (armoryTab === 'consumables') {
    filtered = entries.filter(e => e.type === ITEM_TYPE.CONSUMABLE);
  } else {
    filtered = entries;
  }

  // Sort: discovered first, then by tier desc, then by name
  filtered.sort((a, b) => {
    if (a.discovered && !b.discovered) return -1;
    if (!a.discovered && b.discovered) return 1;
    const ta = a.tier || 0, tb = b.tier || 0;
    if (tb !== ta) return tb - ta;
    return a.name.localeCompare(b.name);
  });

  // Auto-select first discovered
  if (!armorySelectedId) {
    const first = filtered.find(e => e.discovered);
    if (first) armorySelectedId = first.id;
  }

  // Render left list
  const listPanel = document.getElementById('armory-list');
  listPanel.innerHTML = '';

  for (const entry of filtered) {
    const slot = document.createElement('div');
    const isSelected = entry.id === armorySelectedId;
    slot.className = 'arm-slot' + (isSelected ? ' arm-selected' : '') + (entry.discovered ? '' : ' arm-undiscovered');

    if (entry.discovered) {
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = TILE_SIZE;
      spriteCanvas.height = TILE_SIZE;
      spriteCanvas.className = 'arm-slot-sprite';
      const sctx = spriteCanvas.getContext('2d');
      sctx.drawImage(getItemSprite(entry.icon), 0, 0);

      const tierColor = TIER_COLORS[entry.tier] || '#888';
      const tierDot = document.createElement('span');
      tierDot.className = 'arm-tier-dot';
      tierDot.style.background = tierColor;
      tierDot.title = TIER_NAMES[entry.tier] || 'Common';

      const info = document.createElement('div');
      info.className = 'arm-slot-info';
      info.innerHTML = `
        <div class="arm-slot-name" style="color:${tierColor}">${entry.name}</div>
        <div class="arm-slot-type">${TYPE_LABELS[entry.type] || 'Item'}${entry.tier ? ' T' + entry.tier : ''}</div>
      `;

      slot.appendChild(tierDot);
      slot.appendChild(spriteCanvas);
      slot.appendChild(info);

      slot.addEventListener('click', () => {
        armorySelectedId = entry.id;
        updateArmory();
      });
    } else {
      slot.innerHTML = `
        <span class="arm-tier-dot" style="background:#333"></span>
        <div class="arm-slot-unknown">?</div>
        <div class="arm-slot-info">
          <div class="arm-slot-name" style="color:#333">???</div>
          <div class="arm-slot-type">Unknown</div>
        </div>
      `;
    }

    listPanel.appendChild(slot);
  }

  // Render right detail panel
  const detailPanel = document.getElementById('armory-detail');
  const selected = entries.find(e => e.id === armorySelectedId);

  if (!selected || !selected.discovered) {
    detailPanel.innerHTML = '<div class="armory-detail-empty">Select a discovered item</div>';
    return;
  }

  const tierColor = TIER_COLORS[selected.tier] || '#888';
  const tierName = TIER_NAMES[selected.tier] || 'Common';

  // Build large sprite
  const largeSpriteCanvas = document.createElement('canvas');
  largeSpriteCanvas.width = 128;
  largeSpriteCanvas.height = 128;
  largeSpriteCanvas.className = 'arm-detail-sprite';
  const lctx = largeSpriteCanvas.getContext('2d');
  lctx.imageSmoothingEnabled = false;
  lctx.drawImage(getItemSprite(selected.icon), 0, 0, TILE_SIZE, TILE_SIZE, 0, 0, 128, 128);

  // Build stat lines
  const statLines = [];
  if (selected.power) statLines.push({ label: 'POWER', val: '+' + selected.power, color: '#e0a060' });
  if (selected.armor) statLines.push({ label: 'ARMOR', val: '+' + selected.armor, color: '#60a0e0' });
  if (selected.spellBonus) statLines.push({ label: 'SPELL DMG', val: '+' + selected.spellBonus, color: '#c080e0' });
  if (selected.rangeBonus) statLines.push({ label: 'RANGE', val: '+' + selected.rangeBonus, color: '#60c080' });
  if (selected.manaBonus) statLines.push({ label: 'MAX MANA', val: '+' + selected.manaBonus, color: '#60a0e0' });
  if (selected.powerBonus) statLines.push({ label: 'POWER', val: '+' + selected.powerBonus, color: '#e0a060' });
  if (selected.healAmount) statLines.push({ label: 'HEALS', val: selected.healAmount + ' HP', color: '#60c060' });
  if (selected.manaAmount) statLines.push({ label: 'RESTORES', val: selected.manaAmount + ' MP', color: '#6080e0' });
  if (selected.curePoison) statLines.push({ label: 'EFFECT', val: 'Cure Poison', color: '#80c060' });
  if (selected.effect) statLines.push({ label: 'BUFF', val: `+${selected.effect.amount} ${selected.effect.name} (${selected.effect.turns}t)`, color: '#e0c060' });

  const statsHtml = statLines.map(s =>
    `<div class="arm-stat"><span class="arm-stat-icon" style="background:${s.color}"></span><span class="arm-stat-label">${s.label}:</span> <span class="arm-stat-val" style="color:${s.color}">${s.val}</span></div>`
  ).join('');

  detailPanel.innerHTML = `
    <div class="arm-detail-title" style="color:${tierColor}">${selected.name}</div>
    <div class="arm-detail-subtitle">${TYPE_LABELS[selected.type] || 'Item'} &middot; <span style="color:${tierColor}">${tierName}</span></div>
    <div class="arm-detail-sprite-area">
      <div class="arm-detail-sprite-wrap" id="arm-sprite-target"></div>
    </div>
    <div class="arm-detail-desc">${selected.desc}</div>
    ${statsHtml ? `<div class="arm-detail-stats">${statsHtml}</div>` : ''}
    <div class="arm-detail-footer">
      <span>Times Found: ${selected.timesFound}</span>
      ${selected.stackable ? '<span class="arm-stack-tag">Stackable (max ' + (selected.maxStack || 5) + ')</span>' : ''}
      ${selected.slot ? '<span>Slot: ' + selected.slot + '</span>' : ''}
    </div>
  `;

  document.getElementById('arm-sprite-target').appendChild(largeSpriteCanvas);
}

// Armory tab switching
document.getElementById('armory-tab-all')?.addEventListener('click', () => {
  armoryTab = 'all';
  document.querySelectorAll('.armory-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('armory-tab-all').classList.add('active');
  updateArmory();
});
document.getElementById('armory-tab-weapons')?.addEventListener('click', () => {
  armoryTab = 'weapons';
  document.querySelectorAll('.armory-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('armory-tab-weapons').classList.add('active');
  updateArmory();
});
document.getElementById('armory-tab-armor')?.addEventListener('click', () => {
  armoryTab = 'armor';
  document.querySelectorAll('.armory-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('armory-tab-armor').classList.add('active');
  updateArmory();
});
document.getElementById('armory-tab-consumables')?.addEventListener('click', () => {
  armoryTab = 'consumables';
  document.querySelectorAll('.armory-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('armory-tab-consumables').classList.add('active');
  updateArmory();
});

// ── Healer Overlay ──────────────────────────

// ── Town Upgrade Helper ────────────────────
function renderTownUpgradeSection(overlay, building) {
  let section = overlay.querySelector('.town-upgrade-section');
  if (!section) {
    section = document.createElement('div');
    section.className = 'town-upgrade-section';
    overlay.appendChild(section);
  }
  const info = TOWN_UPGRADES[building];
  if (!info) { section.innerHTML = ''; return; }
  const level = getTownUpgradeLevel(building);
  const maxLevel = info.maxLevel;
  const desc = info.descriptions[level - 1] || '';

  if (level >= maxLevel) {
    section.innerHTML = `<div class="upgrade-level">Level ${level}/${maxLevel} (MAX)</div><div class="upgrade-desc">${desc}</div>`;
    return;
  }
  const nextCost = info.costs[level];
  const canAfford = state.player && state.player.gold >= nextCost;
  section.innerHTML = `
    <div class="upgrade-level">Level ${level}/${maxLevel}</div>
    <div class="upgrade-desc">${desc}</div>
    <div class="upgrade-next">Next: ${info.descriptions[level]} — <strong>${nextCost}g</strong></div>
    <button class="upgrade-btn" ${canAfford ? '' : 'disabled'}>Upgrade (${nextCost}g)</button>
  `;
  section.querySelector('.upgrade-btn')?.addEventListener('click', () => {
    upgradeTownBuilding(building);
    render();
  });
}

// ── Spell Book Overlay ───────────────────────

function updateSpellBookOverlay() {
  const overlay = document.getElementById('spellbook-overlay');
  if (!overlay) return;
  if (!state.showSpellBook) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  if (!p) return;

  // Update mana bar
  const manaFill = document.getElementById('sb-mana-fill');
  const manaText = document.getElementById('sb-mana-text');
  const manaPct = p.maxMana > 0 ? Math.round((p.mana / p.maxMana) * 100) : 0;
  if (manaFill) manaFill.style.width = `${manaPct}%`;
  if (manaText) manaText.textContent = `${p.mana} / ${p.maxMana}`;

  const list = document.getElementById('spellbook-list');
  if (!list) return;
  list.innerHTML = '';

  // Spell type icons
  const TYPE_ICONS = {
    ranged_single: '🎯',
    ranged_multi: '⚡',
    self_heal: '💚',
    aoe: '💥',
  };

  const spells = Object.values(SPELLS);

  if (!p.maxMana || p.maxMana <= 0) {
    list.innerHTML = '<div class="spellbook-no-spells">You have no mana capacity — only mages and characters with magic gear can cast spells.</div>';
    return;
  }

  for (const spell of spells) {
    const canAfford = p.mana >= spell.manaCost;
    const typeIcon = TYPE_ICONS[spell.type] || '✨';

    // Build stat chips
    let statsHtml = `<span class="spell-stat">💧 ${spell.manaCost} mana</span>`;
    if (spell.damage) statsHtml += `<span class="spell-stat">⚔️ ${spell.damage} dmg</span>`;
    if (spell.healAmount) statsHtml += `<span class="spell-stat">❤️ ${spell.healAmount} heal</span>`;
    if (spell.range) statsHtml += `<span class="spell-stat">📏 range ${spell.range}</span>`;
    if (spell.maxTargets) statsHtml += `<span class="spell-stat">🎯 hits ${spell.maxTargets}</span>`;

    const entry = document.createElement('div');
    entry.className = `spell-entry ${canAfford ? 'can-cast' : 'no-mana'}`;
    entry.innerHTML = `
      <div class="spell-key-badge">${spell.key.toUpperCase()}</div>
      <div class="spell-info">
        <div class="spell-name-row">
          <span class="spell-name">${typeIcon} ${spell.name}</span>
          <span class="spell-cost ${canAfford ? 'affordable' : ''}">💧 ${spell.manaCost}</span>
        </div>
        <div class="spell-stats">${statsHtml}</div>
        <div class="spell-desc">${spell.desc}</div>
      </div>
    `;
    list.appendChild(entry);
  }
}

// ── Floor Warp Overlay ───────────────────────

function updateFloorWarpOverlay() {
  const overlay = document.getElementById('floor-warp-overlay');
  if (!overlay) return;
  if (!state.showFloorWarp) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const list = document.getElementById('floor-warp-list');
  if (!list) return;
  list.innerHTML = '';

  const warps = state.unlockedFloorWarps || [];
  if (warps.length === 0) {
    list.innerHTML = '<p class="warp-empty">No floors unlocked yet.<br>Reach floor 5, 10, 15... to unlock warp points.</p>';
    return;
  }

  for (const floor of warps) {
    const btn = document.createElement('button');
    btn.className = 'warp-floor-btn';
    btn.innerHTML = `<span class="warp-floor-num">Floor ${floor}</span><span class="warp-floor-icon">⬆</span>`;
    btn.addEventListener('click', () => {
      import('./engine.js?v=47').then(({ warpToFloor }) => { warpToFloor(floor); });
      overlay.classList.add('hidden');
    });
    list.appendChild(btn);
  }
}

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
  const healerLevel = getTownUpgradeLevel('healer');
  const cost = healerLevel >= 3 ? 0 : healerLevel >= 2 ? 5 : 10;

  if (p.hp >= p.maxHp && p.mana >= p.maxMana) {
    status.textContent = 'You are already in perfect health!';
  } else {
    let statusText = `HP: ${p.hp}/${p.maxHp}` + (p.maxMana > 0 ? ` | Mana: ${p.mana}/${p.maxMana}` : '');
    statusText += cost > 0 ? ` (Cost: ${cost}g)` : ' (Free!)';
    status.textContent = statusText;
  }
  goldEl.textContent = `Your gold: ${p.gold}`;

  // Town upgrade section
  renderTownUpgradeSection(overlay, 'healer');
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

  // Update title based on shop type
  const shopTitle = overlay.querySelector('.title-shop');
  if (shopTitle) {
    shopTitle.textContent = state.isDungeonShop ? 'Wandering Trader' : 'Merchant';
  }

  // Town upgrade section (only in village shop)
  if (!state.isDungeonShop) {
    renderTownUpgradeSection(overlay, 'shop');
  } else {
    const existingSec = overlay.querySelector('.town-upgrade-section');
    if (existingSec) existingSec.innerHTML = '';
  }

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
      const price = getDiscountedPrice(entry.price);
      const canBuy = p.gold >= price && p.inventory.length < 30;
      const priceHtml = price < entry.price
        ? `<s style="color:#666">${entry.price}</s> ${price}g`
        : `${price}g`;
      div.innerHTML = `
        <span class="shop-item-name">${entry.item.icon} ${entry.item.name}</span>
        <span class="shop-item-desc">${entry.item.desc}</span>
        <span class="shop-item-price">${priceHtml}</span>
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

    // --- Filter bar + Sell All Trash button ---
    const toolbar = document.createElement('div');
    toolbar.className = 'sell-toolbar';

    const filters = ['All', 'Gear', 'Potions', 'Trash'];
    const filterBar = document.createElement('div');
    filterBar.className = 'sell-filter-bar';
    filters.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'sell-filter-btn' + (sellFilter === f ? ' active' : '');
      btn.textContent = f;
      btn.addEventListener('click', () => { sellFilter = f; render(); });
      filterBar.appendChild(btn);
    });

    const sellAllBtn = document.createElement('button');
    sellAllBtn.className = 'sell-all-trash-btn';
    sellAllBtn.textContent = '🗑 Sell All Trash';
    sellAllBtn.addEventListener('click', () => { sellAllTrash(); render(); });

    toolbar.appendChild(filterBar);
    toolbar.appendChild(sellAllBtn);
    sellList.appendChild(toolbar);

    // --- Item list ---
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'sell-items-container';
    sellList.appendChild(itemsContainer);

    // Apply filter
    const filteredIndices = [];
    for (let i = 0; i < p.inventory.length; i++) {
      const item = p.inventory[i];
      if (sellFilter === 'Gear' && (item.type === 'consumable' || item.type === 'material')) continue;
      if (sellFilter === 'Potions' && item.type !== 'consumable') continue;
      if (sellFilter === 'Trash' && !isTrashItem(item)) continue;
      filteredIndices.push(i);
    }

    if (p.inventory.length === 0) {
      itemsContainer.innerHTML = '<div class="shop-item sell-empty">Your backpack is empty.</div>';
    } else if (filteredIndices.length === 0) {
      itemsContainer.innerHTML = '<div class="shop-item sell-empty">No items match this filter.</div>';
    } else {
      filteredIndices.forEach(i => {
        const item = p.inventory[i];
        const div = document.createElement('div');
        const trash = isTrashItem(item);
        div.className = 'shop-item sell-item-row' + (trash ? ' sell-item-trash' : '');
        const count = item.count || 1;
        const countStr = count > 1 ? ` ×${count}` : '';
        const tierLabel = item.tier ? `<span class="sell-tier sell-tier-${item.tier}">T${item.tier}</span>` : '';
        const sellPrice = getSellPrice(item); // includes stack
        div.innerHTML = `
          <span class="shop-item-name">${item.icon} ${item.name}${countStr} ${tierLabel}</span>
          <span class="shop-item-desc">${item.desc}</span>
          <span class="sell-price-tag">${sellPrice}g</span>
          <button class="shop-sell-btn">Sell</button>
        `;
        div.querySelector('.shop-sell-btn').addEventListener('click', () => {
          sellItem(i);
          render();
        });
        itemsContainer.appendChild(div);
      });
    }
  }
}

let sellFilter = 'All';

// Shop tab switching
document.getElementById('shop-tab-buy')?.addEventListener('click', () => {
  shopTab = 'buy';
  render();
});
document.getElementById('shop-tab-sell')?.addEventListener('click', () => {
  shopTab = 'sell';
  render();
});

// ── Blacksmith Overlay ──────────────────────

function updateBlacksmithOverlay() {
  const overlay = document.getElementById('blacksmith-overlay');
  if (!overlay) return;
  if (!state.showBlacksmith) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const p = state.player;
  const goldEl = document.getElementById('blacksmith-gold');
  goldEl.innerHTML = `${t('ui.gold')}: <strong>${p.gold}</strong>`;

  const list = document.getElementById('blacksmith-recipes');
  list.innerHTML = '';

  // Alchemy tab toggle
  const bsTabBar = document.getElementById('blacksmith-tab-bar');
  if (!bsTabBar) {
    const tabBar = document.createElement('div');
    tabBar.id = 'blacksmith-tab-bar';
    tabBar.className = 'bs-tab-bar';
    tabBar.innerHTML = `
      <button class="bs-tab active" id="bs-tab-craft">⚒️ Craft</button>
      <button class="bs-tab" id="bs-tab-alchemy">🧪 Alchemy</button>
    `;
    list.parentNode.insertBefore(tabBar, list);
    document.getElementById('bs-tab-craft')?.addEventListener('click', () => {
      document.querySelectorAll('.bs-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('bs-tab-craft').classList.add('active');
      state._bsTab = 'craft';
      updateBlacksmithOverlay();
    });
    document.getElementById('bs-tab-alchemy')?.addEventListener('click', () => {
      document.querySelectorAll('.bs-tab').forEach(t => t.classList.remove('active'));
      document.getElementById('bs-tab-alchemy').classList.add('active');
      state._bsTab = 'alchemy';
      updateBlacksmithOverlay();
    });
  } else {
    // Update active tab visual
    document.querySelectorAll('.bs-tab').forEach(t => t.classList.remove('active'));
    const activeId = state._bsTab === 'alchemy' ? 'bs-tab-alchemy' : 'bs-tab-craft';
    document.getElementById(activeId)?.classList.add('active');
  }

  if (state._bsTab === 'alchemy') {
    // Show alchemy recipes
    for (let i = 0; i < ALCHEMY_RECIPES.length; i++) {
      const recipe = ALCHEMY_RECIPES[i];
      const outputItem = ITEMS[recipe.output];
      if (!outputItem) continue;
      const p = state.player;
      let canCraft = p.gold >= recipe.gold && p.inventory.length < BACKPACK_SIZE;
      const matParts = [];
      for (const [matId, qty] of Object.entries(recipe.materials)) {
        const mat = ITEMS[matId];
        const matName = mat ? mat.name : matId;
        const count = p.inventory.filter(it => it.id === matId).reduce((sum, it) => sum + (it.count ?? it.qty ?? 1), 0);
        const has = count >= qty;
        if (!has) canCraft = false;
        matParts.push(`<span class="${has ? 'bs-has' : 'bs-lack'}">${matName} ${count}/${qty}</span>`);
      }
      const div = document.createElement('div');
      div.className = 'bs-recipe' + (canCraft ? '' : ' bs-unavailable');
      div.innerHTML = `
        <div class="bs-recipe-info">
          <div class="bs-recipe-name">🧪 ${recipe.name}</div>
          <div class="bs-recipe-mats">${matParts.join(' + ')}</div>
          <div class="bs-recipe-desc">${recipe.desc}</div>
        </div>
        <div class="bs-recipe-cost">${recipe.gold}g</div>
        <button class="bs-craft-btn" data-alchemy-idx="${i}" ${canCraft ? '' : 'disabled'}>Brew</button>
      `;
      list.appendChild(div);
    }
    list.querySelectorAll('[data-alchemy-idx]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.alchemyIdx);
        alchemyCraft(idx);
        render();
      });
    });
    return;
  }

  const bsLevel = getTownUpgradeLevel('blacksmith');
  const allRecipes = getAvailableCraftingRecipes();
  for (let i = 0; i < allRecipes.length; i++) {
    const recipe = allRecipes[i];
    const outputItem = ITEMS[recipe.output];
    if (!outputItem) continue;

    const goldCost = bsLevel >= 3 ? Math.floor(recipe.gold * 0.8) : recipe.gold;
    // Check if player can craft
    let canCraft = p.gold >= goldCost && p.inventory.length < BACKPACK_SIZE;
    const matParts = [];
    for (const [matId, qty] of Object.entries(recipe.materials)) {
      const mat = ITEMS[matId];
      const matName = mat ? mat.name : matId;
      const count = p.inventory.filter(it => it.id === matId).reduce((sum, it) => sum + (it.qty || 1), 0);
      const has = count >= qty;
      if (!has) canCraft = false;
      matParts.push(`<span class="${has ? 'bs-has' : 'bs-lack'}">${matName} ${count}/${qty}</span>`);
    }

    const div = document.createElement('div');
    div.className = 'bs-recipe' + (canCraft ? '' : ' bs-unavailable');
    div.innerHTML = `
      <div class="bs-recipe-info">
        <div class="bs-recipe-name">${recipe.name}</div>
        <div class="bs-recipe-mats">${matParts.join(' + ')}</div>
      </div>
      <div class="bs-recipe-cost">${goldCost}g</div>
      <button class="bs-craft-btn" data-idx="${i}" ${canCraft ? '' : 'disabled'}>${t('blacksmith.craft')}</button>
    `;
    list.appendChild(div);
  }

  // Bind craft buttons
  list.querySelectorAll('.bs-craft-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.dataset.idx);
      craftItem(idx);
      render();
    });
  });

  // Town upgrade section
  renderTownUpgradeSection(overlay, 'blacksmith');
}

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

// ── Quest Board Overlay ─────────────────────

let questBoardTab = 'available';

function updateQuestBoardOverlay() {
  const overlay = document.getElementById('quest-overlay');
  if (!state.showQuestBoard) {
    overlay.classList.add('hidden');
    return;
  }
  overlay.classList.remove('hidden');

  const listEl = document.getElementById('quest-list');
  listEl.innerHTML = '';

  if (questBoardTab === 'available') {
    const available = getAvailableQuests();
    if (available.length === 0) {
      listEl.innerHTML = '<div class="quest-empty">No quests available. Complete active quests first!</div>';
    } else {
      for (const quest of available) {
        const div = document.createElement('div');
        div.className = 'quest-card';
        let rewardHtml = `<span class="quest-reward-gold">${quest.goldReward}g</span> <span class="quest-reward-xp">${quest.xpReward} XP</span>`;
        if (quest.itemReward) {
          const ri = ITEMS[quest.itemReward];
          if (ri) rewardHtml += ` <span class="quest-reward-item">${ri.name}</span>`;
        }
        div.innerHTML = `
          <div class="quest-card-header">
            <span class="quest-card-name">${quest.name}</span>
          </div>
          <div class="quest-card-desc">${quest.desc}</div>
          <div class="quest-card-rewards">Rewards: ${rewardHtml}</div>
          <button class="quest-accept-btn">Accept</button>
        `;
        div.querySelector('.quest-accept-btn').addEventListener('click', () => {
          acceptQuest(quest.id);
          render();
        });
        listEl.appendChild(div);
      }
    }
  } else {
    // Active quests
    const active = getActiveQuests();
    if (active.length === 0) {
      listEl.innerHTML = '<div class="quest-empty">No active quests. Visit the board to accept some!</div>';
    } else {
      for (const quest of active) {
        const div = document.createElement('div');
        div.className = 'quest-card' + (quest.completed ? ' quest-complete' : '');
        const pct = Math.min(100, Math.floor(quest.progress / quest.amount * 100));
        let rewardHtml = `<span class="quest-reward-gold">${quest.goldReward}g</span> <span class="quest-reward-xp">${quest.xpReward} XP</span>`;
        if (quest.itemReward) {
          const ri = ITEMS[quest.itemReward];
          if (ri) rewardHtml += ` <span class="quest-reward-item">${ri.name}</span>`;
        }
        div.innerHTML = `
          <div class="quest-card-header">
            <span class="quest-card-name">${quest.name}</span>
            <span class="quest-progress-text">${quest.progress}/${quest.amount}</span>
          </div>
          <div class="quest-progress-bar"><div class="quest-progress-fill" style="width:${pct}%"></div></div>
          <div class="quest-card-desc">${quest.desc}</div>
          <div class="quest-card-rewards">Rewards: ${rewardHtml}</div>
          <div class="quest-card-actions">
            ${quest.completed ? '<button class="quest-turnin-btn">Turn In</button>' : ''}
            <button class="quest-abandon-btn">Abandon</button>
          </div>
        `;
        if (quest.completed) {
          div.querySelector('.quest-turnin-btn').addEventListener('click', () => {
            turnInQuest(quest.id);
            render();
          });
        }
        div.querySelector('.quest-abandon-btn').addEventListener('click', () => {
          abandonQuest(quest.id);
          render();
        });
        listEl.appendChild(div);
      }
    }
  }
}

// Quest board tab switching
document.getElementById('quest-tab-available')?.addEventListener('click', () => {
  questBoardTab = 'available';
  document.querySelectorAll('.quest-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('quest-tab-available').classList.add('active');
  updateQuestBoardOverlay();
});
document.getElementById('quest-tab-active')?.addEventListener('click', () => {
  questBoardTab = 'active';
  document.querySelectorAll('.quest-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('quest-tab-active').classList.add('active');
  updateQuestBoardOverlay();
});

// ── Item Detail Popup ───────────────────────

const itemPopup = document.getElementById('item-popup');
const itemPopupContent = document.getElementById('item-popup-content');
const itemPopupButtons = document.getElementById('item-popup-buttons');

function showItemPopup(item, index, source) {
  hideItemTooltip();

  const tierNames = { 1: 'Common', 2: 'Uncommon', 3: 'Rare' };
  const typeLabels = { weapon: 'Weapon', helmet: 'Helmet', chest: 'Chest Armor', gloves: 'Gloves', boots: 'Boots', cape: 'Cape', consumable: 'Consumable', material: 'Material' };

  let html = '';
  if (item.tier) {
    html += `<div class="tooltip-tier tier-${item.tier}">${tierNames[item.tier] || ''}</div>`;
  }
  html += `<div class="popup-item-name">${item.name}</div>`;
  html += `<div class="popup-item-type">${typeLabels[item.type] || item.type}</div>`;

  const stats = [];
  if (item.power) stats.push(`+${item.power} Power`);
  if (item.armor) stats.push(`+${item.armor} Armor`);
  if (item.spellBonus) stats.push(`+${item.spellBonus} Spell Damage`);
  if (item.rangeBonus) stats.push(`+${item.rangeBonus} Range`);
  if (item.manaBonus) stats.push(`+${item.manaBonus} Max Mana`);
  if (item.healAmount) stats.push(`Restores ${item.healAmount} HP`);
  if (item.manaAmount) stats.push(`Restores ${item.manaAmount} Mana`);
  if (item.effect) stats.push(`${item.effect.name}: +${item.effect.amount} ${item.effect.stat} (${item.effect.turns} turns)`);
  if (item.count && item.count > 1) stats.push(`Count: ${item.count}`);
  // Item features
  if (item.features) {
    for (const f of item.features) {
      const info = FEATURE_INFO[f.type];
      if (info) stats.push(`<span style="color:${info.color}">${info.desc(f.value)}</span>`);
    }
  }

  if (stats.length > 0) {
    html += '<div class="popup-stats">';
    for (const s of stats) html += `<div class="popup-stat">${s}</div>`;
    html += '</div>';
  }
  if (item.desc) {
    html += `<div class="popup-desc">${item.desc}</div>`;
  }

  itemPopupContent.innerHTML = html;
  itemPopupButtons.innerHTML = '';

  if (source === 'inventory') {
    // Use/Equip button
    if (item.type === ITEM_TYPE.CONSUMABLE) {
      const useBtn = document.createElement('button');
      useBtn.className = 'popup-btn popup-btn-use';
      useBtn.textContent = 'Use';
      useBtn.addEventListener('click', () => {
        useItem(index);
        closeItemPopup();
        render();
      });
      itemPopupButtons.appendChild(useBtn);
    } else {
      const equipBtn = document.createElement('button');
      equipBtn.className = 'popup-btn popup-btn-use';
      equipBtn.textContent = 'Equip';
      equipBtn.addEventListener('click', () => {
        useItem(index);
        closeItemPopup();
        render();
      });
      itemPopupButtons.appendChild(equipBtn);
    }

    // Drop button
    const dropBtn = document.createElement('button');
    dropBtn.className = 'popup-btn popup-btn-drop';
    dropBtn.textContent = 'Drop';
    dropBtn.addEventListener('click', () => {
      dropItem(index);
      closeItemPopup();
      render();
    });
    itemPopupButtons.appendChild(dropBtn);

    // Destroy button
    const destroyBtn = document.createElement('button');
    destroyBtn.className = 'popup-btn popup-btn-destroy';
    destroyBtn.textContent = 'Destroy';
    destroyBtn.addEventListener('click', () => {
      destroyItem(index);
      closeItemPopup();
      render();
    });
    itemPopupButtons.appendChild(destroyBtn);
  } else if (source === 'equipment') {
    // Unequip button
    const unequipBtn = document.createElement('button');
    unequipBtn.className = 'popup-btn popup-btn-use';
    unequipBtn.textContent = 'Unequip';
    unequipBtn.addEventListener('click', () => {
      unequipItem(index);  // index is the slot key here
      closeItemPopup();
      render();
    });
    itemPopupButtons.appendChild(unequipBtn);
  }

  itemPopup.classList.remove('hidden');
}

function closeItemPopup() {
  itemPopup.classList.add('hidden');
}

document.getElementById('item-popup-close')?.addEventListener('click', closeItemPopup);

window.addEventListener('showItemPopup', (e) => {
  const idx = e.detail;
  if (idx >= 0 && idx < state.player.inventory.length) {
    showItemPopup(state.player.inventory[idx], idx, 'inventory');
  }
});

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
  const typeLabels = { weapon: 'Weapon', helmet: 'Helmet', chest: 'Chest Armor', gloves: 'Gloves', boots: 'Boots', cape: 'Cape', consumable: 'Consumable', material: 'Material' };
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
  if (item.features) {
    for (const f of item.features) {
      const info = FEATURE_INFO[f.type];
      if (info) stats.push(`<span style="color:${info.color}">${info.desc(f.value)}</span>`);
    }
  }

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

// ── Tile Hover Tooltip ───────────────────────

const tileTooltip = document.getElementById('tile-tooltip');

function hideTileTooltip() {
  if (tileTooltip) tileTooltip.classList.add('hidden');
}

function positionTileTooltip(clientX, clientY) {
  if (!tileTooltip) return;
  const pad = 14;
  let x = clientX + pad;
  let y = clientY + pad;
  const rect = tileTooltip.getBoundingClientRect();
  if (x + rect.width > window.innerWidth - 8)  x = clientX - rect.width - pad;
  if (y + rect.height > window.innerHeight - 8) y = clientY - rect.height - pad;
  tileTooltip.style.left = x + 'px';
  tileTooltip.style.top  = y + 'px';
}

function buildTileTooltip(tx, ty) {
  if (!tileTooltip) return;
  if (!state.player || state.mode === 'arena') { hideTileTooltip(); return; }

  // Only show for revealed tiles
  const revealed = state.revealed && state.revealed[ty] && state.revealed[ty][tx];
  if (!revealed) { hideTileTooltip(); return; }

  let html = '';

  // ── Player ─────────────────────────────────
  if (tx === state.player.x && ty === state.player.y) {
    const p = state.player;
    const hpPct = Math.round((p.hp / p.maxHp) * 100);
    html += `<span class="tt-badge tt-badge-player">You</span>`;
    html += `<div class="tt-header"><span class="tt-icon">🧍</span>
      <div><div class="tt-name">${p.name || 'Hero'}</div>
      <div class="tt-subname">Level ${p.level} ${state.playerClass || ''}</div></div></div>`;
    html += `<div class="tt-hp-bar"><div class="tt-hp-fill" style="width:${hpPct}%;background:#48c048"></div></div>`;
    html += `<div class="tt-hp-text">HP ${p.hp} / ${p.maxHp}</div>`;
    html += `<div class="tt-stats">
      <div class="tt-stat"><span>Power</span><span>${p.power || 0}</span></div>
      <div class="tt-stat"><span>Armor</span><span>${p.armor || 0}</span></div>
      ${p.maxMana > 0 ? `<div class="tt-stat"><span>Mana</span><span>${p.mana} / ${p.maxMana}</span></div>` : ''}
      <div class="tt-stat"><span>Floor</span><span>${state.floor || 'Village'}</span></div>
    </div>`;
    tileTooltip.innerHTML = html;
    tileTooltip.classList.remove('hidden');
    return;
  }

  // ── Enemy ───────────────────────────────────
  const enemy = state.enemies && state.enemies.find(e => e.x === tx && e.y === ty && e.hp > 0);
  if (enemy) {
    const info = BESTIARY_INFO[enemy.type] || {};
    // Entity-type → emoji map for tooltip icons
    const ENTITY_ICONS = {
      [ENTITY.GOBLIN]: '👺', [ENTITY.GOBLIN_SHAMAN]: '🧙', [ENTITY.GOBLIN_BERSERKER]: '👺',
      [ENTITY.GOBLIN_SCOUT]: '👺', [ENTITY.GOBLIN_WARLORD]: '👑',
      [ENTITY.ORC]: '🐗', [ENTITY.ORC_BRUTE]: '🐗', [ENTITY.ORC_CHAMPION]: '🐗',
      [ENTITY.SKELETON]: '💀', [ENTITY.SKELETON_ARCHER]: '💀', [ENTITY.SKELETON_KNIGHT]: '💀',
      [ENTITY.SPIDER]: '🕷️', [ENTITY.GIANT_SPIDER]: '🕷️',
      [ENTITY.BAT]: '🦇', [ENTITY.CAVE_TROLL]: '👹', [ENTITY.TROLL]: '👹',
      [ENTITY.SLIME]: '🟢', [ENTITY.WRAITH]: '👻', [ENTITY.DARK_MAGE]: '🧙',
      [ENTITY.MUSHROOM]: '🍄', [ENTITY.VAMPIRE]: '🧛', [ENTITY.LICH]: '☠️',
      [ENTITY.DRAGON]: '🐉', [ENTITY.DEMON]: '😈', [ENTITY.MIMIC]: '📦',
      [ENTITY.GREATER_MIMIC]: '📦', [ENTITY.ANCIENT_MIMIC]: '📦',
      [ENTITY.INFERNAL_MAGE]: '🔥', [ENTITY.ICE_MAGE]: '❄️',
      [ENTITY.FROST_GIANT]: '🧊', [ENTITY.SAND_SCORPION]: '🦂',
      [ENTITY.PLAGUE_RAT]: '🐀', [ENTITY.SWAMP_HAG]: '🧟',
    };
    const entityIcon = ENTITY_ICONS[enemy.type] || '👾';
    const hpPct = Math.max(0, Math.round((enemy.hp / enemy.maxHp) * 100));
    const hpColor = hpPct > 60 ? '#48c048' : hpPct > 30 ? '#d0a020' : '#d03030';
    const nameClass = enemy.isPhaseBoss || enemy.isBoss ? 'boss' : enemy.isElite || enemy.isMiniboss || enemy.isGuardian ? 'elite' : '';
    const label = enemy.isPhaseBoss ? 'Phase Boss' : enemy.isBoss ? 'Boss' : enemy.isGuardian ? 'Guardian' : enemy.isMiniboss ? 'Mini-Boss' : enemy.isElite ? `Elite` : 'Enemy';
    const prefix = (enemy.isElite || enemy.isMiniboss) && enemy.elitePrefix ? `${enemy.elitePrefix} ` : '';
    const displayName = prefix + getEnemyName(enemy);
    html += `<span class="tt-badge tt-badge-enemy">${label}</span>`;
    html += `<div class="tt-header">
      <span class="tt-icon">${entityIcon}</span>
      <div><div class="tt-name ${nameClass}">${displayName}</div>
      ${info.title ? `<div class="tt-subname">${info.title}</div>` : ''}</div>
    </div>`;
    html += `<div class="tt-hp-bar"><div class="tt-hp-fill" style="width:${hpPct}%;background:${hpColor}"></div></div>`;
    html += `<div class="tt-hp-text">HP ${enemy.hp} / ${enemy.maxHp}</div>`;
    html += `<div class="tt-stats">
      <div class="tt-stat"><span>Power</span><span>${enemy.power || 0}</span></div>
      ${enemy.armor ? `<div class="tt-stat"><span>Armor</span><span>${enemy.armor}</span></div>` : ''}
      ${info.element ? `<div class="tt-stat"><span>Element</span><span>${info.element}</span></div>` : ''}
    </div>`;
    if (info.desc) html += `<div class="tt-desc">${info.desc}</div>`;
    tileTooltip.innerHTML = html;
    tileTooltip.classList.remove('hidden');
    return;
  }

  // ── Den ─────────────────────────────────────
  const den = state.dens && state.dens.find(d => d.x === tx && d.y === ty && !d.destroyed);
  if (den) {
    const hpPct = Math.max(0, Math.round((den.hp / den.maxHp) * 100));
    html += `<span class="tt-badge tt-badge-enemy">Spawner</span>`;
    html += `<div class="tt-header"><span class="tt-icon">🕳️</span>
      <div><div class="tt-name elite">${den.name}</div>
      <div class="tt-subname">Monster Den</div></div></div>`;
    html += `<div class="tt-hp-bar"><div class="tt-hp-fill" style="width:${hpPct}%;background:#c06030"></div></div>`;
    html += `<div class="tt-hp-text">HP ${den.hp} / ${den.maxHp}</div>`;
    html += `<div class="tt-desc">Periodically spawns enemies. Destroy it to stop new threats.</div>`;
    tileTooltip.innerHTML = html;
    tileTooltip.classList.remove('hidden');
    return;
  }

  // ── Ground item ─────────────────────────────
  const groundItem = state.items && state.items.find(i => i.x === tx && i.y === ty);
  if (groundItem) {
    const item = groundItem.item;
    const tierColors = { 1: '#888', 2: '#40a040', 3: '#4080e0', 4: '#a040e0', 5: '#e0a030' };
    const tierNames  = { 1: 'Common', 2: 'Uncommon', 3: 'Rare', 4: 'Epic', 5: 'Legendary' };
    if (item.tier) html += `<span class="tt-badge tt-badge-item" style="color:${tierColors[item.tier]||'#888'}">${tierNames[item.tier]||''}</span>`;
    html += `<div class="tt-header"><span class="tt-icon">${item.icon || '📦'}</span>
      <div><div class="tt-name">${item.name}</div>
      <div class="tt-subname">${item.type || ''}</div></div></div>`;
    const stats = [];
    if (item.power) stats.push(['Power', `+${item.power}`]);
    if (item.armor) stats.push(['Armor', `+${item.armor}`]);
    if (item.spellBonus) stats.push(['Spell Dmg', `+${item.spellBonus}`]);
    if (item.healAmount) stats.push(['Heals', `${item.healAmount} HP`]);
    if (item.manaAmount) stats.push(['Restores', `${item.manaAmount} MP`]);
    if (stats.length) {
      html += '<div class="tt-stats">';
      for (const [k, v] of stats) html += `<div class="tt-stat"><span>${k}</span><span>${v}</span></div>`;
      html += '</div>';
    }
    if (item.desc) html += `<div class="tt-desc">${item.desc}</div>`;
    tileTooltip.innerHTML = html;
    tileTooltip.classList.remove('hidden');
    return;
  }

  // ── Chest ───────────────────────────────────
  const chest = state.chests && state.chests.find(c => c.x === tx && c.y === ty);
  if (chest) {
    if (chest.opened) {
      html += `<span class="tt-badge tt-badge-chest">Empty</span>`;
      html += `<div class="tt-header"><span class="tt-icon">📭</span>
        <div><div class="tt-name">Opened Chest</div></div></div>`;
    } else if (chest.isMimic) {
      // Don't spoil mimic — show as chest
      html += `<span class="tt-badge tt-badge-chest">Chest</span>`;
      html += `<div class="tt-header"><span class="tt-icon">📦</span>
        <div><div class="tt-name">Treasure Chest</div>
        <div class="tt-subname">Approach to open</div></div></div>`;
    } else {
      const itemCount = chest.items ? chest.items.length : 0;
      html += `<span class="tt-badge tt-badge-chest">Chest</span>`;
      html += `<div class="tt-header"><span class="tt-icon">💰</span>
        <div><div class="tt-name">Treasure Chest</div>
        <div class="tt-subname">Approach to open</div></div></div>`;
      html += `<div class="tt-stats">
        ${chest.gold ? `<div class="tt-stat"><span>Gold</span><span>${chest.gold}g</span></div>` : ''}
        ${itemCount ? `<div class="tt-stat"><span>Items</span><span>${itemCount}</span></div>` : ''}
      </div>`;
    }
    tileTooltip.innerHTML = html;
    tileTooltip.classList.remove('hidden');
    return;
  }

  // ── Special tile ────────────────────────────
  const tile = state.map && state.map[ty] && state.map[ty][tx];
  const tileProps = tile !== undefined ? TILE_PROPS[tile] : null;
  if (!tileProps) { hideTileTooltip(); return; }

  // Skip boring floor/wall tiles — only show interesting ones
  const INTERESTING_TILES = new Set([
    TILE.CAVE_STAIRS, TILE.UP_STAIRS, TILE.CAVE_ENTRANCE, TILE.PORTAL,
    TILE.HEALER, TILE.MERCHANT, TILE.QUEST_BOARD, TILE.DUNGEON_MERCHANT,
    TILE.FOUNTAIN, TILE.SARCOPHAGUS, TILE.WEAPON_RACK, TILE.BOOKSHELF,
    TILE.BARREL, TILE.FISHING_SPOT, TILE.ARENA, TILE.BLACKSMITH,
    TILE.FLOOR_WARP, TILE.WATER,
  ]);
  if (!INTERESTING_TILES.has(tile)) { hideTileTooltip(); return; }

  const TILE_DESCS = {
    [TILE.CAVE_STAIRS]:      { icon: '🪜', desc: 'Leads deeper into the dungeon.' },
    [TILE.UP_STAIRS]:        { icon: '🪜', desc: 'Return to the previous floor.' },
    [TILE.CAVE_ENTRANCE]:    { icon: '🕳️', desc: 'The entrance to the dungeon depths.' },
    [TILE.PORTAL]:           { icon: '🌀', desc: 'A magical portal to the village.' },
    [TILE.HEALER]:           { icon: '💊', desc: 'Restore HP and cure ailments for gold.' },
    [TILE.MERCHANT]:         { icon: '🛒', desc: 'Buy and sell equipment and supplies.' },
    [TILE.QUEST_BOARD]:      { icon: '📋', desc: 'Accept quests for gold and XP rewards.' },
    [TILE.DUNGEON_MERCHANT]: { icon: '🛒', desc: 'A wandering trader found in the dungeon.' },
    [TILE.FOUNTAIN]:         { icon: '⛲', desc: 'A mystical fountain. Step adjacent to interact.' },
    [TILE.SARCOPHAGUS]:      { icon: '⚰️', desc: 'A stone coffin. May contain treasure — or worse.' },
    [TILE.WEAPON_RACK]:      { icon: '🗡️', desc: 'A rack of weapons. Examine it carefully.' },
    [TILE.BOOKSHELF]:        { icon: '📚', desc: 'Ancient tomes line these shelves.' },
    [TILE.BARREL]:           { icon: '🪣', desc: 'A wooden barrel. Might hold supplies.' },
    [TILE.FISHING_SPOT]:     { icon: '🎣', desc: 'A calm pool. Press E to fish here.' },
    [TILE.ARENA]:            { icon: '⚔️', desc: 'Enter the arena to fight waves of enemies for rewards.' },
    [TILE.BLACKSMITH]:       { icon: '🔨', desc: 'Craft and upgrade gear using materials.' },
    [TILE.FLOOR_WARP]:       { icon: '⬆', desc: 'Warp stone — teleport to unlocked checkpoint floors.' },
    [TILE.WATER]:            { icon: '💧', desc: 'A pool of still water.' },
  };

  const td = TILE_DESCS[tile] || { icon: '🔲', desc: '' };
  html += `<span class="tt-badge tt-badge-tile">${tileProps.walkable ? 'Passable' : 'Obstacle'}</span>`;
  html += `<div class="tt-header"><span class="tt-icon">${td.icon}</span>
    <div><div class="tt-name">${tileProps.name}</div></div></div>`;
  if (td.desc) html += `<div class="tt-desc">${td.desc}</div>`;

  tileTooltip.innerHTML = html;
  tileTooltip.classList.remove('hidden');
}

// Wire canvas mousemove → tile tooltip
canvas.addEventListener('mousemove', (e) => {
  if (!state.player || state.phase === 'class_select' || state.gameOver) {
    hideTileTooltip(); return;
  }
  // Any overlay open? Hide tile tooltip
  if (state.showShop || state.showHealer || state.showBlacksmith || state.showChest ||
      state.showSettings || state.showCharSheet || state.showSkillTree ||
      state.showFloorWarp || state.showSpellBook || state.showAchievements ||
      state.showRunHistory || state.showBestiary || state.showArmory || state.showMinimap) {
    hideTileTooltip(); return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width  / rect.width;
  const scaleY = canvas.height / rect.height;
  const cx = (e.clientX - rect.left) * scaleX;
  const cy = (e.clientY - rect.top)  * scaleY;
  const ts = getTS();
  const { camX, camY } = getCamera();
  const tx = camX + Math.floor(cx / ts);
  const ty = camY + Math.floor(cy / ts);
  if (tx < 0 || ty < 0 || tx >= state.mapW || ty >= state.mapH) {
    hideTileTooltip(); return;
  }
  buildTileTooltip(tx, ty);
  positionTileTooltip(e.clientX, e.clientY);
});

canvas.addEventListener('mouseleave', hideTileTooltip);

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
      } else if (tile === TILE.DUNGEON_MERCHANT) {
        mctx.fillStyle = '#e0c040';
      } else if (tile === TILE.PILLAR) {
        mctx.fillStyle = '#6a6a7a';
      } else if (tile === TILE.WATER) {
        mctx.fillStyle = '#2a4a6a';
      } else if (tile === TILE.CARPET) {
        mctx.fillStyle = '#8a3030';
      } else if (tile === TILE.FOUNTAIN) {
        mctx.fillStyle = '#3a6a9a';
      } else if (tile === TILE.BOOKSHELF) {
        mctx.fillStyle = '#4a3010';
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

  // Draw enemies — gated by All-Seeing Eye
  const hasEyeMap = playerHasAllSeeingEye();
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    const visible = state.visibility[enemy.y] && state.visibility[enemy.y][enemy.x];
    if (!visible && !hasEyeMap) continue;
    mctx.globalAlpha = visible ? 1 : 0.45;
    mctx.fillStyle = enemy.isBoss ? '#e0c040' : '#e04040';
    mctx.fillRect(enemy.x * SCALE, enemy.y * SCALE, SCALE, SCALE);
  }
  mctx.globalAlpha = 1;

  // Draw ground items (visible)
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    mctx.fillStyle = '#40c040';
    mctx.fillRect(gi.x * SCALE, gi.y * SCALE, SCALE, SCALE);
  }

  // Draw map notes (yellow dots)
  const floorNotes = getFloorMapNotes();
  if (floorNotes && Object.keys(floorNotes).length > 0) {
    mctx.fillStyle = '#ffe060';
    for (const key of Object.keys(floorNotes)) {
      const [nx, ny] = key.split(',').map(Number);
      if (!isNaN(nx) && !isNaN(ny)) {
        mctx.fillRect(nx * SCALE, ny * SCALE, SCALE, SCALE);
        // Draw a tiny marker border to differentiate from stairs
        mctx.strokeStyle = '#ffa000';
        mctx.lineWidth = 0.5;
        mctx.strokeRect(nx * SCALE, ny * SCALE, SCALE, SCALE);
      }
    }
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
    <div class="legend-item"><span class="legend-swatch" style="background:#ffe060;border-color:#ffa000"></span> Note (N)</div>
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
  if (state.phase === 'class_select') return;
  const frame = getTorchFrame();
  const torchChanged = gameSettings.torchFlicker && frame !== lastTorchFrame && (state.mode === 'dungeon' || state.mode === 'arena');
  const hasDamageNums = damageNumbers.length > 0;
  if (torchChanged || hasDamageNums) {
    lastTorchFrame = frame;
    renderCanvas();
  }
}
torchAnimLoop();

// Separate canvas-only render for animation (avoids full UI rebuild)
function renderCanvas() {
  if (state.phase === 'class_select') return;

  const ts = getTS();
  const vw = getViewW();
  const vh = getViewH();
  const S = TILE_SIZE; // sprite source size (always 48)

  if (canvas.width !== vw * ts || canvas.height !== vh * ts) {
    resizeCanvas();
  }

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const { camX, camY } = getCamera();

  // Draw tiles
  for (let vy = 0; vy < vh; vy++) {
    for (let vx = 0; vx < vw; vx++) {
      const mx = camX + vx;
      const my = camY + vy;
      if (mx < 0 || mx >= state.mapW || my < 0 || my >= state.mapH) continue;
      const visible = state.visibility[my][mx];
      const revealed = state.revealed[my][mx];
      if (!revealed) continue;
      const tile = state.map[my][mx];
      const sprite = getTileSprite(tile, mx, my);
      const sx = vx * ts;
      const sy = vy * ts;
      ctx.drawImage(sprite, 0, 0, S, S, sx, sy, ts, ts);
      if (!visible) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(sx, sy, ts, ts);
      }
    }
  }

  // Draw torches
  if (state.mode === 'dungeon' || state.mode === 'arena') {
    const torchSprite = getTorchSprite();
    for (let vy = 0; vy < vh; vy++) {
      for (let vx = 0; vx < vw; vx++) {
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
        const sx = vx * ts;
        const sy = vy * ts;
        if (state.visibility[my][mx]) {
          ctx.drawImage(torchSprite, 0, 0, S, S, sx, sy, ts, ts);
        } else {
          ctx.globalAlpha = 0.4;
          ctx.drawImage(torchSprite, 0, 0, S, S, sx, sy, ts, ts);
          ctx.globalAlpha = 1;
        }
      }
    }
  }

  // Draw ground items
  for (const gi of state.items) {
    if (!state.visibility[gi.y] || !state.visibility[gi.y][gi.x]) continue;
    const sx = (gi.x - camX) * ts;
    const sy = (gi.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(getItemSprite(gi.item.icon), 0, 0, S, S, sx, sy, ts, ts);
  }

  // Draw chests
  for (const chest of state.chests) {
    if (!state.visibility[chest.y] || !state.visibility[chest.y][chest.x]) continue;
    const sx = (chest.x - camX) * ts;
    const sy = (chest.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const chestSprite = chest.opened ? getChestOpenSprite() : getChestClosedSprite();
    ctx.drawImage(chestSprite, 0, 0, S, S, sx, sy, ts, ts);
  }

  // Draw enemies
  for (const enemy of state.enemies) {
    if (enemy.hp <= 0) continue;
    if (!state.visibility[enemy.y] || !state.visibility[enemy.y][enemy.x]) continue;
    const sx = (enemy.x - camX) * ts;
    const sy = (enemy.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    ctx.drawImage(getEnemySprite(enemy.type), 0, 0, S, S, sx, sy, ts, ts);
    if (enemy.isBoss) {
      ctx.strokeStyle = '#e0c040';
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 1, sy + 1, ts - 2, ts - 2);
    }
    if (gameSettings.showEnemyHpBars) {
      const hpPct = enemy.hp / enemy.maxHp;
      ctx.fillStyle = '#300';
      ctx.fillRect(sx + 4, sy - 4, ts - 8, 3);
      ctx.fillStyle = hpPct > 0.5 ? '#0c0' : hpPct > 0.25 ? '#cc0' : '#c00';
      ctx.fillRect(sx + 4, sy - 4, (ts - 8) * hpPct, 3);
    }
  }

  // Draw projectiles
  for (const proj of state.projectiles) {
    const sx = (proj.x - camX) * ts;
    const sy = (proj.y - camY) * ts;
    if (sx < 0 || sy < 0 || sx >= canvas.width || sy >= canvas.height) continue;
    const pSprite = proj.type === 'fire' ? getFireballSprite()
      : proj.type === 'arrow' ? getArrowSprite()
      : proj.type === 'ice' ? getIceShardSprite()
      : getLightningSprite();
    ctx.drawImage(pSprite, 0, 0, S, S, sx, sy, ts, ts);
  }

  // Draw player
  const psx = (state.player.x - camX) * ts;
  const psy = (state.player.y - camY) * ts;
  ctx.drawImage(getPlayerSprite(state.playerClass), 0, 0, S, S, psx, psy, ts, ts);

  // Draw damage numbers
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const dn = damageNumbers[i];
    dn.age++;
    if (dn.age >= dn.maxAge) { damageNumbers.splice(i, 1); continue; }
    const alpha = 1 - (dn.age / dn.maxAge);
    const floatY = dn.age * 0.5;
    const dx = (dn.x - camX) * ts + ts / 2;
    const dy = (dn.y - camY) * ts - floatY;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = dn.color;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(dn.text, dx, dy);
    ctx.globalAlpha = 1;
  }
}

// ── Level-Up Notification Banner ─────────────────

function updateLevelUpNotification(p) {
  let el = document.getElementById('levelup-notification');
  if (!el) {
    // Create if missing
    el = document.createElement('div');
    el.id = 'levelup-notification';
    el.className = 'levelup-notif hidden';
    const statPanel = document.getElementById('stats-panel');
    if (statPanel) statPanel.after(el);
  }

  const hasStatPoints = p && p.statPoints > 0;
  const hasSkillPoints = p && (p.skillPoints || 0) > 0;
  const hasSubclassAvail = state.showSubclassSelect;

  if (!hasStatPoints && !hasSkillPoints && !hasSubclassAvail) {
    el.classList.add('hidden');
    return;
  }

  el.classList.remove('hidden');
  const parts = [];
  if (hasStatPoints) parts.push(`<span class="lun-badge lun-stat" id="lun-open-char">📊 ${p.statPoints} Attr pt${p.statPoints !== 1 ? 's' : ''}</span>`);
  if (hasSkillPoints) parts.push(`<span class="lun-badge lun-skill" id="lun-open-skill">⭐ ${p.skillPoints} Skill pt${p.skillPoints !== 1 ? 's' : ''}</span>`);
  if (hasSubclassAvail) parts.push(`<span class="lun-badge lun-subclass">🎯 Specialization ready!</span>`);

  el.innerHTML = `<div class="lun-inner">✨ Level up! ${parts.join(' ')} <span class="lun-hint">→ Press C / V</span></div>`;

  // Click to open character sheet
  el.querySelector('#lun-open-char')?.addEventListener('click', () => {
    toggleCharSheet(); render();
  });
  el.querySelector('#lun-open-skill')?.addEventListener('click', () => {
    toggleSkillTree(); render();
  });
}

// ── Village Expansion Overlay ─────────────────────

function updateVillageExpansionOverlay() {
  const el = document.getElementById('village-expansion-overlay');
  if (!el) return;
  if (!state.showVillageExpansion) {
    el.classList.add('hidden');
    return;
  }
  el.classList.remove('hidden');

  const listEl = document.getElementById('village-expansion-list');
  if (!listEl) return;
  listEl.innerHTML = '';

  const gold = state.player?.gold || 0;

  for (const [key, bld] of Object.entries(VILLAGE_BUILDINGS)) {
    const built = state.townBuildings[key];
    const canAfford = gold >= bld.cost;
    const row = document.createElement('div');
    row.className = 'vexp-row' + (built ? ' vexp-built' : '');
    row.innerHTML = `
      <div class="vexp-icon">${bld.emoji}</div>
      <div class="vexp-info">
        <div class="vexp-name">${bld.name} ${built ? '✅' : ''}</div>
        <div class="vexp-desc">${bld.desc}</div>
      </div>
      <div class="vexp-cost">${built ? 'Built' : `${bld.cost}g`}</div>
      ${!built ? `<button class="vexp-build-btn${canAfford ? '' : ' vexp-cant-afford'}" data-building="${key}" ${canAfford ? '' : 'disabled'}>Build</button>` : ''}
    `;
    if (!built) {
      const buildBtn = row.querySelector('.vexp-build-btn');
      buildBtn?.addEventListener('click', () => {
        purchaseBuilding(key);
        render();
      });
    }
    listEl.appendChild(row);
  }

  // Show current gold
  const goldEl = document.getElementById('vexp-gold');
  if (goldEl) goldEl.textContent = `Your gold: ${gold}g`;
}

// ── Class Select Unlock Info ─────────────────────────

function updateClassSelectUnlockInfo() {
  if (state.phase !== 'class_select') return;

  // Update lock badges and card clickability for unlockable classes
  const classMap = {
    'bard':          { cardId: 'pick-bard',          lockId: 'bard-lock' },
    'holy_knight':   { cardId: 'pick-holy-knight',   lockId: 'holy-knight-lock' },
    'plague_doctor': { cardId: 'pick-plague-doctor', lockId: 'plague-doctor-lock' },
  };

  for (const [cls, ids] of Object.entries(classMap)) {
    const card = document.getElementById(ids.cardId);
    const lockBadge = document.getElementById(ids.lockId);
    if (!card) continue;
    const unlocked = state.unlockedClasses.includes(cls);
    const cond = CLASS_UNLOCK_CONDITIONS[cls];
    if (unlocked) {
      card.classList.remove('class-card-locked');
      card.classList.add('unlocked-class');
      if (lockBadge) { lockBadge.textContent = '✅ Unlocked!'; lockBadge.classList.add('unlocked'); }
    } else {
      card.classList.add('class-card-locked');
      card.classList.remove('unlocked-class');
      if (lockBadge && cond) { lockBadge.textContent = `🔒 ${cond.desc}`; lockBadge.classList.remove('unlocked'); }
    }
  }

  // Update unlock hints summary
  const el = document.getElementById('class-unlock-info');
  if (!el) return;
  el.style.display = '';
  const rows = [];
  for (const [cls, cond] of Object.entries(CLASS_UNLOCK_CONDITIONS)) {
    const unlocked = state.unlockedClasses.includes(cls);
    const name = CLASS_STATS[cls]?.name || cls;
    rows.push(`<span class="unlock-hint ${unlocked ? 'unlocked' : 'locked'}">${unlocked ? '✅' : '🔒'} ${name}: ${cond.desc}</span>`);
  }
  el.innerHTML = rows.join('');
}
