// Part: src/phaser/systems/TimeController.ts

// src/TimeController.ts
import { Game } from 'phaser';

export class TimeController {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  pause() {
    this.game.setTimeScale(0);
  }

  slowDown(factor: number) {
    this.game.setTimeScale(factor);
  }

  speedUp(factor: number) {
    this.game.setTimeScale(factor);
  }

  resume() {
    this.game.setTimeScale(1);
  }
}
