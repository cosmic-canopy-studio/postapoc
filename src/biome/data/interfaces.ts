export interface SubmapObject {
  x: number;
  y: number;
  id: string;
}

export interface SubmapItem {
  x: number;
  y: number;
  id: string;
}

export interface SubmapTerrain {
  x: number;
  y: number;
  id: string;
}

export interface SubmapTile {
  overmapX: number;
  overmapY: number;
  originX: number;
  originY: number;
  submapBiomeName: string;
  submapTerrain: SubmapTerrain[];
  submapObjects: SubmapObject[];
  submapItems: SubmapItem[];
}

export interface Biome {
  name: string;
  terrains: BiomeEntry[];
  objects: BiomeEntry[];
  items: BiomeEntry[];
}

export interface BiomeEntry {
  name: string;
  weight: number;
}
