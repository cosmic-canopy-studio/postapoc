import { addComponent, defineComponent, IWorld, Types } from 'bitecs';

export enum OrientationStateType {
  HORIZONTAL,
  VERTICAL,
}

export type ObjectIDWithOrientation = {
  objectBaseId: string;
  orientation: OrientationStateType;
};

export interface IOrientationState {
  state: OrientationStateType;
}

export const OrientationState = defineComponent({
  state: Types.ui8,
});

export function addOrientationState(
  world: IWorld,
  entity: number,
  state: OrientationStateType
) {
  addComponent(world, OrientationState, entity);
  OrientationState.state[entity] = state;
}

export function handleObjectIdNamedOrientation(objectId: string) {
  let orientation = OrientationStateType.HORIZONTAL;
  if (objectId.includes('_vertical')) {
    objectId = objectId.replace('_vertical', '');
    orientation = OrientationStateType.VERTICAL;
  }
  return { objectBaseId: objectId, orientation } as ObjectIDWithOrientation;
}

export default OrientationState;
