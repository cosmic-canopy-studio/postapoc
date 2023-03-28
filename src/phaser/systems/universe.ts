// Part: src/phaser/systems/universe.ts

// src/phaser/systems/universe.ts
import DebugPanel from "@src/core/components/debugPanel";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import container from "@src/core/systems/inversify.config";
import ObjectPool from "@src/core/systems/objectPool";
import ControlSystem from "@src/ecs/systems/controlSystem";
import { initMovementEvents } from "@src/ecs/systems/initMovementEvents";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import PlayerFactory from "@src/phaser/factories/playerFactory";
import StaticObject from "@src/phaser/objects/staticObject";
import { createWorld, IWorld } from "bitecs";
import Phaser, { Scene } from "phaser";
import RBush from "rbush";

export default class Universe {
  private scene!: Phaser.Scene;
  private world!: IWorld;
  private objectPool!: ObjectPool<StaticObject>;
  private objectRBush!: RBush<StaticObject>;
  private playerFactory!: PlayerFactory;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;

  public generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        object.initialize(x * tileSize, y * tileSize, tileType);
        object.collisionModifier = 0.9;
        this.objectRBush.insert(object);
      }
    }
  }

  public generateStaticObject(x: number, y: number, type: string) {
    const object = this.objectPool.get();
    object.initialize(x, y, type);
    this.objectRBush.insert(object);
  }

  initialize(scene: Phaser.Scene) {
    this.scene = scene;
    this.world = createWorld();
    this.objectPool = new ObjectPool(() => {
      return new StaticObject(this.scene);
    });
    this.objectRBush = new RBush<StaticObject>();

    initMovementEvents();

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this.scene);
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000, this.objectRBush);
  }

  spawnPlayer() {
    this.playerFactory = new PlayerFactory(this.scene, this.world);
    const player = this.playerFactory.createPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, player);
    new DebugPanel(this.world, player);
  }
}
