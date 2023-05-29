import ObjectPool from '@src/entity/systems/objectPool';
import { addCollider } from '@src/movement/components/collider';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/logger';

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
    const objectID = addEntity(this.world);
    const sprite = this.spritePool.get();

    sprite.setTexture(texture);
    sprite.setPosition(x, y);
    sprite.setActive(true);
    sprite.setVisible(true);

    this.scene.add.existing(sprite);
    addPhaserSprite(this.world, objectID, sprite);
    addHealth(this.world, objectID, 100, 100);
    addCollider(this.world, objectID, exempt, collisionModifier);
    return objectID;
  }

  release(entityId: number): void {
    this.logger.debug(`Releasing entity ${entityId}`);
    const sprite = removePhaserSprite(entityId);
    this.spritePool.release(sprite);
    removeEntity(this.world, entityId);
  }
}
