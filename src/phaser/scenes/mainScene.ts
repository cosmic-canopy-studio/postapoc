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
import ControlSystem from "@src/ecs/systems/controlSystem";

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

    const player = this.initPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this, player);

    new DebugPanel(this.world, player);

    this.initTime();
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000);
  }

  private initTime() {
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

    this.initEntities();

  }

  private initEntities() {
    // Add a tree to the scene
    const tree = this.objectPool.get();
    tree.setTexture("tree");
    tree.setPosition(200, 200);
    tree.setActive(true);
    tree.setVisible(true);
    this.objectSpatialIndex.insert(tree);
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

  private generateTileset(mapWidth: number, mapHeight: number, tileSize: number) {
    // Generate the tileset
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        object.setTexture(tileType);
        object.setPosition(x * tileSize, y * tileSize);
        object.setActive(true);
        object.setVisible(true);
        this.objectSpatialIndex.insert(object);
      }
    }
  }
}
