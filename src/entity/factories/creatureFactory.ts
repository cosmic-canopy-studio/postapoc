import { addAttack } from '@src/action/components/attack';
import { CREATURE_DEFAULT_DAMAGE } from '@src/core/config/constants';
import { addHealth } from '@src/entity/components/health';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import {
  DEFAULT_CREATURE_HEIGHT,
  DEFAULT_CREATURE_WIDTH,
} from '@src/entity/data/constants';
import { IEntityFactory } from '@src/entity/data/interfaces';
import {
  getEntityNameWithID,
  removeEntityName,
  setEntityName,
} from '@src/entity/systems/entityNames';
import { addCollider } from '@src/movement/components/collider';
import { addMovement } from '@src/movement/components/movement';
import { getLogger } from '@src/telemetry/systems/logger';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';

export default class CreatureFactory implements IEntityFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private logger = getLogger('entity');

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
  }

  public createEntity(x: number, y: number, creatureId: string): number {
    let name;
    if (!this.scene.textures.exists(creatureId)) {
      this.logger.error(
        `Texture ${creatureId} does not exist!`,
        this.scene.textures
      );
    }
    if (creatureId === 'player') {
      name = 'Survivor';
    } else {
      name = creatureId;
    }
    const creature = addEntity(this.world);
    const sprite = this.scene.add.sprite(x, y, creatureId);
    sprite.setOrigin(0, 0).setDepth(10);
    sprite.setDisplaySize(DEFAULT_CREATURE_WIDTH, DEFAULT_CREATURE_HEIGHT);
    addPhaserSprite(this.world, creature, sprite);
    addMovement(this.world, creature, x, y, 0, 0);
    addHealth(this.world, creature, 100, 100);
    addCollider(this.world, creature);
    addAttack(this.world, creature, CREATURE_DEFAULT_DAMAGE);
    setEntityName(creature, name);
    this.logger.debug(`Created entity ${getEntityNameWithID(creature)} `);
    return creature;
  }

  public releaseEntity(entityId: number): void {
    this.logger.debug(`Releasing entity: ${entityId}`);
    const sprite = getSprite(entityId);
    if (sprite) {
      sprite.destroy();
    }
    removeEntity(this.world, entityId);
    removeEntityName(entityId);
  }
}
