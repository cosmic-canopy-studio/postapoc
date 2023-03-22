// src/ecs/components/Movement.ts
import { addComponent, createType, defineComponent } from 'bitecs';
import logger from '@/logger';

const Movement = createType();
defineComponent(Movement);

export function addMovement(
  entity: number,
  x: number,
  y: number,
  speed: number
) {
  addComponent(entity, Movement);
  Movement.x[entity] = x;
  Movement.y[entity] = y;
  Movement.speed[entity] = speed;
  logger.debug(
    `Added Movement component to entity ${entity} with x: ${x}, y: ${y}, speed: ${speed}`
  );
}

export default Movement;
