import { Direction, GridEngine } from 'grid-engine';

export default class PlayerInputState {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private gridEngine: GridEngine;

  constructor(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    gridEngine: GridEngine
  ) {
    this.cursors = cursors;
    this.gridEngine = gridEngine;
  }

  update(gridActor: string) {
    if (this.cursors.left.isDown) {
      this.gridEngine.move(gridActor, Direction.LEFT);
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move(gridActor, Direction.RIGHT);
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move(gridActor, Direction.UP);
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move(gridActor, Direction.DOWN);
    }

    if (this.cursors.space.isDown) {
      // attack
    }
  }
}
