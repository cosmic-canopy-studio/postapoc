import * as Phaser from 'phaser';
import { Direction, GridEngine } from 'grid-engine';
import Scenes from './scenes';
import './style.css';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Survival Game',
  url: 'https://github.com/Unnamed-GameDev-Studio/survival-game',
  version: '0.0.1', // TODO: Link this to the package version
  type: Phaser.AUTO,

  scene: Scenes,

  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },

  input: {
    keyboard: true
  },

  render: { pixelArt: false, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    fullscreenTarget: 'app',
    expandParent: false
  },

  plugins: {
    scene: [
      {
        key: 'gridEngine',
        plugin: GridEngine,
        mapping: 'gridEngine'
      }
    ]
  },

  parent: 'game',
  backgroundColor: '#000000'
};

export const game = new Phaser.Game(gameConfig);

window.addEventListener('resize', () => {
  game.scale.refresh();
});
