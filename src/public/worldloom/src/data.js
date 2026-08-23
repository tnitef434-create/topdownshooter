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
  [ITEM.RAW_MEAT]: { id: ITEM.RAW_MEAT, name: 'Raw Game Steak', color: '#c95e63', category: 'food', model: 'bone-steak', cooked: false, food: 0.04, nutrition: 0.12, foodRisk: 0.35, description: 'A fresh bone-in cut. Cook it over steady heat for a safe, filling meal.' },
  [ITEM.COOKED_MEAT]: { id: ITEM.COOKED_MEAT, name: 'Fire-Roasted Steak', color: '#a95732', category: 'food', model: 'bone-steak', cooked: true, food: 0.24, nutrition: 0.48, description: 'A browned, bone-in steak with a crisp seared edge. Restores vitality and nourishment.' },
  [ITEM.COPPER_SWORD]: { id: ITEM.COPPER_SWORD, name: 'Copper Longblade', color: '#dc8453', category: 'weapon', tool: 'sword', speed: 1.25, damage: 2.4, attackSpeed: 1.45, reach: 3.75, description: 'A balanced forged blade with a wrapped ashwood grip.' },
};

export function getItem(id) {
  const block = BLOCKS[id];
  if (block) {
    const cssColor = typeof block.color === 'number'
      ? `#${block.color.toString(16).padStart(6, '0')}`
      : block.color;
    return {
      ...block,
      name: id === BLOCK.ASH_PLANKS ? 'Wooden Planks' : block.name,
      color: cssColor,
      requiredTool: block.tool,
      tool: undefined,
      id,
      category: block.category || 'block',
      placeable: id !== BLOCK.AIR && !block.unbreakable,
      description: block.description || 'A piece of the living voxel frontier.',
    };
  }
  return TOOL_ITEMS[id] || { id, name: 'Unknown Relic', color: '#ff4fa3', category: 'unknown' };
}

export const RECIPES = [
  {
    id: 'ash_planks',
    name: 'Ashwood Planks',
    output: { id: BLOCK.ASH_PLANKS, count: 4 },
    ingredients: [{ id: BLOCK.ASH_LOG, count: 1 }],
    description: 'Square ashwood into warm building boards.',
  },
  {
    id: 'pine_planks',
    name: 'Pinewood Planks',
    output: { id: BLOCK.ASH_PLANKS, count: 4 },
    ingredients: [{ id: BLOCK.PINE_LOG, count: 1 }],
    description: 'Dress a pine log into boards compatible with every wood recipe.',
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
    stations: [BLOCK.KILN, BLOCK.FURNACE],
    description: 'Kiln-fused panes with a faint sea tint.',
  },
  {
    id: 'copper_ingot',
    name: 'Copper Ingot',
    output: { id: ITEM.COPPER_INGOT, count: 1 },
    ingredients: [{ id: BLOCK.COPPER_ORE, count: 1 }, { id: BLOCK.COALSTONE, count: 1 }],
    stations: [BLOCK.KILN, BLOCK.FURNACE],
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
    station: BLOCK.CAMP_BENCH,
    description: 'Assemble crystal, glass and refined copper into the first journey’s final artifact.',
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
    id: 'pine_wayfarer_bed',
    name: 'Pine-Fibre Wayfarer Bed',
    output: { id: BLOCK.BED, count: 1 },
    ingredients: [{ id: BLOCK.ASH_PLANKS, count: 3 }, { id: BLOCK.PINE_NEEDLES, count: 3 }],
    station: BLOCK.CAMP_BENCH,
    description: 'The same sheltered bed, padded with dry pine needles.',
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
    stations: [BLOCK.FURNACE, BLOCK.KILN],
    description: 'Cook raw game meat over the steady heat of a furnace or kiln.',
  },
];

export const OBJECTIVES = [
  { id: 'gather', text: 'Gather your first ash or pine log', test: ({ inventory }) => inventory.has(BLOCK.ASH_LOG) || inventory.has(BLOCK.PINE_LOG) },
  { id: 'planks', text: 'Craft wooden planks in your pack', test: ({ inventory }) => inventory.has(BLOCK.ASH_PLANKS) },
  { id: 'tool', text: 'Craft a flint pick or ash hatchet', test: ({ inventory }) => inventory.has(ITEM.CRUDE_PICK) || inventory.has(ITEM.ASH_HATCHET) },
  { id: 'bench', text: 'Place a Camp Bench', test: ({ flags }) => flags.placedBench },
  { id: 'copper', text: 'Find copper beneath the stone', test: ({ inventory }) => inventory.has(BLOCK.COPPER_ORE) || inventory.has(ITEM.COPPER_INGOT) },
  { id: 'kiln', text: 'Build and place an Ember Kiln', test: ({ flags }) => flags.placedKiln },
  { id: 'furnace', text: 'Build a Hearth Furnace for cooking', test: ({ flags }) => flags.placedFurnace },
  { id: 'hunt', text: 'Hunt game and collect fresh meat', test: ({ inventory, flags }) => flags.huntedGame || inventory.has(ITEM.RAW_MEAT) || inventory.has(ITEM.COOKED_MEAT) },
  { id: 'cook', text: 'Cook a nourishing meal over steady heat', test: ({ inventory, flags }) => flags.cookedMeal || inventory.has(ITEM.COOKED_MEAT) },
  { id: 'bed', text: 'Place a Wayfarer Bed in your shelter', test: ({ flags }) => flags.placedBed },
  { id: 'sleep', text: 'Sleep safely and bind your respawn point', test: ({ flags }) => flags.sleptInBed },
  { id: 'lumen', text: 'Harvest three Lumen Crystals', test: ({ inventory }) => inventory.count(BLOCK.LUMEN_CRYSTAL) >= 3 },
  { id: 'lightcore', text: 'Assemble the Lightcore at a Camp Bench', test: ({ inventory, flags }) => flags.completedJourney || inventory.has(ITEM.LIGHTCORE) },
];

/**
 * Return a recipe's material requirements with duplicate item rows combined.
 * The same normalized list drives both the recipe display and the transaction,
 * so "3 / 3" in the book can never disagree with the craft button.
 */
export function recipeRequirements(recipe) {
  const totals = new Map();
  for (const ingredient of Array.isArray(recipe?.ingredients) ? recipe.ingredients : []) {
    const id = Math.floor(Number(ingredient?.id));
    const count = Math.floor(Number(ingredient?.count));
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(count) || count <= 0) continue;
    totals.set(id, (totals.get(id) || 0) + count);
  }
  return [...totals].map(([id, count]) => ({ id, count }));
}

export function recipeStations(recipe) {
  const source = Array.isArray(recipe?.stations)
    ? recipe.stations
    : recipe?.station
      ? [recipe.station]
      : [];
  return [...new Set(source
    .map((id) => Math.floor(Number(id)))
    .filter((id) => Number.isInteger(id) && id > 0 && BLOCKS[id]))];
}

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
  if ([BLOCK.TURF, BLOCK.LOAM, BLOCK.SAND, BLOCK.STONE, BLOCK.ASH_LOG, BLOCK.ASH_LEAVES, BLOCK.PINE_LOG, BLOCK.PINE_NEEDLES, BLOCK.SHORT_GRASS].includes(blockId)) return true;
  if (blockId === BLOCK.COPPER_ORE) return [ITEM.STONE_PICK, ITEM.COPPER_PICK].includes(itemId);
  if (blockId === BLOCK.LUMEN_CRYSTAL) return itemId === ITEM.COPPER_PICK;
  const block = BLOCKS[blockId];
  if (!block?.tool || block.tool === 'hand') return true;
  return getItem(itemId).tool === block.tool || (block.tool === 'pick' && [ITEM.CRUDE_PICK, ITEM.STONE_PICK, ITEM.COPPER_PICK].includes(itemId));
}

export function weaponDamage(itemId) {
  return Math.max(1, Number(getItem(itemId)?.damage) || 1);
}

export function combatProfile(itemId) {
  const item = getItem(itemId);
  const weapon = item.category === 'weapon';
  const tool = item.category === 'tool';
  const attacksPerSecond = weapon ? Number(item.attackSpeed) || 1.35 : tool ? 1.15 : 1.8;
  return {
    damage: weaponDamage(itemId),
    reach: safeReach(item.reach, weapon ? 3.75 : 3.25),
    recovery: 1 / Math.max(0.5, attacksPerSecond),
    staminaCost: weapon ? 0.085 : tool ? 0.065 : 0.04,
  };
}

function safeReach(value, fallback) {
  const reach = Number(value);
  return Number.isFinite(reach) ? Math.max(2.5, Math.min(4.25, reach)) : fallback;
}
