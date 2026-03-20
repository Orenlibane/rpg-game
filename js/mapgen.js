import {
  TILE, TILE_PROPS, VILLAGE_W, VILLAGE_H,
  DUNGEON_W, DUNGEON_H,
  MIN_ROOM_SIZE, MAX_ROOM_SIZE, MAX_ROOMS,
  FLOOR_THEMES, ROOM_TYPE,
  ENTITY, BASE_STATS, BOSS_CAVE_BOSSES,
} from './constants.js?v=42';

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

  // Boss Cave entrance (west side, near town gate — clearly visible)
  map[4][3] = TILE.BOSS_CAVE_ENTRANCE;

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

  // Fishing Spot (south-east, near water)
  map[13][20] = TILE.FISHING_SPOT;

  // Arena (south-center)
  map[13][12] = TILE.ARENA;

  // Blacksmith (north-east area, near huts)
  map[5][20] = TILE.BLACKSMITH;

  // Floor Warp (north of center crossroads — easy to find)
  map[5][12] = TILE.FLOOR_WARP;

  // Beach entrance (right edge of village, accessible from east path)
  map[8][21] = TILE.BEACH_ENTRANCE;

  // Town entrance (left edge of village, accessible from west path)
  map[8][0] = TILE.TOWN_ENTRANCE;

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
    this.type = ROOM_TYPE.NORMAL;
  }
  get cx() { return Math.floor(this.x + this.w / 2); }
  get cy() { return Math.floor(this.y + this.h / 2); }
  get area() { return this.w * this.h; }
  // Inner floor area (1 tile inset = the walkable interior)
  get ix() { return this.x + 1; }
  get iy() { return this.y + 1; }
  get iw() { return this.w - 2; }
  get ih() { return this.h - 2; }
  intersects(other) {
    return (
      this.x - 1 < other.x + other.w &&
      this.x + this.w + 1 > other.x &&
      this.y - 1 < other.y + other.h &&
      this.y + this.h + 1 > other.y
    );
  }
}

// BFS flood-fill reachability check
function isReachable(map, from, to) {
  const H = map.length, W = map[0].length;
  const visited = Array.from({ length: H }, () => new Uint8Array(W));
  const queue = [from.x, from.y];
  visited[from.y][from.x] = 1;
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++], y = queue[head++];
    if (x === to.x && y === to.y) return true;
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    for (const [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && nx < W && ny >= 0 && ny < H && !visited[ny][nx]) {
        const t = map[ny][nx];
        if (TILE_PROPS[t] && TILE_PROPS[t].walkable) {
          visited[ny][nx] = 1;
          queue.push(nx, ny);
        }
      }
    }
  }
  return false;
}

export function generateDungeon(floor, themeKey) {
  const theme = FLOOR_THEMES[themeKey];
  const wallTile = theme ? theme.wallTile : TILE.CAVE_WALL;
  const floorTile = theme ? theme.floorTile : TILE.CAVE_FLOOR;
  const layoutType = theme ? (theme.layoutType || 'dungeon') : 'dungeon';

  switch (layoutType) {
    case 'village': return generateVillageLayout(floor, wallTile, floorTile);
    case 'lair':    return generateLairLayout(floor, wallTile, floorTile);
    case 'swamp':   return generateSwampLayout(floor, wallTile, floorTile);
    default:        return generateStandardDungeon(floor, wallTile, floorTile);
  }
}

// ── Standard Dungeon (rooms + corridors) ─────────
function generateStandardDungeon(floor, wallTile, floorTile) {
  const map = Array.from({ length: DUNGEON_H }, () =>
    new Uint8Array(DUNGEON_W).fill(wallTile)
  );

  const rooms = [];
  const maxAttempts = 500;

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

    carveRoom(map, room, wallTile, floorTile);

    if (rooms.length > 0) {
      const prev = rooms[rooms.length - 1];
      if (Math.random() < 0.3) {
        carveWideCorridor(map, prev.cx, prev.cy, room.cx, room.cy, floorTile);
      } else {
        carveCorridor(map, prev.cx, prev.cy, room.cx, room.cy, floorTile);
      }
    }

    rooms.push(room);
  }

  if (rooms.length < 2) {
    const w = MIN_ROOM_SIZE;
    const h = MIN_ROOM_SIZE;
    const room = new Room(DUNGEON_W - w - 2, DUNGEON_H - h - 2, w, h);
    carveRoom(map, room, wallTile, floorTile);
    carveCorridor(map, rooms[0].cx, rooms[0].cy, room.cx, room.cy, floorTile);
    rooms.push(room);
  }

  assignRoomTypes(rooms);
  decorateRooms(map, rooms, floorTile, wallTile);
  decorateCorridors(map, floorTile);

  return finalizeDungeon(map, rooms, floor, floorTile);
}

// ── Village Layout (open area with hut structures) ─
function generateVillageLayout(floor, wallTile, floorTile) {
  const map = Array.from({ length: DUNGEON_H }, () =>
    new Uint8Array(DUNGEON_W).fill(floorTile)
  );

  // Palisade border (2-tile thick)
  for (let y = 0; y < DUNGEON_H; y++) {
    for (let x = 0; x < DUNGEON_W; x++) {
      if (x < 2 || x >= DUNGEON_W - 2 || y < 2 || y >= DUNGEON_H - 2) {
        map[y][x] = wallTile;
      }
    }
  }

  // Gate opening at south center
  const gateX = Math.floor(DUNGEON_W / 2);
  for (let dx = -2; dx <= 2; dx++) {
    map[DUNGEON_H - 2][gateX + dx] = floorTile;
    map[DUNGEON_H - 1][gateX + dx] = floorTile;
  }

  // Generate 6-10 small hut structures
  const rooms = [];
  const numHuts = randInt(6, 10);
  for (let attempt = 0; attempt < 200 && rooms.length < numHuts; attempt++) {
    const w = randInt(3, 5);
    const h = randInt(3, 5);
    const x = randInt(4, DUNGEON_W - w - 4);
    const y = randInt(4, DUNGEON_H - h - 4);
    const room = new Room(x, y, w, h);

    let overlaps = false;
    for (const r of rooms) {
      if (room.intersects(r)) { overlaps = true; break; }
    }
    if (overlaps) continue;

    // Carve hut walls and floor
    carveRoom(map, room, wallTile, floorTile);

    // Open one side of the hut as a door
    const doorSide = randInt(0, 3);
    if (doorSide === 0) map[room.y][room.cx] = floorTile; // top
    else if (doorSide === 1) map[room.y + room.h - 1][room.cx] = floorTile; // bottom
    else if (doorSide === 2) map[room.cy][room.x] = floorTile; // left
    else map[room.cy][room.x + room.w - 1] = floorTile; // right

    rooms.push(room);
  }

  // Scatter barrels near huts
  for (const room of rooms) {
    if (Math.random() < 0.6) {
      const bx = room.x + room.w;
      const by = room.y + randInt(0, room.h - 1);
      if (bx < DUNGEON_W - 2 && map[by][bx] === floorTile) map[by][bx] = TILE.BARREL;
    }
  }

  // Campfire areas (carpet tiles)
  for (let i = 0; i < 3; i++) {
    const cx = randInt(10, DUNGEON_W - 10);
    const cy = randInt(10, DUNGEON_H - 10);
    if (map[cy][cx] === floorTile) map[cy][cx] = TILE.CARPET;
  }

  // Wooden posts (pillars)
  for (let i = 0; i < 5; i++) {
    const px = randInt(4, DUNGEON_W - 4);
    const py = randInt(4, DUNGEON_H - 4);
    if (map[py][px] === floorTile) map[py][px] = TILE.PILLAR;
  }

  return finalizeDungeon(map, rooms, floor, floorTile);
}

// ── Lair Layout (massive central chamber + side caves) ─
function generateLairLayout(floor, wallTile, floorTile) {
  const map = Array.from({ length: DUNGEON_H }, () =>
    new Uint8Array(DUNGEON_W).fill(wallTile)
  );

  const rooms = [];

  // Small entrance cave (south)
  const entranceW = randInt(5, 7);
  const entranceH = randInt(5, 7);
  const entranceX = randInt(5, 15);
  const entranceY = DUNGEON_H - entranceH - 3;
  const entrance = new Room(entranceX, entranceY, entranceW, entranceH);
  carveRoom(map, entrance, wallTile, floorTile);
  rooms.push(entrance);

  // Massive central chamber
  const bigW = randInt(20, 28);
  const bigH = randInt(14, 20);
  const bigX = Math.floor((DUNGEON_W - bigW) / 2);
  const bigY = Math.floor((DUNGEON_H - bigH) / 2) - 3;
  const bigRoom = new Room(bigX, bigY, bigW, bigH);
  carveRoom(map, bigRoom, wallTile, floorTile);
  rooms.push(bigRoom);

  // Connect entrance to central chamber
  carveCorridor(map, entrance.cx, entrance.cy, bigRoom.cx, bigRoom.cy, floorTile);

  // 3-5 side caves
  const numSides = randInt(3, 5);
  for (let i = 0; i < numSides; i++) {
    const sw = randInt(5, 8);
    const sh = randInt(5, 8);
    let sx, sy;
    // Place around the central chamber
    if (i % 2 === 0) {
      sx = randInt(bigX - sw - 4, bigX - sw); // left side
      sy = bigY + randInt(0, bigH - sh);
    } else {
      sx = randInt(bigX + bigW, bigX + bigW + 4); // right side
      sy = bigY + randInt(0, bigH - sh);
    }
    sx = Math.max(1, Math.min(sx, DUNGEON_W - sw - 1));
    sy = Math.max(1, Math.min(sy, DUNGEON_H - sh - 1));
    const side = new Room(sx, sy, sw, sh);
    carveRoom(map, side, wallTile, floorTile);
    carveCorridor(map, bigRoom.cx, bigRoom.cy, side.cx, side.cy, floorTile);
    rooms.push(side);
  }

  // Decorate central chamber: carpet center (treasure hoard), rubble, bone piles
  const cInner = { x: bigRoom.ix, y: bigRoom.iy, w: bigRoom.iw, h: bigRoom.ih };
  for (let y = cInner.y + 2; y < cInner.y + cInner.h - 2; y++) {
    for (let x = cInner.x + 3; x < cInner.x + cInner.w - 3; x++) {
      if (map[y][x] === floorTile) map[y][x] = TILE.CARPET;
    }
  }
  // Scatter rubble and sarcophagi (bone piles)
  for (let i = 0; i < 6; i++) {
    const rx = cInner.x + randInt(0, cInner.w - 1);
    const ry = cInner.y + randInt(0, cInner.h - 1);
    if (map[ry][rx] === floorTile) map[ry][rx] = TILE.RUBBLE;
  }
  for (let i = 0; i < 3; i++) {
    const rx = cInner.x + randInt(1, cInner.w - 2);
    const ry = cInner.y + randInt(1, cInner.h - 2);
    if (map[ry][rx] === floorTile || map[ry][rx] === TILE.CARPET) map[ry][rx] = TILE.SARCOPHAGUS;
  }

  return finalizeDungeon(map, rooms, floor, floorTile);
}

// ── Swamp Layout (organic rooms + water) ──────────
function generateSwampLayout(floor, wallTile, floorTile) {
  const map = Array.from({ length: DUNGEON_H }, () =>
    new Uint8Array(DUNGEON_W).fill(wallTile)
  );

  // Standard room generation
  const rooms = [];
  const maxAttempts = 500;
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

    carveRoom(map, room, wallTile, floorTile);

    if (rooms.length > 0) {
      const prev = rooms[rooms.length - 1];
      carveWideCorridor(map, prev.cx, prev.cy, room.cx, room.cy, floorTile);
    }

    rooms.push(room);
  }

  if (rooms.length < 2) {
    const w = MIN_ROOM_SIZE;
    const h = MIN_ROOM_SIZE;
    const room = new Room(DUNGEON_W - w - 2, DUNGEON_H - h - 2, w, h);
    carveRoom(map, room, wallTile, floorTile);
    carveCorridor(map, rooms[0].cx, rooms[0].cy, room.cx, room.cy, floorTile);
    rooms.push(room);
  }

  // Post-processing: erode room edges (make organic)
  for (const room of rooms) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        const isEdge = (y === room.y || y === room.y + room.h - 1 ||
                        x === room.x || x === room.x + room.w - 1);
        if (isEdge && map[y][x] === wallTile && Math.random() < 0.3) {
          map[y][x] = floorTile; // Erode wall edges
        }
      }
    }
  }

  // Post-processing: scatter water tiles (25-30% of floor)
  for (let y = 1; y < DUNGEON_H - 1; y++) {
    for (let x = 1; x < DUNGEON_W - 1; x++) {
      if (map[y][x] === floorTile && Math.random() < 0.28) {
        map[y][x] = TILE.WATER;
      }
    }
  }

  // Scatter rubble as dead tree stumps
  for (let i = 0; i < 8; i++) {
    const rx = randInt(3, DUNGEON_W - 3);
    const ry = randInt(3, DUNGEON_H - 3);
    if (map[ry][rx] === floorTile) map[ry][rx] = TILE.RUBBLE;
  }

  return finalizeDungeon(map, rooms, floor, floorTile);
}

// ── Shared dungeon finalization (stairs, reachability) ─
function finalizeDungeon(map, rooms, floor, floorTile) {
  // Player start: center of first room
  const playerStart = { x: rooms[0].cx, y: rooms[0].cy };
  // Ensure player start is walkable
  if (!TILE_PROPS[map[playerStart.y][playerStart.x]] || !TILE_PROPS[map[playerStart.y][playerStart.x]].walkable) {
    map[playerStart.y][playerStart.x] = floorTile;
  }

  // Stairs down: center of last room
  const lastRoom = rooms[rooms.length - 1];
  map[lastRoom.cy][lastRoom.cx] = TILE.CAVE_STAIRS;
  const stairsPos = { x: lastRoom.cx, y: lastRoom.cy };

  // Up stairs: place near player start (floor >= 1; on floor 1 it returns to village)
  let upStairsPos = null;
  if (floor >= 1) {
    const offsets = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
    for (const [ox, oy] of offsets) {
      const ux = playerStart.x + ox, uy = playerStart.y + oy;
      if (ux >= 0 && ux < DUNGEON_W && uy >= 0 && uy < DUNGEON_H) {
        const t = map[uy][ux];
        if (TILE_PROPS[t] && TILE_PROPS[t].walkable && t !== TILE.CAVE_STAIRS) {
          map[uy][ux] = TILE.UP_STAIRS;
          upStairsPos = { x: ux, y: uy };
          break;
        }
      }
    }
  }

  // BFS reachability: ensure player can reach down stairs
  if (!isReachable(map, playerStart, stairsPos)) {
    carveCorridor(map, playerStart.x, playerStart.y, stairsPos.x, stairsPos.y, floorTile);
    map[stairsPos.y][stairsPos.x] = TILE.CAVE_STAIRS;
    if (upStairsPos) map[upStairsPos.y][upStairsPos.x] = TILE.UP_STAIRS;
  }

  return { map, rooms, playerStart, stairsPos, upStairsPos };
}

// ── Room Carving ────────────────────────────────

function carveRoom(map, room, wallTile, floorTile) {
  // The outer ring of the room (row 0, last row, col 0, last col) stays as wall.
  // This creates visible room walls. The interior is carved as floor.
  for (let ry = room.y; ry < room.y + room.h; ry++) {
    for (let rx = room.x; rx < room.x + room.w; rx++) {
      const isEdge = (ry === room.y || ry === room.y + room.h - 1 ||
                      rx === room.x || rx === room.x + room.w - 1);
      map[ry][rx] = isEdge ? wallTile : floorTile;
    }
  }
}

// ── Corridor Carving ─────────────────────────────

function carveCorridor(map, x1, y1, x2, y2, floorTile = TILE.CAVE_FLOOR) {
  let x = x1, y = y1;

  if (Math.random() < 0.5) {
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
  if (y >= 0 && y < DUNGEON_H && x >= 0 && x < DUNGEON_W) {
    map[y][x] = floorTile;
  }
}

function carveWideCorridor(map, x1, y1, x2, y2, floorTile) {
  // Carve main corridor plus 1 tile padding on each side
  let x = x1, y = y1;

  const carveAt = (cx, cy) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = cy + dy, nx = cx + dx;
        if (ny > 0 && ny < DUNGEON_H - 1 && nx > 0 && nx < DUNGEON_W - 1) {
          map[ny][nx] = floorTile;
        }
      }
    }
  };

  if (Math.random() < 0.5) {
    while (x !== x2) { carveAt(x, y); x += x2 > x ? 1 : -1; }
    while (y !== y2) { carveAt(x, y); y += y2 > y ? 1 : -1; }
  } else {
    while (y !== y2) { carveAt(x, y); y += y2 > y ? 1 : -1; }
    while (x !== x2) { carveAt(x, y); x += x2 > x ? 1 : -1; }
  }
  carveAt(x, y);
}

// ── Safety Helpers ──────────────────────────────

// Check if a tile is on the room's outer wall (border ring)
function isRoomWall(room, x, y) {
  return (x >= room.x && x < room.x + room.w &&
          y >= room.y && y < room.y + room.h) &&
         (x === room.x || x === room.x + room.w - 1 ||
          y === room.y || y === room.y + room.h - 1);
}

// Check if a position is a doorway (room wall tile that was carved to floor by a corridor)
function isDoorway(map, room, x, y, floorTile) {
  if (!isRoomWall(room, x, y)) return false;
  const t = map[y] && map[y][x];
  return t === floorTile || (TILE_PROPS[t] && TILE_PROPS[t].walkable);
}

// Find all doorway tiles for a room (walkable tiles on the room's wall ring)
function findDoorways(map, room, floorTile) {
  const doors = [];
  for (let rx = room.x; rx < room.x + room.w; rx++) {
    if (isDoorway(map, room, rx, room.y, floorTile)) doors.push({ x: rx, y: room.y });
    if (isDoorway(map, room, rx, room.y + room.h - 1, floorTile)) doors.push({ x: rx, y: room.y + room.h - 1 });
  }
  for (let ry = room.y + 1; ry < room.y + room.h - 1; ry++) {
    if (isDoorway(map, room, room.x, ry, floorTile)) doors.push({ x: room.x, y: ry });
    if (isDoorway(map, room, room.x + room.w - 1, ry, floorTile)) doors.push({ x: room.x + room.w - 1, y: ry });
  }
  return doors;
}

// Check if placing a non-walkable tile at (x,y) would block movement.
// Safe = at least 2 walkable cardinal neighbors remain, AND not adjacent to a doorway.
function safeToBlock(map, x, y, doorways) {
  // Never block a doorway tile itself
  for (const d of doorways) {
    if (d.x === x && d.y === y) return false;
  }
  // Never block a tile cardinally adjacent to a doorway
  for (const d of doorways) {
    if (Math.abs(d.x - x) + Math.abs(d.y - y) <= 1) return false;
  }
  // Count walkable cardinal neighbors
  const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
  let walkable = 0;
  for (const [dx, dy] of dirs) {
    const nx = x + dx, ny = y + dy;
    if (ny >= 0 && ny < DUNGEON_H && nx >= 0 && nx < DUNGEON_W) {
      const t = map[ny][nx];
      if (TILE_PROPS[t] && TILE_PROPS[t].walkable) walkable++;
    }
  }
  return walkable >= 2;
}

// ── Room Type Assignment ─────────────────────────

function assignRoomTypes(rooms) {
  if (rooms.length <= 2) return;
  const eligible = rooms.slice(1, -1);

  const types = [
    ROOM_TYPE.TREASURE,
    ROOM_TYPE.LIBRARY,
    ROOM_TYPE.ARMORY,
    ROOM_TYPE.FOUNTAIN,
    ROOM_TYPE.CRYPT_CHAMBER,
  ];

  const numSpecial = Math.min(
    Math.floor(eligible.length * 0.4),
    types.length
  );

  const shuffled = [...eligible].sort(() => Math.random() - 0.5);

  for (let i = 0; i < numSpecial; i++) {
    shuffled[i].type = types[i % types.length];
  }

  // Guardian chamber: assign to one remaining NORMAL room (if enough rooms)
  if (rooms.length > 4) {
    const normalRooms = eligible.filter(r => r.type === ROOM_TYPE.NORMAL);
    if (normalRooms.length > 0) {
      const pick = normalRooms[Math.floor(Math.random() * normalRooms.length)];
      pick.type = ROOM_TYPE.GUARDIAN_CHAMBER;
    }
  }
}

// ── Room Decoration ──────────────────────────────

function decorateRooms(map, rooms, floorTile, wallTile) {
  for (const room of rooms) {
    const doorways = findDoorways(map, room, floorTile);
    switch (room.type) {
      case ROOM_TYPE.TREASURE:
        decorateTreasureRoom(map, room, floorTile, doorways);
        break;
      case ROOM_TYPE.LIBRARY:
        decorateLibrary(map, room, floorTile, doorways);
        break;
      case ROOM_TYPE.ARMORY:
        decorateArmory(map, room, floorTile, doorways);
        break;
      case ROOM_TYPE.FOUNTAIN:
        decorateFountainRoom(map, room, floorTile, doorways);
        break;
      case ROOM_TYPE.CRYPT_CHAMBER:
        decorateCryptChamber(map, room, floorTile, doorways);
        break;
      case ROOM_TYPE.GUARDIAN_CHAMBER:
        decorateGuardianChamber(map, room, floorTile, doorways);
        break;
      default:
        decorateNormalRoom(map, room, floorTile, doorways);
        break;
    }
  }
}

// Try to place a non-walkable tile; returns true if placed successfully
function tryPlaceBlocking(map, x, y, tile, floorTile, doorways) {
  if (map[y][x] !== floorTile) return false;
  if (!safeToBlock(map, x, y, doorways)) return false;
  map[y][x] = tile;
  return true;
}

// ── Normal Room ────────────────────────────────

function decorateNormalRoom(map, room, floorTile, doorways) {
  // Pillars in corners of large rooms (2 tiles inset so they don't crowd walls)
  if (room.iw >= 5 && room.ih >= 5) {
    const positions = [
      [room.ix + 1, room.iy + 1],
      [room.ix + room.iw - 2, room.iy + 1],
      [room.ix + 1, room.iy + room.ih - 2],
      [room.ix + room.iw - 2, room.iy + room.ih - 2],
    ];
    for (const [px, py] of positions) {
      tryPlaceBlocking(map, px, py, TILE.PILLAR, floorTile, doorways);
    }
  }

  // Sparse rubble (walkable, so no blocking check needed)
  for (let ry = room.iy; ry < room.iy + room.ih; ry++) {
    for (let rx = room.ix; rx < room.ix + room.iw; rx++) {
      if (map[ry][rx] === floorTile && Math.random() < 0.03) {
        map[ry][rx] = TILE.RUBBLE;
      }
    }
  }

  // 0-2 barrels against interior walls (not near doorways)
  if (room.iw >= 4) {
    const barrelCount = randInt(0, 2);
    for (let b = 0; b < barrelCount; b++) {
      const bx = randInt(room.ix + 1, room.ix + room.iw - 2);
      // Place against top or bottom interior wall
      const by = Math.random() < 0.5 ? room.iy : room.iy + room.ih - 1;
      tryPlaceBlocking(map, bx, by, TILE.BARREL, floorTile, doorways);
    }
  }
}

// ── Treasure Room ─────────────────────────────

function decorateTreasureRoom(map, room, floorTile, doorways) {
  // Carpet in center area
  const insetX = Math.max(1, Math.floor(room.iw * 0.2));
  const insetY = Math.max(1, Math.floor(room.ih * 0.2));
  for (let ry = room.iy + insetY; ry < room.iy + room.ih - insetY; ry++) {
    for (let rx = room.ix + insetX; rx < room.ix + room.iw - insetX; rx++) {
      if (map[ry][rx] === floorTile) {
        map[ry][rx] = TILE.CARPET;
      }
    }
  }
  // Pillars in corners (2 inset)
  if (room.iw >= 5 && room.ih >= 5) {
    const positions = [
      [room.ix + 1, room.iy + 1],
      [room.ix + room.iw - 2, room.iy + 1],
      [room.ix + 1, room.iy + room.ih - 2],
      [room.ix + room.iw - 2, room.iy + room.ih - 2],
    ];
    for (const [px, py] of positions) {
      tryPlaceBlocking(map, px, py, TILE.PILLAR, floorTile, doorways);
    }
  }
}

// ── Library ───────────────────────────────────

function decorateLibrary(map, room, floorTile, doorways) {
  // Bookshelves along top interior wall (skip tiles near doorways)
  for (let rx = room.ix; rx < room.ix + room.iw; rx += 2) {
    tryPlaceBlocking(map, rx, room.iy, TILE.BOOKSHELF, floorTile, doorways);
  }
  // Bookshelves along bottom interior wall
  for (let rx = room.ix; rx < room.ix + room.iw; rx += 2) {
    tryPlaceBlocking(map, rx, room.iy + room.ih - 1, TILE.BOOKSHELF, floorTile, doorways);
  }
  // Carpet runner down center (walkable, no blocking check)
  const midX = room.cx;
  for (let ry = room.iy; ry < room.iy + room.ih; ry++) {
    if (map[ry][midX] === floorTile) {
      map[ry][midX] = TILE.CARPET;
    }
  }
}

// ── Armory ────────────────────────────────────

function decorateArmory(map, room, floorTile, doorways) {
  // Weapon racks along left interior wall
  for (let ry = room.iy; ry < room.iy + room.ih; ry += 2) {
    tryPlaceBlocking(map, room.ix, ry, TILE.WEAPON_RACK, floorTile, doorways);
  }
  // Weapon racks along right interior wall
  for (let ry = room.iy; ry < room.iy + room.ih; ry += 2) {
    tryPlaceBlocking(map, room.ix + room.iw - 1, ry, TILE.WEAPON_RACK, floorTile, doorways);
  }
  // A barrel in the interior
  if (room.iw >= 4 && room.ih >= 4) {
    const bx = randInt(room.ix + 1, room.ix + room.iw - 2);
    const by = randInt(room.iy + 1, room.iy + room.ih - 2);
    tryPlaceBlocking(map, bx, by, TILE.BARREL, floorTile, doorways);
  }
}

// ── Fountain Room ─────────────────────────────

function decorateFountainRoom(map, room, floorTile, doorways) {
  const cx = room.cx;
  const cy = room.cy;
  // Fountain at center (safe — room center is far from doorways in walls)
  if (safeToBlock(map, cx, cy, doorways) && map[cy][cx] === floorTile) {
    map[cy][cx] = TILE.FOUNTAIN;
    // Water tiles around fountain (walkable, no blocking check needed)
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const wx = cx + dx, wy = cy + dy;
        if (wy >= room.iy && wy < room.iy + room.ih &&
            wx >= room.ix && wx < room.ix + room.iw) {
          if (map[wy][wx] === floorTile) {
            map[wy][wx] = TILE.WATER;
          }
        }
      }
    }
  }
}

// ── Crypt Chamber ─────────────────────────────

function decorateCryptChamber(map, room, floorTile, doorways) {
  // Sarcophagi in grid pattern (every 3rd tile, well inside room)
  for (let ry = room.iy + 1; ry < room.iy + room.ih - 1; ry += 3) {
    for (let rx = room.ix + 1; rx < room.ix + room.iw - 1; rx += 3) {
      tryPlaceBlocking(map, rx, ry, TILE.SARCOPHAGUS, floorTile, doorways);
    }
  }
  // Rubble scattered (walkable, no blocking check needed)
  for (let ry = room.iy; ry < room.iy + room.ih; ry++) {
    for (let rx = room.ix; rx < room.ix + room.iw; rx++) {
      if (map[ry][rx] === floorTile && Math.random() < 0.06) {
        map[ry][rx] = TILE.RUBBLE;
      }
    }
  }
}

// ── Guardian Chamber ─────────────────────────────

function decorateGuardianChamber(map, room, floorTile, doorways) {
  // Carpet in center area (like treasure room)
  const insetX = Math.max(1, Math.floor(room.iw * 0.2));
  const insetY = Math.max(1, Math.floor(room.ih * 0.2));
  for (let ry = room.iy + insetY; ry < room.iy + room.ih - insetY; ry++) {
    for (let rx = room.ix + insetX; rx < room.ix + room.iw - insetX; rx++) {
      if (map[ry][rx] === floorTile) {
        map[ry][rx] = TILE.CARPET;
      }
    }
  }
  // Pillars in corners (2 inset)
  if (room.iw >= 5 && room.ih >= 5) {
    const positions = [
      [room.ix + 1, room.iy + 1],
      [room.ix + room.iw - 2, room.iy + 1],
      [room.ix + 1, room.iy + room.ih - 2],
      [room.ix + room.iw - 2, room.iy + room.ih - 2],
    ];
    for (const [px, py] of positions) {
      tryPlaceBlocking(map, px, py, TILE.PILLAR, floorTile, doorways);
    }
  }
}

// ── Corridor Decoration ─────────────────────────

function decorateCorridors(map, floorTile) {
  for (let y = 1; y < DUNGEON_H - 1; y++) {
    for (let x = 1; x < DUNGEON_W - 1; x++) {
      if (map[y][x] !== floorTile) continue;
      // Check if this is a corridor tile (walls on 2+ cardinal sides)
      const wallCount =
        (!TILE_PROPS[map[y-1][x]]?.walkable ? 1 : 0) +
        (!TILE_PROPS[map[y+1][x]]?.walkable ? 1 : 0) +
        (!TILE_PROPS[map[y][x-1]]?.walkable ? 1 : 0) +
        (!TILE_PROPS[map[y][x+1]]?.walkable ? 1 : 0);
      if (wallCount >= 2 && Math.random() < 0.03) {
        map[y][x] = TILE.RUBBLE;
      }
    }
  }
}

// ── Village Cave Map ──────────────────────────────

export function generateCave(depth = 1) {
  const W = 20, H = 16;
  const map = Array.from({ length: H }, () => new Uint8Array(W).fill(TILE.CAVE_WALL));

  // Carve rooms + corridors using simple BSP
  const rooms = [];
  function carveRoom(x, y, w, h) {
    for (let ry = y; ry < y + h; ry++)
      for (let rx = x; rx < x + w; rx++)
        map[ry][rx] = TILE.CAVE_FLOOR;
    rooms.push({ x, y, w, h, cx: Math.floor(x + w / 2), cy: Math.floor(y + h / 2) });
  }
  function carveCorridor(x1, y1, x2, y2) {
    let cx = x1, cy = y1;
    while (cx !== x2) { map[cy][cx] = TILE.CAVE_FLOOR; cx += cx < x2 ? 1 : -1; }
    while (cy !== y2) { map[cy][cx] = TILE.CAVE_FLOOR; cy += cy < y2 ? 1 : -1; }
  }

  // Place 4-6 rooms
  const roomDefs = [
    [2, 2, 4, 4], [8, 2, 5, 4], [14, 2, 4, 4],
    [2, 9, 4, 5], [8, 8, 5, 5], [14, 9, 4, 5],
  ];
  const numRooms = 4 + (depth > 1 ? 2 : 0);
  for (let i = 0; i < numRooms && i < roomDefs.length; i++) {
    const [rx, ry, rw, rh] = roomDefs[i];
    carveRoom(rx, ry, rw, rh);
  }
  for (let i = 1; i < rooms.length; i++) {
    carveCorridor(rooms[i - 1].cx, rooms[i - 1].cy, rooms[i].cx, rooms[i].cy);
  }

  // Player starts in first room
  const playerStart = { x: rooms[0].cx, y: rooms[0].cy };

  // Exit tile in last room
  const lastRoom = rooms[rooms.length - 1];
  map[lastRoom.cy][lastRoom.cx] = TILE.VILLAGE_CAVE_EXIT;
  const stairsPos = { x: lastRoom.cx, y: lastRoom.cy };

  // Spawn enemies: cave crawlers and spiders
  const caveEnemies = [ENTITY.CAVE_CRAWLER, ENTITY.SPIDER, ENTITY.BAT, ENTITY.GOBLIN];
  const enemies = [];
  for (let i = 1; i < rooms.length - 1; i++) {
    const room = rooms[i];
    const numE = 2 + depth;
    for (let j = 0; j < numE; j++) {
      const ex = room.cx + (Math.random() < 0.5 ? -1 : 1);
      const ey = room.cy + (Math.random() < 0.5 ? -1 : 1);
      if (ex > 0 && ex < W - 1 && ey > 0 && ey < H - 1 && map[ey][ex] === TILE.CAVE_FLOOR) {
        enemies.push({ type: caveEnemies[Math.floor(Math.random() * caveEnemies.length)], x: ex, y: ey });
      }
    }
  }

  // Chest in second-to-last room
  const chests = [];
  if (rooms.length >= 2) {
    const cr = rooms[rooms.length - 2];
    chests.push({
      x: cr.cx + 1, y: cr.cy,
      items: [], gold: 20 + depth * 15, opened: false,
    });
  }

  return { map, playerStart, stairsPos, enemies, chests };
}

// ── Mini Dungeon Map ──────────────────────────────

export function generateMiniDungeon(floor = 1) {
  const W = 16, H = 12;
  const map = Array.from({ length: H }, () => new Uint8Array(W).fill(TILE.CAVE_WALL));

  // One large central room + 2 small side rooms
  function carveRoom(x, y, w, h) {
    for (let ry = y; ry < y + h; ry++)
      for (let rx = x; rx < x + w; rx++)
        map[ry][rx] = TILE.CAVE_FLOOR;
    return { x, y, w, h, cx: Math.floor(x + w / 2), cy: Math.floor(y + h / 2) };
  }
  function carveCorridor(x1, y1, x2, y2) {
    let cx = x1, cy = y1;
    while (cx !== x2) { map[cy][cx] = TILE.CAVE_FLOOR; cx += cx < x2 ? 1 : -1; }
    while (cy !== y2) { map[cy][cx] = TILE.CAVE_FLOOR; cy += cy < y2 ? 1 : -1; }
  }

  const entry  = carveRoom(1, 4, 4, 4);
  const main   = carveRoom(6, 2, 6, 8);
  const reward = carveRoom(13, 4, 2, 4);
  carveCorridor(entry.cx, entry.cy, main.cx, main.cy);
  carveCorridor(main.cx, main.cy, reward.cx, reward.cy);

  // Player enters at entry room
  const playerStart = { x: entry.cx, y: entry.cy };

  // Place exit portal in reward room (leads back)
  map[reward.cy][reward.cx] = TILE.MINI_DUNGEON;
  const stairsPos = { x: reward.cx, y: reward.cy };

  // Enemies: spawn in main room - floor-appropriate types
  const enemies = [];
  const enemyTypes = [ENTITY.ORC, ENTITY.SKELETON, ENTITY.TROLL, ENTITY.DARK_MAGE, ENTITY.WRAITH, ENTITY.DEATH_KNIGHT];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  for (let i = 0; i < 3 + Math.floor(floor / 2); i++) {
    const ex = main.x + 1 + Math.floor(Math.random() * (main.w - 2));
    const ey = main.y + 1 + Math.floor(Math.random() * (main.h - 2));
    if (map[ey] && map[ey][ex] === TILE.CAVE_FLOOR) {
      enemies.push({ type: pick(enemyTypes), x: ex, y: ey });
    }
  }

  // Reward chest in reward room (guaranteed high-value loot)
  const chests = [{
    x: reward.cx - 1, y: reward.cy,
    items: [], gold: 30 + floor * 10, opened: false,
    isGuaranteed: true,  // signal to engine for better loot
  }];

  return { map, playerStart, stairsPos, enemies, chests };
}

// ── Arena Map (simple room) ─────────────────────

export function generateArenaMap() {
  const SIZE = 12;
  const map = Array.from({ length: SIZE }, () =>
    new Uint8Array(SIZE).fill(TILE.CAVE_WALL)
  );
  // Carve interior floor
  for (let y = 1; y < SIZE - 1; y++) {
    for (let x = 1; x < SIZE - 1; x++) {
      map[y][x] = TILE.CAVE_FLOOR;
    }
  }
  const playerStart = { x: Math.floor(SIZE / 2), y: Math.floor(SIZE / 2) };
  return { map, playerStart };
}

// ── Beach Map ─────────────────────────────────

export function generateBeach() {
  const W = 22, H = 16;
  // Fill with sandy beach
  const map = Array.from({ length: H }, () => new Uint8Array(W).fill(TILE.BEACH_SAND));

  // Rocky walls at top and bottom
  for (let x = 0; x < W; x++) {
    map[0][x] = TILE.BEACH_WALL;
    map[H - 1][x] = TILE.BEACH_WALL;
  }
  // Left wall (west)
  for (let y = 0; y < H; y++) {
    map[y][0] = TILE.BEACH_WALL;
  }
  // Oceanwater on right side (east)
  for (let y = 1; y < H - 1; y++) {
    map[y][W - 1] = TILE.WATER;
    if (y % 3 !== 1) map[y][W - 2] = TILE.WATER;
  }
  // Rocky outcroppings
  const rocks = [[3,2],[4,2],[3,3],[8,4],[9,4],[14,2],[15,3],[7,12],[8,12],[15,11],[16,11]];
  for (const [x,y] of rocks) {
    if (x < W - 2 && y < H - 1) map[y][x] = TILE.BEACH_WALL;
  }

  // Beach entrance tile (return path to village)
  map[8][1] = TILE.BEACH_ENTRANCE;

  // Player starts near the entrance
  const playerStart = { x: 3, y: 8 };

  // Enemies
  const enemies = [];
  const beachEnemyTypes = [ENTITY.SAND_SCORPION, ENTITY.TOXIC_TOAD, ENTITY.GOBLIN_SCOUT, ENTITY.VENOM_SPITTER];
  const spawnPoints = [[6,5],[10,3],[13,6],[5,10],[10,11],[15,7],[17,5],[12,9]];
  for (let i = 0; i < Math.min(4, spawnPoints.length); i++) {
    const [ex, ey] = spawnPoints[i];
    if (map[ey][ex] === TILE.BEACH_SAND) {
      const etype = beachEnemyTypes[i % beachEnemyTypes.length];
      const base = BASE_STATS[etype] || { maxHp: 8, hp: 8, power: 3, armor: 0, xpReward: 8 };
      enemies.push({ type: etype, x: ex, y: ey, ...base, id: Math.random() });
    }
  }

  // A chest hidden in the beach
  const chests = [{ x: 17, y: 9, opened: false, tier: 1 }];

  return { map, playerStart, enemies, chests, items: [] };
}

// ── Town Map ──────────────────────────────────

export function generateTown() {
  const W = 22, H = 16;
  // Stone/dirt roads for the town
  const map = Array.from({ length: H }, () => new Uint8Array(W).fill(TILE.GRASS));

  // Stone walls around the edges (town walls)
  for (let x = 0; x < W; x++) {
    map[0][x] = TILE.VILLAGE_WALL;
    map[H - 1][x] = TILE.VILLAGE_WALL;
  }
  for (let y = 0; y < H; y++) {
    map[y][W - 1] = TILE.VILLAGE_WALL;
  }
  // Right side exit (return to village)
  map[8][W - 1] = TILE.TOWN_ENTRANCE;

  // Main dirt road (horizontal)
  for (let x = 0; x < W - 1; x++) {
    map[8][x] = TILE.DIRT;
    map[9][x] = TILE.DIRT;
  }
  // Vertical road
  for (let y = 1; y < H - 1; y++) {
    map[y][10] = TILE.DIRT;
    map[y][11] = TILE.DIRT;
  }

  // Town buildings (huts)
  const townHuts = [[2,2],[6,2],[13,2],[18,2],[2,12],[6,12],[13,12],[18,12]];
  for (const [hx, hy] of townHuts) {
    if (map[hy] && map[hy][hx] !== undefined) map[hy][hx] = TILE.HUT;
  }

  // Town merchant
  map[5][16] = TILE.MERCHANT;
  // Town healer
  map[5][3] = TILE.HEALER;
  // Bookshelf decorations (town has a library feel)
  map[3][7] = TILE.BOOKSHELF;
  map[3][14] = TILE.BOOKSHELF;

  const playerStart = { x: W - 3, y: 8 };

  return { map, playerStart, enemies: [], chests: [], items: [] };
}

// ── Boss Cave (5 epic boss rooms) ────────────────────────────────
// Layout: entry room → 5 boss rooms connected by corridors with BOSS_DOORs
// Map: 76 wide × 16 tall
export function generateBossCave() {
  const W = 76, H = 16;
  const map = Array.from({ length: H }, () => new Uint8Array(W).fill(TILE.CAVE_WALL));

  // Helper: fill a rectangle with a tile
  function fill(x1, y1, x2, y2, tile) {
    for (let y = y1; y <= y2; y++)
      for (let x = x1; x <= x2; x++)
        if (y >= 0 && y < H && x >= 0 && x < W) map[y][x] = tile;
  }

  // Entry room (cols 1-6, rows 2-13) — player starts here, exit tile on west wall
  fill(1, 2, 6, 13, TILE.BOSS_FLOOR);
  map[7][1] = TILE.BOSS_CAVE_EXIT;  // exit back to village

  // 5 boss rooms, each 12 wide × 12 tall (interior 10×10), connected by 3-wide corridors
  const ROOM_W = 12;
  const ROOM_H = 12;
  const CORRIDOR_W = 3;
  const ROOM_Y1 = 2;
  const ROOM_Y2 = ROOM_Y1 + ROOM_H - 1; // 13
  const MID_Y = Math.floor((ROOM_Y1 + ROOM_Y2) / 2); // 7 — corridor centre row

  const bossPositions = [];
  const doorPositions = [];

  for (let i = 0; i < 5; i++) {
    const corStartX = 7 + i * (ROOM_W + CORRIDOR_W);
    const roomX1 = corStartX + CORRIDOR_W;      // room left wall
    const roomX2 = roomX1 + ROOM_W - 1;         // room right wall

    // Corridor connecting previous room (or entry) to this boss room
    fill(corStartX, MID_Y - 1, corStartX + CORRIDOR_W - 1, MID_Y + 1, TILE.BOSS_FLOOR);

    // Boss door in the middle of the corridor (initially sealed)
    const doorX = corStartX + 1;
    map[MID_Y - 1][doorX] = TILE.BOSS_DOOR;
    map[MID_Y][doorX]     = TILE.BOSS_DOOR;
    map[MID_Y + 1][doorX] = TILE.BOSS_DOOR;
    doorPositions.push({ x: doorX, yTop: MID_Y - 1, yBot: MID_Y + 1 });

    // Boss room interior
    fill(roomX1 + 1, ROOM_Y1 + 1, roomX2 - 1, ROOM_Y2 - 1, TILE.BOSS_FLOOR);

    // Boss position: centre of room
    const cx = Math.floor((roomX1 + roomX2) / 2);
    const cy = Math.floor((ROOM_Y1 + ROOM_Y2) / 2);
    bossPositions.push({ x: cx, y: cy });

    // Add some atmosphere: corner pillars
    if (roomX1 + 2 < W && ROOM_Y1 + 2 < H) map[ROOM_Y1 + 2][roomX1 + 2] = TILE.PILLAR;
    if (roomX2 - 2 >= 0 && ROOM_Y1 + 2 < H) map[ROOM_Y1 + 2][roomX2 - 2] = TILE.PILLAR;
    if (roomX1 + 2 < W && ROOM_Y2 - 2 >= 0) map[ROOM_Y2 - 2][roomX1 + 2] = TILE.PILLAR;
    if (roomX2 - 2 >= 0 && ROOM_Y2 - 2 >= 0) map[ROOM_Y2 - 2][roomX2 - 2] = TILE.PILLAR;
  }

  const playerStart = { x: 3, y: 7 };

  return { map, playerStart, bossPositions, doorPositions, mapW: W, mapH: H };
}
