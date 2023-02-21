import { PlayerInput } from '../systems';
import { Actor, Interactable } from '../entities/';
import { Logger } from 'tslog';

const logger = new Logger();

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private player!: Actor;
  private bench!: Interactable;

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
    this.bench = new Interactable(this, 200, 200, 'bench');

    this.physics.add.collider(
      this.player.sprite,
      this.bench.sprite,
      () => this.handlePlayerInteractableCollision(this.bench),
      undefined,
      this
    );
  }

  private initPlayer() {
    const cursors = this.input.keyboard.createCursorKeys();

    const playerInput = new PlayerInput(cursors);

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
    this.bench.update();
  }

  private handlePlayerInteractableCollision(interactable: Interactable) {
    this.player.setFocus(interactable);
  }
}
