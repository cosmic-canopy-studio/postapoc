import biomes from '@src/biome/data/biomes';
import {
  SubmapItem,
  SubmapObject,
  SubmapTerrain,
  SubmapTile,
} from '@src/biome/data/interfaces';
import { generateOvermap } from '@src/biome/systems/overworldManager';
import { ECS_NULL } from '@src/core/config/constants';
import ControlSystem from '@src/core/systems/controlSystem';
import {
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import OpenableState, {
  OpenableStateType,
} from '@src/entity/components/openableState';
import { getSprite } from '@src/entity/components/phaserSprite';
import EntityFactory from '@src/entity/factories/entityFactory';
import {
  getEntityTexture,
  getEntityType,
  getItemDetails,
  getStaticObjectDetails,
} from '@src/entity/systems/dataManager';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
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
import { handleObjectIdNamedOrientation } from '@src/entity/components/orientationState';

export default class EntityManager {
  private logger;
  private entityFactory!: EntityFactory;
  private focusManager!: FocusManager;
  private readonly world: IWorld;
  private playerId!: number;
  private debugPanel: DebugPanel;
  private controlSystem: ControlSystem;
  private objectSpatialIndex!: RBush<ICollider>;
  private overmap: SubmapTile[] = [];

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
    this.overmap = generateOvermap(biomes);
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

  getObjectByEid(eid: number): ICollider | null {
    const allObjects = this.objectSpatialIndex.all();
    for (const obj of allObjects) {
      if (obj.entityId === eid) {
        return obj;
      }
    }
    return null;
  }

  spawnOvermap() {
    for (const overmapTile of this.overmap) {
      this.logger.debug(
        `Spawning overmap tile ${overmapTile.originX}, ${overmapTile.originY} of biome ${overmapTile.submapBiomeName}`
      );
      this.spawnSubmap(
        overmapTile.submapTerrain,
        overmapTile.submapObjects,
        overmapTile.submapItems
      );
    }
  }

  generateStaticObject(x: number, y: number, staticObjectId: string) {
    let coordinates = { x, y };
    const objectIDWithOrientation =
      handleObjectIdNamedOrientation(staticObjectId);
    if (
      getStaticObjectDetails(objectIDWithOrientation.objectBaseId).type ===
      'object'
    ) {
      coordinates = this.getSafeCoordinates(x, y);
    }

    const objectID = this.entityFactory.createEntity(
      'staticObject',
      coordinates.x,
      coordinates.y,
      objectIDWithOrientation.objectBaseId,
      { orientation: objectIDWithOrientation.orientation }
    );

    const objectDetails = getStaticObjectDetails(
      objectIDWithOrientation.objectBaseId
    );

    if (!objectDetails) {
      this.logger.info(
        `No object details for ${objectIDWithOrientation.objectBaseId}`
      );
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
    this.logger.debug(`Generating item ${itemId} at ${x}, ${y}`);
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
    const coordinates = this.getSafeCoordinates(x, y);
    this.playerId = this.entityFactory.createEntity(
      'creature',
      coordinates.x,
      coordinates.y,
      playerId
    );
    this.controlSystem.setPlayer(this.playerId);
    this.debugPanel.setPlayer(this.playerId);
    const playerSprite = getSprite(this.playerId);
    this.scene.cameras.main.startFollow(playerSprite);
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

  toggleOpenable(entityId: number) {
    const openableState = OpenableState.state[entityId] as OpenableStateType;
    if (openableState === OpenableStateType.CLOSED) {
      OpenableState.state[entityId] = OpenableStateType.OPEN;
      this.logger.info(`${getEntityNameWithID(entityId)} toggled to open`);
    } else if (openableState === OpenableStateType.OPEN) {
      OpenableState.state[entityId] = OpenableStateType.CLOSED;
      this.logger.info(`${getEntityNameWithID(entityId)} toggled to closed`);
    } else if (openableState === OpenableStateType.LOCKED) {
      this.logger.info(
        `${getEntityNameWithID(
          entityId
        )} cannot be toggled, is currently locked`
      );
    } else if (openableState === OpenableStateType.BROKEN) {
      this.logger.info(
        `${getEntityNameWithID(
          entityId
        )} cannot be toggled, is currently broken`
      );
    } else {
      this.logger.warn(`Unknown openable state ${openableState}`);
    }
    this.updateTexture(entityId);
  }

  private updateTexture(entityId: number) {
    const sprite = getSprite(entityId);
    const texture = getEntityTexture(entityId);
    sprite.setTexture(texture);
  }

  private getSafeCoordinates(
    initialX: number,
    initialY: number,
    mapWidth = 50,
    mapHeight = 50,
    tileSize = 32,
    maxAttempts = 10
  ): { x: number; y: number } {
    let safeX = initialX;
    let safeY = initialY;
    let attempts = 0;

    let dx = 0;
    let dy = -1;
    let maxSteps = 1;
    let stepCount = 0;
    let directionChanges = 0;

    while (attempts < maxAttempts) {
      if (this.isLocationSafe(safeX, safeY, tileSize)) {
        return { x: safeX, y: safeY };
      }

      if (--maxSteps == 0) {
        if (directionChanges % 2 == 0) stepCount++;
        maxSteps = stepCount;
        directionChanges++;
        const temp = dx;
        dx = -dy;
        dy = temp;
      }

      safeX = initialX + dx * tileSize;
      safeY = initialY + dy * tileSize;

      // Ensure safeX and safeY are within the map boundaries
      safeX = Math.max(0, Math.min(mapWidth * tileSize - tileSize, safeX));
      safeY = Math.max(0, Math.min(mapHeight * tileSize - tileSize, safeY));

      attempts++;
    }

    this.logger.error(
      "Could not find a safe position after multiple attempts. Check the map's object density or increase the max attempts."
    );

    return { x: initialX, y: initialY }; // If we can't find a good spot, return the initial spot
  }

  private isLocationSafe(x: number, y: number, tileSize: number): boolean {
    const collidingObjects = this.objectSpatialIndex.search({
      minX: x,
      minY: y,
      maxX: x + tileSize,
      maxY: y + tileSize,
    });
    return !collidingObjects.some((collider) => {
      const objectType = getEntityType(collider.entityId);
      return objectType !== 'tile' && objectType !== 'item';
    });
  }

  private spawnSubmap(
    submapTerrain: SubmapTerrain[],
    submapObjects: SubmapObject[],
    submapItems: SubmapItem[]
  ) {
    for (const tile of submapTerrain) {
      this.generateStaticObject(tile.x, tile.y, tile.id);
    }

    for (const object of submapObjects) {
      this.generateStaticObject(object.x, object.y, object.id);
    }

    for (const item of submapItems) {
      this.generateItem(item.x, item.y, item.id);
    }
  }
}
