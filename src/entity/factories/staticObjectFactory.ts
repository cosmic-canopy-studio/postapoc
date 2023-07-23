import { ECS_NULL } from '@src/core/config/constants';
import { addHealth } from '@src/entity/components/health';
import {
  addOpenableState,
  OpenableStateType,
} from '@src/entity/components/openableState';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import { DEFAULT_HEALTH } from '@src/entity/data/constants';

import { IEntityFactory } from '@src/entity/data/types';
import {
  getEntityTexture,
  getStaticObjectDetails,
} from '@src/entity/systems/dataManager';
import {
  removeEntityName,
  setEntityName,
} from '@src/entity/systems/entityNames';
import { addCollider } from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import {
  addOrientationState,
  OrientationStateType,
} from '@src/entity/components/orientationState';

export default class StaticObjectFactory implements IEntityFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private logger = getLogger('entity');

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
  }

  createEntity(
    x: number,
    y: number,
    objectId: string,
    options?: Record<any, any>
  ) {
    const objectDetails = getStaticObjectDetails(objectId);
    if (!objectDetails) {
      this.logger.error(`Static object ${objectId} not found`);
      return ECS_NULL;
    }

    const randomIndex = Math.floor(
      Math.random() * objectDetails.textures.length
    );
    let selectedTexture = objectDetails.textures[randomIndex];

    const orientation = options?.orientation || OrientationStateType.HORIZONTAL;

    if (orientation === OrientationStateType.VERTICAL) {
      selectedTexture = `${selectedTexture}_vertical`;
    }

    const staticObject = addEntity(this.world);

    setEntityName(staticObject, objectDetails.name);

    addOrientationState(this.world, staticObject, orientation);

    if (objectDetails.properties?.includes('openable')) {
      addOpenableState(this.world, staticObject, OpenableStateType.CLOSED);
      selectedTexture = getEntityTexture(staticObject);
      console.log('selectedTexture: ', selectedTexture);
    }

    const sprite = this.scene.add.sprite(x, y, selectedTexture);
    sprite.setOrigin(0, 0);
    sprite.setActive(true);
    sprite.setVisible(true);

    addPhaserSprite(this.world, staticObject, sprite);
    const initialHealth = objectDetails.health ?? DEFAULT_HEALTH;
    addHealth(this.world, staticObject, initialHealth, initialHealth);
    addCollider(this.world, staticObject);

    this.logger.debug(`Created entity ${objectDetails.name} at ${x},${y}`);
    return staticObject;
  }

  releaseEntity(entityId: number): void {
    this.logger.debug(`Releasing entity: ${entityId}`);
    const sprite = getSprite(entityId);
    if (sprite) {
      sprite.destroy();
    }
    removeEntity(this.world, entityId);
    removeEntityName(entityId);
  }
}
