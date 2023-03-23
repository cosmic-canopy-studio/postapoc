// Part: src/main.ts

import Phaser from 'phaser';
import BootScene from '@src/phaser/scenes/BootScene';
import PreloadScene from '@src/phaser/scenes/PreloadScene';
import MainScene from '@src/phaser/scenes/MainScene';
import DebugPanel from '@src/core/DebugPanel';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, MainScene],
  parent: 'game-container',
};

const game = new Phaser.Game(config);
const debugPanel = new DebugPanel();
