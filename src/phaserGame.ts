import Phaser from 'phaser';
import Scenes from './scenes';

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Survival Game',
    url: 'https://github.com/Unnamed-GameDev-Studio/survival-game',
    version: '0.0.1', // TODO: Link this to the package version
    type: Phaser.AUTO,

    scene: Scenes,

    input: {
        keyboard: true
    },

    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    parent: 'phaser-container',
    backgroundColor: '#282c34',
    canvasStyle:
        'width: 100%; height: 100%; will-change: transform; image-rendering: -moz-crisp-edges; image-rendering: -webkit-crisp-edges; image-rendering: pixelated; image-rendering: crisp-edges;'
};
export const phaser = new Phaser.Game(gameConfig);
