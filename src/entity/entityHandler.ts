import { getLogger } from '@src/telemetry/logger';
import { DestroyEntityEventPayload } from '@src/config/eventTypes';
import { getSprite } from '@src/entity/phaserSprite';
import { getCollider } from '@src/movement/collider';
import { focusSystem } from '@src/action/focusSystem';
import { Focus, getFocusTarget, updateFocusTarget } from '@src/action/focus';
import PlayerManager from '@src/managers/playerManager';
import ObjectManager from '@src/managers/objectManager';
import * as Phaser from 'phaser';
import EventBus from '@src/core/eventBus';
import { IUpdatableHandler } from '@src/config/interfaces';
import { DROP_SPREAD_RADIUS } from '@src/config/constants';

export class EntityHandler implements IUpdatableHandler {
  private logger;
  private arrow!: Phaser.GameObjects.Sprite;
  private playerManager!: PlayerManager;
  private objectManager!: ObjectManager;

  constructor(
    scene: Phaser.Scene,
    playerManager: PlayerManager,
    objectManager: ObjectManager
  ) {
    this.logger = getLogger('entity');
    this.arrow = this.createArrow(scene);
    this.playerManager = playerManager;
    this.objectManager = objectManager;
  }

  initialize() {
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
  }

  update() {
    const player = this.playerManager.getPlayer();
    let focusTarget = getFocusTarget(player);
    if (focusTarget === 0) {
      this.logger.debug(`No focus target set for ${player}`);
      focusTarget = focusSystem(
        player,
        this.objectManager.getObjectSpatialIndex(),
        this.arrow
      );
      if (focusTarget) {
        this.logger.info(`Focus target set to ${focusTarget}`);
        updateFocusTarget(player, focusTarget);
      }
    }
  }

  onEntityDestroyed(payload: DestroyEntityEventPayload) {
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
