// Part: src/phaser/systems/universe.ts

import DebugPanel from "@src/core/components/debugPanel";
import { getLogger } from "@src/core/components/logger";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/core/constants";
import { ITimeController, ITimeSystem } from "@src/core/interfaces";
import EventBus from "@src/core/systems/eventBus";
import { DamageEventPayload } from "@src/core/systems/eventTypes";
import container from "@src/core/systems/inversify.config";
import Health from "@src/ecs/components/health";
import ControlSystem from "@src/ecs/systems/controlSystem";
import { focusSystem } from "@src/ecs/systems/focusSystem";
import { healthSystem } from "@src/ecs/systems/healthSystem";
import { initMovementEvents } from "@src/ecs/systems/initMovementEvents";
import { movementSystem } from "@src/ecs/systems/movementSystem";
import PlayerFactory from "@src/phaser/factories/playerFactory";
import StaticObjectFactory from "@src/phaser/factories/staticObjectFactory";
import StaticObject from "@src/phaser/objects/staticObject";
import { createWorld, IWorld } from "bitecs";
import Phaser, { Scene } from "phaser";
import RBush from "rbush";

export default class Universe {
  private scene!: Phaser.Scene;
  private world!: IWorld;
  private staticObjectFactory!: StaticObjectFactory;
  private objectSpatialIndex!: RBush<StaticObject>;
  private playerFactory!: PlayerFactory;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private arrow!: StaticObject;
  private player!: number;
  private focusedObject: StaticObject | null = null;
  private logger = getLogger("universe");

  initialize(scene: Phaser.Scene) {
    this.scene = scene;
    this.world = createWorld();
    this.objectSpatialIndex = new RBush<StaticObject>();
    this.staticObjectFactory = new StaticObjectFactory(this.scene, this.world);
    this.playerFactory = new PlayerFactory(this.scene, this.world);

    this.spawnPlayer();
    initMovementEvents();

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this.scene);
    this.arrow = this.staticObjectFactory.create(0, 0, "red_arrow", true);
    this.arrow.setVisible(false);

    EventBus.on("attack", () => {
      this.destroyFocusTarget();
    });

    EventBus.on("damage", this.onDamage.bind(this));
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000, this.objectSpatialIndex);
    healthSystem(this.world, this.objectSpatialIndex, this.staticObjectFactory);
    this.focusedObject = focusSystem(this.world, this.player, this.objectSpatialIndex, this.arrow);
  }

  addObject(object: StaticObject) {
    this.objectSpatialIndex.insert(object);
  }

  addObjects(objects: StaticObject[]) {
    this.objectSpatialIndex.load(objects);
  }

  spawnPlayer() {
    this.player = this.playerFactory.createPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    new DebugPanel(this.world, this.player);
  }

  generateTileset() {
    const objects = this.staticObjectFactory.generateTileset();
    this.addObjects(objects);
  }

  generateStaticObject(x: number, y: number, texture: string) {
    const object = this.staticObjectFactory.create(x, y, texture);
    this.addObject(object);
  }

  private destroyFocusTarget() {
    if (this.focusedObject) {
      EventBus.emit("damage", { entity: this.focusedObject.eid, damage: 10 });
      this.logger.info(`Damaging ${this.focusedObject.name}`);
    }
  }

  private onDamage({ entity, damage }: DamageEventPayload) {
    Health.current[entity] -= damage;
    this.logger.info(`Damage ${damage} to ${entity}, health: ${Health.current[entity]}`);
  }
}
