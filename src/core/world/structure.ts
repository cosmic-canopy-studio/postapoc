export default class Structure {
  name: string;
  tiledMapAsset: string;
  spawnPositions: { x: number; y: number }[];

  constructor(name: string, tiledMapAsset: string, spawnPositions: { x: number; y: number }[]) {
    this.name = name;
    this.tiledMapAsset = tiledMapAsset;
    this.spawnPositions = spawnPositions;
  }
}
