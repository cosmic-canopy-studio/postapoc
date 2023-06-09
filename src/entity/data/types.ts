import { ICollider } from '@src/movement/components/collider';
import { BBox } from 'rbush';

export type Boundaries = ICollider | BBox;

export type RecipeIngredient = {
  id: string;
  quantity: number;
};

export type Recipe = RecipeIngredient[];
