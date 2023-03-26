// Part: src/phaser/scenes/mainScene.ts

import Phaser, { Scene } from "phaser";
import { addEntity, createWorld } from "bitecs";
import { addMovement } from "@src/ecs/components/movement";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import container from "@src/core/inversify.config";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import DebugPanel from "@src/core/debugPanel";
import StaticObject from "@src/objects/staticObject";
import ObjectPool from "@src/core/world/objectPool";
import RBush from "rbush";

const TILE_SIZE = 32;
const MAP_WIDTH = 50;
const MAP_HEIGHT = 50;

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private objectPool!: ObjectPool<StaticObject>;
  private objectSpatialIndex!: RBush<StaticObject>;

  constructor() {
    super("MainScene");
  }

  create() {
    this.world = createWorld();

    // Create an object pool for StaticObjects
    this.objectPool = new ObjectPool(() => {
      const object = new StaticObject(this, 0, 0, "grass");
      object.setActive(false);
      object.setVisible(false);
      return object;
    }, MAP_WIDTH * MAP_HEIGHT);

    this.objectSpatialIndex = new RBush<StaticObject>();

    // Generate the tileset
    for (let x = 0; x < MAP_WIDTH; x++) {
      for (let y = 0; y < MAP_HEIGHT; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        object.setTexture(tileType);
        object.setPosition(x * TILE_SIZE, y * TILE_SIZE);
        object.setActive(true);
        object.setVisible(true);
        this.objectSpatialIndex.insert(object);
      }
    }

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
