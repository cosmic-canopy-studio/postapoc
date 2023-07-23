import { ICollider } from '@src/movement/components/collider';

export interface IFocusTarget {
  distance: number;
  target: ICollider;
}

export interface IDrop {
  id: string;
  drop_chance: number;
  count: number;
}

export interface IItemGroup {
  [key: string]: IDrop[];
}
