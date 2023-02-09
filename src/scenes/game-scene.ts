const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private gridEngine!: GridEngine;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'interior-map' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      const layer = interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
    const bench = this.physics.add.sprite(0, 0, 'bench');

    const player = this.physics.add.sprite(0, 0, 'player');

    this.cameras.main.startFollow(player, true);
    this.cameras.main.setFollowOffset(-player.width, -player.height);

    const gridEngineConfig = {
      characters: [
        {
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
        },
        {
          id: 'bench',
          sprite: bench,
          startPosition: { x: 4, y: 2 }
        }
      ]
    };

    this.gridEngine.create(interiorTilemap, gridEngineConfig);
  }

  public update(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.gridEngine.move('player', 'left');
    } else if (cursors.right.isDown) {
      this.gridEngine.move('player', 'right');
    } else if (cursors.up.isDown) {
      this.gridEngine.move('player', 'up');
    } else if (cursors.down.isDown) {
      this.gridEngine.move('player', 'down');
    }
  }
}
