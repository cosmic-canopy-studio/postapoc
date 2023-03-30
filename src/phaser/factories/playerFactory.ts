// Part: src/phaser/factories/playerFactory.ts

import { addHealth } from "@src/ecs/components/health";
import { addMovement } from "@src/ecs/components/movement";
import { addEntity, IWorld } from "bitecs";
import Phaser from "phaser";

export default class PlayerFactory {
  private scene: Phaser.Scene;
  private world: IWorld;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
  }

  public createPlayer() {
    const player = addEntity(this.world);

    addMovement(
      this.world,
      player,
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      0,
      0,
      this.scene
    );

    addHealth(this.world, player, 100, 100);

    return player;
  }
}
