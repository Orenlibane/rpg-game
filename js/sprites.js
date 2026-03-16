import { TILE, TILE_SIZE, ENTITY } from './constants.js';

const cache = {};
const tileSeedCache = {};
const S = TILE_SIZE; // 32

// ── Utility ─────────────────────────────────────

function makeCanvas() {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  return c;
}

function fillRect(g, x, y, w, h, color) {
  g.fillStyle = color;
  g.fillRect(x, y, w, h);
}

function px(g, x, y, color) {
  g.fillStyle = color;
  g.fillRect(x * 2, y * 2, 2, 2);
}

// Draw a simple 16x16 pixel-art sprite (each "pixel" = 2x2 on the 32x32 canvas)
function drawPixels(g, pixels, palette) {
  for (let y = 0; y < pixels.length; y++) {
    const row = pixels[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const color = palette[ch];
      if (color) px(g, x, y, color);
    }
  }
}

// ── Tile Sprite Builders ─────────────────────────

function buildTileSprite(tileType) {
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (tileType) {
    case TILE.VOID:
      fillRect(g, 0, 0, S, S, '#1a1a2a');
      break;

    case TILE.GRASS:
      fillRect(g, 0, 0, S, S, '#2d5a1e');
      g.fillStyle = '#3a7028';
      for (let i = 0; i < 8; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      g.fillStyle = '#245216';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      break;

    case TILE.DIRT:
      fillRect(g, 0, 0, S, S, '#6b5230');
      g.fillStyle = '#7a6038';
      for (let i = 0; i < 6; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 3);
      }
      g.fillStyle = '#5a4228';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      break;

    case TILE.HUT:
      fillRect(g, 0, 0, S, S, '#2d5a1e');
      // Wooden hut
      fillRect(g, 4, 8, 24, 20, '#5a3a1a');
      fillRect(g, 6, 10, 20, 16, '#7a5a30');
      // Roof
      fillRect(g, 2, 4, 28, 6, '#8a4a1a');
      fillRect(g, 6, 2, 20, 4, '#9a5a2a');
      // Door
      fillRect(g, 12, 18, 8, 10, '#3a2010');
      // Window
      fillRect(g, 20, 14, 4, 4, '#a0c8e0');
      break;

    case TILE.CAVE_ENTRANCE:
      fillRect(g, 0, 0, S, S, '#2d5a1e');
      // Dark cave opening
      fillRect(g, 4, 4, 24, 24, '#3a3a4a');
      fillRect(g, 6, 6, 20, 20, '#1a1a2a');
      fillRect(g, 8, 4, 16, 2, '#4a4a5a');
      // Archway
      fillRect(g, 4, 4, 4, 24, '#5a5a6a');
      fillRect(g, 24, 4, 4, 24, '#5a5a6a');
      fillRect(g, 4, 4, 24, 4, '#6a6a7a');
      break;

    case TILE.CAVE_WALL:
      fillRect(g, 0, 0, S, S, '#3a3a4a');
      g.fillStyle = '#44445a';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#2e2e3e';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 3, 3);
      }
      break;

    case TILE.CAVE_FLOOR:
      fillRect(g, 0, 0, S, S, '#2a2a3a');
      g.fillStyle = '#323246';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      g.fillStyle = '#222234';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 2, 2);
      }
      break;

    case TILE.CAVE_STAIRS:
      fillRect(g, 0, 0, S, S, '#2a2a3a');
      // Stairs going down
      fillRect(g, 6, 6, 20, 4, '#6a6a7a');
      fillRect(g, 8, 12, 18, 4, '#5a5a6a');
      fillRect(g, 10, 18, 16, 4, '#4a4a5a');
      fillRect(g, 12, 24, 14, 4, '#3a3a4a');
      // Highlight
      fillRect(g, 6, 6, 20, 2, '#8a8a9a');
      fillRect(g, 8, 12, 18, 2, '#7a7a8a');
      break;

    case TILE.MOSS_WALL:
      fillRect(g, 0, 0, S, S, '#2a4a2a');
      g.fillStyle = '#3a5a3a';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#1e3a1e';
      for (let i = 0; i < 3; i++) {
        g.fillRect(Math.floor(Math.random() * 28) + 2, Math.floor(Math.random() * 28) + 2, 3, 3);
      }
      break;

    case TILE.MOSS_FLOOR:
      fillRect(g, 0, 0, S, S, '#1e3a1e');
      g.fillStyle = '#2a4a2a';
      for (let i = 0; i < 6; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      break;

    case TILE.BONE_WALL:
      fillRect(g, 0, 0, S, S, '#4a4038');
      g.fillStyle = '#5a5048';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      // Bone accents
      g.fillStyle = '#8a7a6a';
      g.fillRect(8, 14, 6, 2);
      g.fillRect(20, 8, 4, 2);
      break;

    case TILE.BONE_FLOOR:
      fillRect(g, 0, 0, S, S, '#2a2420');
      g.fillStyle = '#3a3430';
      for (let i = 0; i < 5; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Small bone fragments
      g.fillStyle = '#6a5a4a';
      g.fillRect(10, 20, 4, 2);
      g.fillRect(22, 10, 3, 2);
      break;

    case TILE.WEB_FLOOR:
      fillRect(g, 0, 0, S, S, '#2a2a3a');
      g.fillStyle = '#323246';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Web strands
      g.strokeStyle = 'rgba(200,200,200,0.25)';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(0, 0); g.lineTo(S, S);
      g.moveTo(S, 0); g.lineTo(0, S);
      g.moveTo(S / 2, 0); g.lineTo(S / 2, S);
      g.moveTo(0, S / 2); g.lineTo(S, S / 2);
      g.stroke();
      break;

    case TILE.LAVA_WALL:
      fillRect(g, 0, 0, S, S, '#5a2a1a');
      g.fillStyle = '#6a3a2a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#8a3a0a';
      g.fillRect(10, 16, 4, 3);
      g.fillRect(22, 6, 3, 3);
      break;

    case TILE.LAVA_FLOOR:
      fillRect(g, 0, 0, S, S, '#3a1a0a');
      g.fillStyle = '#5a2a1a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Lava glow spots
      g.fillStyle = '#aa4a1a';
      g.fillRect(8, 12, 3, 2);
      g.fillRect(20, 22, 4, 2);
      break;

    case TILE.ICE_WALL:
      fillRect(g, 0, 0, S, S, '#3a4a6a');
      g.fillStyle = '#4a5a7a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 24) + 4, Math.floor(Math.random() * 24) + 4, 4, 4);
      }
      g.fillStyle = '#6a8aaa';
      g.fillRect(6, 10, 3, 2);
      g.fillRect(22, 20, 4, 2);
      break;

    case TILE.ICE_FLOOR:
      fillRect(g, 0, 0, S, S, '#2a3a5a');
      g.fillStyle = '#3a4a6a';
      for (let i = 0; i < 4; i++) {
        g.fillRect(Math.floor(Math.random() * 26) + 3, Math.floor(Math.random() * 26) + 3, 3, 2);
      }
      // Ice shine
      g.fillStyle = '#5a7aaa';
      g.fillRect(14, 8, 2, 2);
      g.fillRect(6, 22, 2, 2);
      break;

    case TILE.PORTAL:
      fillRect(g, 0, 0, S, S, '#2a2a3a');
      // Swirling portal
      g.fillStyle = '#6a3aaa';
      g.beginPath();
      g.arc(16, 16, 10, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#8a4aea';
      g.beginPath();
      g.arc(16, 16, 7, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#ba7aff';
      g.beginPath();
      g.arc(16, 16, 4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = '#eeccff';
      g.beginPath();
      g.arc(16, 16, 2, 0, Math.PI * 2);
      g.fill();
      break;

    case TILE.HEALER:
      fillRect(g, 0, 0, S, S, '#2d5a1e');
      // Green-robed healer figure
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0cccc0.....',
        '.....0ceec0.....',
        '.....0cccc0.....',
        '......0000......',
        '.....0GGGG0.....',
        '....0GGGGGG0....',
        '....0GG00GG0....',
        '....0GGGGGG0....',
        '.....0GGGG0.....',
        '.....0G00G0.....',
        '......0..0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', 'c': '#e8c8a0', 'e': '#2a2a2a', 'G': '#2a8a3a' });
      // Red cross
      fillRect(g, 14, 16, 4, 2, '#e04040');
      fillRect(g, 15, 15, 2, 4, '#e04040');
      break;

    case TILE.MERCHANT:
      fillRect(g, 0, 0, S, S, '#2d5a1e');
      // Brown-robed merchant
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0cccc0.....',
        '.....0ceec0.....',
        '.....0cccc0.....',
        '......0000......',
        '.....0BBBB0.....',
        '....0BBBBBB0....',
        '....0BB00BB0....',
        '....0BBBBBB0....',
        '.....0BBBB0.....',
        '.....0B00B0.....',
        '......0..0......',
        '......0..0......',
        '.....00..00.....',
        '................',
      ], { '0': '#1a1a1a', 'c': '#e8c8a0', 'e': '#2a2a2a', 'B': '#8a6a2a' });
      // Gold coin
      fillRect(g, 22, 18, 4, 4, '#e0c040');
      fillRect(g, 23, 19, 2, 2, '#f0d860');
      break;

    default:
      fillRect(g, 0, 0, S, S, '#1a1a2a');
      break;
  }

  return c;
}

// ── Player Sprite Builders ───────────────────────

function buildPlayerSprite(playerClass) {
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (playerClass) {
    case 'warrior':
      drawPixels(g, [
        '......0000......',
        '.....088880.....',
        '....08888880....',
        '....08cccc80....',
        '....0ceec0c0....',
        '....0cccc0c0....',
        '.....0cc0.......',
        '..s..0BB0.......',
        '..s.0BBBB0......',
        '..s.0B00B0......',
        '..s.0BBBB0......',
        '.....0BB0.......',
        '.....0BB0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', '8': '#8a8a9a', 'c': '#e8c8a0', 'e': '#2a4a8a', 'B': '#3060c0', 's': '#a0a0b0' });
      // Sword
      fillRect(g, 4, 14, 2, 10, '#c0c0d0');
      fillRect(g, 2, 18, 6, 2, '#8a6a2a');
      break;

    case 'mage':
      drawPixels(g, [
        '.....00000......',
        '....0PPPPP0.....',
        '....0P000P0.....',
        '....0cccc0......',
        '....0ceec0......',
        '....0cccc0......',
        '.....0PP0.......',
        '....0PPPP0......',
        '...0PPPPPP0.....',
        '...0PP00PP0.....',
        '...0PPPPPP0.....',
        '....0PPPP0......',
        '.....0PP0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'P': '#6030a0', 'c': '#e8c8a0', 'e': '#2a2a2a' });
      // Staff
      fillRect(g, 24, 6, 2, 18, '#8a6a2a');
      fillRect(g, 22, 4, 6, 4, '#a040e0');
      fillRect(g, 24, 5, 2, 2, '#e0a0ff');
      break;

    case 'archer':
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0cccc0.....',
        '.....0ceec0.....',
        '.....0cccc0.....',
        '......0000......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#2a7030', 'c': '#e8c8a0', 'e': '#2a6a2a' });
      // Bow
      g.strokeStyle = '#8a6a2a';
      g.lineWidth = 2;
      g.beginPath();
      g.arc(26, 16, 8, -1.2, 1.2);
      g.stroke();
      // Bowstring
      g.strokeStyle = '#c0c0c0';
      g.lineWidth = 1;
      g.beginPath();
      g.moveTo(26, 8);
      g.lineTo(26, 24);
      g.stroke();
      break;

    default:
      fillRect(g, 0, 0, S, S, '#c08030');
      break;
  }

  return c;
}

// ── Enemy Sprite Builders ────────────────────────

function buildEnemySprite(entityType) {
  const c = makeCanvas();
  const g = c.getContext('2d');

  switch (entityType) {
    case ENTITY.GOBLIN:
      drawPixels(g, [
        '................',
        '................',
        '..0..0000..0....',
        '..0.0GGGG0.0....',
        '..000GGGG000....',
        '....0GrrG0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#cc2020' });
      break;

    case ENTITY.ORC:
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '...0GrrrrG0.....',
        '...0GGTTGG0.....',
        '....0GGGG0......',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '..0GGG00GGG0....',
        '..0GGGGGGGG0....',
        '...0GGGGGG0.....',
        '....0GGGG0......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'G': '#3a6a1a', 'r': '#cc2020', 'T': '#e8e8c0' });
      break;

    case ENTITY.SKELETON:
      drawPixels(g, [
        '................',
        '......000.......',
        '.....0WWW0......',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '....0.W0W.0.....',
        '....0WWWWW0.....',
        '....0W0.0W0.....',
        '....0WWWWW0.....',
        '.....0WWW0......',
        '......0W0.......',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'W': '#d0d0c0' });
      break;

    case ENTITY.SPIDER:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '.0..........0...',
        '..0..0000..0....',
        '...00BBBB00.....',
        '.0.0BBBBBB0.0...',
        '..00BrrrrrB00...',
        '...0BBBBBB0.....',
        '.0.0BBBBBB0.0...',
        '..0..0000..0....',
        '.0..........0...',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#6a3a2a', 'r': '#cc2020' });
      break;

    case ENTITY.TROLL:
      drawPixels(g, [
        '....00000.......',
        '...0TTTTT0......',
        '..0TTTTTTT0.....',
        '..0TrrTrrT0.....',
        '..0TTTTTTT0.....',
        '..0TTTTTTT0.....',
        '...0TTTTT0......',
        '..0TTTTTTT0.....',
        '.0TTTTTTTTT0....',
        '.0TTT000TTT0....',
        '.0TTTTTTTTT0....',
        '..0TTTTTTT0.....',
        '...0TTTTT0......',
        '....0T.T0.......',
        '...00..00.......',
        '...00..00.......',
      ], { '0': '#1a1a1a', 'T': '#5a7a3a', 'r': '#aa2020' });
      break;

    case ENTITY.DARK_MAGE:
      drawPixels(g, [
        '.....00000......',
        '....0DDDDD0.....',
        '....0D000D0.....',
        '....0cccc0......',
        '....0c00c0......',
        '....0cccc0......',
        '.....0DD0.......',
        '....0DDDD0......',
        '...0DDDDDD0.....',
        '...0DD00DD0.....',
        '...0DDDDDD0.....',
        '....0DDDD0......',
        '.....0DD0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
      ], { '0': '#1a1a1a', 'D': '#3a1a4a', 'c': '#8a8a9a' });
      // Dark orb
      fillRect(g, 24, 8, 4, 4, '#8a2aaa');
      fillRect(g, 25, 9, 2, 2, '#c060e0');
      break;

    case ENTITY.BAT:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '................',
        '0..........0....',
        '.0........0.....',
        '..00.0000.00....',
        '..0.0BBBB0.0....',
        '....0BrrB0......',
        '....0BBBB0......',
        '.....0..0.......',
        '................',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#4a3a4a', 'r': '#cc2020' });
      break;

    case ENTITY.SLIME:
      drawPixels(g, [
        '................',
        '................',
        '................',
        '................',
        '.....0000.......',
        '....0SSSS0......',
        '...0SSSSSS0.....',
        '...0S0SS0S0.....',
        '...0SSSSSS0.....',
        '..0SSSSSSSS0....',
        '..0SSSSSSSS0....',
        '..0SSSSSSSS0....',
        '...00000000.....',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'S': '#40aa40' });
      // Shine
      fillRect(g, 14, 10, 2, 2, '#80ee80');
      break;

    case ENTITY.WRAITH:
      drawPixels(g, [
        '................',
        '.....0000.......',
        '....0WWWW0......',
        '...0WWWWWW0.....',
        '...0W0WW0W0.....',
        '...0WWWWWW0.....',
        '....0WWWW0......',
        '...0WWWWWW0.....',
        '..0WWWWWWWW0....',
        '..0WW0000WW0....',
        '..0WWWWWWWW0....',
        '...0WWWWWW0.....',
        '....0W00W0......',
        '.....0..0.......',
        '......00........',
        '................',
      ], { '0': '#1a1a1a', 'W': '#8a8aaa' });
      // Ghost glow
      g.fillStyle = 'rgba(160,160,200,0.3)';
      g.beginPath();
      g.arc(16, 14, 10, 0, Math.PI * 2);
      g.fill();
      break;

    case ENTITY.GOBLIN_SHAMAN:
      drawPixels(g, [
        '.....00000......',
        '....0PPPPP0.....',
        '....0P000P0.....',
        '....0GGGG0......',
        '....0GrrG0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '....0GGGG0......',
        '....0G00G0......',
        '....0GGGG0......',
        '.....0GG0.......',
        '......00........',
        '.....0..0.......',
        '....00..00......',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#cc2020', 'P': '#8a4a8a' });
      // Staff
      fillRect(g, 24, 6, 2, 16, '#6a4a2a');
      fillRect(g, 23, 4, 4, 4, '#aa40aa');
      break;

    case ENTITY.MUSHROOM:
      drawPixels(g, [
        '................',
        '................',
        '.....00000......',
        '....0MMMMM0.....',
        '...0MMwwwMM0....',
        '...0MwMMMwM0....',
        '...0MMMMMMM0....',
        '....0000000.....',
        '......0SS0......',
        '......0SS0......',
        '......0SS0......',
        '.....0SSSS0.....',
        '.....0SSSS0.....',
        '......0000......',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'M': '#aa3030', 'w': '#e0e0c0', 'S': '#c0b090' });
      break;

    case ENTITY.GOBLIN_BERSERKER:
      drawPixels(g, [
        '................',
        '......0000......',
        '.....0GGGG0.....',
        '.....0GrrG0.....',
        '.....0GGGG0.....',
        '......0GG0......',
        '.A...0GGGG0.....',
        '.A..0GGGGGG0....',
        '.A..0GG00GG0....',
        '.A..0GGGGGG0....',
        '.....0GGGG0.....',
        '......0GG0......',
        '......0..0......',
        '.....00..00.....',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'G': '#5a9a2a', 'r': '#ff3030', 'A': '#8a8a9a' });
      // Axe blade
      fillRect(g, 0, 10, 4, 6, '#a0a0b0');
      break;

    // Bosses
    case ENTITY.GOBLIN_WARLORD:
      drawPixels(g, [
        '....000000......',
        '...08888880.....',
        '...0888888000...',
        '..0GGGGGGGG0....',
        '..0GGrrrrGG0....',
        '..0GGTTTTGG0....',
        '...0GGGGGG0.....',
        '..0GGGGGGGG0....',
        '.0GGGGGGGGGG0...',
        '.0GGG0000GGG0...',
        '.0GGGGGGGGGG0...',
        '..0GGGGGGGG0....',
        '...0GG00GG0.....',
        '....0G..G0......',
        '...00....00.....',
        '................',
      ], { '0': '#1a1a1a', 'G': '#4a8a2a', 'r': '#ff2020', 'T': '#e8e8c0', '8': '#8a8a9a' });
      break;

    case ENTITY.SPIDER_QUEEN:
      drawPixels(g, [
        '0..............0',
        '.0............0.',
        '..0..00000..0...',
        '...00BBBBB00....',
        '.0.0BBBBBBB0.0..',
        '..00BrrrrrB00...',
        '...0BBBBBBB0....',
        '.0.0BBBBBBB0.0..',
        '..0.0BBBBB0.0...',
        '.0...00000...0..',
        '................',
        '................',
        '................',
        '................',
        '................',
        '................',
      ], { '0': '#1a1a1a', 'B': '#8a3a5a', 'r': '#ee2020' });
      // Crown
      fillRect(g, 10, 2, 2, 4, '#e0c040');
      fillRect(g, 14, 0, 2, 4, '#e0c040');
      fillRect(g, 18, 2, 2, 4, '#e0c040');
      break;

    case ENTITY.LICH:
      drawPixels(g, [
        '.....00000......',
        '....0DDDDD0.....',
        '....0D000D0.....',
        '...0WWWWWW0.....',
        '...0W0WW0W0.....',
        '...0WWWWWW0.....',
        '....0WWWW0......',
        '...0DDDDDD0.....',
        '..0DDDDDDDD0....',
        '..0DDD00DDD0....',
        '..0DDDDDDDD0....',
        '...0DDDDDD0.....',
        '....0DD00D0.....',
        '.....0..0.......',
        '....00..00......',
        '................',
      ], { '0': '#1a1a1a', 'D': '#2a1a3a', 'W': '#c0c0a0' });
      // Green eyes
      fillRect(g, 10, 8, 2, 2, '#40ff40');
      fillRect(g, 16, 8, 2, 2, '#40ff40');
      // Staff
      fillRect(g, 26, 4, 2, 20, '#4a3a2a');
      fillRect(g, 24, 2, 6, 4, '#40aa40');
      break;

    case ENTITY.MYCELIUM_LORD:
      drawPixels(g, [
        '....000000......',
        '...0MMMMMM0.....',
        '..0MMwwwwMM0....',
        '..0MwMMMMwM0....',
        '..0MMMMMMMM0....',
        '..0MMMMMMMM0....',
        '...00000000.....',
        '.....0SS0.......',
        '....0SSSS0......',
        '...0SSSSSS0.....',
        '...0SSSSSS0.....',
        '...0SSSSSS0.....',
        '....0SSSS0......',
        '....0SSSS0......',
        '.....0000.......',
        '................',
      ], { '0': '#1a1a1a', 'M': '#8a2a2a', 'w': '#e0e0c0', 'S': '#8a7a50' });
      break;

    case ENTITY.FIRE_ELEMENTAL:
      drawPixels(g, [
        '......00........',
        '.....0FF0.......',
        '....0FFFF0......',
        '...0FFFFFF0.....',
        '...0FYrrYF0.....',
        '...0FFFFFF0.....',
        '....0FFFF0......',
        '...0FFFFFF0.....',
        '..0FFFFFFFF0....',
        '..0FFF00FFF0....',
        '..0FFFFFFFF0....',
        '...0FFFFFF0.....',
        '....0FFFF0......',
        '.....0FF0.......',
        '......00........',
        '................',
      ], { '0': '#1a1a1a', 'F': '#e06020', 'Y': '#ffcc00', 'r': '#ff2020' });
      // Flame glow
      g.fillStyle = 'rgba(255,100,0,0.2)';
      g.beginPath();
      g.arc(16, 16, 12, 0, Math.PI * 2);
      g.fill();
      break;

    case ENTITY.FROST_GIANT:
      drawPixels(g, [
        '...0000000......',
        '..0IIIIIII0.....',
        '..0IIIIIII0.....',
        '.0IIIIIIIII0....',
        '.0IIrrIrrII0....',
        '.0IIIIIIIII0....',
        '.0IIIIIIIII0....',
        '..0IIIIIII0.....',
        '.0IIIIIIIII0....',
        '0IIIIIIIIIII0...',
        '0IIII000IIII0...',
        '0IIIIIIIIIII0...',
        '.0IIIIIIIII0....',
        '..0II0.0II0.....',
        '..00.....00.....',
        '..00.....00.....',
      ], { '0': '#1a1a1a', 'I': '#6a9acc', 'r': '#2040aa' });
      break;

    default:
      // Generic enemy
      fillRect(g, 0, 0, S, S, '#a03030');
      fillRect(g, 8, 8, 16, 16, '#c04040');
      break;
  }

  return c;
}

// ── Item Sprites ─────────────────────────────────

function buildItemSprite(iconCode) {
  const c = makeCanvas();
  const g = c.getContext('2d');
  const code = iconCode.toUpperCase();

  // Weapons
  if (code === 'W1' || code === 'W2' || code === 'W3') {
    // Sword
    const colors = { W1: '#9a9a9a', W2: '#b0b0c0', W3: '#d0d0e0' };
    const bladeColor = colors[code] || '#a0a0a0';
    fillRect(g, 14, 2, 4, 20, bladeColor);
    fillRect(g, 15, 2, 2, 2, '#e0e0ff');
    fillRect(g, 8, 22, 16, 3, '#8a6a2a');
    fillRect(g, 14, 24, 4, 6, '#6a4a1a');
    return c;
  }

  if (code === 'WS' || code === 'WF') {
    // Staff
    const orbColor = code === 'WS' ? '#e04020' : '#60c0ff';
    fillRect(g, 15, 4, 2, 22, '#8a6a2a');
    g.fillStyle = orbColor;
    g.beginPath();
    g.arc(16, 6, 4, 0, Math.PI * 2);
    g.fill();
    fillRect(g, 15, 5, 2, 2, '#ffffff80');
    return c;
  }

  if (code === 'WA' || code === 'WC') {
    // Axe / Club
    fillRect(g, 14, 6, 3, 20, '#8a6a2a');
    if (code === 'WA') {
      fillRect(g, 8, 4, 10, 8, '#a0a0b0');
      fillRect(g, 9, 5, 8, 6, '#b0b0c0');
    } else {
      fillRect(g, 10, 4, 8, 8, '#6a5a4a');
    }
    return c;
  }

  if (code === 'WD') {
    // Dagger
    fillRect(g, 14, 6, 3, 14, '#a0a0b0');
    fillRect(g, 15, 6, 1, 2, '#d0d0e0');
    fillRect(g, 10, 20, 12, 3, '#8a6a2a');
    fillRect(g, 14, 22, 3, 6, '#6a4a1a');
    return c;
  }

  if (code === 'WB') {
    // Bow
    g.strokeStyle = '#8a6a2a';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(16, 16, 10, -1.4, 1.4);
    g.stroke();
    g.strokeStyle = '#c0c0c0';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(20, 6);
    g.lineTo(20, 26);
    g.stroke();
    return c;
  }

  // Helmets
  if (code === 'H1' || code === 'H2' || code === 'H3') {
    const colors = { H1: '#8a6a3a', H2: '#8a8a9a', H3: '#c0c0b0' };
    const col = colors[code];
    fillRect(g, 6, 8, 20, 16, col);
    fillRect(g, 8, 6, 16, 4, col);
    fillRect(g, 10, 16, 12, 6, '#1a1a2a');
    if (code === 'H3') {
      fillRect(g, 8, 6, 16, 2, '#e0c040');
    }
    return c;
  }

  // Chest armor
  if (code === 'C1' || code === 'C2' || code === 'C3' || code === 'CR') {
    const colors = { C1: '#8a6a3a', C2: '#7a7a8a', C3: '#9a9aaa', CR: '#4060a0' };
    const col = colors[code];
    fillRect(g, 6, 4, 20, 22, col);
    fillRect(g, 10, 4, 12, 4, col);
    fillRect(g, 14, 8, 4, 14, '#00000030');
    fillRect(g, 4, 8, 4, 12, col);
    fillRect(g, 24, 8, 4, 12, col);
    return c;
  }

  // Gloves
  if (code === 'G1' || code === 'G2' || code === 'G3') {
    const colors = { G1: '#8a6a3a', G2: '#7a7a8a', G3: '#8a8a9a' };
    const col = colors[code];
    fillRect(g, 8, 6, 16, 20, col);
    fillRect(g, 6, 10, 4, 8, col);
    fillRect(g, 22, 10, 4, 8, col);
    fillRect(g, 10, 4, 4, 4, col);
    fillRect(g, 14, 4, 4, 4, col);
    fillRect(g, 18, 4, 4, 4, col);
    return c;
  }

  // Boots
  if (code === 'B1' || code === 'B2' || code === 'B3') {
    const colors = { B1: '#a08060', B2: '#8a6a3a', B3: '#7a7a8a' };
    const col = colors[code];
    fillRect(g, 6, 6, 8, 18, col);
    fillRect(g, 18, 6, 8, 18, col);
    fillRect(g, 4, 22, 12, 4, col);
    fillRect(g, 16, 22, 12, 4, col);
    return c;
  }

  // Capes
  if (code === 'K1' || code === 'K2' || code === 'KF') {
    const colors = { K1: '#6a5a4a', K2: '#3a3a5a', KF: '#8a3a1a' };
    const col = colors[code];
    fillRect(g, 6, 2, 20, 4, col);
    fillRect(g, 4, 6, 24, 20, col);
    // Clasp
    fillRect(g, 14, 2, 4, 4, '#e0c040');
    return c;
  }

  // Potions
  if (code.startsWith('P')) {
    const potionColors = {
      PH: '#cc3030', 'PH+': '#ee2020',
      PM: '#3040cc', PA: '#30aa30',
      PS: '#cc6030', PD: '#3060cc',
      PF: '#ccaa20', PR: '#20aa60',
    };
    const pCol = potionColors[code] || '#aa8833';
    // Bottle
    fillRect(g, 12, 4, 8, 4, '#c0c0c0');
    fillRect(g, 13, 2, 6, 4, '#c0c0c0');
    fillRect(g, 8, 8, 16, 18, pCol);
    fillRect(g, 10, 10, 12, 14, pCol);
    fillRect(g, 8, 24, 16, 4, pCol);
    // Shine
    fillRect(g, 10, 10, 3, 4, '#ffffff40');
    return c;
  }

  // Default
  fillRect(g, 8, 8, 16, 16, '#aa8833');
  return c;
}

// ── Projectile Sprites ───────────────────────────

function buildFireball() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.fillStyle = '#ff6600';
  g.beginPath();
  g.arc(16, 16, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffcc00';
  g.beginPath();
  g.arc(16, 16, 5, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(16, 16, 2, 0, Math.PI * 2);
  g.fill();
  return c;
}

function buildArrow() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  fillRect(g, 6, 15, 20, 2, '#8a6a2a');
  // Arrowhead
  fillRect(g, 24, 13, 4, 6, '#a0a0b0');
  fillRect(g, 26, 14, 2, 4, '#c0c0d0');
  // Fletching
  fillRect(g, 4, 12, 4, 3, '#aa4040');
  fillRect(g, 4, 17, 4, 3, '#aa4040');
  return c;
}

function buildIceShard() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.fillStyle = '#60c0ff';
  g.beginPath();
  g.moveTo(16, 4);
  g.lineTo(24, 16);
  g.lineTo(16, 28);
  g.lineTo(8, 16);
  g.closePath();
  g.fill();
  g.fillStyle = '#a0e0ff';
  g.beginPath();
  g.moveTo(16, 8);
  g.lineTo(20, 16);
  g.lineTo(16, 24);
  g.lineTo(12, 16);
  g.closePath();
  g.fill();
  fillRect(g, 15, 14, 2, 2, '#ffffff');
  return c;
}

function buildLightning() {
  const c = makeCanvas();
  const g = c.getContext('2d');
  g.strokeStyle = '#ffff40';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(12, 2);
  g.lineTo(18, 12);
  g.lineTo(12, 14);
  g.lineTo(20, 30);
  g.stroke();
  g.strokeStyle = '#ffffff';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(12, 2);
  g.lineTo(18, 12);
  g.lineTo(12, 14);
  g.lineTo(20, 30);
  g.stroke();
  return c;
}

// ── Exported API ─────────────────────────────────

export function getTileSprite(tileType) {
  if (!tileSeedCache[tileType]) {
    tileSeedCache[tileType] = buildTileSprite(tileType);
  }
  return tileSeedCache[tileType];
}

export function getPlayerSprite(playerClass) {
  const key = 'player_' + (playerClass || 'warrior');
  if (!cache[key]) {
    cache[key] = buildPlayerSprite(playerClass);
  }
  return cache[key];
}

export function getEnemySprite(entityType) {
  if (!cache[entityType]) {
    cache[entityType] = buildEnemySprite(entityType);
  }
  return cache[entityType];
}

export function getFireballSprite() {
  if (!cache.fireball) cache.fireball = buildFireball();
  return cache.fireball;
}

export function getArrowSprite() {
  if (!cache.arrow) cache.arrow = buildArrow();
  return cache.arrow;
}

export function getIceShardSprite() {
  if (!cache.iceShard) cache.iceShard = buildIceShard();
  return cache.iceShard;
}

export function getLightningSprite() {
  if (!cache.lightning) cache.lightning = buildLightning();
  return cache.lightning;
}

export function getItemSprite(iconCode) {
  const key = 'item_' + iconCode;
  if (!cache[key]) cache[key] = buildItemSprite(iconCode);
  return cache[key];
}
