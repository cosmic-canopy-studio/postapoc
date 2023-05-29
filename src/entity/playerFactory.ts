import { addCollider } from '@src/movement/collider';
import { addHealth } from '@src/entity/health';
import { addMovement } from '@src/movement/movement';
import { addPhaserSprite } from '@src/entity/phaserSprite';
import { addEntity, IWorld } from 'bitecs';
import Phaser from 'phaser';
import { addAttack } from '@src/action/components/attack';
import { PLAYER_DEFAULT_DAMAGE } from '@src/config/constants';
import { addFocus } from '@src/action/components/focus';

export default class PlayerFactory {
  private scene: Phaser.Scene;
  private readonly world: IWorld;

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
    return player;
  }
}
