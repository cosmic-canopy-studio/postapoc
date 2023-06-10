import { LootDrop } from '@src/entity/data/types';
import { ICollider } from '@src/movement/components/collider';

export interface IFocusTarget {
  distance: number;
  target: ICollider;
}

export interface IItemGroup {
  [key: string]: LootDrop[];
}

export interface IEntityFactory {
  createEntity(x: number, y: number, id: string): number;

  releaseEntity(entityId: number): void;
}
