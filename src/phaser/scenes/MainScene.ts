// src/phaser/scenes/MainScene.ts

import Phaser, { Scene } from 'phaser';
import { addEntity, createWorld } from 'bitecs';
import { addMovement } from '@src/ecs/components/Movement';
import { movementSystem } from '@src/ecs/systems/MovementSystem';
import { ITimeController, ITimeSystem } from '@src/interfaces';
import container from '@src/inversify.config';
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from '@src/constants';

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;

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
    const timeControllerFactory = container.get<
      (scene: Scene) => ITimeController
    >(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);
    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
  }

  update(time: number, deltaTime: number) {
    this.world.tick(deltaTime);
  }
}
