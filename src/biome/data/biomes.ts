import { Biome } from '@src/biome/data/interfaces';

// NOTE: Objects must be sorted by descending weight

export const grasslandBiome: Biome = {
  name: 'grassland',
  terrains: [
    { name: 'grass', weight: 10 },
    { name: 'dirt', weight: 1 },
  ],
  objects: [
    { name: 'tree', weight: 1 },
    { name: 'bench', weight: 0.4 },
  ],
  items: [
    { name: 'rock', weight: 0.5 },
    { name: 'hammer', weight: 0.1 },
  ],
};

export const forestBiome: Biome = {
  name: 'forest',
  terrains: [
    { name: 'grass', weight: 10 },
    { name: 'dirt', weight: 3 },
  ],
  objects: [{ name: 'tree', weight: 5 }],
  items: [{ name: 'rock', weight: 1 }],
};

export const shelterBiome: Biome = {
  name: 'shelter',
  terrains: [
    { name: 'shelter', weight: 100 },
    { name: 'grass', weight: 0 },
  ],
  objects: [],
  items: [],
};

const biomes: Record<string, Biome> = {
  grassland: grasslandBiome,
  forest: forestBiome,
  shelter: shelterBiome,
};

export default biomes;
