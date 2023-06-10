import { ECS_NULL } from '@src/core/config/constants';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import {
  DEFAULT_HEALTH,
  DEFAULT_OBJECT_COLLISION_MODIFIER,
} from '@src/entity/data/constants';
import { IEntityFactory } from '@src/entity/data/interfaces';
import staticObjectsData from '@src/entity/data/staticObjects.json';
import { StaticObject } from '@src/entity/data/types';
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
  private staticObjectsMap: Map<string, StaticObject>;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;

    this.staticObjectsMap = new Map<string, StaticObject>(
      staticObjectsData.map((staticObject) => [staticObject.id, staticObject])
    );
  }

  createEntity(x: number, y: number, objectId: string): number {
    const objectDetails = this.staticObjectsMap.get(objectId);
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
    const collisionModifier =
      objectDetails.collisionModifier || DEFAULT_OBJECT_COLLISION_MODIFIER;
    addCollider(
      this.world,
      staticObject,
      objectDetails.focusExempt,
      collisionModifier
    );
    setEntityName(staticObject, objectDetails.name);

    this.logger.debug(`Created entity ${objectDetails.name}`);
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

  getObjectDetails(id: string): StaticObject | null {
    return this.staticObjectsMap.get(id) || null;
  }
}
