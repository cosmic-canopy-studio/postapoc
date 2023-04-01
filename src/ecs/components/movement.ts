// Part: src/ecs/components/movement.ts
// Code Reference:
// Documentation:

import { addComponent, defineComponent, IWorld, Types } from 'bitecs';

export interface IMovement {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
}

export const Movement = defineComponent({
  x: Types.f32,
  y: Types.f32,
  xSpeed: Types.f32,
  ySpeed: Types.f32,
});

export function addMovement(
  world: IWorld,
  entity: number,
  x: number,
  y: number,
  xSpeed: number,
  ySpeed: number
) {
  addComponent(world, Movement, entity);
  Movement.x[entity] = x;
  Movement.y[entity] = y;
  Movement.xSpeed[entity] = xSpeed;
  Movement.ySpeed[entity] = ySpeed;
}

export default Movement;
