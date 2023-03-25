// Part: src/phaser/scenes/mainScene.ts

import Phaser, { Scene } from "phaser";
import { addEntity, createWorld } from "bitecs";
import { addMovement } from "@src/ecs/components/movement";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import container from "@src/core/inversify.config";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import DebugPanel from "@src/core/debugPanel";

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
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      0,
      0,
      this
    );

    // In the create method of MainScene
    new DebugPanel(this.world, player);

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);

    console.log(this.add.image(200, 300, "tree"));
    this.add.image(200, 200, "tree");
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000);
  }
}
