import { BLOCK, BLOCKS } from './blocks.js';

export const ITEM = Object.freeze({
  STICK: 101,
  CRUDE_PICK: 102,
  STONE_PICK: 103,
  COPPER_PICK: 104,
  ASH_HATCHET: 105,
  COPPER_INGOT: 106,
  LIGHTCORE: 107,
  RAW_MEAT: 108,
  COOKED_MEAT: 109,
  COPPER_SWORD: 110,
});

const TOOL_ITEMS = {
  [ITEM.STICK]: { id: ITEM.STICK, name: 'Ash Rod', color: '#a8754d', category: 'material', description: 'A straight, sturdy crafting rod.' },
  [ITEM.CRUDE_PICK]: { id: ITEM.CRUDE_PICK, name: 'Flint Pick', color: '#aeb4a9', category: 'tool', tool: 'pickaxe', speed: 2.4, description: 'A rough starter pick. Mines stone and coalstone.' },
  [ITEM.STONE_PICK]: { id: ITEM.STONE_PICK, name: 'Stone Pick', color: '#7f8b8b', category: 'tool', tool: 'pickaxe', speed: 4.1, description: 'A reliable mining tool that can free copper.' },
  [ITEM.COPPER_PICK]: { id: ITEM.COPPER_PICK, name: 'Copper Pick', color: '#d68457', category: 'tool', tool: 'pickaxe', speed: 7, description: 'A bright, fast pick that can harvest lumen crystal.' },
  [ITEM.ASH_HATCHET]: { id: ITEM.ASH_HATCHET, name: 'Ash Hatchet', color: '#c58a5c', category: 'tool', tool: 'axe', speed: 4.6, description: 'Makes short work of ashwood.' },
  [ITEM.COPPER_INGOT]: { id: ITEM.COPPER_INGOT, name: 'Copper Ingot', color: '#e08b5f', category: 'material', description: 'Warm metal refined in a nearby kiln.' },
  [ITEM.LIGHTCORE]: { id: ITEM.LIGHTCORE, name: 'Lightcore', color: '#6fffe1', category: 'relic', description: 'A pulsing heart of copper and captured lumen.' },
  [ITEM.RAW_MEAT]: { id: ITEM.RAW_MEAT, name: 'Raw Game Meat', color: '#c7605a', category: 'food', description: 'Fresh meat dropped by a hunted animal. Cook it before eating.' },
  [ITEM.COOKED_MEAT]: { id: ITEM.COOKED_MEAT, name: 'Roasted Game', color: '#b96b3f', category: 'food', food: 0.38, description: 'Furnace-roasted meat that restores vitality when used.' },
  [ITEM.COPPER_SWORD]: { id: ITEM.COPPER_SWORD, name: 'Copper Longblade', color: '#dc8453', category: 'weapon', tool: 'sword', speed: 1.25, damage: 2.4, description: 'A balanced forged blade with a wrapped ashwood grip.' },
};

export function getItem(id) {
  const block = BLOCKS[id];
  if (block) {
    const cssColor = typeof block.color === 'number'
      ? `#${block.color.toString(16).padStart(6, '0')}`
      : block.color;
    return {
      ...block,
      color: cssColor,
      requiredTool: block.tool,
      tool: undefined,
      id,
      category: block.category || 'block',
      placeable: id !== BLOCK.AIR,
      description: block.description || 'A piece of the living voxel frontier.',
    };
  }
  return TOOL_ITEMS[id] || { id, name: 'Unknown Relic', color: '#ff4fa3', category: 'unknown' };
}

export const RECIPES = [
  {
    id: 'ash_planks',
    name: 'Ash Planks',
    output: { id: BLOCK.ASH_PLANKS, count: 4 },
    ingredients: [{ id: BLOCK.ASH_LOG, count: 1 }],
    description: 'Square ashwood into warm building boards.',
  },
  {
    id: 'ash_rods',
    name: 'Ash Rods',
    output: { id: ITEM.STICK, count: 4 },
    ingredients: [{ id: BLOCK.ASH_PLANKS, count: 1 }],
    description: 'Useful handles for tools and lights.',
  },
  {
    id: 'camp_bench',
    name: 'Camp Bench',
    output: { id: BLOCK.CAMP_BENCH, count: 1 },
    ingredients: [{ id: BLOCK.ASH_PLANKS, count: 4 }],
    description: 'A field workbench that unlocks finer craft.',
  },
  {
    id: 'flint_pick',
    name: 'Flint Pick',
    output: { id: ITEM.CRUDE_PICK, count: 1 },
    ingredients: [{ id: BLOCK.STONE, count: 2 }, { id: ITEM.STICK, count: 2 }],
    description: 'Your first proper mining tool.',
  },
  {
    id: 'ash_hatchet',
    name: 'Ash Hatchet',
    output: { id: ITEM.ASH_HATCHET, count: 1 },
    ingredients: [{ id: BLOCK.STONE, count: 2 }, { id: ITEM.STICK, count: 2 }],
    description: 'Cuts logs much faster than bare hands.',
  },
  {
    id: 'stone_pick',
    name: 'Stone Pick',
    output: { id: ITEM.STONE_PICK, count: 1 },
    ingredients: [{ id: BLOCK.STONE, count: 3 }, { id: ITEM.STICK, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'Strong enough to harvest copper ore.',
  },
  {
    id: 'stone_brick',
    name: 'Stone Brick',
    output: { id: BLOCK.STONE_BRICK, count: 2 },
    ingredients: [{ id: BLOCK.STONE, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'Clean masonry for lasting shelters.',
  },
  {
    id: 'kiln',
    name: 'Ember Kiln',
    output: { id: BLOCK.KILN, count: 1 },
    ingredients: [{ id: BLOCK.STONE_BRICK, count: 6 }, { id: BLOCK.COALSTONE, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'Refines ore and fuses sand into glass.',
  },
  {
    id: 'torch',
    name: 'Lumen Torch',
    output: { id: BLOCK.TORCH, count: 4 },
    ingredients: [{ id: BLOCK.COALSTONE, count: 1 }, { id: ITEM.STICK, count: 1 }],
    description: 'A warm marker against the dark.',
  },
  {
    id: 'glass',
    name: 'Clear Glass',
    output: { id: BLOCK.GLASS, count: 3 },
    ingredients: [{ id: BLOCK.SAND, count: 3 }, { id: BLOCK.COALSTONE, count: 1 }],
    station: BLOCK.KILN,
    description: 'Kiln-fused panes with a faint sea tint.',
  },
  {
    id: 'copper_ingot',
    name: 'Copper Ingot',
    output: { id: ITEM.COPPER_INGOT, count: 1 },
    ingredients: [{ id: BLOCK.COPPER_ORE, count: 1 }, { id: BLOCK.COALSTONE, count: 1 }],
    station: BLOCK.KILN,
    description: 'Refine raw copper into useful metal.',
  },
  {
    id: 'copper_pick',
    name: 'Copper Pick',
    output: { id: ITEM.COPPER_PICK, count: 1 },
    ingredients: [{ id: ITEM.COPPER_INGOT, count: 3 }, { id: ITEM.STICK, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'A quick tool capable of harvesting lumen crystal.',
  },
  {
    id: 'lightcore',
    name: 'Lightcore',
    output: { id: ITEM.LIGHTCORE, count: 1 },
    ingredients: [{ id: BLOCK.LUMEN_CRYSTAL, count: 3 }, { id: ITEM.COPPER_INGOT, count: 2 }, { id: BLOCK.GLASS, count: 1 }],
    station: BLOCK.KILN,
    description: 'The end of the first journey—and the beginning of your world.',
  },
  {
    id: 'framed_window',
    name: 'Framed Windows',
    output: { id: BLOCK.WINDOW, count: 4 },
    ingredients: [{ id: BLOCK.GLASS, count: 4 }, { id: BLOCK.ASH_PLANKS, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'Clear panes held in warm, weather-tight ashwood frames.',
  },
  {
    id: 'hearth_furnace',
    name: 'Hearth Furnace',
    output: { id: BLOCK.FURNACE, count: 1 },
    ingredients: [{ id: BLOCK.STONE_BRICK, count: 8 }, { id: BLOCK.COALSTONE, count: 2 }],
    station: BLOCK.CAMP_BENCH,
    description: 'A proper home furnace for smelting and cooking.',
  },
  {
    id: 'ashwood_chest',
    name: 'Ashwood Chest',
    output: { id: BLOCK.CHEST, count: 1 },
    ingredients: [{ id: BLOCK.ASH_PLANKS, count: 8 }],
    station: BLOCK.CAMP_BENCH,
    description: 'A handsome lidded chest for furnishing a shelter.',
  },
  {
    id: 'wayfarer_bed',
    name: 'Wayfarer Bed',
    output: { id: BLOCK.BED, count: 1 },
    ingredients: [{ id: BLOCK.ASH_PLANKS, count: 3 }, { id: BLOCK.ASH_LEAVES, count: 3 }],
    station: BLOCK.CAMP_BENCH,
    description: 'A low ashwood frame topped with a soft leaf-fibre mattress.',
  },
  {
    id: 'copper_longblade',
    name: 'Copper Longblade',
    output: { id: ITEM.COPPER_SWORD, count: 1 },
    ingredients: [{ id: ITEM.COPPER_INGOT, count: 2 }, { id: ITEM.STICK, count: 1 }],
    station: BLOCK.CAMP_BENCH,
    description: 'A quicker, stronger weapon for dangerous nights.',
  },
  {
    id: 'roasted_game',
    name: 'Roasted Game',
    output: { id: ITEM.COOKED_MEAT, count: 1 },
    ingredients: [{ id: ITEM.RAW_MEAT, count: 1 }, { id: BLOCK.COALSTONE, count: 1 }],
    station: BLOCK.FURNACE,
    description: 'Cook raw game meat over steady furnace heat.',
  },
];

export const OBJECTIVES = [
  { id: 'gather', text: 'Gather your first ashwood log', test: ({ inventory }) => inventory.has(BLOCK.ASH_LOG) },
  { id: 'planks', text: 'Craft ash planks in your pack', test: ({ inventory }) => inventory.has(BLOCK.ASH_PLANKS) },
  { id: 'tool', text: 'Craft a flint pick or ash hatchet', test: ({ inventory }) => inventory.has(ITEM.CRUDE_PICK) || inventory.has(ITEM.ASH_HATCHET) },
  { id: 'bench', text: 'Place a Camp Bench', test: ({ flags }) => flags.placedBench },
  { id: 'copper', text: 'Find copper beneath the stone', test: ({ inventory }) => inventory.has(BLOCK.COPPER_ORE) || inventory.has(ITEM.COPPER_INGOT) },
  { id: 'kiln', text: 'Build and place an Ember Kiln', test: ({ flags }) => flags.placedKiln },
  { id: 'lumen', text: 'Harvest three Lumen Crystals', test: ({ inventory }) => inventory.count(BLOCK.LUMEN_CRYSTAL) >= 3 },
  { id: 'lightcore', text: 'Craft the Lightcore', test: ({ inventory }) => inventory.has(ITEM.LIGHTCORE) },
];

export function toolMultiplier(itemId, blockId) {
  const item = getItem(itemId);
  const block = BLOCKS[blockId];
  if (!block) return 1;
  if (!item.tool) return block.tool === 'hand' || !block.tool ? 1 : 0.45;
  if (item.tool !== block.tool) return 0.65;
  return item.speed || 2;
}

export function canHarvest(itemId, blockId) {
  // Starter materials remain obtainable by hand, just deliberately slowly.
  if ([BLOCK.TURF, BLOCK.LOAM, BLOCK.SAND, BLOCK.STONE, BLOCK.ASH_LOG, BLOCK.ASH_LEAVES].includes(blockId)) return true;
  if (blockId === BLOCK.COPPER_ORE) return [ITEM.STONE_PICK, ITEM.COPPER_PICK].includes(itemId);
  if (blockId === BLOCK.LUMEN_CRYSTAL) return itemId === ITEM.COPPER_PICK;
  const block = BLOCKS[blockId];
  if (!block?.tool || block.tool === 'hand') return true;
  return getItem(itemId).tool === block.tool || (block.tool === 'pick' && [ITEM.CRUDE_PICK, ITEM.STONE_PICK, ITEM.COPPER_PICK].includes(itemId));
}

export function weaponDamage(itemId) {
  return Math.max(1, Number(getItem(itemId)?.damage) || 1);
}
