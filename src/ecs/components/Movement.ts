// src/ecs/components/Movement.ts
import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import logger from '@src/logger';

export const Movement = defineComponent({
  x: Types.f32,
  y: Types.f32,
  speed: Types.f32,
});

export function addMovement(
  world: IWorld,
  entity: number,
  x: number,
  y: number,
  speed: number
) {
  addComponent(world, Movement, entity);
  Movement.x[entity] = x;
  Movement.y[entity] = y;
  Movement.speed[entity] = speed;
  logger.debug(
    `Added Movement component to entity ${entity} with x: ${x}, y: ${y}, speed: ${speed}`
  );
}
