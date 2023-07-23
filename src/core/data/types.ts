import { Actions } from '@src/action/data/enums';
import { EntityActions } from '@src/entity/data/enums';
import { MoveActions } from '@src/movement/data/enums';
import { TelemetryActions } from '@src/telemetry/data/enums';
import { TimeActions } from '@src/time/data/enums';

export interface Asset {
  key: string;
  url: string;
  width?: number;
  height?: number;
}

export interface Tilemap extends Asset {
  key: string;
  type: 'tilemap';
  url: string;
  tilesets: Asset[];
}

export interface TilesetProperty {
  name: string;
  value: string;
}

export interface Tileset {
  id: number;
  name: string;
  properties: TilesetProperty[];
  tilewidth: number;
  tileheight: number;
  columns: number;
  tiles: Tile[];
}

export interface Tile {
  id: number;
  properties: TilesetProperty[];
}

export interface ControlMapping {
  [type: string]: Record<string, string>;
}

export interface IHandler {
  initialize(): void;
}

export interface IUpdatableHandler extends IHandler {
  update(): void;
}

export type GameAction =
  | MoveActions
  | Actions
  | EntityActions
  | TelemetryActions
  | TimeActions;

export interface GameActionHandler {
  (state: boolean): void;
}
