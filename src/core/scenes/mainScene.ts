import Universe from '@src/core/systems/universe';
import Phaser from 'phaser';
import { TimeState } from '@src/time/systems/timeSystem';

export default class MainScene extends Phaser.Scene {
  private universe!: Universe;
  private timeStateText!: Phaser.GameObjects.Text;
  private helpText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create() {
    this.universe = new Universe(this);
    this.universe.initialize();

    this.timeStateText = this.add
      .text(this.cameras.main.width - 20, 10, '', {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      })
      .setOrigin(1, 0);
    this.timeStateText.setScrollFactor(0);

    this.helpText = this.add.text(
      this.cameras.main.width - 300,
      this.cameras.main.height - 50,
      "Press '/' for help",
      {
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: { left: 10, right: 10, top: 5, bottom: 5 },
      }
    );
    this.helpText.setScrollFactor(0);
  }

  update(time: number, deltaTime: number) {
    this.universe.update(time, deltaTime);
    this.updateTimeStateText();
  }

  private updateTimeStateText() {
    const timeState = this.universe.getTimeState();
    this.timeStateText.setText(`${TimeState[timeState].toLowerCase()}`);
  }
}
