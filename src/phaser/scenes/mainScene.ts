// Part: src/phaser/scenes/mainScene.ts

import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import DebugPanel from "@src/core/devTools/debugPanel";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import container from "@src/core/inversify.config";
import ObjectPool from "@src/core/world/objectPool";
import { addMovement } from "@src/ecs/components/movement";
import ControlSystem from "@src/ecs/systems/controlSystem";
import { initMovementEvents } from "@src/ecs/systems/initMovementEvents";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import StaticObject from "@src/phaser/objects/staticObject";
import { addEntity, createWorld } from "bitecs";
import Phaser, { Scene } from "phaser";
import RBush from "rbush";

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
    this.initObjects();

    initMovementEvents();

    this.initSystems();
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000, this.objectSpatialIndex);
  }

  private initSystems() {
    const player = this.initPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this, player);

    new DebugPanel(this.world, player);

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);
  }

  private initObjects() {
    this.initObjectHelpers();
    this.generateTileset();
    this.initStaticObjects();
  }

  private initPlayer() {
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

    return player;
  }

  private initObjectHelpers() {
    this.world = createWorld();

    this.objectPool = new ObjectPool(() => {
      return new StaticObject(this);
    });

    this.objectSpatialIndex = new RBush<StaticObject>();
  }

  private initStaticObjects() {
    const tree = this.objectPool.get();
    tree.initialize(200, 200, "tree");
    this.objectSpatialIndex.insert(tree);
  }

  private generateTileset() {
    const tileSize = 32;
    const mapWidth = 50;
    const mapHeight = 50;

    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        object.initialize(x * tileSize, y * tileSize, tileType);
        object.collisionModifier = 0.9;
        this.objectSpatialIndex.insert(object);
      }
    }
  }
}
