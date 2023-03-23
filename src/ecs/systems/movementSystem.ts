// Part: src/ecs/systems/movementSystem.ts

import { defineQuery, IWorld } from 'bitecs';
import { Movement } from '@src/ecs/components/movement';

const movementQuery = defineQuery([Movement]);

export function movementSystem(world: IWorld, deltaTime: number) {
  const { x, y, speed } = Movement;
  const entities = movementQuery(world);

  for (const eid of entities) {
    x[eid] += speed[eid] * deltaTime;
    y[eid] += speed[eid] * deltaTime;
  }
}
