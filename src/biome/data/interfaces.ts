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
