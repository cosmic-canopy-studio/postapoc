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
    this.world = createWorld();

    const tileSize = 32;
    const mapWidth = 50;
    const mapHeight = 50;

    this.initObjectHelpers(mapWidth, mapHeight);
    this.generateTileset(mapWidth, mapHeight, tileSize);
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

  private initObjectHelpers(mapWidth: number, mapHeight: number) {
    // Create an object pool for StaticObjects
    this.objectPool = new ObjectPool(() => {
      const object = new StaticObject(this, 0, 0, "grass");
      object.setActive(false);
      object.setVisible(false);
      return object;
    }, mapWidth * mapHeight);

    this.objectSpatialIndex = new RBush<StaticObject>();
  }

  private initStaticObjects() {
    // Add a tree to the scene
    const tree = new StaticObject(this, 200, 200, "tree");
    this.objectSpatialIndex.insert(tree);

    // Add world bounds
    this.objectSpatialIndex.insert(
      new StaticObject(this, -1, -1, null, this.cameras.main.width + 1, 1, "worldBounds")
    );
    this.objectSpatialIndex.insert(
      new StaticObject(this, -1, this.cameras.main.height, null, this.cameras.main.width + 1, 1, "worldBounds")
    );
    this.objectSpatialIndex.insert(
      new StaticObject(this, -1, 0, null, 1, this.cameras.main.height, "worldBounds")
    );
    this.objectSpatialIndex.insert(
      new StaticObject(this, this.cameras.main.width, 0, null, 1, this.cameras.main.height, "worldBounds")
    );
  }

  private generateTileset(mapWidth: number, mapHeight: number, tileSize: number) {
    // Generate the tileset
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = new StaticObject(this, x * tileSize, y * tileSize, tileType);
        object.collisionModifier = 0.9;
        this.objectSpatialIndex.insert(object);
      }
    }
  }
}
