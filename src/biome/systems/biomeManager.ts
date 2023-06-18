import { Biome, BiomeEntry } from '@src/biome/data/interfaces';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();

function calculateCutoffs(entry: BiomeEntry[]) {
  let totalWeight = 0;
  for (const item of entry) {
    totalWeight += item.weight;
  }

  const cutoffs = [];
  let cumulativeWeight = 0;
  for (const item of entry) {
    cumulativeWeight += item.weight;
    cutoffs.push(cumulativeWeight / totalWeight);
  }

  return cutoffs;
}

export function generateBiomeTileset(
  biome: Biome,
  mapWidth = 50,
  mapHeight = 50,
  tileSize = 32
) {
  const terrainCutoffs = calculateCutoffs(biome.terrains);

  const objects = [];
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      const noiseValue = (noise2D(x / 5, y / 5) + 1) / 2;

      let terrain = biome.terrains[biome.terrains.length - 1].name;

      for (let i = 0; i < terrainCutoffs.length - 1; i++) {
        if (noiseValue < terrainCutoffs[i]) {
          terrain = biome.terrains[i].name;
          break;
        }
      }

      objects.push({ x: x * tileSize, y: y * tileSize, id: terrain });
    }
  }

  return objects;
}

export function populateBiome(
  biome: Biome,
  mapWidth = 50,
  mapHeight = 50,
  tileSize = 32
) {
  const totalArea = mapWidth * mapHeight;
  const objects = [];

  for (const object of biome.objects) {
    const objectCount = Math.floor(totalArea * (object.weight / 100)); // weight is considered as percentage

    for (let i = 0; i < objectCount; i++) {
      const x = Math.floor(Math.random() * mapWidth) * tileSize;
      const y = Math.floor(Math.random() * mapHeight) * tileSize;
      objects.push({ x, y, id: object.name });
    }
  }

  const items = [];
  for (const item of biome.items) {
    const itemCount = Math.floor(totalArea * (item.weight / 100)); // weight is considered as percentage

    for (let i = 0; i < itemCount; i++) {
      const x = Math.floor(Math.random() * mapWidth) * tileSize;
      const y = Math.floor(Math.random() * mapHeight) * tileSize;
      items.push({ x, y, id: item.name });
    }
  }

  return { objects, items };
}
