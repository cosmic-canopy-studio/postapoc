import ObjectPool from '@src/entity/systems/objectPool';
import { addCollider } from '@src/movement/components/collider';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';
import {
  getEntityName,
  getEntityNameWithID,
  removeEntityName,
  setEntityName,
} from '@src/entity/components/names';

export default class StaticObjectFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private spritePool: ObjectPool<Phaser.GameObjects.Sprite>;
  private logger = getLogger('entity');

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;

    this.spritePool = new ObjectPool<Phaser.GameObjects.Sprite>(() => {
      const sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, '');
      sprite.setOrigin(0, 0);
      return sprite;
    });
  }

  public create(
    x: number,
    y: number,
    texture: string,
    exempt = false,
    collisionModifier = 0
  ) {
    const entityId = addEntity(this.world);
    const sprite = this.spritePool.get();

    sprite.setTexture(texture);
    sprite.setPosition(x, y);
    sprite.setActive(true);
    sprite.setVisible(true);
    setEntityName(entityId, texture);

    this.scene.add.existing(sprite);
    addPhaserSprite(this.world, entityId, sprite);
    addHealth(this.world, entityId, 100, 100);
    addCollider(this.world, entityId, exempt, collisionModifier);
    this.logger.debug(`Created entity ${getEntityNameWithID(entityId)} `);
    return entityId;
  }

  release(entityId: number): void {
    this.logger.debug(
      `Releasing entity: ${entityId} ${getEntityName(entityId)} `
    );
    const sprite = removePhaserSprite(entityId);
    this.spritePool.release(sprite);
    removeEntityName(entityId);
    removeEntity(this.world, entityId);
  }
}
