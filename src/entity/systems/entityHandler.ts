import { getLogger } from '@src/telemetry/systems/logger';
import {
  getSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { getCollider } from '@src/movement/components/collider';
import FocusManager from '@src/action/systems/focusManager';
import {
  clearFocusTarget,
  Focus,
  getFocusTarget,
} from '@src/action/components/focus';
import PlayerManager from '@src/entity/systems/playerManager';
import ObjectManager from '@src/entity/systems/objectManager';
import * as Phaser from 'phaser';
import EventBus from '@src/core/systems/eventBus';
import { IUpdatableHandler } from '@src/core/data/interfaces';
import { DROP_SPREAD_RADIUS } from '@src/core/config/constants';
import { EntityIDPayload } from '@src/entity/data/events';
import { addToInventory } from '@src/entity/components/inventory';
import { IWorld } from 'bitecs';
import { getEntityNameWithID } from '@src/entity/components/names';
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
  }

  update() {
    this.focusManager.update(
      this.playerManager.getPlayer(),
      this.objectManager.getObjectSpatialIndex()
    );
  }

  onEntityDestroyed(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.info(`Destroying ${getEntityNameWithID(entityId)}`);
    this.handleDrops(entityId);
    this.removeWorldEntity(entityId);
    this.objectManager.getStaticObjectFactory().release(entityId);
  }

  private onToggleInventory(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.logger.debug(
      `Toggling inventory for ${getEntityNameWithID(entityId)}`
    );
    if (this.scene.isActive('InventoryScene')) {
      this.scene.stop('InventoryScene');
    } else {
      this.scene.launch('InventoryScene', { entityId: entityId });
    }
  }

  private onToggleHelp() {
    this.logger.debug(`Toggling help screen.`);
    if (this.scene.isActive('HelpScene')) {
      this.scene.stop('HelpScene');
    } else {
      this.scene.launch('HelpScene');
    }
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
      addToInventory(this.world, entityId, focusedObjectEntityId);
      this.logger.info(
        `${getEntityNameWithID(entityId)} picked up ${getEntityNameWithID(
          focusedObjectEntityId
        )})`
      );
    }
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
