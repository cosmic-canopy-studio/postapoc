import { addComponent, defineComponent, IWorld, Types } from 'bitecs';

export interface IMotion {
  xSpeed: number;
  ySpeed: number;
}

export const Motion = defineComponent({
  xSpeed: Types.f32,
  ySpeed: Types.f32,
});

export function addMotion(
  world: IWorld,
  entity: number,
  xSpeed: number,
  ySpeed: number
) {
  addComponent(world, Motion, entity);
  Motion.xSpeed[entity] = xSpeed;
  Motion.ySpeed[entity] = ySpeed;
}

export default Motion;
