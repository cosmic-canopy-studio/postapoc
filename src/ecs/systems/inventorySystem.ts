// Part: src/ecs/systems/inventorySystem.ts
// Code Reference:
// Documentation:

import { Item } from '@src/ecs/components/item';
import PlayerFactory from '@src/phaser/factories/playerFactory';

export class InventorySystem {
  private playerFactory: PlayerFactory;

  constructor(playerFactory: PlayerFactory) {
    this.playerFactory = playerFactory;
  }

  addItemToPlayerInventory(item: Item): void {
    this.playerFactory.getInventory().addItem(item);
  }

  removeItemFromPlayerInventory(item: Item): boolean {
    return this.playerFactory.getInventory().removeItem(item);
  }

  // Add any other inventory related methods here
}
