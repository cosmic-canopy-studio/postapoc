// Part: src/main.ts
// Code Reference: https://github.com/photonstorm/phaser
// Documentation: https://photonstorm.github.io/phaser3-docs/

import 'reflect-metadata';
import BootScene from '@src/phaser/scenes/bootScene';
import MainScene from '@src/phaser/scenes/mainScene';
import TitleScene from '@src/phaser/scenes/titleScene';
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, TitleScene, MainScene],
  parent: 'game-container',
};

const game = new Phaser.Game(config);
