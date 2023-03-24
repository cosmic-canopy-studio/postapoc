// Part: src/main.ts

import Phaser from "phaser";
import "reflect-metadata";
import BootScene from "@src/phaser/scenes/bootScene";
import PreloadScene from "@src/phaser/scenes/preloadScene";
import MainScene from "@src/phaser/scenes/mainScene";
import DebugPanel from "@src/core/debugPanel";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [BootScene, PreloadScene, MainScene],
  parent: "game-container",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);
const debugPanel = new DebugPanel();
