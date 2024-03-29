import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { ECS_NULL } from '@src/core/config/constants';

export interface IFocus {
  target: number;
}

export const Focus = defineComponent({
  target: Types.i32,
});

export function addFocus(world: IWorld, entity: number, target: number) {
  addComponent(world, Focus, entity);
  Focus.target[entity] = target;
}

export function getFocusTarget(entity: number) {
  return Focus.target[entity];
}

export function hasFocus(entity: number) {
  return Focus.target[entity] !== 0;
}

export function updateFocusTarget(entity: number, target: number) {
  Focus.target[entity] = target;
}

export function clearFocusTarget(entity: number) {
  Focus.target[entity] = ECS_NULL;
}

export default Focus;
