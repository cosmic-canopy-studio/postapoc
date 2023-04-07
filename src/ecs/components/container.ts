// Part: src/ecs/components/container.ts

import { addComponent, createType, IWorld, removeComponent } from 'bitecs';

export const Container = createType();
export const addContainer = (world: IWorld, eid: number) => {
  addComponent(world, Container, eid);
  return eid;
};
export const removeContainer = (world: IWorld, eid: number) => {
  removeComponent(world, Container, eid);
};
