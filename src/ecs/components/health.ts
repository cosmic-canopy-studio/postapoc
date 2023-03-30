// Part: src/ecs/components/health.ts

import { addComponent, defineComponent, IWorld, Types } from "bitecs";

export interface IHealth {
  current: number;
  max: number;
}

export const Health = defineComponent({
  current: Types.f32,
  max: Types.f32
});

export function addHealth(
  world: IWorld,
  entity: number,
  currentHealth: number,
  maxHealth: number
) {
  addComponent(world, Health, entity);
  Health.current[entity] = currentHealth;
  Health.max[entity] = maxHealth;
}

export default Health;
