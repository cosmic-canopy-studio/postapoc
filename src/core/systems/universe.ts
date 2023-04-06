// Part: src/core/systems/universe.ts
// Code Reference: https://github.com/developit/mitt
// Code Reference: https://github.com/mourner/rbush
// Documentation:

import DebugPanel from '@src/core/components/debugPanel';
import { getLogger } from '@src/core/components/logger';
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from '@src/core/constants';
import { ITimeController, ITimeSystem } from '@src/core/interfaces';
import EventBus from '@src/core/systems/eventBus';
import {
  DamageEventPayload,
  DestroyEntityEventPayload,
} from '@src/core/systems/eventTypes';
import container from '@src/core/systems/inversify.config';
import {
  getBoundingBox,
  getCollider,
  ICollider,
} from '@src/ecs/components/collider';
import Health from '@src/ecs/components/health';
import ControlSystem from '@src/ecs/systems/controlSystem';
import { focusSystem } from '@src/ecs/systems/focusSystem';
import { healthSystem } from '@src/ecs/systems/healthSystem';
import { initMovementEvents } from '@src/ecs/systems/initMovementEvents';
import { movementSystem } from '@src/ecs/systems/movementSystem';
import { TimeState } from '@src/core/systems/timeSystem';
import PlayerFactory from '@src/phaser/factories/playerFactory';
import StaticObjectFactory from '@src/phaser/factories/staticObjectFactory';
import { createWorld, IWorld } from 'bitecs';
import Phaser, { Scene } from 'phaser';
import RBush from 'rbush';

export default class Universe {
  private scene!: Phaser.Scene;
  private world!: IWorld;
  private staticObjectFactory!: StaticObjectFactory;
  private objectSpatialIndex!: RBush<ICollider>;
  private playerFactory!: PlayerFactory;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private arrow!: Phaser.GameObjects.Sprite;
  private player!: number;
  private focusedObject: number | null = null;
  private logger = getLogger('universe');

  initialize(scene: Phaser.Scene) {
    this.scene = scene;
    this.world = createWorld();

    this.objectSpatialIndex = new RBush<ICollider>();
    this.staticObjectFactory = new StaticObjectFactory(this.scene, this.world);
    this.playerFactory = new PlayerFactory(this.scene, this.world);

    initMovementEvents();

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<
      (scene: Scene) => ITimeController
    >(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this.scene);
    this.arrow = this.scene.add.sprite(0, 0, 'red_arrow');
    this.arrow.setVisible(false);

    EventBus.on('attack', this.attackFocusTarget.bind(this));
    EventBus.on('damage', this.onDamage.bind(this));
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
  }

  update(time: number, deltaTime: number) {
    const adjustedDeltaTime = this.timeSystem.getAdjustedDeltaTime(deltaTime);
    const timeState = this.timeSystem.getTimeState();
    if (timeState !== TimeState.PAUSED) {
      this.logger.debug(
        `Time state: ${timeState}, delta time: ${adjustedDeltaTime}`
      );
      movementSystem(
        this.world,
        adjustedDeltaTime / 1000,
        this.objectSpatialIndex
      );
      healthSystem(this.world);
      this.focusedObject = focusSystem(
        this.world,
        this.player,
        this.objectSpatialIndex,
        this.arrow
      );
    } else {
      this.logger.debug(`Time state: ${timeState}`);
    }
  }

  spawnPlayer() {
    this.player = this.playerFactory.createPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    new DebugPanel(this.world, this.player);
  }

  generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    const collisionModifier = 0.9;
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? 'grass' : 'grass2';
        this.generateStaticObject(
          x * tileSize,
          y * tileSize,
          tileType,
          true,
          collisionModifier
        );
      }
    }
  }

  generateStaticObject(
    x: number,
    y: number,
    texture: string,
    exempt = false,
    collisionModifier = 0
  ) {
    const objectID = this.staticObjectFactory.create(x, y, texture, exempt);
    const bounds = getBoundingBox(objectID);
    if (!bounds) {
      this.logger.info(`No bounds for ${objectID}`);
    }
    this.objectSpatialIndex.insert({
      eid: objectID,
      exempt: true,
      collisionModifier: collisionModifier,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
    });
    this.logger.debug(
      `Added static object ${objectID} with texture ${texture} to spatial index`
    );
  }

  getTimeState(): TimeState {
    return this.timeSystem.getTimeState();
  }

  private onEntityDestroyed({ entityId }: DestroyEntityEventPayload) {
    if (this.focusedObject === entityId) {
      this.focusedObject = null;
      this.arrow.setVisible(false);
    }
    const collider = getCollider(entityId);
    this.objectSpatialIndex.remove(collider, (a, b) => {
      return a.eid === b.eid;
    });
    this.staticObjectFactory.release(entityId);
    this.logger.info(`Entity ${entityId} destroyed`);
  }

  private attackFocusTarget() {
    const damage = 25;
    if (this.focusedObject) {
      EventBus.emit('damage', { entity: this.focusedObject, damage });
      this.logger.info(`Damaging ${this.focusedObject}`);
    }
  }

  private onDamage({ entity, damage }: DamageEventPayload) {
    Health.current[entity] -= damage;
    this.logger.info(
      `Damage ${damage} to ${entity}, health: ${Health.current[entity]}`
    );
  }
}
