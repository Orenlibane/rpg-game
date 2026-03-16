import {
  TILE, VILLAGE_W, VILLAGE_H,
  DUNGEON_W, DUNGEON_H,
  MIN_ROOM_SIZE, MAX_ROOM_SIZE, MAX_ROOMS,
  FLOOR_THEMES,
} from './constants.js?v=8';

// ── Village (fixed layout) ───────────────────────

export function generateVillage() {
  const map = Array.from({ length: VILLAGE_H }, () =>
    new Uint8Array(VILLAGE_W).fill(TILE.GRASS)
  );

  // Dirt paths - horizontal
  for (let x = 0; x < VILLAGE_W; x++) {
    map[8][x] = TILE.DIRT;
    map[9][x] = TILE.DIRT;
  }
  // Dirt paths - vertical
  for (let y = 0; y < VILLAGE_H; y++) {
    map[y][11] = TILE.DIRT;
    map[y][12] = TILE.DIRT;
  }

  // Huts
  const huts = [
    [3, 3], [7, 3], [15, 3], [19, 3],
    [3, 12], [7, 12], [15, 12], [19, 12],
  ];
  for (const [hx, hy] of huts) {
    if (hx < VILLAGE_W && hy < VILLAGE_H) {
      map[hy][hx] = TILE.HUT;
    }
  }

  // Cave entrance (north-east area)
  const caveX = 17;
  const caveY = 7;
  map[caveY][caveX] = TILE.CAVE_ENTRANCE;

  // Healer (south-west area, near a hut)
  const healerX = 4;
  const healerY = 5;
  map[healerY][healerX] = TILE.HEALER;

  // Merchant (south-east area, near a hut)
  const merchantX = 16;
  const merchantY = 5;
  map[merchantY][merchantX] = TILE.MERCHANT;

  // Quest Board (near center, south side)
  const questX = 8;
  const questY = 5;
  map[questY][questX] = TILE.QUEST_BOARD;

  // Player start position
  const playerStart = { x: 11, y: 9 };

  return { map, playerStart, caveEntrance: { x: caveX, y: caveY } };
}

// ── Dungeon (procedural rooms + corridors) ───────

function randInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

class Room {
  constructor(x, y, w, h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
  }
  get cx() { return Math.floor(this.x + this.w / 2); }
  get cy() { return Math.floor(this.y + this.h / 2); }
  intersects(other) {
    return (
      this.x - 1 < other.x + other.w &&
      this.x + this.w + 1 > other.x &&
      this.y - 1 < other.y + other.h &&
      this.y + this.h + 1 > other.y
    );
  }
}

export function generateDungeon(floor, themeKey) {
  const theme = FLOOR_THEMES[themeKey];
  const wallTile = theme ? theme.wallTile : TILE.CAVE_WALL;
  const floorTile = theme ? theme.floorTile : TILE.CAVE_FLOOR;

  const map = Array.from({ length: DUNGEON_H }, () =>
    new Uint8Array(DUNGEON_W).fill(wallTile)
  );

  const rooms = [];
  const maxAttempts = 200;

  for (let attempt = 0; attempt < maxAttempts && rooms.length < MAX_ROOMS; attempt++) {
    const w = randInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    const h = randInt(MIN_ROOM_SIZE, MAX_ROOM_SIZE);
    const x = randInt(1, DUNGEON_W - w - 1);
    const y = randInt(1, DUNGEON_H - h - 1);
    const room = new Room(x, y, w, h);

    let overlaps = false;
    for (const r of rooms) {
      if (room.intersects(r)) { overlaps = true; break; }
    }
    if (overlaps) continue;

    // Carve room
    for (let ry = room.y; ry < room.y + room.h; ry++) {
      for (let rx = room.x; rx < room.x + room.w; rx++) {
        map[ry][rx] = floorTile;
      }
    }

    // Connect to previous room
    if (rooms.length > 0) {
      const prev = rooms[rooms.length - 1];
      carveCorridor(map, prev.cx, prev.cy, room.cx, room.cy, floorTile);
    }

    rooms.push(room);
  }

  // Ensure we have at least 2 rooms
  if (rooms.length < 2) {
    // Force a second room
    const w = MIN_ROOM_SIZE;
    const h = MIN_ROOM_SIZE;
    const room = new Room(DUNGEON_W - w - 2, DUNGEON_H - h - 2, w, h);
    for (let ry = room.y; ry < room.y + room.h; ry++) {
      for (let rx = room.x; rx < room.x + room.w; rx++) {
        map[ry][rx] = floorTile;
      }
    }
    carveCorridor(map, rooms[0].cx, rooms[0].cy, room.cx, room.cy, floorTile);
    rooms.push(room);
  }

  // Player start: center of first room
  const playerStart = { x: rooms[0].cx, y: rooms[0].cy };

  // Stairs down: center of last room
  const lastRoom = rooms[rooms.length - 1];
  map[lastRoom.cy][lastRoom.cx] = TILE.CAVE_STAIRS;
  const stairsPos = { x: lastRoom.cx, y: lastRoom.cy };

  return { map, rooms, playerStart, stairsPos };
}

function carveCorridor(map, x1, y1, x2, y2, floorTile = TILE.CAVE_FLOOR) {
  let x = x1, y = y1;

  // Randomly choose to go horizontal or vertical first
  if (Math.random() < 0.5) {
    // Horizontal then vertical
    while (x !== x2) {
      if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
        map[y][x] = floorTile;
      }
      x += x2 > x ? 1 : -1;
    }
    while (y !== y2) {
      if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
        map[y][x] = floorTile;
      }
      y += y2 > y ? 1 : -1;
    }
  } else {
    // Vertical then horizontal
    while (y !== y2) {
      if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
        map[y][x] = floorTile;
      }
      y += y2 > y ? 1 : -1;
    }
    while (x !== x2) {
      if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
        map[y][x] = floorTile;
      }
      x += x2 > x ? 1 : -1;
    }
  }
  // Final tile
  if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
    map[y][x] = floorTile;
  }
}
