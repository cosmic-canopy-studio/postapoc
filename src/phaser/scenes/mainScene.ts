// Part: src/phaser/scenes/mainScene.ts

import Phaser, { Scene } from "phaser";
import { addEntity, createWorld } from "bitecs";
import { addMovement } from "@src/ecs/components/movement";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import { ITimeController, ITimeSystem } from "@src/utils/interfaces";
import container from "@src/core/inversify.config";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/utils/constants";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;

  constructor() {
    super("MainScene");
  }

  create() {
    this.world = createWorld();

    // Create an entity for the player character
    const player = addEntity(this.world);
    addMovement(
      this.world,
      player,
      0,
      0,
      100,
      this
    );
    this.cameras.main.startFollow(phaserEntityMapper[player]);


    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);

    // Call the function to generate the terrain (to be implemented later)
    this.generateTerrain();
  }

  // Placeholder function for terrain generation
  generateTerrain() {
    // TODO: Implement terrain generation logic
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000);
  }
}
