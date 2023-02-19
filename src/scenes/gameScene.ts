import 'reflect-metadata';
import { TYPES } from '../constants/types';
import PlayerInput from '../components/playerInput';
import '../entities/actor';
import '../entities/interactable';
import Actor from '../entities/actor';
import Interactable from '../entities/interactable';
import container from '../config/inversify.config';
import { Logger } from 'tslog';

const logger = new Logger({ type: 'pretty' });

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Actor;
  private status!: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    const playerInput: PlayerInput = container.get(TYPES.PlayerInput);
    playerInput.setCursors(this.cursors);

    const bench = this.add.interactable(200, 200, 'bench');

    this.player = this.add.actor(100, 200, 'character') as Actor;

    this.player.setControlState(playerInput);

    this.status = this.add.text(-10, -20, this.player.getFocus() || 'none');

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);

    this.physics.add.collider(
      this.player,
      bench,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.handlePlayerInteractableCollision as ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  public update(): void {
    this.player.update();
    //this.updatePlayerFocus();
  }

  private handlePlayerInteractableCollision(_obj1: Actor, obj2: Interactable) {
    this.add.text(100, -20, 'collision');
    this.player.setFocus(obj2);
  }

  /*private updatePlayerFocus() {
    const gridEngine = this.controller.getEngine();
    const facingTile = gridEngine.getFacingPosition(this.player.getId());
    const tileObject = gridEngine.getCharactersAt(facingTile, 'ground');
    if (tileObject.length > 0) {
      const object = gridEngine.getSprite(tileObject[0]) as Interactable;
      this.player.setFocus(object);
    }
    this.status.text = this.player.getFocus() || 'none';
  }*/
}
