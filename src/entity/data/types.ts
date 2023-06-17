import { ICollider } from '@src/movement/components/collider';
import { BBox } from 'rbush';

export type Boundaries = ICollider | BBox;

export type RecipeIngredient = {
  id: string;
  quantity: number;
};

export type Recipe = RecipeIngredient[];

export type LootDrop = {
  id: string;
  drop_chance: number;
  count: number;
};

export type StaticObject = {
  id: string;
  name: string;
  textures: string[];
  type: string;
  category: string;
  health?: number;
  lootTable: LootDrop[];
  focusExempt: boolean;
  collisionModifier?: number;
};

export type Item = {
  id: string;
  name: string;
  textures: string[];
  type: string;
  category: string;
  health?: number;
  focusExempt?: boolean;
  collisionModifier?: number;
  canBePickedUp: boolean;
  recipe?: Recipe;
};

export type GenericObject = StaticObject | Item;

export type CraftableItem = {
  id: string;
  name: string;
  textures: string[];
  category: string;
  health?: number;
  canBePickedUp: boolean;
  recipe: Recipe;
};
