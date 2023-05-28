import { addCollider } from '@src/components/collider';
import { addHealth } from '@src/components/health';
import { addMovement } from '@src/components/movement';
import { addPhaserSprite } from '@src/components/phaserSprite';
import { addEntity, IWorld } from 'bitecs';
import Phaser from 'phaser';
import { addAttack } from '@src/components/attack';
import { PLAYER_DEFAULT_DAMAGE } from '@src/config/constants';

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
    return player;
  }
}
