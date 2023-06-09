import { ICollider } from '@src/movement/components/collider';
import { BBox } from 'rbush';

export type Boundaries = ICollider | BBox;

export type RecipeIngredient = {
  id: string;
  quantity: number;
};

export type Recipe = RecipeIngredient[];

export type Item = {
  id: string;
  name: string;
  texture: string;
  category?: string;
  canBePickedUp?: boolean;
  recipe?: Recipe;
};

export type XYCoordinates = {
  x: number;
  y: number;
};
