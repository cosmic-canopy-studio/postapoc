import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MainScene from './scenes/MainScene';
import DebugPanel from './DebugPanel';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, MainScene],
};

const game = new Phaser.Game(config);
const debugPanel = new DebugPanel();
