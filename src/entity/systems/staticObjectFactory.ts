import ObjectPool from '@src/entity/systems/objectPool';
import { addCollider } from '@src/movement/components/collider';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  removePhaserSprite,
} from '@src/entity/components/phaserSprite';
import { addComponent, addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';
import {
  getEntityName,
  getEntityNameWithID,
  removeEntityName,
  setEntityName,
} from '@src/entity/components/names';
import items from '@src/entity/data/items.json';
import {
  addCanBePickedUp,
  CanBePickedUp,
} from '@src/entity/components/canPickup';

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
    itemId: string,
    exempt = false,
    collisionModifier = 0
  ) {
    const entityId = addEntity(this.world);
    const sprite = this.spritePool.get();

    const item = items.find((item) => item.id === itemId);
    let itemTexture = itemId;
    if (item?.texture) {
      itemTexture = item.texture;
    }
    sprite.setTexture(itemTexture);
    sprite.setPosition(x, y);
    sprite.setActive(true);
    sprite.setVisible(true);

    let itemName = itemId;
    if (item?.name) {
      itemName = item.name;
    }

    setEntityName(entityId, itemName);

    this.scene.add.existing(sprite);
    addPhaserSprite(this.world, entityId, sprite);
    addHealth(this.world, entityId, 100, 100);
    addCollider(this.world, entityId, exempt, collisionModifier);
    if (item?.canBePickedUp) {
      this.logger.debugVerbose(
        `Adding CanBePickedUp to ${getEntityNameWithID(entityId)}`
      );
      addCanBePickedUp(this.world, entityId);
      addComponent(this.world, CanBePickedUp, entityId);
      CanBePickedUp.value[entityId] = 1;
    }

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
