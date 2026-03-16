import {
  state, selectClass, playerMove, playerWait, useItem,
  chooseLevelUp, restartGame, shootBow, toggleBestiary, toggleArmory, toggleMinimap,
  enterThrowMode, cancelThrowMode, throwInDirection, castSpell,
  healPlayer, closeHealer, closeShop, closeChest, takeAllFromChest, closeQuestBoard,
  toggleSettings, closeSettings, applyCheatCode,
  toggleCharSheet, closeCharSheet,
  toggleSkillTree, closeSkillTree, useActiveSkill, getSkillRank,
  toggleAchievements, closeAchievements,
  loadGame, hasSaveGame, deleteSave,
} from './engine.js?v=11';
import { render } from './renderer.js?v=11';
import { PLAYER_CLASS } from './constants.js?v=11';

// ── Class Selection ──────────────────────────

const classSelectEl = document.getElementById('class-select');

document.getElementById('pick-warrior').addEventListener('click', () => {
  selectClass(PLAYER_CLASS.WARRIOR);
  classSelectEl.classList.add('hidden');
  render();
});

document.getElementById('pick-mage').addEventListener('click', () => {
  selectClass(PLAYER_CLASS.MAGE);
  classSelectEl.classList.add('hidden');
  // Add mana level-up option for mage
  addManaLevelUpBtn();
  render();
});

document.getElementById('pick-archer').addEventListener('click', () => {
  selectClass(PLAYER_CLASS.ARCHER);
  classSelectEl.classList.add('hidden');
  render();
});

// ── Continue (Load Save) ────────────────────
const continueSaveBtn = document.getElementById('continue-save');
if (hasSaveGame()) {
  continueSaveBtn.style.display = '';
}
continueSaveBtn.addEventListener('click', () => {
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
    btn.textContent = '+8 Max Mana';
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

  // Achievements toggle
  if (e.key === 'n' || e.key === 'N') {
    if (state.phase !== 'class_select') {
      e.preventDefault();
      toggleAchievements();
      render();
      return;
    }
  }

  // Escape closes overlays
  if (e.key === 'Escape') {
    const itemPopup = document.getElementById('item-popup');
    if (!itemPopup.classList.contains('hidden')) {
      itemPopup.classList.add('hidden');
      return;
    }
    if (state.showChest) { closeChest(); render(); return; }
    if (state.showHealer) { closeHealer(); render(); return; }
    if (state.showShop) { closeShop(); render(); return; }
    if (state.showQuestBoard) { closeQuestBoard(); render(); return; }
    if (state.showSettings) { closeSettings(); render(); return; }
    if (state.showCharSheet) { closeCharSheet(); render(); return; }
    if (state.showSkillTree) { closeSkillTree(); render(); return; }
    if (state.showAchievements) { closeAchievements(); render(); return; }
  }

  if (state.phase === 'class_select') return;
  if (state.gameOver) return;
  if (state.pendingLevelUp) return;
  if (state.showBestiary) return;
  if (state.showArmory) return;
  if (state.showMinimap) return;
  if (state.showHealer) return;
  if (state.showShop) return;
  if (state.showQuestBoard) return;
  if (state.showSettings) return;
  if (state.showCharSheet) return;
  if (state.showSkillTree) return;
  if (state.showAchievements) return;
  if (state.showChest) return;

  // Throw mode: intercept direction keys
  if (state.throwMode) {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':    throwInDirection(0, -1); break;
      case 'ArrowDown': case 's': case 'S':   throwInDirection(0, 1);  break;
      case 'ArrowLeft': case 'a': case 'A':   throwInDirection(-1, 0); break;
      case 'ArrowRight': case 'd': case 'D':  throwInDirection(1, 0);  break;
      case 'Escape': case 't': case 'T':      cancelThrowMode(); break;
    }
    render();
    checkOverlays();
    return;
  }

  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W': e.preventDefault(); playerMove(0, -1); break;
    case 'ArrowDown':  case 's': case 'S': e.preventDefault(); playerMove(0, 1);  break;
    case 'ArrowLeft':  case 'a': case 'A': e.preventDefault(); playerMove(-1, 0); break;
    case 'ArrowRight': case 'd': case 'D': e.preventDefault(); playerMove(1, 0);  break;
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
    const classNames = { warrior: 'Warrior', mage: 'Mage', archer: 'Archer' };
    deathStatsEl.textContent = `${classNames[state.playerClass]} | Floor ${state.floor} | Level ${state.player.level} | ${state.turnCount} turns`;
    gameOverEl.classList.remove('hidden');
  }

  if (state.pendingLevelUp) {
    levelUpEl.classList.remove('hidden');
  }
}

restartBtn.addEventListener('click', () => {
  gameOverEl.classList.add('hidden');
  restartGame();
  classSelectEl.classList.remove('hidden');
  continueSaveBtn.style.display = 'none';
  // Remove mana button if it exists (will be re-added if mage is picked)
  const manaBtn = document.getElementById('choose-mana');
  if (manaBtn) manaBtn.remove();
});

chooseHpBtn.addEventListener('click', () => {
  levelUpEl.classList.add('hidden');
  chooseLevelUp('hp');
  render();
});

choosePowerBtn.addEventListener('click', () => {
  levelUpEl.classList.add('hidden');
  chooseLevelUp('power');
  render();
});

closeBestiaryBtn.addEventListener('click', () => {
  toggleBestiary();
  render();
});

document.getElementById('close-armory').addEventListener('click', () => {
  toggleArmory();
  render();
});

const closeMinimapBtn = document.getElementById('close-minimap');
closeMinimapBtn.addEventListener('click', () => {
  toggleMinimap();
  render();
});

// Healer
document.getElementById('heal-btn').addEventListener('click', () => {
  healPlayer();
  render();
});
document.getElementById('close-healer').addEventListener('click', () => {
  closeHealer();
  render();
});

// Settings
document.getElementById('close-settings').addEventListener('click', () => {
  closeSettings();
  render();
});

// Skill Tree
document.getElementById('close-skilltree').addEventListener('click', () => {
  closeSkillTree();
  render();
});

// Character Sheet
document.getElementById('close-charsheet').addEventListener('click', () => {
  closeCharSheet();
  render();
});
document.getElementById('cheat-submit').addEventListener('click', () => {
  const input = document.getElementById('cheat-input');
  const code = input.value.trim();
  if (code) {
    const result = applyCheatCode(code);
    if (result) {
      document.getElementById('godmode-status').textContent = state.godMode ? 'God Mode: ON' : 'God Mode: OFF';
      document.getElementById('godmode-status').style.color = state.godMode ? '#60e060' : '#888';
    }
    input.value = '';
    render();
  }
});
document.getElementById('cheat-input').addEventListener('keydown', (e) => {
  e.stopPropagation(); // prevent game key handling
  if (e.key === 'Enter') {
    document.getElementById('cheat-submit').click();
  }
});

// Quest Board
document.getElementById('close-quest').addEventListener('click', () => {
  closeQuestBoard();
  render();
});

// Shop
document.getElementById('close-shop').addEventListener('click', () => {
  closeShop();
  render();
});

// Chest
document.getElementById('close-chest').addEventListener('click', () => {
  closeChest();
  render();
});
document.getElementById('take-all-chest').addEventListener('click', () => {
  takeAllFromChest();
  render();
});

// Achievements
document.getElementById('close-achievements').addEventListener('click', () => {
  closeAchievements();
  render();
});
