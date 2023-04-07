// Part: src/ecs/components/inventory.ts

import { addComponent, createType, IWorld, removeComponent } from 'bitecs';

export const Inventory = createType();
export const addInventory = (world: IWorld, eid: number) => {
  addComponent(world, Inventory, eid);
  return eid;
};
export const removeInventory = (world: IWorld, eid: number) => {
  removeComponent(world, Inventory, eid);
};
