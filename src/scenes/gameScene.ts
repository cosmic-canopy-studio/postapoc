import PlayerInputState from '../states/playerInputState';
import '../actors/actor';
import '../interactables/interactable';
import { GridEngine } from 'grid-engine';
import Actor from '../actors/actor';
import Interactable from '../interactables/interactable';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Actor;
  private status?: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      const layer = interiorTilemap.createLayer(i, 'interior', 0, 0);
      //console.log(layer.layer);
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.gridEngine.create(interiorTilemap, { characters: [] });

    const playerInputState = new PlayerInputState(
      this.cursors,
      this.gridEngine
    );

    const bench = this.add.interactable(0, 0, 'bench');

    this.player = this.add.actor(0, 0, 'character');

    this.player.setControlState(playerInputState);

    const playerCharacter = {
      id: this.player.getId(),
      sprite: this.player,
      startPosition: { x: 2, y: 2 },
      charLayer: 'ground'
    };

    this.status = this.add.text(-10, -20, this.player.getFocus());

    this.gridEngine.addCharacter(playerCharacter);

    const benchCharacter = {
      id: 'bench',
      sprite: bench,
      startPosition: { x: 4, y: 2 },
      charLayer: 'ground'
    };

    this.gridEngine.addCharacter(benchCharacter);

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);

    this.gridEngine.movementStarted().subscribe(({ direction }) => {
      this.player.play('walk-'.concat(direction));
    });
    this.gridEngine.movementStopped().subscribe(({ direction }) => {
      this.player.play('idle-'.concat(direction));
    });

    this.gridEngine.directionChanged().subscribe(({ direction }) => {
      this.player.play('idle-'.concat(direction));
    });

    this.physics.add.collider(
      this.player,
      bench,
      this.handlePlayerInteractableCollision,
      undefined,
      this
    );

    console.log(this.gridEngine.getCharLayer(this.player.id));
  }

  public update(): void {
    this.player.update();
    this.updatePlayerFocus();
  }

  private handlePlayerInteractableCollision(obj1: Actor, obj2: Interactable) {
    this.add.text(100, -20, 'collision');
    this.player.setFocus(obj2);
  }

  private updatePlayerFocus() {
    const facingTile = this.gridEngine.getFacingPosition(this.player.id);
    const tileObject = this.gridEngine.getCharactersAt(facingTile, 'ground');
    if (tileObject.length > 0) {
      const object = this.gridEngine.getSprite(tileObject[0]) as Interactable;
      this.player.setFocus(object);
    }
    this.status.text = this.player.getFocus();
  }
}
