import Phaser from 'phaser';
import { addEntity, createWorld } from 'bitecs';
import { addMovement } from '@/ecs/components/Movement';
import createMovementSystem from '@/ecs/systems/MovementSystem';

export default class MainScene extends Phaser.Scene {
  private world!: ReturnType<typeof createWorld>;

  constructor() {
    super('MainScene');
  }

  create() {
    this.world = createWorld();

    // Create an entity for the player character
    const player = addEntity(this.world);
    addMovement(player, 400, 300, 100);

    // Set up the systems
    this.world.addSystem(createMovementSystem());
  }

  update() {
    this.world.tick();
  }
}
