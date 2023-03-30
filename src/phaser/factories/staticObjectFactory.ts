// Part: src/phaser/factories/staticObjectFactory.ts

import ObjectPool from "@src/core/systems/objectPool";
import { addHealth } from "@src/ecs/components/health";
import StaticObject from "@src/phaser/objects/staticObject";
import { addEntity, IWorld } from "bitecs";
import Phaser from "phaser";

export default class StaticObjectFactory {
  private scene: Phaser.Scene;
  private world: IWorld;
  private objectPool: ObjectPool<StaticObject>;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
    this.objectPool = new ObjectPool(() => {
      return new StaticObject(this.scene);
    });
  }

  generateTileset(tileSize = 32, mapWidth = 50, mapHeight = 50) {
    let objects = [];
    for (let x = 0; x < mapWidth; x++) {
      for (let y = 0; y < mapHeight; y++) {
        const tileType = Math.random() > 0.5 ? "grass" : "grass2";
        const object = this.objectPool.get();
        const objectID = addEntity(this.world);
        object.initialize(x * tileSize, y * tileSize, tileType, objectID, true);
        object.collisionModifier = 0.9;
        objects.push(object);
      }
    }
    return objects;
  }

  public create(x: number, y: number, texture: string, exempt = false) {
    const object = this.objectPool.get();
    const objectID = addEntity(this.world);
    object.initialize(x, y, texture, objectID, exempt);
    addHealth(this.world, objectID, 100, 100);
    return object;
  }

  release(item: StaticObject): void {
    item.deinitialize();
    this.objectPool.release(item);
  }
}
