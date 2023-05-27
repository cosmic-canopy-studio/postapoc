// Part: src/ecs/components/inventory.ts
// Code Reference:
// Documentation:

import { Item } from './item';
import { Container } from './container';

export class Inventory {
  private items: Item[] = [];

  addItem(item: Item): void {
    const existingItem = this.items.find((i) => i.id === item.id);
    if (
      existingItem &&
      existingItem instanceof Container &&
      item instanceof Container
    ) {
      existingItem.stack(item);
    } else {
      this.items.push(item);
    }
  }

  removeItem(item: Item): boolean {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  organizeItems(): void {
    this.items.sort((a, b) => a.name.localeCompare(b.name));
  }

  manageContainer(
    container: Container,
    action: 'add' | 'remove',
    item: Item
  ): boolean {
    if (action === 'add') {
      container.addItem(item);
      return true;
    } else if (action === 'remove') {
      return container.removeItem(item);
    }
    return false;
  }
}
