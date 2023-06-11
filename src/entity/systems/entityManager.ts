import { ECS_NULL } from '@src/core/config/constants';
import ControlSystem from '@src/core/systems/controlSystem';
import {
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import {
  DEFAULT_ITEM_COLLISION_MODIFIER,
  DEFAULT_OBJECT_COLLISION_MODIFIER,
} from '@src/entity/data/constants';
import itemsData from '@src/entity/data/items.json';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { Item, StaticObject } from '@src/entity/data/types';
import EntityFactory from '@src/entity/factories/entityFactory';
import FocusManager from '@src/entity/systems/focusManager';
import { healthSystem } from '@src/entity/systems/healthSystem';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { movement } from '@src/movement/systems/movement';
import DebugPanel from '@src/telemetry/systems/debugPanel';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import RBush from 'rbush';

export default class EntityManager {
  private logger;
  private entityFactory!: EntityFactory;
  private focusManager!: FocusManager;
  private readonly world: IWorld;
  private playerId!: number;
  private debugPanel: DebugPanel;
  private controlSystem: ControlSystem;
  private objectSpatialIndex!: RBush<ICollider>;
  private itemsMap: Map<string, Item>;
  private staticObjectsMap: Map<string, StaticObject>;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
    this.controlSystem = new ControlSystem();
    this.debugPanel = new DebugPanel();
    this.itemsMap = new Map<string, Item>(
      itemsData.map((item) => [item.id, item])
    );

    this.staticObjectsMap = new Map<string, StaticObject>(
      staticObjectsData.map((staticObject) => [staticObject.id, staticObject])
    );
  }

  initialize() {
    this.entityFactory = new EntityFactory(this.scene, this.world);
    this.objectSpatialIndex = new RBush<ICollider>();
    this.logger.debug('EntityManager initialized');
    this.controlSystem.initialize(this.scene);
    this.focusManager = new FocusManager(this.scene);
  }

  update(adjustedDeltaTime: number) {
    healthSystem(this.world);
    movement(this.world, adjustedDeltaTime / 1000, this.objectSpatialIndex);
    this.focusManager.update(this.playerId, this.objectSpatialIndex);
  }

  public getObjectByEid(eid: number): ICollider | null {
    const allObjects = this.objectSpatialIndex.all();
    for (const obj of allObjects) {
      if (obj.eid === eid) {
        return obj;
      }
    }
    return null;
  }

  generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        this.generateStaticObject(x * tileSize, y * tileSize, 'grass');
      }
    }
  }

  generateStaticObject(x: number, y: number, staticObjectId: string) {
    const objectID = this.entityFactory.createEntity(
      'staticObject',
      x,
      y,
      staticObjectId
    );
    const objectDetails = this.getObjectDetails(staticObjectId);

    if (!objectDetails) {
      this.logger.info(`No object details for ${objectID}`);
      return;
    }

    const bounds = getBoundingBox(objectID);
    if (!bounds) {
      this.logger.info(`No bounds for ${objectID}`);
    }

    const collisionModifier =
      objectDetails.collisionModifier || DEFAULT_OBJECT_COLLISION_MODIFIER;

    this.objectSpatialIndex.insert({
      eid: objectID,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
      exempt: objectDetails.focusExempt,
      collisionModifier: collisionModifier,
    });

    this.logger.debugVerbose(
      `Added static object ${objectID} with texture ${staticObjectId} to spatial index`
    );
  }

  generateItem(x: number, y: number, itemId: string) {
    this.logger.info(`Generating item ${itemId} at ${x}, ${y}`);
    this.logger.info(`Entity factory: ${this.entityFactory}`);
    const objectID = this.entityFactory.createEntity('item', x, y, itemId);
    const itemDetails = this.getItemDetails(itemId);

    if (!itemDetails) {
      this.logger.info(`No item details for ${objectID}`);
      return;
    }

    const bounds = getBoundingBox(objectID);
    if (!bounds) {
      this.logger.info(`No bounds for ${objectID}`);
    }

    this.objectSpatialIndex.insert({
      eid: objectID,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
      exempt: false,
      collisionModifier: DEFAULT_ITEM_COLLISION_MODIFIER,
    });

    this.logger.debugVerbose(
      `Added item ${objectID} with texture ${itemId} to spatial index`
    );
  }

  getObjectSpatialIndex() {
    return this.objectSpatialIndex;
  }

  releaseEntity(entityType: string, id: number) {
    const playerId = this.getPlayerId();
    const playerFocusId = getFocusTarget(playerId);
    if (playerFocusId === id) {
      updateFocusTarget(playerId, ECS_NULL);
    }
    this.entityFactory.releaseEntity(entityType, id);
  }

  canItemBePickedUp(itemId: string) {
    const item = this.getItemDetails(itemId);
    this.logger.debug('Item can be picked up:', item?.canBePickedUp);
    return item ? item.canBePickedUp : false;
  }

  getItemDetails(itemId: string) {
    const item = this.itemsMap.get(itemId.toLowerCase());
    this.logger.debug('Item details:', item);
    return item || null;
  }

  getObjectDetails(objectId: string) {
    const object = this.staticObjectsMap.get(objectId.toLowerCase());
    this.logger.debug('Object details:', object);
    return object || null;
  }

  spawnPlayer(x: number, y: number, playerId: string) {
    this.playerId = this.entityFactory.createEntity('creature', x, y, playerId);
    this.controlSystem.setPlayer(this.playerId);
    this.debugPanel.setPlayer(this.playerId);
  }

  getPlayerId() {
    return this.playerId;
  }
}
