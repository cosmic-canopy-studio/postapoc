// src/ecs/systems/MovementSystem.ts
import { pipe } from 'bitecs';
import Movement from '@components/Movement';
import logger from '@/logger';

export function createMovementSystem() {
  return pipe((world) => {
    for (const entity of world.query(Movement)) {
      Movement.x[entity] += Movement.speed[entity];
      Movement.y[entity] += Movement.speed[entity];
      logger.debug(`Updated movement for entity ${entity}`);
    }
  });
}

export default createMovementSystem;
