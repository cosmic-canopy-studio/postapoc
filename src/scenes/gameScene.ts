import 'reflect-metadata';
import { TYPES } from '../constants/types';
import PlayerInput from '../systems/playerInput';
import '../entities/actor';
import '../entities/interactable';
import Actor from '../entities/actor';
import Interactable from '../entities/interactable';
import container from '../config/inversify.config';
import { Logger } from 'tslog';

const logger = new Logger();

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private player!: Actor;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.initTileset();

    this.initPlayer();

    this.initObjects();
    logger.debug('game scene created');
  }

  private initObjects() {
    const bench = new Interactable(this, 200, 200, 'bench');

    this.physics.add.collider(
      this.player.sprite,
      bench.sprite,
      () => this.handlePlayerInteractableCollision(bench),
      undefined,
      this
    );
  }

  private initPlayer() {
    const cursors = this.input.keyboard.createCursorKeys();

    const playerInput: PlayerInput = container.get(TYPES.PlayerInput);
    playerInput.setCursors(cursors);

    this.player = new Actor(this, 100, 200, 'character');

    this.player.setControlState(playerInput);

    this.cameras.main.startFollow(this.player.sprite, true);
    this.cameras.main.setFollowOffset(
      -this.player.sprite.width,
      -this.player.sprite.height
    );
  }

  private initTileset() {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
  }

  public update(): void {
    this.player.update();
  }

  private handlePlayerInteractableCollision(interactable: Interactable) {
    this.player.setFocus(interactable);
  }
}
