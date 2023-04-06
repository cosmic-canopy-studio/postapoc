// Part: src/phaser/scenes/mainScene.ts
// Code Reference: https://github.com/photonstorm/phaser
// Documentation: https://photonstorm.github.io/phaser3-docs/

import Universe from '@src/core/systems/universe';
import Phaser from 'phaser';
import { TimeState } from '@src/core/systems/timeSystem';

export default class MainScene extends Phaser.Scene {
  private universe!: Universe;
  private timeStateText!: Phaser.GameObjects.Text;

  constructor() {
    super('MainScene');
  }

  create() {
    this.initSystems();
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

  private initSystems() {
    this.universe = new Universe();
    this.universe.initialize(this);
    this.universe.generateTileset();
    this.universe.generateStaticObject(200, 200, 'tree');
    this.universe.generateStaticObject(400, 400, 'bench');
    this.universe.spawnPlayer();
  }

  private updateTimeStateText() {
    const timeState = this.universe.getTimeState();
    this.timeStateText.setText(`${TimeState[timeState].toLowerCase()}`);
  }
}
