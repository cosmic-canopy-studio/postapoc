// Part: src/main.ts

import Phaser from 'phaser';
import BootScene from './phaser/scenes/BootScene';
import PreloadScene from './phaser/scenes/PreloadScene';
import MainScene from './phaser/scenes/MainScene';
import DebugPanel from './DebugPanel';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, MainScene],
};

const game = new Phaser.Game(config);
const debugPanel = new DebugPanel();
