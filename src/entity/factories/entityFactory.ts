import { IEntityFactory } from '@src/entity/data/types';
import CreatureFactory from '@src/entity/factories/creatureFactory';
import ItemFactory from '@src/entity/factories/itemFactory';
import StaticObjectFactory from '@src/entity/factories/staticObjectFactory';
import { IWorld } from 'bitecs';
import Phaser from 'phaser';

interface IEntityType {
  [index: string]: IEntityFactory;
}

export default class EntityFactory {
  factories: IEntityType = {};
  private scene: Phaser.Scene;
  private world: IWorld;

  constructor(scene: Phaser.Scene, world: IWorld) {
    this.scene = scene;
    this.world = world;
    this.factories['creature'] = new CreatureFactory(scene, world);
    this.factories['staticObject'] = new StaticObjectFactory(scene, world);
    this.factories['item'] = new ItemFactory(scene, world);
  }

  createEntity(entityType: string, x: number, y: number, id: string): number {
    if (!this.factories[entityType]) {
      throw new Error('Entity type does not exist');
    }
    return this.factories[entityType].createEntity(x, y, id);
  }

  releaseEntity(entityType: string, id: number): void {
    if (!this.factories[entityType]) {
      throw new Error('Entity type does not exist');
    }
    this.factories[entityType].releaseEntity(id);
  }
}
