// Part: src/phaser/factories/playerFactory.ts
// Code Reference:
// Documentation:

// src/phaser/factories/playerFactory.ts

import { addCollider } from '@src/ecs/components/collider';
import { addHealth } from '@src/ecs/components/health';
import { addMovement } from '@src/ecs/components/movement';
import { addPhaserSprite } from '@src/ecs/components/phaserSprite';
import { addEntity, IWorld } from 'bitecs';
import Phaser from 'phaser';
import { Inventory } from '@src/ecs/components/inventory';
import { ContainerFactory } from '@src/phaser/factories/containerFactory';

export default class PlayerFactory {
  private scene: Phaser.Scene;
  private world: IWorld;
  private inventory: Inventory;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
    this.inventory = new Inventory();
  }

  public createPlayer(containerFactory: ContainerFactory) {
    const player = addEntity(this.world);
    const centerX = this.scene.cameras.main.centerX;
    const centerY = this.scene.cameras.main.centerY;
    const sprite = this.scene.add.sprite(centerX, centerY, 'player');
    sprite.setOrigin(0, 0);
    addPhaserSprite(this.world, player, sprite);
    addMovement(this.world, player, centerX, centerY, 0, 0);
    addHealth(this.world, player, 100, 100);
    addCollider(this.world, player, true, 1);
    const backpack = containerFactory.createContainer('backpack');
    this.inventory.addItem(backpack);
    return player;
  }

  public getInventory(): Inventory {
    return this.inventory;
  }
}
