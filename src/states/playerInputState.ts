import { Direction, GridEngine } from 'grid-engine';

export default class PlayerInputState {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private gridEngine!: GridEngine;

  constructor(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    gridEngine: GridEngine
  ) {
    this.cursors = cursors;
    this.gridEngine = gridEngine;
  }

  update(gridActor: string) {
    if (this.cursors.left.isDown) {
      this.gridEngine.move(gridActor, 'left');
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move(gridActor, 'right');
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move(gridActor, 'up');
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move(gridActor, 'down');
    }

    if (this.cursors.space.isDown) {
      // attack
    }
  }
}
