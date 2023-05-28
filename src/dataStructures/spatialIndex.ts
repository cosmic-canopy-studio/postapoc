import RBush from 'rbush';

type BoundingBox = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export default class SpatialIndex {
  private tree: RBush<BoundingBox>;

  constructor() {
    this.tree = new RBush<BoundingBox>();
  }

  insert(boundingBox: BoundingBox): void {
    this.tree.insert(boundingBox);
  }

  remove(boundingBox: BoundingBox): void {
    this.tree.remove(boundingBox);
  }

  search(boundingBox: BoundingBox): BoundingBox[] {
    return this.tree.search(boundingBox);
  }

  all(): BoundingBox[] {
    return this.tree.all();
  }
}
