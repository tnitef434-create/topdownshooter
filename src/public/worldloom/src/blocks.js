import * as THREE from '../vendor/three.module.min.js';

export const BLOCK = Object.freeze({
  AIR: 0,
  TURF: 1,
  LOAM: 2,
  STONE: 3,
  SAND: 4,
  ASH_LOG: 5,
  ASH_LEAVES: 6,
  ASH_PLANKS: 7,
  GLASS: 8,
  WATER: 9,
  COALSTONE: 10,
  COPPER_ORE: 11,
  LUMEN_CRYSTAL: 12,
  BASALT: 13,
  STONE_BRICK: 14,
  CAMP_BENCH: 15,
  KILN: 16,
  TORCH: 17,
  LAVA: 18,
  WINDOW: 19,
  FERN: 20,
  WILDFLOWER: 21,
  CACTUS: 22,
  FURNACE: 23,
  CHEST: 24,
  BED: 25,
  GLOW_MUSHROOM: 26,
  // Save-compatible alias: older worlds used the glowing name for this id.
  CAVE_MUSHROOM: 26,
  BEDROCK: 27,
  PINE_LOG: 28,
  PINE_NEEDLES: 29,
  SHORT_GRASS: 30,
  OVERGROWN_ASH_LOG: 31,
  OVERGROWN_PINE_LOG: 32,
  RED_FLOWER: 33,
});

const TILE = Object.freeze({
  AIR: 0,
  TURF_TOP: 1,
  TURF_SIDE: 2,
  LOAM: 3,
  STONE: 4,
  SAND: 5,
  ASH_LOG_TOP: 6,
  ASH_LOG_SIDE: 7,
  ASH_LEAVES: 8,
  ASH_PLANKS: 9,
  GLASS: 10,
  WATER: 11,
  COALSTONE: 12,
  COPPER_ORE: 13,
  LUMEN_CRYSTAL: 14,
  BASALT: 15,
  STONE_BRICK: 16,
  CAMP_BENCH_TOP: 17,
  CAMP_BENCH_SIDE: 18,
  KILN_TOP: 19,
  KILN_SIDE: 20,
  TORCH: 21,
  LAVA: 22,
  WINDOW: 23,
  FERN: 24,
  WILDFLOWER: 25,
  CACTUS_TOP: 26,
  CACTUS_SIDE: 27,
  FURNACE_TOP: 28,
  FURNACE_SIDE: 29,
  CHEST_TOP: 30,
  CHEST_SIDE: 31,
  BED_TOP: 32,
  BED_SIDE: 33,
  GLOW_MUSHROOM: 34,
  BEDROCK: 35,
  PINE_LOG_TOP: 36,
  PINE_LOG_SIDE: 37,
  PINE_NEEDLES: 38,
  SHORT_GRASS: 39,
  OVERGROWN_ASH_LOG_SIDE: 40,
  OVERGROWN_PINE_LOG_SIDE: 41,
  RED_FLOWER: 42,
});

const ATLAS_COLUMNS = 7;
const ATLAS_ROWS = 7;
const TILE_SIZE = 32;

function defineBlock(id, definition) {
  return Object.freeze({
    id,
    toolCategory: definition.toolCategory ?? definition.tool ?? 'none',
    tint: definition.tint ?? 0xffffff,
    ...definition,
    tiles: Object.freeze({ ...definition.tiles }),
  });
}

export const BLOCKS = Object.freeze([
  defineBlock(BLOCK.AIR, {
    name: 'Air',
    hardness: 0,
    color: 0x000000,
    tiles: { top: TILE.AIR, side: TILE.AIR, bottom: TILE.AIR },
    drop: null,
    tool: 'none',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
  }),
  defineBlock(BLOCK.TURF, {
    name: 'Meadow Turf',
    hardness: 0.55,
    color: 0x6f9b45,
    tiles: { top: TILE.TURF_TOP, side: TILE.TURF_SIDE, bottom: TILE.LOAM },
    drop: BLOCK.LOAM,
    tool: 'shovel',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.LOAM, {
    name: 'Rich Loam',
    hardness: 0.45,
    color: 0x795038,
    tiles: { top: TILE.LOAM, side: TILE.LOAM, bottom: TILE.LOAM },
    drop: BLOCK.LOAM,
    tool: 'shovel',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.STONE, {
    name: 'Waystone',
    hardness: 1.5,
    color: 0x858b8d,
    tiles: { top: TILE.STONE, side: TILE.STONE, bottom: TILE.STONE },
    drop: BLOCK.STONE,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.SAND, {
    name: 'Sunwash Sand',
    hardness: 0.5,
    color: 0xd9c884,
    tiles: { top: TILE.SAND, side: TILE.SAND, bottom: TILE.SAND },
    drop: BLOCK.SAND,
    tool: 'shovel',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.ASH_LOG, {
    name: 'Ashwood Log',
    hardness: 2,
    color: 0x8d8067,
    tiles: { top: TILE.ASH_LOG_TOP, side: TILE.ASH_LOG_SIDE, bottom: TILE.ASH_LOG_TOP },
    drop: BLOCK.ASH_LOG,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.ASH_LEAVES, {
    name: 'Ashleaf Canopy',
    hardness: 0.2,
    color: 0x4d7d51,
    tiles: { top: TILE.ASH_LEAVES, side: TILE.ASH_LEAVES, bottom: TILE.ASH_LEAVES },
    drop: BLOCK.ASH_LEAVES,
    tool: 'shears',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    alphaTest: 0.35,
  }),
  defineBlock(BLOCK.ASH_PLANKS, {
    name: 'Wooden Planks',
    description: 'Planed building boards crafted from either ash or highland pine.',
    hardness: 2,
    color: 0xb39b70,
    tiles: { top: TILE.ASH_PLANKS, side: TILE.ASH_PLANKS, bottom: TILE.ASH_PLANKS },
    drop: BLOCK.ASH_PLANKS,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.GLASS, {
    name: 'Riverglass',
    hardness: 0.3,
    color: 0x9bd5df,
    tiles: { top: TILE.GLASS, side: TILE.GLASS, bottom: TILE.GLASS },
    drop: BLOCK.GLASS,
    tool: 'pickaxe',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    opacity: 0.48,
  }),
  defineBlock(BLOCK.WATER, {
    name: 'Spring Water',
    hardness: 0,
    color: 0x438cc7,
    tiles: { top: TILE.WATER, side: TILE.WATER, bottom: TILE.WATER },
    drop: null,
    tool: 'bucket',
    opaque: false,
    transparent: true,
    emissive: 0x06182a,
    solid: false,
    liquid: true,
    opacity: 0.72,
  }),
  defineBlock(BLOCK.COALSTONE, {
    name: 'Coalstone',
    hardness: 2.8,
    color: 0x4c4c4b,
    tiles: { top: TILE.COALSTONE, side: TILE.COALSTONE, bottom: TILE.COALSTONE },
    drop: BLOCK.COALSTONE,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.COPPER_ORE, {
    name: 'Verdant Copper Ore',
    hardness: 3,
    color: 0xa66c4b,
    tiles: { top: TILE.COPPER_ORE, side: TILE.COPPER_ORE, bottom: TILE.COPPER_ORE },
    drop: BLOCK.COPPER_ORE,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.LUMEN_CRYSTAL, {
    name: 'Lumen Crystal',
    hardness: 2.2,
    color: 0x8fffe8,
    tiles: { top: TILE.LUMEN_CRYSTAL, side: TILE.LUMEN_CRYSTAL, bottom: TILE.LUMEN_CRYSTAL },
    drop: BLOCK.LUMEN_CRYSTAL,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x65ffe1,
    emissiveIntensity: 1.7,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.BASALT, {
    name: 'Night Basalt',
    hardness: 3.5,
    color: 0x36383f,
    tiles: { top: TILE.BASALT, side: TILE.BASALT, bottom: TILE.BASALT },
    drop: BLOCK.BASALT,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.STONE_BRICK, {
    name: 'Waystone Brick',
    hardness: 2.1,
    color: 0x7b8385,
    tiles: { top: TILE.STONE_BRICK, side: TILE.STONE_BRICK, bottom: TILE.STONE_BRICK },
    drop: BLOCK.STONE_BRICK,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.CAMP_BENCH, {
    name: 'Trail Bench',
    hardness: 1.6,
    color: 0x98734f,
    tiles: { top: TILE.CAMP_BENCH_TOP, side: TILE.CAMP_BENCH_SIDE, bottom: TILE.ASH_PLANKS },
    drop: BLOCK.CAMP_BENCH,
    tool: 'axe',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    alphaTest: 0.35,
  }),
  defineBlock(BLOCK.KILN, {
    name: 'Field Kiln',
    hardness: 3.2,
    color: 0x625b56,
    tiles: { top: TILE.KILN_TOP, side: TILE.KILN_SIDE, bottom: TILE.BASALT },
    drop: BLOCK.KILN,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x251006,
    emissiveIntensity: 0.3,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.TORCH, {
    name: 'Glowwick Torch',
    hardness: 0.05,
    color: 0xffc56a,
    tiles: { top: TILE.TORCH, side: TILE.TORCH, bottom: TILE.TORCH },
    drop: BLOCK.TORCH,
    tool: 'none',
    opaque: false,
    transparent: true,
    emissive: 0xff9d45,
    emissiveIntensity: 2.2,
    solid: false,
    liquid: false,
    alphaTest: 0.2,
    shape: 'cross',
  }),
  defineBlock(BLOCK.LAVA, {
    name: 'Deep Lava',
    description: 'Molten rock pooled in the deepest caverns. It burns on contact.',
    hardness: 0,
    color: 0xff6a1f,
    tiles: { top: TILE.LAVA, side: TILE.LAVA, bottom: TILE.LAVA },
    drop: null,
    tool: 'bucket',
    opaque: false,
    transparent: false,
    emissive: 0xff4717,
    emissiveIntensity: 2.5,
    solid: false,
    liquid: false,
    hazard: 'lava',
  }),
  defineBlock(BLOCK.WINDOW, {
    name: 'Framed Window',
    description: 'Clear riverglass held in a warm ashwood frame.',
    hardness: 0.42,
    color: 0xc4edf0,
    tiles: { top: TILE.WINDOW, side: TILE.WINDOW, bottom: TILE.WINDOW },
    drop: BLOCK.WINDOW,
    tool: 'pickaxe',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    opacity: 0.62,
  }),
  defineBlock(BLOCK.FERN, {
    name: 'Feather Fern',
    description: 'A layered woodland fern that bends with the breeze.',
    hardness: 0.08,
    color: 0x4e9a55,
    tiles: { top: TILE.FERN, side: TILE.FERN, bottom: TILE.FERN },
    drop: BLOCK.FERN,
    tool: 'hand',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
    alphaTest: 0.24,
    shape: 'cross',
  }),
  defineBlock(BLOCK.WILDFLOWER, {
    name: 'Sunpetal',
    description: 'A small meadow flower with many wind-tossed petals.',
    hardness: 0.06,
    color: 0xf1cf69,
    tiles: { top: TILE.WILDFLOWER, side: TILE.WILDFLOWER, bottom: TILE.WILDFLOWER },
    drop: BLOCK.WILDFLOWER,
    tool: 'hand',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
    alphaTest: 0.2,
    shape: 'cross',
  }),
  defineBlock(BLOCK.CACTUS, {
    name: 'Ribbed Cactus',
    description: 'A water-storing desert plant with pale protective spines.',
    hardness: 0.65,
    color: 0x4d9854,
    tiles: { top: TILE.CACTUS_TOP, side: TILE.CACTUS_SIDE, bottom: TILE.CACTUS_TOP },
    drop: BLOCK.CACTUS,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.FURNACE, {
    name: 'Hearth Furnace',
    description: 'A proper stone furnace for smelting ore and cooking meat.',
    hardness: 3.1,
    color: 0x69645e,
    tiles: { top: TILE.FURNACE_TOP, side: TILE.FURNACE_SIDE, bottom: TILE.BASALT },
    drop: BLOCK.FURNACE,
    tool: 'pickaxe',
    opaque: true,
    transparent: false,
    emissive: 0x321309,
    emissiveIntensity: 0.42,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.CHEST, {
    name: 'Ashwood Chest',
    description: 'A sturdy lidded chest for a lived-in homestead.',
    hardness: 1.8,
    color: 0xa57443,
    tiles: { top: TILE.CHEST_TOP, side: TILE.CHEST_SIDE, bottom: TILE.ASH_PLANKS },
    drop: BLOCK.CHEST,
    tool: 'axe',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    shape: 'slab-high',
  }),
  defineBlock(BLOCK.BED, {
    name: 'Wayfarer Bed',
    description: 'A soft wool bed over a low ashwood frame.',
    hardness: 0.8,
    color: 0xb75345,
    tiles: { top: TILE.BED_TOP, side: TILE.BED_SIDE, bottom: TILE.ASH_PLANKS },
    drop: BLOCK.BED,
    tool: 'axe',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    shape: 'slab',
  }),
  defineBlock(BLOCK.GLOW_MUSHROOM, {
    name: 'Cave Button Mushroom',
    description: 'A small, earthy mushroom that grows on naturally damp cave floors.',
    hardness: 0.05,
    color: 0x9a7654,
    tiles: { top: TILE.GLOW_MUSHROOM, side: TILE.GLOW_MUSHROOM, bottom: TILE.GLOW_MUSHROOM },
    drop: BLOCK.GLOW_MUSHROOM,
    tool: 'hand',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
    alphaTest: 0.18,
    shape: 'cross-short',
  }),
  defineBlock(BLOCK.BEDROCK, {
    name: 'Worldroot Bedrock',
    description: 'The unbreakable foundation beneath the woven world.',
    hardness: Number.POSITIVE_INFINITY,
    color: 0x25292d,
    tiles: { top: TILE.BEDROCK, side: TILE.BEDROCK, bottom: TILE.BEDROCK },
    drop: null,
    tool: 'none',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    unbreakable: true,
  }),
  defineBlock(BLOCK.PINE_LOG, {
    name: 'Highland Pine Log',
    description: 'A resinous, reddish trunk from the highland pine.',
    hardness: 2.15,
    color: 0x74513b,
    tiles: { top: TILE.PINE_LOG_TOP, side: TILE.PINE_LOG_SIDE, bottom: TILE.PINE_LOG_TOP },
    drop: BLOCK.PINE_LOG,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.PINE_NEEDLES, {
    name: 'Highland Pine Needles',
    description: 'Dense evergreen boughs with fine, blue-green needles.',
    hardness: 0.18,
    color: 0x315e47,
    tiles: { top: TILE.PINE_NEEDLES, side: TILE.PINE_NEEDLES, bottom: TILE.PINE_NEEDLES },
    drop: BLOCK.PINE_NEEDLES,
    tool: 'shears',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: true,
    liquid: false,
    alphaTest: 0.42,
  }),
  defineBlock(BLOCK.SHORT_GRASS, {
    name: 'Meadow Shortgrass',
    description: 'Soft native grass growing in loose, walk-through patches.',
    hardness: 0.02,
    color: 0x6d9f4d,
    tiles: { top: TILE.SHORT_GRASS, side: TILE.SHORT_GRASS, bottom: TILE.SHORT_GRASS },
    drop: null,
    tool: 'hand',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
    selectable: false,
    alphaTest: 0.28,
    shape: 'grass-tuft',
  }),
  defineBlock(BLOCK.OVERGROWN_ASH_LOG, {
    name: 'Ivy-Grown Ash Log',
    description: 'An old ash trunk wrapped in flat, pixel-cut ivy growth.',
    hardness: 2,
    color: 0x65745a,
    tiles: { top: TILE.ASH_LOG_TOP, side: TILE.OVERGROWN_ASH_LOG_SIDE, bottom: TILE.ASH_LOG_TOP },
    drop: BLOCK.ASH_LOG,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.OVERGROWN_PINE_LOG, {
    name: 'Moss-Grown Pine Log',
    description: 'A highland pine trunk with needles and moss growing into its bark.',
    hardness: 2.15,
    color: 0x586048,
    tiles: { top: TILE.PINE_LOG_TOP, side: TILE.OVERGROWN_PINE_LOG_SIDE, bottom: TILE.PINE_LOG_TOP },
    drop: BLOCK.PINE_LOG,
    tool: 'axe',
    opaque: true,
    transparent: false,
    emissive: 0x000000,
    solid: true,
    liquid: false,
  }),
  defineBlock(BLOCK.RED_FLOWER, {
    name: 'Emberpetal',
    description: 'A rare voxel poppy sculpted by hand, glowing red in the meadow.',
    hardness: 0.06,
    color: 0xd72626,
    tiles: { top: TILE.RED_FLOWER, side: TILE.RED_FLOWER, bottom: TILE.RED_FLOWER },
    drop: BLOCK.RED_FLOWER,
    tool: 'hand',
    opaque: false,
    transparent: true,
    emissive: 0x000000,
    solid: false,
    liquid: false,
    alphaTest: 0.2,
    shape: 'prop',
  }),
]);

export const HOTBAR_BLOCKS = Object.freeze([
  BLOCK.TURF,
  BLOCK.STONE,
  BLOCK.ASH_PLANKS,
  BLOCK.GLASS,
  BLOCK.WATER,
  BLOCK.STONE_BRICK,
  BLOCK.LUMEN_CRYSTAL,
  BLOCK.KILN,
  BLOCK.TORCH,
  BLOCK.WINDOW,
  BLOCK.CACTUS,
  BLOCK.FURNACE,
  BLOCK.CHEST,
  BLOCK.BED,
]);

export function isSolid(blockId) {
  return Boolean(BLOCKS[blockId]?.solid);
}

export function isTransparent(blockId) {
  return Boolean(BLOCKS[blockId]?.transparent);
}

export function isLiquid(blockId) {
  return Boolean(BLOCKS[blockId]?.liquid);
}

export function isHazard(blockId) {
  return Boolean(BLOCKS[blockId]?.hazard);
}

export function blockShapeHeight(blockId) {
  const shape = BLOCKS[blockId]?.shape;
  if (shape === 'slab') return 0.46;
  if (shape === 'slab-high') return 0.78;
  if (shape === 'cross-short') return 0.54;
  if (shape === 'grass-tuft') return 0.3;
  if (shape === 'prop') return 1;
  return 1;
}

function tileRandom(seed) {
  let state = (seed * 0x9e3779b9 + 0x6d2b79f5) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x100000000;
  };
}

function rect(context, color, x, y, width, height) {
  context.fillStyle = color;
  context.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
}

function scatter(context, random, colors, count, minSize = 1, maxSize = 3) {
  for (let index = 0; index < count; index += 1) {
    const size = Math.floor(minSize + random() * (maxSize - minSize + 1));
    const x = Math.floor(random() * (TILE_SIZE - size + 1));
    const y = Math.floor(random() * (TILE_SIZE - size + 1));
    rect(context, colors[Math.floor(random() * colors.length)], x, y, size, size);
  }
}

function paintTile(context, index, painter) {
  const column = index % ATLAS_COLUMNS;
  const row = Math.floor(index / ATLAS_COLUMNS);
  context.save();
  context.translate(column * TILE_SIZE, row * TILE_SIZE);
  painter(context, tileRandom(index + 17));
  context.restore();
}

function paintAtlas(context) {
  paintTile(context, TILE.TURF_TOP, (tile, random) => {
    rect(tile, '#6f9b45', 0, 0, 32, 32);
    scatter(tile, random, ['#83ad4d', '#527c3d', '#9bbb55', '#456f3a'], 58, 1, 3);
    scatter(tile, random, ['#d8c75c', '#bed58e'], 7, 1, 1);
  });

  paintTile(context, TILE.TURF_SIDE, (tile, random) => {
    rect(tile, '#76503a', 0, 0, 32, 32);
    scatter(tile, random, ['#8b6041', '#5e3f32', '#9d6d48'], 38, 1, 3);
    rect(tile, '#648e43', 0, 0, 32, 7);
    scatter(tile, random, ['#83ad4d', '#4c743b'], 18, 1, 3);
    for (let x = 0; x < 32; x += 4) {
      rect(tile, random() > 0.4 ? '#648e43' : '#7ba24a', x, 6, 2 + random() * 3, 2 + random() * 4);
    }
  });

  paintTile(context, TILE.LOAM, (tile, random) => {
    rect(tile, '#79503a', 0, 0, 32, 32);
    scatter(tile, random, ['#936245', '#5c3c30', '#a27250', '#684332'], 60, 1, 3);
  });

  paintTile(context, TILE.STONE, (tile, random) => {
    rect(tile, '#858b8d', 0, 0, 32, 32);
    scatter(tile, random, ['#9aa0a0', '#6c7376', '#777e80', '#a8abab'], 55, 1, 4);
    rect(tile, '#666d70', 4, 23, 8, 2);
    rect(tile, '#9aa0a0', 20, 7, 7, 2);
  });

  paintTile(context, TILE.SAND, (tile, random) => {
    rect(tile, '#d9c884', 0, 0, 32, 32);
    scatter(tile, random, ['#e9da9b', '#c3ae6d', '#bda76c', '#f0dfa0'], 64, 1, 2);
  });

  paintTile(context, TILE.ASH_LOG_TOP, (tile, random) => {
    rect(tile, '#8e8067', 0, 0, 32, 32);
    rect(tile, '#5e584d', 2, 2, 28, 28);
    rect(tile, '#a39375', 4, 4, 24, 24);
    rect(tile, '#756b59', 7, 7, 18, 18);
    rect(tile, '#b4a281', 10, 10, 12, 12);
    rect(tile, '#665d50', 13, 13, 6, 6);
    scatter(tile, random, ['#81745f', '#c2b08c'], 12, 1, 2);
  });

  paintTile(context, TILE.ASH_LOG_SIDE, (tile, random) => {
    rect(tile, '#756d5d', 0, 0, 32, 32);
    for (let x = 0; x < 32; x += 4) {
      rect(tile, random() > 0.45 ? '#91836a' : '#5d584e', x, 0, 2 + random() * 3, 32);
    }
    scatter(tile, random, ['#b09f80', '#4d4b45'], 22, 1, 4);
  });

  paintTile(context, TILE.ASH_LEAVES, (tile, random) => {
    rect(tile, '#4d7d51', 0, 0, 32, 32);
    scatter(tile, random, ['#6b9860', '#345f47', '#82a969', '#416e4c'], 80, 1, 4);
    for (let hole = 0; hole < 16; hole += 1) {
      const size = random() > 0.7 ? 2 : 1;
      tile.clearRect(Math.floor(random() * 31), Math.floor(random() * 31), size, size);
    }
  });

  paintTile(context, TILE.ASH_PLANKS, (tile, random) => {
    rect(tile, '#ad956d', 0, 0, 32, 32);
    for (let y = 0; y < 32; y += 8) {
      rect(tile, '#6e604e', 0, y, 32, 1);
      const seam = y % 16 === 0 ? 10 : 23;
      rect(tile, '#6e604e', seam, y, 1, 8);
    }
    scatter(tile, random, ['#c1aa7d', '#8f795d', '#755f4b'], 34, 1, 3);
    rect(tile, '#4d4b45', 9, 2, 1, 1);
    rect(tile, '#4d4b45', 22, 18, 1, 1);
  });

  paintTile(context, TILE.GLASS, (tile) => {
    rect(tile, 'rgba(111, 193, 212, 0.18)', 0, 0, 32, 32);
    rect(tile, 'rgba(197, 240, 244, 0.85)', 0, 0, 32, 2);
    rect(tile, 'rgba(197, 240, 244, 0.85)', 0, 30, 32, 2);
    rect(tile, 'rgba(176, 224, 232, 0.75)', 0, 0, 2, 32);
    rect(tile, 'rgba(176, 224, 232, 0.75)', 30, 0, 2, 32);
    rect(tile, 'rgba(238, 255, 255, 0.88)', 5, 5, 9, 2);
    rect(tile, 'rgba(238, 255, 255, 0.72)', 5, 7, 2, 8);
    rect(tile, 'rgba(125, 202, 219, 0.6)', 22, 20, 5, 1);
  });

  paintTile(context, TILE.WATER, (tile, random) => {
    rect(tile, 'rgba(46, 126, 184, 0.76)', 0, 0, 32, 32);
    scatter(tile, random, ['rgba(74, 158, 205, 0.8)', 'rgba(31, 103, 164, 0.7)'], 28, 1, 3);
    for (let y = 4; y < 32; y += 7) {
      const offset = (y * 3) % 11;
      rect(tile, 'rgba(155, 216, 231, 0.68)', offset, y, 9, 1);
      rect(tile, 'rgba(155, 216, 231, 0.52)', (offset + 17) % 27, y + 2, 6, 1);
    }
  });

  paintTile(context, TILE.COALSTONE, (tile, random) => {
    rect(tile, '#757a7b', 0, 0, 32, 32);
    scatter(tile, random, ['#888e8f', '#646a6c'], 34, 1, 3);
    scatter(tile, random, ['#24272a', '#333638', '#151719'], 25, 2, 5);
  });

  paintTile(context, TILE.COPPER_ORE, (tile, random) => {
    rect(tile, '#7f8586', 0, 0, 32, 32);
    scatter(tile, random, ['#969b9b', '#686f71'], 35, 1, 3);
    scatter(tile, random, ['#bd7148', '#de8d55', '#7d9b78', '#62aa98'], 28, 2, 4);
  });

  paintTile(context, TILE.LUMEN_CRYSTAL, (tile, random) => {
    rect(tile, '#174d51', 0, 0, 32, 32);
    scatter(tile, random, ['#236b68', '#102f38', '#2d7772'], 32, 1, 3);
    rect(tile, '#65ffe1', 14, 3, 4, 23);
    rect(tile, '#b7fff3', 15, 5, 2, 15);
    rect(tile, '#49cdbd', 7, 12, 5, 15);
    rect(tile, '#91ffeb', 22, 8, 4, 18);
    rect(tile, '#d7fff8', 23, 10, 1, 10);
  });

  paintTile(context, TILE.BASALT, (tile, random) => {
    rect(tile, '#34363d', 0, 0, 32, 32);
    scatter(tile, random, ['#454850', '#282a31', '#53545b'], 50, 1, 4);
    rect(tile, '#202229', 6, 0, 2, 15);
    rect(tile, '#202229', 21, 16, 2, 16);
  });

  paintTile(context, TILE.STONE_BRICK, (tile, random) => {
    rect(tile, '#747b7d', 0, 0, 32, 32);
    for (let y = 0; y < 32; y += 8) {
      rect(tile, '#41484b', 0, y, 32, 2);
      const seam = y % 16 === 0 ? 16 : 8;
      rect(tile, '#41484b', seam, y, 2, 8);
      if (y % 16 !== 0) rect(tile, '#41484b', 24, y, 2, 8);
    }
    scatter(tile, random, ['#899092', '#626a6c'], 30, 1, 2);
  });

  paintTile(context, TILE.CAMP_BENCH_TOP, (tile, random) => {
    rect(tile, '#9a744e', 0, 0, 32, 32);
    rect(tile, '#5b4638', 0, 10, 32, 2);
    rect(tile, '#5b4638', 0, 21, 32, 2);
    scatter(tile, random, ['#bc9060', '#7c5c43'], 34, 1, 3);
    rect(tile, '#34383a', 3, 3, 2, 2);
    rect(tile, '#34383a', 27, 27, 2, 2);
  });

  paintTile(context, TILE.CAMP_BENCH_SIDE, (tile, random) => {
    rect(tile, '#9a744e', 0, 5, 32, 8);
    rect(tile, '#5b4638', 0, 11, 32, 2);
    rect(tile, '#71543d', 4, 13, 5, 17);
    rect(tile, '#71543d', 23, 13, 5, 17);
    scatter(tile, random, ['#bd8d5e', '#694b39'], 14, 1, 3);
    rect(tile, '#323538', 3, 7, 2, 2);
    rect(tile, '#323538', 27, 7, 2, 2);
  });

  paintTile(context, TILE.KILN_TOP, (tile, random) => {
    rect(tile, '#5f5a56', 0, 0, 32, 32);
    scatter(tile, random, ['#77716b', '#494642'], 35, 1, 3);
    rect(tile, '#2c2c2b', 7, 7, 18, 18);
    rect(tile, '#171819', 10, 10, 12, 12);
    rect(tile, '#8a5e3e', 13, 13, 6, 6);
  });

  paintTile(context, TILE.KILN_SIDE, (tile, random) => {
    rect(tile, '#625b56', 0, 0, 32, 32);
    for (let y = 0; y < 32; y += 8) {
      rect(tile, '#3f3c3a', 0, y, 32, 2);
      rect(tile, '#3f3c3a', y % 16 === 0 ? 15 : 7, y, 2, 8);
    }
    scatter(tile, random, ['#78706a', '#4d4946'], 20, 1, 2);
    rect(tile, '#242424', 8, 14, 16, 12);
    rect(tile, '#5a2c17', 11, 18, 10, 6);
    rect(tile, '#c06a2e', 13, 20, 6, 4);
  });

  paintTile(context, TILE.TORCH, (tile) => {
    rect(tile, '#725136', 14, 12, 4, 19);
    rect(tile, '#b6844f', 15, 13, 2, 17);
    rect(tile, '#e7652f', 11, 5, 10, 10);
    rect(tile, '#ffad43', 13, 3, 7, 11);
    rect(tile, '#fff09a', 15, 6, 3, 6);
    rect(tile, 'rgba(255, 194, 72, 0.55)', 10, 8, 2, 5);
    rect(tile, 'rgba(255, 194, 72, 0.4)', 20, 7, 2, 5);
  });

  paintTile(context, TILE.LAVA, (tile, random) => {
    rect(tile, '#c93314', 0, 0, 32, 32);
    scatter(tile, random, ['#f15a1a', '#ff8b20', '#9d2417', '#ffbd37'], 82, 1, 4);
    for (let y = 3; y < 32; y += 8) {
      rect(tile, '#ffd35a', (y * 5) % 17, y, 12, 2);
      rect(tile, '#ff701c', (y * 3 + 9) % 23, y + 2, 8, 1);
    }
  });

  paintTile(context, TILE.WINDOW, (tile) => {
    rect(tile, 'rgba(105, 188, 207, 0.16)', 0, 0, 32, 32);
    rect(tile, '#7a5d43', 0, 0, 32, 4);
    rect(tile, '#5a4537', 0, 28, 32, 4);
    rect(tile, '#7a5d43', 0, 0, 4, 32);
    rect(tile, '#5a4537', 28, 0, 4, 32);
    rect(tile, 'rgba(218, 251, 255, 0.82)', 6, 6, 10, 2);
    rect(tile, 'rgba(218, 251, 255, 0.62)', 6, 8, 2, 8);
    rect(tile, 'rgba(99, 177, 195, 0.6)', 22, 21, 5, 1);
  });

  paintTile(context, TILE.FERN, (tile, random) => {
    tile.clearRect(0, 0, 32, 32);
    rect(tile, '#375e35', 15, 9, 2, 23);
    for (let y = 10; y < 30; y += 4) {
      const width = Math.max(4, 14 - Math.abs(20 - y) * 0.45);
      rect(tile, '#4d8d49', 16 - width, y, width, 2);
      rect(tile, '#67a95a', 16, y + 1, width, 2);
      for (let x = 0; x < width; x += 4) {
        rect(tile, random() > 0.45 ? '#75b662' : '#3f7a42', 15 - x, y - 2, 3, 3);
        rect(tile, random() > 0.45 ? '#75b662' : '#3f7a42', 17 + x, y + 1, 3, 3);
      }
    }
    rect(tile, '#8dc571', 15, 6, 2, 6);
  });

  paintTile(context, TILE.WILDFLOWER, (tile) => {
    tile.clearRect(0, 0, 32, 32);
    rect(tile, '#438243', 15, 11, 2, 21);
    rect(tile, '#5b9d4b', 11, 21, 5, 3);
    rect(tile, '#5b9d4b', 17, 17, 6, 3);
    const petals = [[12, 7], [16, 5], [20, 8], [19, 12], [13, 12], [9, 10]];
    petals.forEach(([x, y], index) => rect(tile, index % 2 ? '#f6d76d' : '#fff0a1', x, y, 5, 5));
    rect(tile, '#9b6a2c', 15, 9, 5, 5);
    rect(tile, '#e5a83c', 16, 10, 3, 3);
  });
  paintTile(context, TILE.RED_FLOWER, (tile) => {
    tile.clearRect(0, 0, 32, 32);
    rect(tile, '#2d5f2d', 15, 12, 2, 20);
    rect(tile, '#3f8140', 10, 22, 5, 3);
    rect(tile, '#67a84a', 17, 18, 6, 3);
    const petals = [[11, 6], [16, 4], [21, 7], [20, 12], [12, 12], [8, 9]];
    petals.forEach(([x, y], index) => rect(tile, index % 2 ? '#e02525' : '#ff5643', x, y, 5, 5));
    rect(tile, '#7a1414', 15, 9, 5, 5);
    rect(tile, '#ffd700', 16, 10, 3, 3);
  });

  paintTile(context, TILE.CACTUS_TOP, (tile, random) => {
    rect(tile, '#4e9b58', 0, 0, 32, 32);
    rect(tile, '#2d6f42', 3, 3, 26, 26);
    rect(tile, '#62ad5e', 7, 7, 18, 18);
    scatter(tile, random, ['#cde0a2', '#e8e6ba'], 15, 1, 1);
  });

  paintTile(context, TILE.CACTUS_SIDE, (tile, random) => {
    rect(tile, '#43894e', 0, 0, 32, 32);
    for (let x = 1; x < 32; x += 6) {
      rect(tile, '#2f7042', x, 0, 2, 32);
      rect(tile, '#63aa59', x + 2, 0, 2, 32);
    }
    scatter(tile, random, ['#d9dfb0', '#f1e9c2'], 22, 1, 1);
  });

  paintTile(context, TILE.FURNACE_TOP, (tile, random) => {
    rect(tile, '#66625d', 0, 0, 32, 32);
    scatter(tile, random, ['#7e7972', '#4c4a47'], 42, 1, 3);
    rect(tile, '#252625', 7, 7, 18, 18);
    rect(tile, '#111414', 10, 10, 12, 12);
  });

  paintTile(context, TILE.FURNACE_SIDE, (tile, random) => {
    rect(tile, '#69645e', 0, 0, 32, 32);
    for (let y = 0; y < 32; y += 8) {
      rect(tile, '#44413e', 0, y, 32, 2);
      rect(tile, '#44413e', y % 16 === 0 ? 15 : 7, y, 2, 8);
    }
    scatter(tile, random, ['#827b73', '#57524e'], 20, 1, 2);
    rect(tile, '#1d1d1c', 6, 14, 20, 14);
    rect(tile, '#772c15', 9, 18, 14, 7);
    rect(tile, '#f06a1d', 11, 19, 10, 5);
    rect(tile, '#ffc04c', 14, 18, 4, 5);
  });

  paintTile(context, TILE.CHEST_TOP, (tile, random) => {
    rect(tile, '#a87643', 0, 0, 32, 32);
    for (let y = 3; y < 32; y += 8) rect(tile, '#78502f', 0, y, 32, 2);
    scatter(tile, random, ['#bd8b52', '#8b5c35'], 20, 1, 3);
    rect(tile, '#d1b36c', 14, 13, 4, 6);
  });

  paintTile(context, TILE.CHEST_SIDE, (tile, random) => {
    rect(tile, '#9b693d', 0, 0, 32, 32);
    rect(tile, '#5a3c2c', 0, 8, 32, 3);
    rect(tile, '#5a3c2c', 0, 27, 32, 3);
    rect(tile, '#5a3c2c', 3, 0, 3, 32);
    rect(tile, '#5a3c2c', 26, 0, 3, 32);
    scatter(tile, random, ['#b67e46', '#7d502f'], 25, 1, 3);
    rect(tile, '#e0be69', 13, 8, 7, 8);
    rect(tile, '#6e512f', 15, 11, 3, 3);
  });

  paintTile(context, TILE.BED_TOP, (tile, random) => {
    rect(tile, '#b74f43', 0, 0, 32, 32);
    rect(tile, '#f0e5cf', 1, 1, 30, 9);
    rect(tile, '#d8c8ae', 3, 7, 26, 3);
    scatter(tile, random, ['#ce6658', '#983f39', '#e17a67'], 34, 1, 3);
  });

  paintTile(context, TILE.BED_SIDE, (tile) => {
    rect(tile, '#70523d', 0, 20, 32, 10);
    rect(tile, '#9b6541', 0, 18, 32, 5);
    rect(tile, '#b74f43', 0, 5, 32, 14);
    rect(tile, '#e6d9c2', 0, 5, 10, 14);
    rect(tile, '#4a3a31', 2, 29, 4, 3);
    rect(tile, '#4a3a31', 26, 29, 4, 3);
  });

  paintTile(context, TILE.GLOW_MUSHROOM, (tile, random) => {
    tile.clearRect(0, 0, 32, 32);
    rect(tile, '#725844', 9, 21, 3, 11);
    rect(tile, '#866a51', 21, 23, 2, 9);
    rect(tile, '#8f6745', 4, 15, 13, 8);
    rect(tile, '#b89062', 7, 13, 8, 5);
    rect(tile, '#775238', 17, 19, 10, 7);
    rect(tile, '#a77d52', 19, 17, 7, 5);
    scatter(tile, random, ['#5c4232', '#d0aa78', '#6d4a35'], 11, 1, 2);
  });

  paintTile(context, TILE.BEDROCK, (tile, random) => {
    rect(tile, '#25292d', 0, 0, TILE_SIZE, TILE_SIZE);
    scatter(tile, random, ['#171a1d', '#30363a', '#3b4145'], 72, 1, 4);
    for (let index = 0; index < 7; index++) {
      const x = Math.floor(random() * TILE_SIZE);
      const y = Math.floor(random() * TILE_SIZE);
      rect(tile, '#111416', x, y, 1 + random() * 5, 1);
      rect(tile, '#3c4246', x, y + 1, 1 + random() * 3, 1);
    }
  });

  paintTile(context, TILE.PINE_LOG_TOP, (tile, random) => {
    rect(tile, '#8c6447', 0, 0, 32, 32);
    for (let inset = 3; inset <= 12; inset += 3) {
      tile.strokeStyle = inset % 2 ? '#5c3e30' : '#b08056';
      tile.lineWidth = 1;
      tile.strokeRect(inset, inset, 32 - inset * 2, 32 - inset * 2);
    }
    scatter(tile, random, ['#4c342a', '#c09262'], 14, 1, 2);
  });

  paintTile(context, TILE.PINE_LOG_SIDE, (tile, random) => {
    rect(tile, '#6e4b39', 0, 0, 32, 32);
    for (let x = 1; x < 32; x += 5) {
      rect(tile, random() > 0.45 ? '#8c6043' : '#50382f', x, 0, 2 + random() * 2, 32);
    }
    scatter(tile, random, ['#a0734e', '#49342b', '#76513b'], 28, 1, 4);
  });

  paintTile(context, TILE.PINE_NEEDLES, (tile, random) => {
    tile.clearRect(0, 0, 32, 32);
    rect(tile, '#315e47', 0, 0, 32, 32);
    for (let index = 0; index < 62; index++) {
      const x = Math.floor(random() * 32);
      const y = Math.floor(random() * 32);
      const length = 2 + Math.floor(random() * 5);
      rect(tile, random() > 0.45 ? '#47785b' : '#244b3b', x, y, 1, length);
      if (random() > 0.76) tile.clearRect(x, y, 1, 1);
    }
    scatter(tile, random, ['#5a8968', '#1e3d32'], 22, 1, 2);
  });

  paintTile(context, TILE.SHORT_GRASS, (tile, random) => {
    tile.clearRect(0, 0, 32, 32);
    const colors = ['#527f3c', '#6b9c48', '#83ad55', '#426f39'];
    for (let blade = 0; blade < 25; blade++) {
      const x = 2 + Math.floor(random() * 28);
      const height = 8 + Math.floor(random() * 15);
      const width = random() > 0.82 ? 2 : 1;
      rect(tile, colors[Math.floor(random() * colors.length)], x, 31 - height, width, height);
      if (random() > 0.5) rect(tile, '#9abb65', x, 31 - height, 1, 3);
    }
  });

  paintTile(context, TILE.OVERGROWN_ASH_LOG_SIDE, (tile, random) => {
    rect(tile, '#756d5d', 0, 0, 32, 32);
    for (let x = 1; x < 32; x += 5) {
      rect(tile, random() > 0.45 ? '#91836a' : '#5d584e', x, 0, 2 + random() * 3, 32);
    }
    scatter(tile, random, ['#b09f80', '#4d4b45'], 16, 1, 3);
    // Flat ivy is painted into the bark tile: it changes the surface without
    // adding collision or leaf cubes around the trunk silhouette.
    const vineColumns = [3, 15, 25];
    for (const [index, x] of vineColumns.entries()) {
      const startY = 2 + Math.floor(random() * 7);
      rect(tile, index === 1 ? '#315b36' : '#3e6f3f', x, startY, 2, 30 - startY);
      for (let y = startY + 2; y < 31; y += 5 + Math.floor(random() * 3)) {
        const left = (index + y) % 2 === 0;
        rect(tile, '#4f8748', x + (left ? -3 : 2), y, 4, 3);
        rect(tile, '#6a9b55', x + (left ? -2 : 3), y, 2, 2);
      }
    }
    scatter(tile, random, ['#315e3a', '#5b914f', '#7aa65d'], 22, 1, 3);
  });

  paintTile(context, TILE.OVERGROWN_PINE_LOG_SIDE, (tile, random) => {
    rect(tile, '#6e4b39', 0, 0, 32, 32);
    for (let x = 1; x < 32; x += 5) {
      rect(tile, random() > 0.45 ? '#8c6043' : '#50382f', x, 0, 2 + random() * 2, 32);
    }
    scatter(tile, random, ['#a0734e', '#49342b'], 18, 1, 3);
    for (let y = 2; y < 31; y += 4) {
      const x = 4 + ((y * 7) % 22);
      rect(tile, '#244b3b', x, y, 2, Math.min(8, 32 - y));
      rect(tile, '#47785b', Math.max(0, x - 4), y + 2, 6, 2);
      rect(tile, '#5a8968', x + 2, Math.min(31, y + 4), 4, 2);
    }
    scatter(tile, random, ['#315e47', '#6b9368', '#1e3d32'], 25, 1, 3);
  });
}

function createCanvas(width, height) {
  if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  if (typeof OffscreenCanvas !== 'undefined') {
    return new OffscreenCanvas(width, height);
  }

  throw new Error('createTextureAtlas() requires a browser canvas implementation.');
}

export function createTextureAtlas() {
  const width = ATLAS_COLUMNS * TILE_SIZE;
  const height = ATLAS_ROWS * TILE_SIZE;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d', { alpha: true });

  if (!context) {
    throw new Error('Unable to create a 2D context for the block texture atlas.');
  }

  context.imageSmoothingEnabled = false;
  context.clearRect(0, 0, width, height);
  paintAtlas(context);

  const texture = new THREE.CanvasTexture(canvas);
  texture.name = 'Worldloom procedural block atlas';
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.anisotropy = 1;
  if (THREE.SRGBColorSpace) texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  // Square atlas: this half-texel inset is valid for both U and V coordinates.
  const uvInset = 0.5 / width;
  texture.userData.atlas = {
    columns: ATLAS_COLUMNS,
    rows: ATLAS_ROWS,
    tileSize: TILE_SIZE,
    uvInset,
  };
  texture.userData.columns = ATLAS_COLUMNS;
  texture.userData.rows = ATLAS_ROWS;
  texture.userData.tileSize = TILE_SIZE;
  texture.userData.uvInset = uvInset;

  return {
    canvas,
    texture,
    columns: ATLAS_COLUMNS,
    rows: ATLAS_ROWS,
    tileSize: TILE_SIZE,
    uvInset,
  };
}
