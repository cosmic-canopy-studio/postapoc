import * as Phaser from 'phaser';
import Scenes from './scenes';
import './style.css';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Survival Game',
  url: 'https://github.com/Unnamed-GameDev-Studio/survival-game',
  version: '0.0.1', // TODO: Link this to the package version
  type: Phaser.AUTO,

  scale: {
    width: window.innerWidth,
    height: window.innerHeight,
  },

  scene: Scenes,

  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  input: {
    keyboard: true,
  },

  /**render: { pixelArt: false, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    // `fullscreenTarget` must be defined for phones to not have
    // a small margin during fullscreen.
    fullscreenTarget: 'app',
    expandParent: false,
  },**/

  parent: 'game',
  backgroundColor: '#000000',
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  // Expose `_game` to allow debugging, mute button and fullscreen button
  (window as any)._game = new Game(gameConfig);
});
