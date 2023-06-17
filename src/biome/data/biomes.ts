import { Biome } from '@src/biome/data/interfaces';

export const parkBiome: Biome = {
  name: 'park',
  terrains: ['grass'],
  objects: ['tree', 'bench'],
  items: ['rock', 'hammer'],
};

export const grasslandBiome: Biome = {
  name: 'grassland',
  terrains: ['grass', 'dirt'],
  objects: ['tree'],
  items: ['rock'],
};

const biomes: Record<string, Biome> = {
  park: parkBiome,
  grassland: grasslandBiome,
};

export default biomes;
