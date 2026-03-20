import {
  state, selectClass, playerMove, playerWait, useItem,
  chooseLevelUp, restartGame, shootBow, toggleBestiary, toggleArmory, toggleMinimap,
  enterThrowMode, cancelThrowMode, throwInDirection, castSpell,
  healPlayer, closeHealer, closeShop, closeChest, takeAllFromChest, closeQuestBoard,
  toggleSettings, closeSettings, applyCheatCode,
  toggleCharSheet, closeCharSheet,
  toggleSkillTree, closeSkillTree, useActiveSkill, getSkillRank,
  toggleAchievements, closeAchievements,
  loadGame, hasSaveGame, deleteSave, loadGameFromCloud, throwTrash, fullResetGame,
  useTownPortal,
  activatePrestige, declinePrestige,
  closeFishing, castLine, reelIn,
  closeArena, enterArena, nextArenaWave, leaveArena,
  closeBlacksmith, craftItem,
  toggleRunHistory, closeRunHistory,
  closeFloorWarp, warpToFloor,
  toggleSpellBook, closeSpellBook,
  gameSettings, updateSetting, pickupItem,
  apiRegister, apiLogin, setAuth, isLoggedIn, getAuthUsername,
  startCloudSync, checkDbStatus,
  setDifficulty, toggleVillageExpansion, closeVillageExpansion, purchaseBuilding,
  setHeroName, setHeroColor, enterBeach, enterTown, exitBeach, exitTown,
  toggleAutoExplore, addMapNote, getMapNote, toggleTalentTree, closeTalentTree,
  unlockTalent, getTalentPoints, getUnlockedTalents,
} from './engine.js?v=44';
import { render, resizeCanvas } from './renderer.js?v=44';
import { PLAYER_CLASS, PRESTIGE, DIFFICULTY, TALENT_TREES } from './constants.js?v=44';
import { initI18n, setLanguage, applyStaticTranslations, t } from './i18n.js';

// ── Initialize i18n ─────────────────────────
initI18n(gameSettings.language);

// ── Login / Register ────────────────────────

const loginOverlay = document.getElementById('login-overlay');
const loginError = document.getElementById('login-error');
const loginUsernameInput = document.getElementById('login-username');
const loginPasswordInput = document.getElementById('login-password');
const btnLogin = document.getElementById('btn-login');
const btnRegister = document.getElementById('btn-register');
const btnPlayOffline = document.getElementById('btn-play-offline');

function showLoginError(msg) {
  loginError.textContent = msg;
  loginError.style.display = '';
}

function hideLoginError() {
  loginError.style.display = 'none';
}

function showLoginOverlay() {
  loginOverlay.classList.remove('hidden');
}

function hideLoginOverlay() {
  loginOverlay.classList.add('hidden');
}

function updateUserBadge() {
  const el = document.getElementById('game-version');
  if (el) {
    el.textContent = isLoggedIn() ? `v43 | ${getAuthUsername()}` : 'v43';
  }
}

// ── Continue-or-New-Game flow ─────────────────
const continueOrNewOverlay = document.getElementById('continue-or-new-overlay');
const btnContinueGame = document.getElementById('btn-continue-game');
const btnNewGame = document.getElementById('btn-new-game');

function showContinueOrNew() {
  // Populate save info line
  const infoEl = document.getElementById('continue-save-info');
  if (infoEl) {
    try {
      const raw = localStorage.getItem('rpg_save');
      if (raw) {
        const snap = JSON.parse(raw);
        const p = snap.player;
        const cls = snap.playerClass || '';
        const lvl = p?.level || 1;
        const floor = snap.floor || 0;
        const name = p?.name || 'Hero';
        infoEl.textContent = `${name} · ${cls} · Level ${lvl} · Floor ${floor}`;
      }
    } catch (_) {}
  }
  continueOrNewOverlay?.classList.remove('hidden');
}

function hideContinueOrNew() {
  continueOrNewOverlay?.classList.add('hidden');
}

btnContinueGame?.addEventListener('click', () => {
  if (loadGame()) {
    hideContinueOrNew();
    if (state.playerClass === PLAYER_CLASS.MAGE) addManaLevelUpBtn();
    render();
  }
});

btnNewGame?.addEventListener('click', () => {
  hideContinueOrNew();
  classSelectEl.classList.remove('hidden');
});

// Called after login overlay is dismissed — route to continue-or-new or class select
function afterLogin() {
  updateUserBadge();
  if (hasSaveGame()) {
    showContinueOrNew();
  } else {
    classSelectEl.classList.remove('hidden');
  }
}

async function handleLogin() {
  hideLoginError();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;
  if (!username || !password) { showLoginError('Enter username and password'); return; }

  btnLogin.disabled = true;
  btnLogin.textContent = '...';
  try {
    const res = await apiLogin(username, password);
    if (res.error) { showLoginError(res.error); return; }
    setAuth(res.token, res.username);
    startCloudSync();
    hideLoginOverlay();

    // Try to load cloud save first; fall back to local save prompt
    const cloudLoaded = await loadGameFromCloud();
    if (cloudLoaded) {
      classSelectEl.classList.add('hidden');
      if (state.playerClass === PLAYER_CLASS.MAGE) addManaLevelUpBtn();
      render();
    } else {
      afterLogin();
    }
  } catch (e) {
    showLoginError('Connection failed');
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = 'Enter Dungeon';
  }
}

async function handleRegister() {
  hideLoginError();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value;
  if (!username || !password) { showLoginError('Enter username and password'); return; }

  btnRegister.disabled = true;
  btnRegister.textContent = '...';
  try {
    const res = await apiRegister(username, password);
    if (res.error) { showLoginError(res.error); return; }
    setAuth(res.token, res.username);
    startCloudSync();
    hideLoginOverlay();
    afterLogin();
  } catch (e) {
    showLoginError('Connection failed');
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = 'Create Hero';
  }
}

btnLogin?.addEventListener('click', handleLogin);
btnRegister?.addEventListener('click', handleRegister);
btnPlayOffline?.addEventListener('click', () => {
  hideLoginOverlay();
  afterLogin();
});

// Allow Enter key in login form
loginPasswordInput?.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') handleLogin();
});
loginUsernameInput?.addEventListener('keydown', (e) => {
  e.stopPropagation();
  if (e.key === 'Enter') loginPasswordInput?.focus();
});

// On load: always show login screen first, handle DB availability transparently
(async () => {
  const dbReady = await checkDbStatus();

  if (dbReady && isLoggedIn()) {
    // Already have a session token (page refresh) — try to skip login
    startCloudSync();
    const cloudLoaded = await loadGameFromCloud();
    if (cloudLoaded) {
      // Cloud save loaded directly — go straight to game
      classSelectEl.classList.add('hidden');
      if (state.playerClass === PLAYER_CLASS.MAGE) addManaLevelUpBtn();
      updateUserBadge();
      render();
      return;
    } else if (!isLoggedIn()) {
      // Token was invalidated — fall through to show login
    } else {
      // Logged in but no cloud save — show login UI briefly then route
      hideLoginOverlay();
      updateUserBadge();
      afterLogin();
      return;
    }
  }

  // Show the login screen (has Play Offline for offline users)
  showLoginOverlay();

  // Hide login/register inputs if no DB available
  if (!dbReady) {
    const form = document.querySelector('.login-form-v2');
    const hint = document.querySelector('.login-hint-v2');
    if (form) form.style.display = 'none';
    if (hint) hint.style.display = 'none';
  }
})();

// ── Class Selection ──────────────────────────

const classSelectEl = document.getElementById('class-select');

document.getElementById('pick-warrior')?.addEventListener('click', () => {
  selectClass(PLAYER_CLASS.WARRIOR);
  classSelectEl.classList.add('hidden');
  render();
});

document.getElementById('pick-mage')?.addEventListener('click', () => {
  selectClass(PLAYER_CLASS.MAGE);
  classSelectEl.classList.add('hidden');
  // Add mana level-up option for mage
  addManaLevelUpBtn();
  render();
});

document.getElementById('pick-archer')?.addEventListener('click', () => {
  selectClass(PLAYER_CLASS.ARCHER);
  classSelectEl.classList.add('hidden');
  render();
});

// Unlockable classes
document.getElementById('pick-bard')?.addEventListener('click', () => {
  if (!state.unlockedClasses.includes(PLAYER_CLASS.BARD)) return;
  selectClass(PLAYER_CLASS.BARD);
  classSelectEl.classList.add('hidden');
  addManaLevelUpBtn();
  render();
});
document.getElementById('pick-holy-knight')?.addEventListener('click', () => {
  if (!state.unlockedClasses.includes(PLAYER_CLASS.HOLY_KNIGHT)) return;
  selectClass(PLAYER_CLASS.HOLY_KNIGHT);
  classSelectEl.classList.add('hidden');
  addManaLevelUpBtn();
  render();
});
document.getElementById('pick-plague-doctor')?.addEventListener('click', () => {
  if (!state.unlockedClasses.includes(PLAYER_CLASS.PLAGUE_DOCTOR)) return;
  selectClass(PLAYER_CLASS.PLAGUE_DOCTOR);
  classSelectEl.classList.add('hidden');
  addManaLevelUpBtn();
  render();
});

// Hero name input handler
const heroNameInput = document.getElementById('hero-name-input');
if (heroNameInput) {
  heroNameInput.addEventListener('input', () => setHeroName(heroNameInput.value));
}

// Hero color selection
document.querySelectorAll('.hero-color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setHeroColor(btn.dataset.colorId);
    document.querySelectorAll('.hero-color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.difficulty;
    setDifficulty(id);
    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Village expansion
document.getElementById('village-expansion-btn')?.addEventListener('click', () => {
  toggleVillageExpansion();
  render();
});
document.getElementById('close-village-expansion')?.addEventListener('click', () => {
  closeVillageExpansion();
  render();
});
document.querySelectorAll('.build-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.building;
    purchaseBuilding(key);
    render();
  });
});

// ── Continue (Load Save) — kept for settings panel ─
const continueSaveBtn = document.getElementById('continue-save');
// The main continue flow is now handled by the continue-or-new overlay;
// this button still lives in the settings panel as a fallback.
continueSaveBtn?.addEventListener('click', () => {
  if (loadGame()) {
    classSelectEl.classList.add('hidden');
    if (state.playerClass === PLAYER_CLASS.MAGE) addManaLevelUpBtn();
    render();
  }
});

function addManaLevelUpBtn() {
  const choices = document.getElementById('level-up-choices');
  if (!document.getElementById('choose-mana')) {
    const btn = document.createElement('button');
    btn.id = 'choose-mana';
    btn.className = 'choice-btn';
    btn.textContent = t('levelup.mana');
    btn.addEventListener('click', () => {
      levelUpEl.classList.add('hidden');
      chooseLevelUp('mana');
      render();
    });
    choices.appendChild(btn);
  }
}

// ── Input Handling ───────────────────────────

document.addEventListener('keydown', (e) => {
  // Spell book toggle
  if (e.key === 'z' || e.key === 'Z') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleSpellBook();
      render();
      return;
    }
  }

  // Allow bestiary toggle even during class select
  if (e.key === 'b' || e.key === 'B') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleBestiary();
      render();
      return;
    }
  }

  // Minimap toggle
  if (e.key === 'm' || e.key === 'M') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleMinimap();
      render();
      return;
    }
  }

  // Settings toggle
  if (e.key === 'p' || e.key === 'P') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleSettings();
      render();
      return;
    }
  }

  // Armory toggle
  if (e.key === 'i' || e.key === 'I') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleArmory();
      render();
      return;
    }
  }

  // Character sheet toggle
  if (e.key === 'c' || e.key === 'C') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleCharSheet();
      render();
      return;
    }
  }

  // Skill tree toggle
  if (e.key === 'v' || e.key === 'V') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleSkillTree();
      render();
      return;
    }
  }

  // Map note toggle (N key) — only in dungeon/village on explored tiles
  if (e.key === 'n' || e.key === 'N') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      openMapNoteModal();
      return;
    }
  }

  // Talent tree toggle
  if (e.key === 'u' || e.key === 'U') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleTalentTree();
      if (state.showTalentTree) renderTalentTree();
      render();
      return;
    }
  }

  // Achievements toggle (moved to A key since N is now map notes)
  if (e.key === 'y' || e.key === 'Y') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleAchievements();
      render();
      return;
    }
  }

  // Run history toggle
  if (e.key === 'l' || e.key === 'L') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleRunHistory();
      render();
      return;
    }
  }

  // Escape closes overlays (but not prestige overlay or arena wave cleared)
  if (e.key === 'Escape') {
    if (state.showPrestige) return; // Cannot dismiss prestige with Escape
    if (state.arenaWaveCleared) return; // Must choose next wave or leave
    const itemPopup = document.getElementById('item-popup');
    if (!itemPopup.classList.contains('hidden')) {
      itemPopup.classList.add('hidden');
      return;
    }
    if (state.showTalentTree) { closeTalentTree(); render(); return; }
    if (state.showFishing) { closeFishing(); render(); return; }
    if (state.showArena) { closeArena(); render(); return; }
    if (state.showChest) { closeChest(); render(); return; }
    if (state.showSpellBook) { closeSpellBook(); render(); return; }
    if (state.showFloorWarp) { closeFloorWarp(); render(); return; }
    if (state.showHealer) { closeHealer(); render(); return; }
    if (state.showShop) { closeShop(); render(); return; }
    if (state.showBlacksmith) { closeBlacksmith(); render(); return; }
    if (state.showQuestBoard) { closeQuestBoard(); render(); return; }
    if (state.showSettings) { closeSettings(); render(); return; }
    if (state.showCharSheet) { closeCharSheet(); render(); return; }
    if (state.showSkillTree) { closeSkillTree(); render(); return; }
    if (state.showAchievements) { closeAchievements(); render(); return; }
    if (state.showRunHistory) { closeRunHistory(); render(); return; }
    if (state.showBestiary) { toggleBestiary(); render(); return; }
    if (state.showArmory) { toggleArmory(); render(); return; }
    if (state.showMinimap) { toggleMinimap(); render(); return; }
    // No overlay open — open Settings
    if (state.phase !== 'class_select' && !state.gameOver) {
      toggleSettings(); render(); return;
    }
  }

  if (state.phase === 'class_select') return;
  if (state.gameOver) return;
  if (state.pendingLevelUp) return;
  if (state.showPrestige) return;
  if (state.showFishing) return;
  if (state.showArena) return;
  if (state.arenaWaveCleared) return;
  if (state.showBestiary) return;
  if (state.showArmory) return;
  if (state.showMinimap) return;
  if (state.showFloorWarp) return;
  if (state.showHealer) return;
  if (state.showShop) return;
  if (state.showBlacksmith) return;
  if (state.showQuestBoard) return;
  if (state.showSettings) return;
  if (state.showCharSheet) return;
  if (state.showSkillTree) return;
  if (state.showAchievements) return;
  if (state.showRunHistory) return;
  if (state.showSubclassSelect) return;
  if (state.showChest) return;
  if (state.showTalentTree) return;

  // Tab: toggle auto-explore
  if (e.key === 'Tab') {
    e.preventDefault();
    toggleAutoExplore();
    render();
    return;
  }

  // Throw mode: intercept direction keys
  if (state.throwMode) {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':                    throwInDirection(0, -1); break;
      case 'ArrowDown': case 's': case 'S': case 'x': case 'X': throwInDirection(0, 1);  break;
      case 'ArrowLeft': case 'a': case 'A':                   throwInDirection(-1, 0); break;
      case 'ArrowRight': case 'd': case 'D':                  throwInDirection(1, 0);  break;
      case 'Escape': case 't': case 'T':      cancelThrowMode(); break;
    }
    render();
    checkOverlays();
    return;
  }

  // Town Portal (Boss Skill)
  if (e.key === 'q' || e.key === 'Q') {
    if (state.bossSkills?.town_portal && state.mode === 'dungeon') {
      e.preventDefault();
      useTownPortal();
      render();
      return;
    }
  }

  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W':                     e.preventDefault(); playerMove(0, -1); break;
    case 'ArrowDown':  case 's': case 'S': case 'x': case 'X': e.preventDefault(); playerMove(0, 1);  break;
    case 'ArrowLeft':  case 'a': case 'A':                     e.preventDefault(); playerMove(-1, 0); break;
    case 'ArrowRight': case 'd': case 'D':                     e.preventDefault(); playerMove(1, 0);  break;
    case ' ':          e.preventDefault(); playerWait();       break;
    case 't': case 'T':
      e.preventDefault();
      enterThrowMode();
      break;
    case 'f': case 'F':
      e.preventDefault();
      if (state.playerClass === PLAYER_CLASS.MAGE) {
        castSpell('fire_spell');
      } else if (state.playerClass === PLAYER_CLASS.WARRIOR && getSkillRank('cleave') > 0) {
        useActiveSkill('cleave');
      } else if (state.playerClass === PLAYER_CLASS.ARCHER && getSkillRank('multishot') > 0) {
        useActiveSkill('multishot');
      }
      break;
    case 'g': case 'G':
      e.preventDefault();
      if (state.playerClass === PLAYER_CLASS.MAGE) {
        castSpell('ice_shard');
      } else if (state.playerClass === PLAYER_CLASS.WARRIOR && getSkillRank('execute') > 0) {
        useActiveSkill('execute');
      } else if (state.playerClass === PLAYER_CLASS.ARCHER && getSkillRank('poison_arrow') > 0) {
        useActiveSkill('poison_arrow');
      }
      break;
    case 'h': case 'H':
      e.preventDefault();
      if (state.playerClass === PLAYER_CLASS.MAGE) {
        castSpell('chain_lightning');
      } else if (state.playerClass === PLAYER_CLASS.WARRIOR && getSkillRank('battle_cry') > 0) {
        useActiveSkill('battle_cry');
      } else if (state.playerClass === PLAYER_CLASS.ARCHER && getSkillRank('smoke_bomb') > 0) {
        useActiveSkill('smoke_bomb');
      }
      break;
    case 'j': case 'J':
      e.preventDefault();
      castSpell('heal');
      break;
    case 'e': case 'E':
      e.preventDefault();
      pickupItem();
      break;
    case 'r': case 'R':
      e.preventDefault();
      shootBow();
      break;
    case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8':
    case '9': case '0':
      e.preventDefault();
      {
        const idx = e.key === '0' ? 9 : parseInt(e.key) - 1;
        if (idx < state.player.inventory.length) {
          window.dispatchEvent(new CustomEvent('showItemPopup', { detail: idx }));
        }
      }
      break;
  }

  render();
  checkOverlays();
});

// Listen for inventory click events from renderer
window.addEventListener('useItem', (e) => {
  if (state.phase === 'class_select') return;
  useItem(e.detail);
  render();
});

// ── Overlays ─────────────────────────────────

const gameOverEl = document.getElementById('game-over');
const levelUpEl = document.getElementById('level-up');
const restartBtn = document.getElementById('restart-btn');
const chooseHpBtn = document.getElementById('choose-hp');
const choosePowerBtn = document.getElementById('choose-power');
const deathStatsEl = document.getElementById('death-stats');
const closeBestiaryBtn = document.getElementById('close-bestiary');

function checkOverlays() {
  if (state.gameOver) {
    const classKey = { warrior: 'class.warrior', mage: 'class.mage', archer: 'class.archer' };
    deathStatsEl.textContent = t('gameover.stats', { class: t(classKey[state.playerClass] || 'class.adventurer'), floor: state.floor, level: state.player.level, turns: state.turnCount });
    gameOverEl.classList.remove('hidden');
  }

  if (state.pendingLevelUp) {
    levelUpEl.classList.remove('hidden');
  }
}

restartBtn?.addEventListener('click', () => {
  gameOverEl.classList.add('hidden');
  restartGame();
  classSelectEl.classList.remove('hidden');
  continueSaveBtn.style.display = 'none';
  // Remove mana button if it exists (will be re-added if mage is picked)
  const manaBtn = document.getElementById('choose-mana');
  if (manaBtn) manaBtn.remove();
});

chooseHpBtn?.addEventListener('click', () => {
  levelUpEl.classList.add('hidden');
  chooseLevelUp('hp');
  render();
});

choosePowerBtn?.addEventListener('click', () => {
  levelUpEl.classList.add('hidden');
  chooseLevelUp('power');
  render();
});

closeBestiaryBtn?.addEventListener('click', () => {
  toggleBestiary();
  render();
});

document.getElementById('close-armory')?.addEventListener('click', () => {
  toggleArmory();
  render();
});

const closeMinimapBtn = document.getElementById('close-minimap');
closeMinimapBtn?.addEventListener('click', () => {
  toggleMinimap();
  render();
});

// Floor Warp
document.getElementById('close-floor-warp')?.addEventListener('click', () => {
  closeFloorWarp();
  render();
});

document.getElementById('close-spellbook')?.addEventListener('click', () => {
  closeSpellBook();
  render();
});

// Healer
document.getElementById('heal-btn')?.addEventListener('click', () => {
  healPlayer();
  render();
});
document.getElementById('close-healer')?.addEventListener('click', () => {
  closeHealer();
  render();
});

// Settings
document.getElementById('close-settings')?.addEventListener('click', () => {
  closeSettings();
  render();
});

// Start Over (full reset)
document.getElementById('start-over-btn')?.addEventListener('click', () => {
  document.getElementById('start-over-confirm').classList.remove('hidden');
  document.getElementById('start-over-btn').classList.add('hidden');
});
document.getElementById('start-over-no')?.addEventListener('click', () => {
  document.getElementById('start-over-confirm').classList.add('hidden');
  document.getElementById('start-over-btn').classList.remove('hidden');
});
document.getElementById('start-over-yes')?.addEventListener('click', () => {
  fullResetGame();
  document.getElementById('start-over-confirm').classList.add('hidden');
  document.getElementById('start-over-btn').classList.remove('hidden');
  document.getElementById('settings-overlay').classList.add('hidden');
  document.getElementById('class-select').classList.remove('hidden');
  document.getElementById('continue-save').style.display = 'none';
  const manaBtn = document.getElementById('choose-mana');
  if (manaBtn) manaBtn.remove();
  render();
});

// Skill Tree
document.getElementById('close-skilltree')?.addEventListener('click', () => {
  closeSkillTree();
  render();
});

// Character Sheet
document.getElementById('close-charsheet')?.addEventListener('click', () => {
  closeCharSheet();
  render();
});
document.getElementById('cheat-submit')?.addEventListener('click', () => {
  const input = document.getElementById('cheat-input');
  const code = input.value.trim();
  if (code) {
    const result = applyCheatCode(code);
    if (result) {
      document.getElementById('godmode-status').textContent = state.godMode ? t('settings.godmode_on') : t('settings.godmode_off');
      document.getElementById('godmode-status').style.color = state.godMode ? '#60e060' : '#888';
    }
    input.value = '';
    render();
  }
});
document.getElementById('cheat-input')?.addEventListener('keydown', (e) => {
  e.stopPropagation(); // prevent game key handling
  if (e.key === 'Enter') {
    document.getElementById('cheat-submit').click();
  }
});

// Quest Board
document.getElementById('close-quest')?.addEventListener('click', () => {
  closeQuestBoard();
  render();
});

// Shop
document.getElementById('close-shop')?.addEventListener('click', () => {
  closeShop();
  render();
});

// Blacksmith
document.getElementById('close-blacksmith')?.addEventListener('click', () => {
  closeBlacksmith();
  render();
});

// Chest
document.getElementById('close-chest')?.addEventListener('click', () => {
  closeChest();
  render();
});
document.getElementById('take-all-chest')?.addEventListener('click', () => {
  takeAllFromChest();
  render();
});

// Achievements
document.getElementById('close-achievements')?.addEventListener('click', () => {
  closeAchievements();
  render();
});

// Prestige
document.getElementById('prestige-accept')?.addEventListener('click', () => {
  activatePrestige();
  classSelectEl.classList.remove('hidden');
  continueSaveBtn.style.display = 'none';
  // Remove mana button if it exists
  const manaBtn = document.getElementById('choose-mana');
  if (manaBtn) manaBtn.remove();
  // Show prestige info on class select
  updateClassSelectPrestige();
  render();
});

document.getElementById('prestige-decline')?.addEventListener('click', () => {
  declinePrestige();
  render();
});

function updateClassSelectPrestige() {
  const el = document.getElementById('class-select-prestige');
  if (!el) return;
  if (state.prestigeLevel > 0) {
    const title = PRESTIGE.TITLES[state.prestigeLevel] || '';
    const color = PRESTIGE.TITLE_COLORS[state.prestigeLevel] || '#ccc';
    const pl = PRESTIGE.PER_LEVEL;
    el.style.display = '';
    el.innerHTML = `
      <span style="color: ${color}; font-weight: bold;">NG+${state.prestigeLevel} ${title}</span>
      <span class="prestige-bonuses">+${pl.powerBonus * state.prestigeLevel} Pow | +${pl.hpBonus * state.prestigeLevel} HP | +${pl.xpBoostPercent * state.prestigeLevel}% XP</span>
    `;
  } else {
    el.style.display = 'none';
  }
}

// Show prestige info on initial load if prestige > 0
if (state.prestigeLevel > 0) {
  updateClassSelectPrestige();
}

// Fishing
document.getElementById('cast-line-btn')?.addEventListener('click', () => {
  castLine();
  render();
  // Poll for phase changes during fishing
  if (!window._fishingInterval) {
    window._fishingInterval = setInterval(() => {
      if (!state.showFishing || state.fishingPhase === 'idle') {
        clearInterval(window._fishingInterval);
        window._fishingInterval = null;
        return;
      }
      render();
    }, 200);
  }
});

document.getElementById('reel-in-btn')?.addEventListener('click', () => {
  reelIn();
  render();
});

document.getElementById('close-fishing')?.addEventListener('click', () => {
  closeFishing();
  if (window._fishingInterval) {
    clearInterval(window._fishingInterval);
    window._fishingInterval = null;
  }
  render();
});

// Arena
document.getElementById('enter-arena-btn')?.addEventListener('click', () => {
  enterArena();
  render();
});

document.getElementById('close-arena')?.addEventListener('click', () => {
  closeArena();
  render();
});

document.getElementById('close-history')?.addEventListener('click', () => {
  closeRunHistory();
  render();
});

document.getElementById('next-wave-btn')?.addEventListener('click', () => {
  nextArenaWave();
  render();
});

document.getElementById('leave-arena-btn')?.addEventListener('click', () => {
  leaveArena();
  render();
});

// ── Throw Trash ─────────────────────────────
document.getElementById('btn-throw-trash')?.addEventListener('click', () => {
  throwTrash();
  render();
});

// ── Inventory Tab Switching ─────────────────
window._invTab = 'all';
document.getElementById('inv-tabs')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.inv-tab');
  if (!btn) return;
  window._invTab = btn.dataset.tab;
  render();
});

// ── Settings Controls ────────────────────────

// Tile Size toggle group
document.getElementById('setting-tile-size')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.settings-opt');
  if (!btn) return;
  const value = parseInt(btn.dataset.value);
  updateSetting('tileSize', value);
  document.querySelectorAll('#setting-tile-size .settings-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  resizeCanvas();
  render();
});

// Toggle settings (ON/OFF buttons)
function setupToggle(elementId, settingKey) {
  document.getElementById(elementId)?.addEventListener('click', () => {
    const newValue = !gameSettings[settingKey];
    updateSetting(settingKey, newValue);
    const btn = document.getElementById(elementId);
    btn.textContent = newValue ? t('ui.on') : t('ui.off');
    btn.classList.toggle('active', newValue);
    render();
  });
}

setupToggle('setting-damage-numbers', 'showDamageNumbers');
setupToggle('setting-torch-flicker', 'torchFlicker');
setupToggle('setting-enemy-hp', 'showEnemyHpBars');
setupToggle('setting-auto-pickup', 'autoPickup');

// Language toggle
document.getElementById('setting-language')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.settings-opt');
  if (!btn) return;
  const lang = btn.dataset.value;
  updateSetting('language', lang);
  setLanguage(lang);
  document.querySelectorAll('#setting-language .settings-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
});

// Sync settings UI when settings overlay opens
function syncSettingsUI() {
  // Sync language toggle
  document.querySelectorAll('#setting-language .settings-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.value === gameSettings.language);
  });
  document.querySelectorAll('#setting-tile-size .settings-opt').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.value) === gameSettings.tileSize);
  });
  const toggles = [
    ['setting-damage-numbers', 'showDamageNumbers'],
    ['setting-torch-flicker', 'torchFlicker'],
    ['setting-enemy-hp', 'showEnemyHpBars'],
    ['setting-auto-pickup', 'autoPickup'],
  ];
  for (const [id, key] of toggles) {
    const btn = document.getElementById(id);
    btn.textContent = gameSettings[key] ? t('ui.on') : t('ui.off');
    btn.classList.toggle('active', gameSettings[key]);
  }
}

window.addEventListener('settingsOpened', syncSettingsUI);

// ── Responsive Canvas ───────────────────────
resizeCanvas();
render();
window.addEventListener('resize', () => {
  resizeCanvas();
  render();
});

// ── Map Note Modal ───────────────────────────
function openMapNoteModal() {
  if (state.phase === 'class_select' || state.gameOver) return;
  const modal = document.getElementById('map-note-modal');
  if (!modal) return;
  const existing = getMapNote();
  const input = document.getElementById('map-note-input');
  if (input) input.value = existing || '';
  modal.classList.remove('hidden');
  if (input) { input.focus(); input.select(); }
}

document.getElementById('map-note-save')?.addEventListener('click', () => {
  const input = document.getElementById('map-note-input');
  const text = input ? input.value : '';
  addMapNote(text);
  document.getElementById('map-note-modal')?.classList.add('hidden');
  render();
});

document.getElementById('map-note-cancel')?.addEventListener('click', () => {
  document.getElementById('map-note-modal')?.classList.add('hidden');
});

document.getElementById('map-note-input')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = e.target.value;
    addMapNote(text);
    document.getElementById('map-note-modal')?.classList.add('hidden');
    render();
    e.preventDefault();
  } else if (e.key === 'Escape') {
    document.getElementById('map-note-modal')?.classList.add('hidden');
    e.preventDefault();
  }
});

// ── Talent Tree Overlay ───────────────────────
document.getElementById('talent-tree-close')?.addEventListener('click', () => {
  closeTalentTree();
  render();
});

document.getElementById('talent-tree-overlay')?.addEventListener('click', (e) => {
  const node = e.target.closest('.talent-node');
  if (node) {
    const nodeId = node.dataset.nodeId;
    if (nodeId) {
      unlockTalent(nodeId);
      renderTalentTree();
      render();
    }
  }
});

function renderTalentTree() {
  const overlay = document.getElementById('talent-tree-overlay');
  if (!overlay) return;
  const container = overlay.querySelector('.talent-tree-container');
  if (!container) return;
  const pts = getTalentPoints();
  const unlocked = getUnlockedTalents();
  const ptsDisplay = overlay.querySelector('.talent-points-display');
  if (ptsDisplay) ptsDisplay.textContent = `✨ Talent Points: ${pts}`;
  container.innerHTML = '';
  for (const [treeKey, tree] of Object.entries(TALENT_TREES)) {
    const col = document.createElement('div');
    col.className = 'talent-tree-col';
    const lbl = document.createElement('div');
    lbl.className = 'talent-tree-label';
    lbl.textContent = tree.label;
    col.appendChild(lbl);
    for (const node of tree.nodes) {
      const isUnlocked = !!unlocked[node.id];
      const prereqMet = !node.requires || !!unlocked[node.requires];
      const canAfford = pts >= node.cost;
      const btn = document.createElement('div');
      btn.className = `talent-node ${isUnlocked ? 'unlocked' : prereqMet && canAfford ? 'available' : 'locked'}`;
      btn.dataset.nodeId = isUnlocked ? '' : node.id;
      btn.innerHTML = `<span class="tn-name">${node.name}</span><span class="tn-cost">${isUnlocked ? '✓' : node.cost + '✨'}</span><div class="tn-desc">${node.desc}</div>`;
      col.appendChild(btn);
    }
    container.appendChild(col);
  }
}
window._renderTalentTree = renderTalentTree;

// ── Mobile Touch Controls ───────────────────
(function initMobileControls() {
  const isTouchDevice = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const mobileControls = document.getElementById('mobile-controls');
  if (!mobileControls) return;

  // Show mobile controls on touch devices or narrow screens
  function checkMobile() {
    if (isTouchDevice || window.innerWidth <= 768) {
      mobileControls.classList.add('visible');
    } else {
      mobileControls.classList.remove('visible');
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // D-pad direction buttons
  const dirMap = {
    up:    { key: 'ArrowUp' },
    down:  { key: 'ArrowDown' },
    left:  { key: 'ArrowLeft' },
    right: { key: 'ArrowRight' },
    wait:  { key: ' ' },
  };
  mobileControls.querySelectorAll('.dpad-btn').forEach(btn => {
    const dir = btn.dataset.dir;
    if (!dirMap[dir]) return;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: dirMap[dir].key, bubbles: true }));
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: dirMap[dir].key, bubbles: true }));
    });
  });

  // Action buttons
  const actionMap = {
    pickup:   'e',
    shoot:    'r',
    spell:    'f',
    book:     'z',
    map:      'm',
    char:     'c',
    settings: 'Escape',
  };
  mobileControls.querySelectorAll('.mobile-action-btn').forEach(btn => {
    const action = btn.dataset.action;
    if (!actionMap[action]) return;
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: actionMap[action], bubbles: true }));
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: actionMap[action], bubbles: true }));
    });
  });
})();
