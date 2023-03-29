// Part: src/phaser/systems/universe.ts

import DebugPanel from "@src/core/components/debugPanel";
import { getLogger } from "@src/core/components/logger";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import EventBus from "@src/core/systems/eventBus";
import container from "@src/core/systems/inversify.config";
import ObjectPool from "@src/core/systems/objectPool";
import ControlSystem from "@src/ecs/systems/controlSystem";
import { focusSystem } from "@src/ecs/systems/focusSystem";
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
  private objectSpatialIndex!: RBush<StaticObject>;
  private playerFactory!: PlayerFactory;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private arrow!: StaticObject;
  private player!: number;
  private focusedObject: StaticObject | null = null;
  private logger = getLogger("universe");

  public generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        object.initialize(x * tileSize, y * tileSize, tileType, true);
        object.collisionModifier = 0.9;
        this.objectSpatialIndex.insert(object);
      }
    }
  }

  public generateStaticObject(x: number, y: number, type: string) {
    const object = this.objectPool.get();
    object.initialize(x, y, type);
    this.objectSpatialIndex.insert(object);
  }

  initialize(scene: Phaser.Scene) {
    this.scene = scene;
    this.world = createWorld();
    this.objectPool = new ObjectPool(() => {
      return new StaticObject(this.scene);
    });
    this.objectSpatialIndex = new RBush<StaticObject>();

    initMovementEvents();

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this.scene);
    this.arrow = new StaticObject(this.scene);
    this.arrow.initialize(0, 0, "red_arrow", true);
    this.arrow.setVisible(false);

    EventBus.on("attack", () => {
      this.destroyFocusTarget();
    });
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000, this.objectSpatialIndex);
    this.focusedObject = focusSystem(this.world, this.player, this.objectSpatialIndex, this.arrow);
  }

  spawnPlayer() {
    this.playerFactory = new PlayerFactory(this.scene, this.world);
    this.player = this.playerFactory.createPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    new DebugPanel(this.world, this.player);
  }

  private destroyFocusTarget() {
    if (this.focusedObject) {
      this.objectSpatialIndex.remove(this.focusedObject);
      this.logger.info(`Destroying ${this.focusedObject.name}`);
      this.objectPool.release(this.focusedObject);
      this.focusedObject = null;
    }
  }
}
