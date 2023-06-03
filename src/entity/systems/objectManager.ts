import { getLogger } from '@src/telemetry/systems/logger';
import StaticObjectFactory from '@src/entity/systems/staticObjectFactory';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { IWorld } from 'bitecs';
import RBush from 'rbush';
import { LootDrops } from '@src/entity/systems/lootDrops';
import { movement } from '@src/movement/systems/movement';

export default class ObjectManager {
  private logger;
  private staticObjectFactory!: StaticObjectFactory;
  private objectSpatialIndex!: RBush<ICollider>;
  private lootTable!: LootDrops;
  private readonly world: IWorld;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
  }

  initialize() {
    this.staticObjectFactory = new StaticObjectFactory(this.scene, this.world);
    this.objectSpatialIndex = new RBush<ICollider>();
    this.lootTable = new LootDrops();
    this.logger.debug('ObjectManager initialized');
  }

  generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    const collisionModifier = 0.9;
    const grassVariants = ['grass', 'grass2', 'grass3', 'grass4'];
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const randomIndex = Math.floor(Math.random() * grassVariants.length);
        const tileType = grassVariants[randomIndex];
        this.generateStaticObject(
          x * tileSize,
          y * tileSize,
          tileType,
          true,
          collisionModifier
        );
      }
    }
  }

  generateStaticObject(
    x: number,
    y: number,
    texture: string,
    exempt = false,
    collisionModifier = 0
  ) {
    const objectID = this.staticObjectFactory.create(x, y, texture, exempt);
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
      exempt: true,
      collisionModifier: collisionModifier,
    });
    this.logger.debug(
      `Added static object ${objectID} with texture ${texture} to spatial index`
    );
  }

  update(adjustedDeltaTime: number) {
    movement(this.world, adjustedDeltaTime / 1000, this.objectSpatialIndex);
  }

  public getStaticObjectFactory() {
    return this.staticObjectFactory;
  }

  public getObjectSpatialIndex() {
    return this.objectSpatialIndex;
  }

  public getLootTable() {
    return this.lootTable;
  }
}
