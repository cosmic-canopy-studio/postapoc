class Biome {
  name: string;
  terrainTypes: Map<string, string>;
  objects: Map<string, string>;
  structures: Map<string, Structure>;

  constructor(name: string) {
    this.name = name;
    this.terrainTypes = new Map();
    this.objects = new Map();
    this.structures = new Map();
  }

  addTerrainType(key: string, asset: string): void {
    this.terrainTypes.set(key, asset);
  }

  addObject(key: string, asset: string): void {
    this.objects.set(key, asset);
  }

  addStructure(key: string, structure: Structure): void {
    this.structures.set(key, structure);
  }
}

export function createGrassBiome(): Biome {

}
