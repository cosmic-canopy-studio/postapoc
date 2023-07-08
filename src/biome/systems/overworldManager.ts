// in biomeManager.ts
import {
  OVERMAP_HEIGHT,
  OVERMAP_WIDTH,
  STARTING_X,
  STARTING_Y,
  SUBMAP_HEIGHT,
  SUBMAP_WIDTH,
  TILE_SIZE,
} from '@src/biome/data/constants';
import { Biome, SubmapTerrain, SubmapTile } from '@src/biome/data/interfaces';
import {
  generateBiomeSubmap,
  populateBiomeSubmap,
} from '@src/biome/systems/biomeManager';
import { getLogger } from '@src/telemetry/systems/logger';
import { createNoise2D } from 'simplex-noise';

const noise2D = createNoise2D();
const grasslandMaxHeight = 0.6; // heights below this value will be grassland

export function generateOvermap(
  biomes: Record<string, Biome>,
  overmapWidth = OVERMAP_WIDTH, // width of the overmap in submaps
  overmapHeight = OVERMAP_HEIGHT, // height of the overmap in submaps
  submapWidth = SUBMAP_WIDTH, // width of a submap in tiles
  submapHeight = SUBMAP_HEIGHT, // height of a submap in tiles
  tileSize = TILE_SIZE
) {
  const logger = getLogger('biome');
  const overmap: SubmapTile[] = [];
  for (let overmapX = 0; overmapX < overmapWidth; overmapX++) {
    for (let overmapY = 0; overmapY < overmapHeight; overmapY++) {
      let submapBiome: Biome;
      if (overmapX === STARTING_X && overmapY === STARTING_Y) {
        submapBiome = biomes['shelter'];
      } else {
        const height = (noise2D(overmapX / 5, overmapY / 5) + 1) / 2; // normalize to [0,1]
        submapBiome = getBiomeBasedOnHeight(biomes, height);
      }
      logger.debug(
        `Generating submap ${submapBiome.name} for overmap coordinate ${overmapX},${overmapY}`
      );
      const originX = overmapX * submapWidth * tileSize;
      const originY = overmapY * submapHeight * tileSize;

      const submapTerrain: SubmapTerrain[] = generateBiomeSubmap(
        submapBiome,
        originX,
        originY,
        submapWidth,
        submapHeight,
        tileSize
      );

      const { submapObjects, submapItems } = populateBiomeSubmap(
        submapBiome,
        originX,
        originY,
        submapWidth,
        submapHeight,
        tileSize
      );

      overmap.push({
        overmapX,
        overmapY,
        originX,
        originY,
        submapBiomeName: submapBiome.name,
        submapTerrain,
        submapObjects,
        submapItems,
      });
    }
  }
  return overmap;
}

function getBiomeBasedOnHeight(biomes: Record<string, Biome>, height: number) {
  let biome;
  if (height < grasslandMaxHeight) {
    biome = biomes['grassland'];
  } else {
    biome = biomes['forest'];
  }
  return biome;
}
