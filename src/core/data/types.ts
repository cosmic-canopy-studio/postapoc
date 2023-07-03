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
