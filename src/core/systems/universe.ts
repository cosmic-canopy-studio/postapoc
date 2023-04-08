// Part: src/core/systems/universe.ts
// Code Reference: https://github.com/developit/mitt
// Documentation:

// Code Reference: https://github.com/mourner/rbush

import DebugPanel from '@src/core/components/debugPanel';
import { getLogger } from '@src/core/components/logger';
import EventBus from '@src/core/systems/eventBus';
import container from '@src/core/systems/inversify.config';
import {
  getBoundingBox,
  getCollider,
  ICollider,
} from '@src/ecs/components/collider';
import Health from '@src/ecs/components/health';
import { focusSystem } from '@src/ecs/systems/focusSystem';
import { healthSystem } from '@src/ecs/systems/healthSystem';
import { movementSystem } from '@src/ecs/systems/movementSystem';
import { TimeState } from '@src/core/systems/timeSystem';
import PlayerFactory from '@src/phaser/factories/playerFactory';
import StaticObjectFactory from '@src/phaser/factories/staticObjectFactory';
import { createWorld, IWorld } from 'bitecs';
import Phaser, { Scene } from 'phaser';
import RBush from 'rbush';
import { LootTable } from '@src/core/systems/lootTable';
import { getSprite } from '@src/ecs/components/phaserSprite';
import { movementEvents } from '@src/core/events/movementEvents';
import {
  ActionEventPayload,
  DamageEventPayload,
  DestroyEntityEventPayload,
} from '@src/core/definitions/eventTypes';
import { ITimeController, ITimeSystem } from '@src/core/definitions/interfaces';
import ControlSystem from '@src/core/systems/controlSystem';
import {
  TIME_CONTROLLER_FACTORY,
  TIME_SYSTEM,
} from '@src/core/definitions/constants';
import { Actions } from '@src/core/events/actionEvents';
import { ContainerFactory } from '@src/phaser/factories/containerFactory';

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
  private lootTable!: LootTable;
  private containerFactory!: ContainerFactory;

  initialize(scene: Phaser.Scene) {
    this.scene = scene;
    this.world = createWorld();
    this.lootTable = new LootTable();
    this.objectSpatialIndex = new RBush<ICollider>();
    this.staticObjectFactory = new StaticObjectFactory(this.scene, this.world);
    this.playerFactory = new PlayerFactory(this.scene, this.world);
    this.containerFactory = new ContainerFactory();

    movementEvents();

    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    const timeControllerFactory = container.get<
      (scene: Scene) => ITimeController
    >(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this.scene);
    this.arrow = this.scene.add.sprite(0, 0, 'red_arrow');
    this.arrow.setVisible(false);

    EventBus.on('damage', this.onDamage.bind(this));
    EventBus.on('action', this.onAction.bind(this));
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
  }

  onAction(payload: ActionEventPayload) {
    switch (payload.action) {
      case Actions.ATTACK:
        this.onAttack(payload.entity);
        break;
      case Actions.INTERACT:
        this.onInteract(payload.entity);
        break;
    }
  }

  update(time: number, deltaTime: number) {
    const adjustedDeltaTime = this.timeSystem.getAdjustedDeltaTime(deltaTime);
    const timeState = this.timeSystem.getTimeState();
    if (timeState !== TimeState.PAUSED) {
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
    }
  }

  spawnPlayer() {
    this.player = this.playerFactory.createPlayer(this.containerFactory);
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    new DebugPanel(this.world, this.player);
  }

  generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    const collisionModifier = 0.9;
    const grassVariants = ['grass', 'grass2', 'grass3', 'grass4'];
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const randomIndex = Math.floor(Math.random() * grassVariants.length);
        const tileType = grassVariants[randomIndex];
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

  private onInteract(interactingEntity: number) {
    if (this.focusedObject) {
      this.logger.info(`Interacting with ${this.focusedObject}`);
    }
    // TODO: Implement interaction component
    // TODO: Implement interaction system
    // TODO: Get interaction component from focused object
    // TODO: Call interaction component's interact method
  }

  private onEntityDestroyed({ entityId }: DestroyEntityEventPayload) {
    if (this.focusedObject === entityId) {
      this.focusedObject = null;
      this.arrow.setVisible(false);
    }
    const objectSprite = getSprite(entityId);
    if (!objectSprite) {
      this.logger.error(`No sprite for entity ${entityId}`);
      return;
    }

    const objectName = objectSprite.texture.key;
    const droppedItems = this.lootTable.generateDrops(objectName);
    this.logger.info(`Dropping items ${droppedItems} from ${objectName}`);
    const objectPosition = objectSprite.getCenter();
    this.handleDrops(droppedItems, objectPosition);

    const collider = getCollider(entityId);
    this.objectSpatialIndex.remove(collider, (a, b) => {
      return a.eid === b.eid;
    });
    this.staticObjectFactory.release(entityId);
    this.logger.info(`Entity ${entityId} destroyed`);
  }

  private handleDrops(
    droppedItems: string[],
    objectPosition: Phaser.Math.Vector2
  ) {
    const spreadRadius = 50;
    droppedItems.forEach((item) => {
      const offsetX = Math.random() * spreadRadius - spreadRadius / 2;
      const offsetY = Math.random() * spreadRadius - spreadRadius / 2;
      this.generateStaticObject(
        objectPosition.x + offsetX,
        objectPosition.y + offsetY,
        item
      );
    });
  }

  private onAttack(attackingEntity: number) {
    // TODO: Use attack component
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
