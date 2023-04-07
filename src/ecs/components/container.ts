// Part: src/ecs/components/container.ts
// Code Reference:
// Documentation:

import { Item } from './item';

export class Container extends Item {
  private items: Item[] = [];

  constructor(id: string, name: string, weight: number, volume: number) {
    super(id, name, weight, volume);
  }

  addItem(item: Item): void {
    this.items.push(item);
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

  getTotalWeight(): number {
    return this.items.reduce((total, item) => total + item.weight, this.weight);
  }

  getTotalVolume(): number {
    return this.items.reduce((total, item) => total + item.volume, this.volume);
  }
}
