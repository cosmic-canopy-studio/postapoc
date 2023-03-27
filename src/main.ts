// Part: src/main.ts

import Phaser from "phaser";
import "reflect-metadata";
import BootScene from "@src/phaser/scenes/bootScene";
import TitleScene from "@src/phaser/scenes/titleScene";
import MainScene from "@src/phaser/scenes/mainScene";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, TitleScene, MainScene],
  parent: "game-container"
};

const game = new Phaser.Game(config);
