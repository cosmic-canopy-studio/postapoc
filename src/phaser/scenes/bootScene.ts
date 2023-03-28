// Part: src/phaser/scenes/bootScene.ts

import MainScene from "@src/phaser/scenes/mainScene";
import TitleScene from "@src/phaser/scenes/titleScene";
import { createFallbackSVG } from "@src/utils/svgUtils";
import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super("BootScene");
  }

  preload() {
    // Set up the progress bar
    this.progressBar = this.add.graphics();
    this.progressBar.fillStyle(0xffffff, 1);
    this.progressBar.fillRect(240, 290, 320, 20);

    // Set up the background for the progress bar
    const backgroundBar = this.add.graphics();
    backgroundBar.lineStyle(4, 0xffffff, 1);
    backgroundBar.strokeRect(240, 290, 320, 20);

    // Update the progress bar during loading
    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(240, 290, 320 * value, 20);
    });

    this.load.on(Phaser.Loader.Events.FILE_LOAD_ERROR, (file: Phaser.Loader.File) => {
      const key = file.key;
      file.destroy();
      const fallbackSVG = createFallbackSVG(key, 32, 32);
      if (this.textures.exists(key)) {
        this.textures.remove(key);
      }
      console.log(fallbackSVG);
      this.load.svg(key, fallbackSVG);
      this.load.emit(Phaser.Loader.Events.FILE_COMPLETE, file);
    }, this);

    this.loadTitleMenuAssets();
    this.loadTerrainAssets();
    this.loadObjectAssets();
  }

  create() {
    if (import.meta.env.DEV) {
      this.scene.start("MainScene");
    } else {
      this.scene.start("TitleScene");
    }
  }

  private loadTitleMenuAssets() {
    // Load assets here
    this.load.svg("starry_night", "assets/ui/starry_night.svg", {
      width: 800,
      height: 600
    });
    this.load.svg("forest_silhouette", "assets/ui/forest_silhouette.svg", {
      width: 800,
      height: 600
    });
    this.load.svg("postapoc_title", "assets/ui/postapoc_title.svg", {
      width: 800,
      height: 100
    });
    this.load.svg("mushroom_cloud", "assets/ui/mushroom_cloud.svg", {
      width: 100,
      height: 100
    });
  }

  private loadTerrainAssets() {
    this.load.svg("grass", "assets/tiles/grass.svg");
    this.load.svg("grass2", "assets/tiles/grass2.svg");
    this.load.svg("white_tile", "assets/tiles/white_tile.svg");
    this.load.svg("concrete_wall", "assets/tiles/concrete_wall.svg");
  }

  private loadObjectAssets() {
    this.load.svg("player", "assets/objects/player.svg");
    this.load.svg("pipe", "assets/objects/pipe.svg");
    this.load.svg("bench", "assets/objects/bench.svg");
    this.load.svg("door", "assets/objects/door.svg");
    this.load.svg("tree", "assets/objects/tree.svg");
  }
}
