import { ECS_NULL } from '@src/core/config/constants';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import { DEFAULT_ITEM_COLLISION_MODIFIER } from '@src/entity/data/constants';
import { IEntityFactory } from '@src/entity/data/interfaces';
import itemsData from '@src/entity/data/items.json';
import { Item } from '@src/entity/data/types';
import {
  getEntityNameWithID,
  removeEntityName,
  setEntityName,
} from '@src/entity/systems/entityNames';
import { addCollider } from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';

export default class ItemFactory implements IEntityFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private logger = getLogger('entity');
  private itemsMap: Map<string, Item>;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;

    this.itemsMap = new Map<string, Item>(
      itemsData.map((item) => [item.id, item])
    );
  }

  createEntity(x: number, y: number, itemId: string): number {
    const itemDetails = this.itemsMap.get(itemId);
    if (!itemDetails) {
      this.logger.error(`Item ${itemId} not found`);
      return ECS_NULL;
    }

    const randomIndex = Math.floor(Math.random() * itemDetails.textures.length);
    const selectedTexture = itemDetails.textures[randomIndex];

    const itemEntityId = addEntity(this.world);
    const sprite = this.scene.add.sprite(x, y, selectedTexture);
    sprite.setOrigin(0, 0);
    sprite.setActive(true);
    sprite.setVisible(true);

    addPhaserSprite(this.world, itemEntityId, sprite);
    addCollider(
      this.world,
      itemEntityId,
      false,
      DEFAULT_ITEM_COLLISION_MODIFIER
    );
    setEntityName(itemEntityId, itemDetails.name);

    this.logger.debug(`Created entity ${getEntityNameWithID(itemEntityId)}`);
    return itemEntityId;
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
