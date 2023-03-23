// Part: src/phaser/scenes/mainScene.ts

import Phaser, { Scene } from 'phaser';
import { addEntity, createWorld } from 'bitecs';
import { addMovement } from '@src/ecs/components/movement';
import { movementSystem } from '@src/ecs/systems/movementSystem';
import { ITimeController, ITimeSystem } from '@src/utils/interfaces';
import container from '@src/core/inversify.config';
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from '@src/utils/constants';
import Character from '@src/objects/character';

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;
  private timeController!: ITimeController;
  private timeSystem!: ITimeSystem;
  private player!: Character;

  constructor() {
    super('MainScene');
  }

  create() {
    this.world = createWorld();

    // Create an entity for the player character
    const player = addEntity(this.world);
    addMovement(this.world, player, 400, 300, 100);
    this.player = new Character(
      this,
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'player'
    );

    // Initialize the TimeController
    const timeControllerFactory = container.get<
      (scene: Scene) => ITimeController
    >(TIME_CONTROLLER_FACTORY);
    this.timeController = timeControllerFactory(this);
    this.timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
  }

  update(time: number, deltaTime: number) {
    movementSystem(this.world, deltaTime / 1000);
    this.player.update(deltaTime);
  }
}
