import { ECS_NULL } from '@src/core/config/constants';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import { DEFAULT_HEALTH } from '@src/entity/data/constants';
import { IEntityFactory } from '@src/entity/data/interfaces';
import { getStaticObjectDetails } from '@src/entity/systems/dataManager';
import {
  removeEntityName,
  setEntityName,
} from '@src/entity/systems/entityNames';
import { addCollider } from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';

export default class StaticObjectFactory implements IEntityFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private logger = getLogger('entity');

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
  }

  createEntity(x: number, y: number, objectId: string): number {
    const objectDetails = getStaticObjectDetails(objectId);
    if (!objectDetails) {
      this.logger.error(`Static object ${objectId} not found`);
      return ECS_NULL;
    }

    const randomIndex = Math.floor(
      Math.random() * objectDetails.textures.length
    );
    const selectedTexture = objectDetails.textures[randomIndex];

    const staticObject = addEntity(this.world);
    const sprite = this.scene.add.sprite(x, y, selectedTexture);
    sprite.setOrigin(0, 0);
    sprite.setActive(true);
    sprite.setVisible(true);

    addPhaserSprite(this.world, staticObject, sprite);
    const initialHealth = objectDetails.health || DEFAULT_HEALTH;
    addHealth(this.world, staticObject, initialHealth, initialHealth);
    addCollider(this.world, staticObject);
    setEntityName(staticObject, objectDetails.name);

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
