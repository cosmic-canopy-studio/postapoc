import { addCollider } from '@src/movement/components/collider';
import { addHealth } from '@src/entity/components/health';
import { addMovement } from '@src/movement/components/movement';
import {
  addPhaserSprite,
  getSprite,
} from '@src/entity/components/phaserSprite';
import { addEntity, IWorld, removeEntity } from 'bitecs';
import Phaser from 'phaser';
import { addAttack } from '@src/action/components/attack';
import { PLAYER_DEFAULT_DAMAGE } from '@src/core/config/constants';
import { addFocus } from '@src/entity/components/focus';
import {
  getEntityName,
  getEntityNameWithID,
  removeEntityName,
  setEntityName,
} from '@src/entity/systems/entityNames';
import { getLogger } from '@src/telemetry/systems/logger';

export default class PlayerFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;
  private logger = getLogger('entity');

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
  }

  public createPlayer() {
    const player = addEntity(this.world);
    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;
    const sprite = this.scene.add.sprite(centerX, centerY, 'player');
    sprite.setOrigin(0, 0);
    addPhaserSprite(this.world, player, sprite);
    addMovement(this.world, player, centerX, centerY, 0, 0);
    addHealth(this.world, player, 100, 100);
    addCollider(this.world, player, true, 1);
    addAttack(this.world, player, PLAYER_DEFAULT_DAMAGE);
    addFocus(this.world, player, 0);
    setEntityName(player, 'player');
    this.logger.debug(`Created entity ${getEntityNameWithID(player)} `);
    return player;
  }

  public release(entityId: number): void {
    this.logger.debug(
      `Releasing entity: ${entityId} ${getEntityName(entityId)} `
    );
    const sprite = getSprite(entityId);
    if (sprite) {
      sprite.destroy();
    }
    removeEntity(this.world, entityId);
    removeEntityName(entityId);
  }
}
