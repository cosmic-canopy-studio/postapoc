// Part: src/ecs/components/attack.ts
// Code Reference:
// Documentation:

import { addComponent, defineComponent, IWorld, Types } from 'bitecs';

export interface IAttack {
  damage: number;
}

export const Attack = defineComponent({
  damage: Types.f32,
});

export function addAttack(world: IWorld, entity: number, damage: number) {
  addComponent(world, Attack, entity);
  Attack.damage[entity] = damage;
}

export default Attack;
