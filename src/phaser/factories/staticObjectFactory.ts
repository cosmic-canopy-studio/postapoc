// Part: src/phaser/factories/staticObjectFactory.ts
// Code Reference:
// Documentation:

import ObjectPool from '@src/core/systems/objectPool';
import { addCollider } from '@src/ecs/components/collider';
import { addHealth } from '@src/ecs/components/health';
import { addPhaserSprite, getSprite } from '@src/ecs/components/phaserSprite';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import { addInteractionComponent } from '@src/ecs/components/interactionComponent';
import { interactionMapping } from '@src/config/interactions';

export default class StaticObjectFactory {
  private scene: Phaser.Scene;
  private world: IWorld;
  private spritePool: ObjectPool<Phaser.GameObjects.Sprite>;

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

    const interactionComponent = interactionMapping[texture];
    if (interactionComponent) {
      addInteractionComponent(this.world, objectID, interactionComponent);
    }

    return objectID;
  }

  release(entityId: number): void {
    const sprite = getSprite(entityId);
    if (!sprite) {
      throw new Error('No sprite found for entity');
    }

    sprite.setActive(false);
    sprite.setVisible(false);
    sprite.setTexture('');

    this.spritePool.release(sprite);
    removeEntity(this.world, entityId);
  }
}
