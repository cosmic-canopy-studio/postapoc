import { getLogger } from '@src/telemetry/systems/logger';
import {
  getSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
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
import { IUpdatableHandler } from '@src/core/config/interfaces';
import { DROP_SPREAD_RADIUS } from '@src/core/config/constants';
import { EntityIDPayload } from '@src/entity/data/events';
import { addToInventory } from '@src/entity/components/inventory';
import { IWorld } from 'bitecs';
import { getEntityNameWithID } from '@src/entity/components/names';

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
      focusTarget =
        focus(player, this.objectManager.getObjectSpatialIndex(), this.arrow) ||
        0;
      if (focusTarget !== 0) {
        updateFocusTarget(player, focusTarget);
      }
    }
  }

  private onItemPickedUp(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.debug(
      `${getEntityNameWithID(entityId)} attempting to pick up item`
    );
    const focusedObject = getFocusTarget(entityId);
    this.logger.debug(
      `${getEntityNameWithID(
        entityId
      )} current focus for pickup: ${getEntityNameWithID(focusedObject)}`
    );
    if (focusedObject) {
      this.removeWorldEntity(focusedObject);
      addToInventory(this.world, entityId, focusedObject);
      this.logger.info(
        `${getEntityNameWithID(entityId)} picked up ${getEntityNameWithID(
          focusedObject
        )})`
      );
    }
  }

  onEntityDestroyed(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.handleDrops(entityId);
    this.removeWorldEntity(entityId);
    this.objectManager.getStaticObjectFactory().release(entityId);
    this.logger.info(`Entity ${getEntityNameWithID(entityId)}) destroyed`);
  }

  private handleDrops(entityId: number) {
    const objectSprite = getSprite(entityId);
    if (!objectSprite) {
      this.logger.error(`No sprite for entity ${entityId}`);
      return;
    }

    const objectName = objectSprite.texture.key;
    const droppedItems = this.objectManager
      .getLootTable()
      .generateDrops(objectName);
    this.logger.info(
      `Dropping items ${droppedItems} from ${getEntityNameWithID(entityId)})`
    );
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

  private removeWorldEntity(entityId: number) {
    // Remove sprite
    removePhaserSprite(entityId);

    // Remove from spatial index
    const collider = getCollider(entityId);
    this.objectManager.getObjectSpatialIndex().remove(collider, (a, b) => {
      return a.eid === b.eid;
    });

    // Update focus
    for (let entityID = 0; entityID < Focus.target.length; entityID++) {
      if (getFocusTarget(entityID) === entityId) {
        this.logger.info(
          `Unsetting focus target for ${getEntityNameWithID(entityId)})`
        );
        updateFocusTarget(entityId, 0); // Unset the focus target
      }
    }
    this.logger.info(`Entity ${entityId} removed`);
  }

  private createArrow(scene: Phaser.Scene, visible = false) {
    const arrow = scene.add.sprite(0, 0, 'red_arrow');
    arrow.setVisible(visible);
    return arrow;
  }
}
