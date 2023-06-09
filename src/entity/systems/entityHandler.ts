import { getLogger } from '@src/telemetry/systems/logger';
import {
  getSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { getCollider } from '@src/movement/components/collider';
import FocusManager from '@src/entity/systems/focusManager';
import {
  clearFocusTarget,
  Focus,
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import PlayerManager from '@src/entity/systems/playerManager';
import ObjectManager from '@src/entity/systems/objectManager';
import * as Phaser from 'phaser';
import EventBus from '@src/core/systems/eventBus';
import { IUpdatableHandler } from '@src/core/data/interfaces';
import { DROP_SPREAD_RADIUS } from '@src/core/config/constants';
import { CraftedItemsPayload, EntityIDPayload } from '@src/entity/data/events';
import { addItemToInventory } from '@src/entity/components/inventory';
import { IWorld } from 'bitecs';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import { entityCanBePickedUp } from '@src/entity/components/canPickup';
import ScenePlugin = Phaser.Scenes.ScenePlugin;

export default class EntityHandler implements IUpdatableHandler {
  private logger;
  private playerManager!: PlayerManager;
  private objectManager!: ObjectManager;
  private focusManager!: FocusManager;
  private readonly world: IWorld;
  private scene: ScenePlugin;

  constructor(
    scene: Phaser.Scene,
    playerManager: PlayerManager,
    objectManager: ObjectManager,
    world: IWorld
  ) {
    this.logger = getLogger('entity');
    this.playerManager = playerManager;
    this.objectManager = objectManager;
    this.focusManager = new FocusManager(scene);
    this.world = world;
    this.scene = scene.scene;
  }

  initialize() {
    EventBus.on('destroyEntity', this.onEntityDestroyed.bind(this));
    EventBus.on('itemPickedUp', this.onItemPickedUp.bind(this));
    EventBus.on('toggleInventory', this.onToggleInventory.bind(this));
    EventBus.on('toggleHelp', this.onToggleHelp.bind(this));
    EventBus.on('toggleCrafting', this.onToggleCrafting.bind(this));
    EventBus.on('switchFocus', this.onSwitchFocus.bind(this));
    EventBus.on('itemCrafted', this.onItemCrafted.bind(this));
  }

  update() {
    this.focusManager.update(
      this.playerManager.getPlayer(),
      this.objectManager.getObjectSpatialIndex()
    );
  }

  onToggleCrafting(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('CraftScene', entityId);
  }

  private onItemCrafted(payload: CraftedItemsPayload) {
    const { creatingEntityId, createdItemName, createdItemQuantity } = payload;
    this.logger.debug(
      `Dropping ${createdItemQuantity} ${createdItemName} near ${getEntityNameWithID(
        creatingEntityId
      )}`
    );
    // create an array with a string for each item in the quantity
    const craftedDrop: string[] =
      Array(createdItemQuantity).fill(createdItemName);
    this.dropItemsNearEntity(creatingEntityId, craftedDrop);
  }

  private onSwitchFocus(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.debug(`Switching focus for ${getEntityNameWithID(entityId)}`);
    updateFocusTarget(this.playerManager.getPlayer(), entityId);
  }

  private onEntityDestroyed(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.info(`Destroying ${getEntityNameWithID(entityId)}`);
    this.handleDrops(entityId);
    this.removeWorldEntity(entityId);
    this.objectManager.getStaticObjectFactory().release(entityId);
  }

  private toggleScene(sceneName: string, entityId: number) {
    this.logger.debug(
      `Toggling ${sceneName} for ${getEntityNameWithID(entityId)}`
    );
    if (this.scene.isActive(sceneName)) {
      this.scene.stop(sceneName);
    } else {
      this.scene.launch(sceneName, { entityId: entityId });
    }
  }

  private onToggleInventory(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('InventoryScene', entityId);
  }

  private onToggleHelp(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('HelpScene', entityId);
  }

  private onItemPickedUp(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.debugVerbose(
      `${getEntityNameWithID(entityId)} attempting to pick up item`
    );

    const focusedObjectEntityId = getFocusTarget(entityId);
    const canBePickedUp = entityCanBePickedUp(focusedObjectEntityId);
    if (!canBePickedUp) {
      this.logger.warn(
        `Item ${getEntityNameWithID(
          focusedObjectEntityId
        )} cannot be picked up.`
      );
      return;
    }
    this.logger.debug(
      `${getEntityNameWithID(
        entityId
      )} current focus for pickup: ${getEntityNameWithID(
        focusedObjectEntityId
      )}`
    );
    if (focusedObjectEntityId) {
      this.removeWorldEntity(focusedObjectEntityId);
      addItemToInventory(entityId, focusedObjectEntityId);
      this.logger.info(
        `${getEntityNameWithID(entityId)} picked up ${getEntityNameWithID(
          focusedObjectEntityId
        )})`
      );
      EventBus.emit('refreshInventory', { entityId: entityId });
    }
  }

  private handleDrops(entityId: number) {
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
    return this.objectManager.getLootTable().generateDrops(objectName);
  }

  private dropItemsNearEntity(entityId: number, droppedItems: string[]) {
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
      this.objectManager.generateStaticObject(
        objectPosition.x + offsetX,
        objectPosition.y + offsetY,
        item,
        false,
        1
      );
    });
  }

  private removeWorldEntity(entityId: number) {
    removePhaserSprite(entityId);

    const collider = getCollider(entityId);
    this.objectManager.getObjectSpatialIndex().remove(collider, (a, b) => {
      return a.eid === b.eid;
    });

    for (
      let focusingEntityId = 0;
      focusingEntityId < Focus.target.length;
      focusingEntityId++
    ) {
      if (getFocusTarget(focusingEntityId) === entityId) {
        this.logger.info(
          `Unsetting focus target for ${getEntityNameWithID(focusingEntityId)}`
        );
        const playerEntityId = this.playerManager.getPlayer();
        if (focusingEntityId === playerEntityId) {
          this.focusManager.removeFocus(playerEntityId);
        } else {
          clearFocusTarget(focusingEntityId);
        }
      }
    }
    this.logger.info(`Entity ${entityId} removed`);
  }
}
