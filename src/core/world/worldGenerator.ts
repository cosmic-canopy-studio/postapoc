import Structure from "@src/core/world/structure";

export class WorldGenerator {
  scene: Phaser.Scene;
  ecsWorld: ECSWorld;

  constructor(scene: Phaser.Scene, ecsWorld: ECSWorld) {
    this.scene = scene;
    this.ecsWorld = ecsWorld;
  }

  generateWorld(biome: Biome, width: number, height: number): void {

  }
}
