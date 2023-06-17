import biomes from '@src/biome/data/biomes';
import {
  generateBiomeTileset,
  populateBiome,
} from '@src/biome/systems/biomeManager';
import { ECS_NULL } from '@src/core/config/constants';
import ControlSystem from '@src/core/systems/controlSystem';
import {
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import EntityFactory from '@src/entity/factories/entityFactory';
import {
  getItemDetails,
  getStaticObjectDetails,
} from '@src/entity/systems/dataManager';
import FocusManager from '@src/entity/systems/focusManager';
import { healthSystem } from '@src/entity/systems/healthSystem';
import {
  getBoundingBox,
  getCollider,
  ICollider,
} from '@src/movement/components/collider';
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

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
    this.controlSystem = new ControlSystem();
    this.debugPanel = new DebugPanel();
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

  switchFocus(entityId: number) {
    this.focusManager.findAndSetNewFocusTarget(
      entityId,
      this.objectSpatialIndex
    );
  }

  public getObjectByEid(eid: number): ICollider | null {
    const allObjects = this.objectSpatialIndex.all();
    for (const obj of allObjects) {
      if (obj.entityId === eid) {
        return obj;
      }
    }
    return null;
  }

  generateBiome(
    biomeName: string,
    mapWidth = 50,
    mapHeight = 50,
    tileSize = 32
  ) {
    const biome = biomes[biomeName];
    const tiles = generateBiomeTileset(biome, mapWidth, mapHeight, tileSize);
    const { objects, items } = populateBiome(
      biome,
      mapWidth,
      mapHeight,
      tileSize
    );

    for (const tile of tiles) {
      this.generateStaticObject(tile.x, tile.y, tile.id);
    }

    for (const object of objects) {
      this.generateStaticObject(object.x, object.y, object.id);
    }

    for (const item of items) {
      this.generateItem(item.x, item.y, item.id);
    }
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
    const objectDetails = getStaticObjectDetails(staticObjectId);

    if (!objectDetails) {
      this.logger.info(`No object details for ${objectID}`);
      return;
    }

    const bounds = getBoundingBox(objectID);
    if (!bounds) {
      this.logger.info(`No bounds for ${objectID}`);
    }

    this.objectSpatialIndex.insert({
      entityId: objectID,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
    });

    this.logger.debugVerbose(
      `Added static object ${objectID} with texture ${staticObjectId} to spatial index`
    );
  }

  generateItem(x: number, y: number, itemId: string) {
    this.logger.info(`Generating item ${itemId} at ${x}, ${y}`);
    this.logger.info(`Entity factory: ${this.entityFactory}`);
    const objectID = this.entityFactory.createEntity('item', x, y, itemId);
    const itemDetails = getItemDetails(itemId);

    if (!itemDetails) {
      this.logger.info(`No item details for ${objectID}`);
      return;
    }

    const bounds = getBoundingBox(objectID);
    if (!bounds) {
      this.logger.info(`No bounds for ${objectID}`);
    }

    this.objectSpatialIndex.insert({
      entityId: objectID,
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY,
    });

    this.logger.debugVerbose(
      `Added item ${objectID} with texture ${itemId} to spatial index`
    );
  }

  getObjectSpatialIndex() {
    return this.objectSpatialIndex;
  }

  releaseEntity(entityType: string, entityId: number) {
    this.removeSpatialIndexEntry(entityId);
    this.entityFactory.releaseEntity(entityType, entityId);
    const playerId = this.getPlayerId();
    const playerFocusId = getFocusTarget(playerId);
    if (playerFocusId === entityId) {
      updateFocusTarget(playerId, ECS_NULL);
    }
  }

  spawnPlayer(x: number, y: number, playerId: string) {
    this.playerId = this.entityFactory.createEntity('creature', x, y, playerId);
    this.controlSystem.setPlayer(this.playerId);
    this.debugPanel.setPlayer(this.playerId);
  }

  getPlayerId() {
    return this.playerId;
  }

  removeSpatialIndexEntry(entityId: number) {
    const collider = getCollider(entityId);
    this.objectSpatialIndex.remove(collider, (a, b) => {
      return a.entityId === b.entityId;
    });
  }
}
