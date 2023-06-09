import 'reflect-metadata';
import BootScene from '@src/core/scenes/bootScene';
import MainScene from '@src/core/scenes/mainScene';
import TitleScene from '@src/core/scenes/titleScene';
import InventoryScene from '@src/entity/scenes/inventoryScene';
import Phaser from 'phaser';
import LogRocket from 'logrocket';
import HelpScene from '@src/entity/scenes/helpScene';
import CraftingScene from '@src/entity/scenes/craftingScene';

LogRocket.init('1wjjv9/postapoc');
LogRocket.identify('user', {
  name: 'Generic User',
});
const isTestEnvironment = process.env.NODE_ENV === 'test';

const config = {
  type: isTestEnvironment ? Phaser.HEADLESS : Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [
    BootScene,
    TitleScene,
    MainScene,
    InventoryScene,
    HelpScene,
    CraftingScene,
  ],
  parent: 'game-container',
};

const game = new Phaser.Game(config);
console.debug('Game started: ', game.isRunning);
