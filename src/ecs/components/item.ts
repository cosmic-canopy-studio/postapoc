// Part: src/ecs/components/item.ts
// Code Reference:
// Documentation:

import { addComponent, createType, IWorld, removeComponent } from 'bitecs';

export interface IItem {
  name: string;
  weight: number;
  volume: number;
  category: string;
  durability?: number;
  condition?: number;
}

export const Item = createType();
export const addItem = (world: IWorld, eid: number) => {
  addComponent(world, Item, eid);
  return eid;
};
export const removeItem = (world: IWorld, eid: number) => {
  removeComponent(world, Item, eid);
};
