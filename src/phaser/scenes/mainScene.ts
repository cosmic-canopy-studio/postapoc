// Part: src/phaser/scenes/mainScene.ts

import Phaser, { Scene } from "phaser";
import { addEntity, createWorld } from "bitecs";
import { addMovement } from "@src/ecs/components/movement";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import container from "@src/core/inversify.config";
import { TERRAIN_GENERATOR, TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import { TerrainGenerator } from "@src/core/terrainGenerator";
import DebugPanel from "@src/core/debugPanel";

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private terrainGenerator!: TerrainGenerator;

  constructor() {
    super("MainScene");
  }

  preload() {
    // Initialize the TerrainGenerator
    this.terrainGenerator = container.get<TerrainGenerator>(TERRAIN_GENERATOR);
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
      100,
      this
    );

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);

    // Call the function to generate the terrain
    this.terrainGenerator.generateTerrain(this);

    // In the create method of MainScene
    const debugPanel = new DebugPanel(this.world, player);
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000);
  }
}
