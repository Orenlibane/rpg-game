import { TILE_PROPS } from './constants.js';

// Recursive shadowcasting FOV
// Each tile has: visible (currently seen), revealed (ever seen)

export function computeFOV(map, px, py, radius) {
  const h = map.length;
  const w = map[0].length;

  // Reset visibility (keep revealed)
  const vis = Array.from({ length: h }, () => new Uint8Array(w));

  // Player tile is always visible
  vis[py][px] = 1;

  // 8 octants
  for (let oct = 0; oct < 8; oct++) {
    castLight(map, vis, px, py, radius, 1, 1.0, 0.0, oct, w, h);
  }

  return vis;
}

function transformOctant(ox, oy, row, col, oct) {
  switch (oct) {
    case 0: return [ox + col, oy - row];
    case 1: return [ox + row, oy - col];
    case 2: return [ox + row, oy + col];
    case 3: return [ox + col, oy + row];
    case 4: return [ox - col, oy + row];
    case 5: return [ox - row, oy + col];
    case 6: return [ox - row, oy - col];
    case 7: return [ox - col, oy - row];
  }
}

function castLight(map, vis, ox, oy, radius, row, startSlope, endSlope, oct, w, h) {
  if (startSlope < endSlope) return;

  let nextStartSlope = startSlope;

  for (let i = row; i <= radius; i++) {
    let blocked = false;

    for (let dx = -i, dy = -i; dx <= 0; dx++) {
      const leftSlope = (dx - 0.5) / (dy + 0.5);
      const rightSlope = (dx + 0.5) / (dy - 0.5);

      if (startSlope < rightSlope) continue;
      if (endSlope > leftSlope) break;

      const [mx, my] = transformOctant(ox, oy, i, dx, oct);

      // Check bounds
      if (mx < 0 || mx >= w || my < 0 || my >= h) continue;

      // Check radius (circular)
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius) {
        vis[my][mx] = 1;
      }

      const tile = map[my][mx];
      const transparent = TILE_PROPS[tile] ? TILE_PROPS[tile].transparent : false;

      if (blocked) {
        if (!transparent) {
          nextStartSlope = rightSlope;
        } else {
          blocked = false;
          startSlope = nextStartSlope;
        }
      } else if (!transparent && i < radius) {
        blocked = true;
        castLight(map, vis, ox, oy, radius, i + 1, startSlope, rightSlope, oct, w, h);
        nextStartSlope = rightSlope;
      }
    }

    if (blocked) break;
  }
}
