import {
  Biome,
  BiomeEntry,
  SubmapItem,
  SubmapObject,
  SubmapTerrain,
} from '@src/biome/data/interfaces';
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

export function generateBiomeSubmap(
  biome: Biome,
  originX: number,
  originY: number,
  mapWidth: number,
  mapHeight: number,
  tileSize: number
) {
  const terrainCutoffs = calculateCutoffs(biome.terrains);

  const terrains: SubmapTerrain[] = [];
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

      terrains.push({
        x: x * tileSize + originX,
        y: y * tileSize + originY,
        id: terrain,
      });
    }
  }

  return terrains;
}

export function populateBiomeSubmap(
  biome: Biome,
  originX: number,
  originY: number,
  mapWidth: number,
  mapHeight: number,
  tileSize: number
) {
  const totalArea = mapWidth * mapHeight;
  const submapObjects: SubmapObject[] = [];

  for (const object of biome.objects) {
    const objectCount = Math.floor(totalArea * (object.weight / 100)); // weight is considered as percentage

    for (let i = 0; i < objectCount; i++) {
      const x = Math.floor(Math.random() * mapWidth) * tileSize + originX;
      const y = Math.floor(Math.random() * mapHeight) * tileSize + originY;
      submapObjects.push({ x, y, id: object.name });
    }
  }

  const submapItems: SubmapItem[] = [];
  for (const item of biome.items) {
    const itemCount = Math.floor(totalArea * (item.weight / 100)); // weight is considered as percentage

    for (let i = 0; i < itemCount; i++) {
      const x = Math.floor(Math.random() * mapWidth) * tileSize + originX;
      const y = Math.floor(Math.random() * mapHeight) * tileSize + originY;
      submapItems.push({ x, y, id: item.name });
    }
  }

  return { submapObjects, submapItems };
}
