import { ICollider } from '@src/movement/components/collider';

export interface IFocusTarget {
  distance: number;
  target: ICollider;
}
