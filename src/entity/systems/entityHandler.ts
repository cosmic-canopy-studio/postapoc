import { DROP_SPREAD_RADIUS, ECS_NULL } from '@src/core/config/constants';
import EventBus from '@src/core/systems/eventBus';
import {
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import { addItemToInventory } from '@src/entity/components/inventory';
import {
  getSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { CraftedItemsPayload, EntityIDPayload } from '@src/entity/data/events';
import { LootDrop } from '@src/entity/data/types';
import EntityManager from '@src/entity/systems/entityManager';
import {
  getEntityName,
  getEntityNameWithID,
} from '@src/entity/systems/entityNames';
import { getCollider } from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import * as Phaser from 'phaser';

export default class EntityHandler {
  private logger;
  private entityManager;

  constructor(
    scene: Phaser.Scene,
    world: IWorld,
    entityManager: EntityManager
  ) {
    this.logger = getLogger('entity');
    this.entityManager = entityManager;
  }

  initialize() {
    EventBus.on('itemPickedUp', this.onItemPickedUp.bind(this));
    EventBus.on('itemCrafted', this.onItemCrafted.bind(this));
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
  }

  onItemCrafted(payload: CraftedItemsPayload) {
    const { creatingEntityId, createdItemName, createdItemQuantity } = payload;
    this.logger.debug(
      `Dropping ${createdItemQuantity} ${createdItemName} near ${getEntityNameWithID(
        creatingEntityId
      )}`
    );
    const craftedDrop: string[] =
      Array(createdItemQuantity).fill(createdItemName);
    this.dropItemsNearEntity(creatingEntityId, craftedDrop);
  }

  generateDrops(objectName: string): string[] {
    const lootTable =
      this.entityManager.getObjectDetails(objectName)?.lootTable;
    if (!lootTable) {
      this.logger.warn(`No item group found for ${objectName}`);
      return [];
    }
    const drops: string[] = [];
    lootTable.forEach((drop: LootDrop) => {
      for (let i = 0; i < drop.count; i++) {
        const roll = Math.random() * 100;
        if (roll <= drop.drop_chance) {
          drops.push(drop.id);
        }
      }
    });
    return drops;
  }

  dropItemsNearEntity(entityId: number, droppedItems: string[]) {
    const objectSprite = getSprite(entityId);
    if (!objectSprite) {
      this.logger.error(`No sprite for entity ${entityId}`);
      return;
    }
    const objectPosition: Phaser.Math.Vector2 = objectSprite.getCenter();
    const spreadRadius = DROP_SPREAD_RADIUS;
    droppedItems.forEach((item) => {
      const offsetX = Math.random() * spreadRadius - spreadRadius / 2;
      const offsetY = Math.random() * spreadRadius - spreadRadius / 2;
      this.entityManager.generateItem(
        objectPosition.x + offsetX,
        objectPosition.y + offsetY,
        item
      );
    });
  }

  private onEntityDestroyed(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.info(`Destroying ${getEntityNameWithID(entityId)}`);
    this.dropLoot(entityId);
    this.removeWorldEntity(entityId);
    this.entityManager.releaseEntity('staticObject', entityId);
  }

  private dropLoot(entityId: number) {
    const droppedItems = this.getEntityLootDrops(entityId);
    this.logger.info(
      `Dropping items ${droppedItems} from ${getEntityNameWithID(entityId)})`
    );
    this.dropItemsNearEntity(entityId, droppedItems);
  }

  private getEntityLootDrops(entityId: number) {
    const objectSprite = getSprite(entityId);
    if (!objectSprite) {
      this.logger.error(`No sprite for entity ${entityId}`);
      return [];
    }
    const objectName = objectSprite.texture.key;
    return this.generateDrops(objectName);
  }

  private removeWorldEntity(entityId: number) {
    removePhaserSprite(entityId);
    this.entityManager
      .getObjectSpatialIndex()
      .remove(getCollider(entityId), (a, b) => {
        return a.eid === b.eid;
      });
    this.logger.info(`Entity ${entityId} removed`);
  }

  private onItemPickedUp(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.debugVerbose(
      `${getEntityNameWithID(entityId)} attempting to pick up item`
    );

    const focusedObjectEntityId = getFocusTarget(entityId);
    const entityName = getEntityName(focusedObjectEntityId);
    const canBePickedUp = this.entityManager.canItemBePickedUp(entityName);
    if (!canBePickedUp) {
      this.logger.warn(`Item ${entityName} cannot be picked up.`);
      return;
    }
    this.logger.debugVerbose(
      `${getEntityNameWithID(
        entityId
      )} current focus for pickup: ${getEntityNameWithID(
        focusedObjectEntityId
      )}`
    );
    if (focusedObjectEntityId) {
      this.removeWorldEntity(focusedObjectEntityId);
      addItemToInventory(entityId, focusedObjectEntityId);
      updateFocusTarget(entityId, ECS_NULL);
      this.logger.info(
        `${getEntityNameWithID(entityId)} picked up ${getEntityNameWithID(
          focusedObjectEntityId
        )})`
      );
      EventBus.emit('refreshInventory', { entityId: entityId });
    }
  }
}
