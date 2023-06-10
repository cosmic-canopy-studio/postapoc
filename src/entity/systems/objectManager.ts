import {
  DEFAULT_ITEM_COLLISION_MODIFIER,
  DEFAULT_OBJECT_COLLISION_MODIFIER,
} from '@src/entity/data/constants';
import itemsData from '@src/entity/data/items.json';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { Item, StaticObject } from '@src/entity/data/types';
import EntityCreator from '@src/entity/factories/entityFactory';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { movement } from '@src/movement/systems/movement';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import RBush from 'rbush';

export default class ObjectManager {
  private logger;
  private entityCreator: EntityCreator;
  private objectSpatialIndex!: RBush<ICollider>;
  private itemsMap: Map<string, Item>;
  private staticObjectsMap: Map<string, StaticObject>;
  private readonly world: IWorld;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
    this.entityCreator = new EntityCreator(scene, world);
    this.itemsMap = new Map<string, Item>(
      itemsData.map((item) => [item.id, item])
    );

    this.staticObjectsMap = new Map<string, StaticObject>(
      staticObjectsData.map((staticObject) => [staticObject.id, staticObject])
    );
  }

  initialize() {
    this.objectSpatialIndex = new RBush<ICollider>();
    this.logger.debug('ObjectManager initialized');
  }

  update(adjustedDeltaTime: number) {
    movement(this.world, adjustedDeltaTime / 1000, this.objectSpatialIndex);
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
    const objectID = this.entityCreator.createEntity(
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
    const objectID = this.entityCreator.createEntity('item', x, y, itemId);
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

  releaseEntity(entityType: string, id: number): void {
    this.entityCreator.releaseEntity(entityType, id);
  }

  canItemBePickedUp(itemId: string): boolean {
    const item = this.getItemDetails(itemId);
    return item ? item.canBePickedUp : false;
  }

  getItemDetails(itemId: string): Item | null {
    return this.itemsMap.get(itemId) || null;
  }

  getObjectDetails(objectId: string): StaticObject | null {
    return this.staticObjectsMap.get(objectId) || null;
  }
}
