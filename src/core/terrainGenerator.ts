// Part: src/core/terrainGenerator.ts

import { injectable } from "inversify";
import Phaser from "phaser";
import { createNoise2D } from "simplex-noise";
import alea from "alea";

@injectable()
export class TerrainGenerator {
  private noise2D: (x: number, y: number) => number;
  private tileImages = ["grass", "concrete_wall"];

  constructor() {
    // create a new random function based on the seed
    const prng = alea("seed");
    // use the seeded random function to initialize the noise function
    this.noise2D = createNoise2D(prng);
  }

  generateTerrain(scene: Phaser.Scene, width: number, height: number): void {
    const tileSize = 32;

    // Create an empty 2D array representing the terrain
    const terrain: number[][] = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(0));

    // Generate terrain using Simplex noise
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const noiseValue = this.noise2D(x / 10, y / 10);
        terrain[y][x] = noiseValue > 0 ? 1 : 0; // Assign terrain types based on noise value
      }
    }

    // Create a Tilemap
    const map = scene.make.tilemap({ data: terrain, tileWidth: tileSize, tileHeight: tileSize });
    const tileset = map.addTilesetImage("tiles", null, tileSize, tileSize, 0, 0);

    for (let i = 0; i < this.tileImages.length; i++) {
      map.addTilesetImage(this.tileImages[i], this.tileImages[i]);
    }

    // Create a Tilemap Layer
    const layer = map.createLayer(0, tileset, 0, 0);
  }
}
