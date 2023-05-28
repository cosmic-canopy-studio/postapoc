import Universe from '@src/coreSystems/universe';
import Phaser from 'phaser';
import { TimeState } from '@src/coreSystems/timeSystem';

export default class MainScene extends Phaser.Scene {
  private universe!: Universe;
  private timeStateText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create() {
    this.universe = new Universe(this);
    this.universe.initialize();

    this.timeStateText = this.add.text(this.cameras.main.width - 200, 10, '', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    this.timeStateText.setScrollFactor(0);
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
