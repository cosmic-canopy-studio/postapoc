import { getLogger } from '@src/telemetry/logger';
import { getSprite } from '@src/entity/components/phaserSprite';
import { getCollider } from '@src/movement/components/collider';
import { focus } from '@src/action/systems/focus';
import {
  Focus,
  getFocusTarget,
  updateFocusTarget,
} from '@src/action/components/focus';
import PlayerManager from '@src/entity/systems/playerManager';
import ObjectManager from '@src/entity/systems/objectManager';
import * as Phaser from 'phaser';
import EventBus from '@src/core/eventBus';
import { IUpdatableHandler } from '@src/config/interfaces';
import { DROP_SPREAD_RADIUS } from '@src/config/constants';
import { EntityIDPayload } from '@src/entity/data/events';

export default class EntityHandler implements IUpdatableHandler {
  private logger;
  private readonly arrow!: Phaser.GameObjects.Sprite;
  private playerManager!: PlayerManager;
  private objectManager!: ObjectManager;
  private readonly world: IWorld;
  constructor(
    scene: Phaser.Scene,
    playerManager: PlayerManager,
    objectManager: ObjectManager,
    world: IWorld
  ) {
    this.logger = getLogger('entity');
    this.arrow = this.createArrow(scene);
    this.playerManager = playerManager;
    this.objectManager = objectManager;
    this.world = world;
  }

  initialize() {
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
    EventBus.on('itemPickedUp', this.onItemPickedUp.bind(this));
  }

  update() {
    const player = this.playerManager.getPlayer();
    let focusTarget = getFocusTarget(player);
    if (focusTarget === 0) {
      this.logger.debug(`No focus target set for ${player}`);
      focusTarget =
        focus(player, this.objectManager.getObjectSpatialIndex(), this.arrow) ||
        0;
      if (focusTarget !== 0) {
        this.logger.info(`Focus target set to ${focusTarget}`);
        updateFocusTarget(player, focusTarget);
      }
    }
  }

  private onItemPickedUp(payload: EntityIDPayload) {
    this.logger.debug(`${payload.entityId} attempting to pick up item`);
    const { entityId } = payload;
    const focusedObject = getFocusTarget(entityId);
    this.logger.debug(`${entityId} current focus for pickup: ${focusedObject}`);
    if (focusedObject) {
      this.removeWorldEntity(focusedObject);
      addToInventory(this.world, entityId, focusedObject);
      this.logger.info(`${entityId} picked up ${focusedObject}`);
    }
  }

  onEntityDestroyed(payload: EntityIDPayload) {
    const { entityId } = payload;

    for (let entity = 0; entity < Focus.target.length; entity++) {
      if (getFocusTarget(entity) === entityId) {
        this.logger.info(`Unsetting focus target for ${entity}`);
        updateFocusTarget(entity, 0); // Unset the focus target
      }
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
    const spreadRadius = DROP_SPREAD_RADIUS;
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

  private createArrow(scene: Phaser.Scene, visible = false) {
    const arrow = scene.add.sprite(0, 0, 'red_arrow');
    arrow.setVisible(visible);
    return arrow;
  }
}
