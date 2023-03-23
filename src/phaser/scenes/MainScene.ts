// Part: src/phaser/scenes/MainScene.ts

import Phaser from 'phaser';
import { addEntity, createWorld } from 'bitecs';
import { addMovement } from '@src/ecs/components/Movement';
import { movementSystem } from '@src/ecs/systems/MovementSystem';
import { TimeController } from '@src/TimeController';

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: TimeController;

  constructor() {
    super('MainScene');
  }

  create() {
    this.world = createWorld();

    // Create an entity for the player character
    const player = addEntity(this.world);
    addMovement(player, 400, 300, 100);

    // Set up the systems
    this.world.addSystem(movementSystem);

    // Initialize the TimeController
    this.timeController = new TimeController(this.game);
  }

  update(time: number, deltaTime: number) {
    this.world.tick(deltaTime);

    // Example usage of TimeController
    // this.timeController.pause();
    // this.timeController.slowDown(0.5);
    // this.timeController.speedUp(2);
    // this.timeController.resume();
  }
}
