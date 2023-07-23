import { addComponent, defineComponent, IWorld, Types } from 'bitecs';

export enum OpenableStateType {
  CLOSED,
  OPEN,
  LOCKED,
  BROKEN,
}

export interface IOpenableState {
  state: OpenableStateType;
}

export const OpenableState = defineComponent({
  state: Types.ui8,
});

export function addOpenableState(
  world: IWorld,
  entity: number,
  state: OpenableStateType
) {
  addComponent(world, OpenableState, entity);
  OpenableState.state[entity] = state;
}

export default OpenableState;
