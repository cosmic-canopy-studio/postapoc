// Part: src/ecs/components/item.ts
// Code Reference:
// Documentation:

export interface IItem {
  name: string;
  weight: number;
  volume: number;
  category: string;
  durability?: number;
  condition?: number;
}

export class Item implements IItem {
  id!: string;
  name!: string;
  weight!: number;
  volume!: number;
  category!: string;
  durability?: number;
  condition?: number;

  constructor(
    id: string,
    name: string,
    weight: number,
    volume: number,
    category: string
  ) {
    this.initialize(id, name, weight, volume, category);
  }

  initialize(
    id: string,
    name: string,
    weight: number,
    volume: number,
    category: string
  ): void {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.volume = volume;
    this.category = category;
  }
}
