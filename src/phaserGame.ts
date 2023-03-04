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
        /* mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'app',
        expandParent: false */
    },

    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },

    parent: 'phaser-container',
    backgroundColor: '#282c34'
};
export const phaser = new Phaser.Game(gameConfig);
