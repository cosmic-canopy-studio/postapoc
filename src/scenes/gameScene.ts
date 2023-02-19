import 'reflect-metadata';
import { TYPES } from '../constants/types';
import PlayerInput from '../systems/playerInput';
import '../entities/actor';
import '../entities/interactable';
import Actor from '../entities/actor';
import Interactable from '../entities/interactable';
import container from '../config/inversify.config';

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
  }

  private initObjects() {
    const bench: Interactable = this.add.interactable(200, 200, 'bench');

    this.physics.add.collider(
      this.player,
      bench,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.handlePlayerInteractableCollision as ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  private initPlayer() {
    const cursors = this.input.keyboard.createCursorKeys();

    const playerInput: PlayerInput = container.get(TYPES.PlayerInput);
    playerInput.setCursors(cursors);

    this.player = this.add.actor(100, 200, 'character') as Actor;

    this.player.setControlState(playerInput);

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);
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

  private handlePlayerInteractableCollision(_obj1: Actor, obj2: Interactable) {
    this.player.setFocus(obj2);
  }
}
