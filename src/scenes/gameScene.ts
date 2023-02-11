import PlayerInputState from '../states/playerInputState';
import '../actors/actor';
import { GridEngine } from 'grid-engine';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private gridEngine!: GridEngine;
  private cursors: object;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'interior-map' });
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

    const player = this.add.actor(0, 0, 'player');
    player.setControlState(playerInputState);

    const playerCharacter = {
      id: 'player',
      sprite: player,
      startPosition: { x: 2, y: 2 },
      walkingAnimationMapping: {
        up: {
          leftFoot: 9,
          standing: 10,
          rightFoot: 11
        },
        down: {
          leftFoot: 0,
          standing: 1,
          rightFoot: 2
        },
        left: {
          leftFoot: 3,
          standing: 4,
          rightFoot: 5
        },
        right: {
          leftFoot: 6,
          standing: 7,
          rightFoot: 8
        }
      }
    };
    this.gridEngine.addCharacter(playerCharacter);

    const benchCharacter = {
      id: 'bench',
      sprite: bench,
      startPosition: { x: 4, y: 2 }
    };
    this.gridEngine.addCharacter(benchCharacter);

    this.cameras.main.startFollow(player, true);
    this.cameras.main.setFollowOffset(-player.width, -player.height);
  }

  public update(): void {}
}
