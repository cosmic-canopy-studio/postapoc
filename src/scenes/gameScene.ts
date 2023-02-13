import PlayerInputState from '../states/playerInputState';
import '../actors/actor';
import { GridEngine } from 'grid-engine';
import Actor from '../actors/actor';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Actor;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      const layer = interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.gridEngine.create(interiorTilemap, { characters: [] });

    const playerInputState = new PlayerInputState(
      this.cursors,
      this.gridEngine
    );

    const bench = this.add.actor(0, 0, 'bench');

    this.player = this.add.actor(0, 0, 'character');

    this.player.setControlState(playerInputState);
    this.player.play('idle-down');

    const playerCharacter = {
      id: this.player.getId(),
      sprite: this.player,
      startPosition: { x: 2, y: 2 }
    };

    this.gridEngine.addCharacter(playerCharacter);

    const benchCharacter = {
      id: 'bench',
      sprite: bench,
      startPosition: { x: 4, y: 2 }
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
  }

  public update(): void {
    this.player.update();
  }
}
