import { Biome } from '@src/biome/data/interfaces';

export function generateBiomeTileset(
  biome: Biome,
  mapWidth = 50,
  mapHeight = 50,
  tileSize = 32
) {
  const objects = [];
  for (let x = 0; x < mapWidth; x++) {
    for (let y = 0; y < mapHeight; y++) {
      // Select a random terrain from the biome's terrain list
      const terrain =
        biome.terrains[Math.floor(Math.random() * biome.terrains.length)];
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
  const objects = [];
  const objectCount = Math.floor(mapWidth * mapHeight * 0.05); // 5% of the area populated by objects
  for (let i = 0; i < objectCount; i++) {
    const x = Math.floor(Math.random() * mapWidth) * tileSize;
    const y = Math.floor(Math.random() * mapHeight) * tileSize;
    const objectId =
      biome.objects[Math.floor(Math.random() * biome.objects.length)];
    objects.push({ x, y, id: objectId });
  }

  const items = [];
  const itemCount = Math.floor(mapWidth * mapHeight * 0.01); // 1% of the area populated by items
  for (let i = 0; i < itemCount; i++) {
    const x = Math.floor(Math.random() * mapWidth) * tileSize;
    const y = Math.floor(Math.random() * mapHeight) * tileSize;
    const itemId = biome.items[Math.floor(Math.random() * biome.items.length)];
    items.push({ x, y, id: itemId });
  }

  return { objects, items };
}
