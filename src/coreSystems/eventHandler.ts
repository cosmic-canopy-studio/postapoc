import { getLogger } from '@src/telemetry/logger';
import EventBus from '@src/coreSystems/eventBus';
import PlayerManager from '@src/managers/playerManager';
import ObjectManager from '@src/managers/objectManager';
import {
  ActionEventPayload,
  DamageEventPayload,
  DestroyEntityEventPayload,
  MoveEventPayload,
} from '@src/definitions/eventTypes';
import { getSprite } from '@src/components/phaserSprite';
import { getCollider } from '@src/components/collider';
import { IWorld } from 'bitecs';

import Health from '@src/components/health';
import { focusSystem } from '@src/componentSystems/focusSystem';
import Movement from '@src/components/movement';
import { MOVEMENT_SPEED } from '@src/config/constants';
import { Actions, MoveDirections } from '@src/config/enums';
import { interactionSystem } from '@src/componentSystems/interactionSystem';
import { getInteractionComponent } from '@src/components/interactionComponent';
import { getDamage } from '@src/components/attack';

export default class EventHandler {
  private logger;
  private playerManager: PlayerManager;
  private objectManager: ObjectManager;
  private world: IWorld;
  private arrow!: Phaser.GameObjects.Sprite;
  private focusedObject: number | null = null;

  constructor(
    playerManager: PlayerManager,
    objectManager: ObjectManager,
    world: IWorld
  ) {
    this.logger = getLogger('universe');
    this.playerManager = playerManager;
    this.objectManager = objectManager;
    this.world = world;
  }

  initialize(scene: Phaser.Scene) {
    EventBus.on('damage', this.onDamage.bind(this));
    EventBus.on('action', this.onAction.bind(this));
    EventBus.on('move', this.onMove.bind(this));
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
    this.arrow = this.createArrow(scene);
  }

  update() {
    this.focusedObject = focusSystem(
      this.playerManager.getPlayer(),
      this.objectManager.getObjectSpatialIndex(),
      this.arrow
    );
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

  onMove(payload: MoveEventPayload) {
    const { entity, state, action } = payload;
    this.handleMovement(state, action, entity);
  }

  handleMovement(state: boolean, direction: MoveDirections, eid: number) {
    const speed = MOVEMENT_SPEED;
    if (state) {
      switch (direction) {
        case MoveDirections.UP:
          Movement.ySpeed[eid] = -speed;
          break;
        case MoveDirections.DOWN:
          Movement.ySpeed[eid] = speed;
          break;
        case MoveDirections.LEFT:
          Movement.xSpeed[eid] = -speed;
          break;
        case MoveDirections.RIGHT:
          Movement.xSpeed[eid] = speed;
          break;
      }
    } else {
      switch (direction) {
        case MoveDirections.UP:
        case MoveDirections.DOWN:
          Movement.ySpeed[eid] = 0;
          break;
        case MoveDirections.LEFT:
        case MoveDirections.RIGHT:
          Movement.xSpeed[eid] = 0;
          break;
      }
    }

    getLogger('movement').debug(
      `Entity ${eid} move ${direction} ${state ? 'start' : 'stop'}`
    );
  }

  private createArrow(scene: Phaser.Scene, visible = false) {
    const arrow = scene.add.sprite(0, 0, 'red_arrow');
    arrow.setVisible(visible);
    return arrow;
  }

  private onInteract(interactingEntity: number) {
    if (this.focusedObject) {
      this.logger.info(
        `${interactingEntity} interacting with ${this.focusedObject}`
      );
      const interactionComponent = getInteractionComponent(this.focusedObject);
      if (interactionComponent) {
        const interactionName = 'PickUp';
        interactionSystem(this.focusedObject, interactionName);
      } else {
        this.logger.info(
          `No interaction component found for ${this.focusedObject}`
        );
      }
    }
  }

  private onEntityDestroyed({ entityId }: DestroyEntityEventPayload) {
    if (this.focusedObject === entityId) {
      this.focusedObject = null;
      this.arrow?.setVisible(false);
    }
    const objectSprite = getSprite(entityId);
    if (!objectSprite) {
      this.logger.error(`No sprite for entity ${entityId}`);
      return;
    }

    const objectName = objectSprite.texture.key;
    const droppedItems = this.objectManager
      .getLootTable()
      .generateDrops(objectName);
    this.logger.info(`Dropping items ${droppedItems} from ${objectName}`);
    const objectPosition: Phaser.Math.Vector2 = objectSprite.getCenter();
    this.handleDrops(droppedItems, objectPosition);

    const collider = getCollider(entityId);
    this.objectManager.getObjectSpatialIndex().remove(collider, (a, b) => {
      return a.eid === b.eid;
    });
    this.objectManager.getStaticObjectFactory().release(entityId);
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
      this.objectManager.generateStaticObject(
        objectPosition.x + offsetX,
        objectPosition.y + offsetY,
        item
      );
    });
  }

  private onAttack(attackingEntity: number) {
    const damage = getDamage(attackingEntity);
    if (this.focusedObject) {
      EventBus.emit('damage', { entity: this.focusedObject, damage });
      this.logger.info(`${attackingEntity} is damaging ${this.focusedObject}`);
    }
  }

  private onDamage({ entity, damage }: DamageEventPayload) {
    Health.current[entity] -= damage;
    this.logger.info(
      `Damage ${damage} to ${entity}, health: ${Health.current[entity]}`
    );
  }
}
