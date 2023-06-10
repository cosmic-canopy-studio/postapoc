import {
  DEFAULT_ITEM_COLLISION_MODIFIER,
  DEFAULT_OBJECT_COLLISION_MODIFIER,
} from '@src/entity/data/constants';
import itemsData from '@src/entity/data/items.json';
import { Item } from '@src/entity/data/types';
import EntityCreator from '@src/entity/factories/entityFactory';
import StaticObjectFactory from '@src/entity/factories/staticObjectFactory';
import { LootDrops } from '@src/entity/systems/lootDrops';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { movement } from '@src/movement/systems/movement';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import RBush from 'rbush';

export default class ObjectManager {
  private logger;
  private entityCreator: EntityCreator;
  private objectSpatialIndex!: RBush<ICollider>;
  private lootTable!: LootDrops;
  private itemsMap: Map<string, Item>;
  private readonly world: IWorld;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
    this.entityCreator = new EntityCreator(scene, world);
    this.itemsMap = new Map<string, Item>(
      itemsData.map((item) => [item.id, item])
    );
  }

  initialize() {
    this.objectSpatialIndex = new RBush<ICollider>();
    this.lootTable = new LootDrops();
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

  generateStaticObject(x: number, y: number, id: string) {
    const objectID = this.entityCreator.createEntity('staticObject', x, y, id);
    const objectDetails = (
      this.entityCreator.factories['staticObject'] as StaticObjectFactory
    ).getObjectDetails(id);

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
      `Added static object ${objectID} with texture ${id} to spatial index`
    );
  }

  generateItem(x: number, y: number, id: string) {
    const objectID = this.entityCreator.createEntity('item', x, y, id);
    const itemDetails = this.getItemDetails(id);

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
      `Added item ${objectID} with texture ${id} to spatial index`
    );
  }

  getObjectSpatialIndex() {
    return this.objectSpatialIndex;
  }

  getLootTable() {
    return this.lootTable;
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
}
