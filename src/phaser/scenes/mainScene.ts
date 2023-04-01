// Part: src/phaser/scenes/mainScene.ts
// Code Reference:
// Documentation:

import Universe from '@src/phaser/systems/universe';
import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
  private universe!: Universe;

  constructor() {
    super('MainScene');
  }

  create() {
    this.initSystems();
  }

  update(time: number, deltaTime: number) {
    this.universe.update(time, deltaTime);
  }

  private initSystems() {
    this.universe = new Universe();
    this.universe.initialize(this);
    this.universe.generateTileset();
    this.universe.generateStaticObject(200, 200, 'tree');
    this.universe.generateStaticObject(400, 400, 'bench');
    this.universe.spawnPlayer();
  }
}
