// Part: src/phaser/factories/containerFactory.ts
// Code Reference:
// Documentation:

import ObjectPool from '@src/core/systems/objectPool';
import { Container } from '@src/ecs/components/container';
import items from '@src/data/items.json';

export class ContainerFactory {
  private containerPool: ObjectPool<Container>;

  constructor() {
    this.containerPool = new ObjectPool<Container>(
      () => new Container('', '', 0, 0, '')
    );
  }

  createContainer(id: string): Container {
    const containerConfig = items.items.find(
      (item) => item.id === id && item.category === 'container'
    );
    if (!containerConfig) {
      throw new Error(`Container config not found for id: ${id}`);
    }
    const container = this.containerPool.get();
    container.initialize(
      containerConfig.id,
      containerConfig.name,
      containerConfig.weight,
      containerConfig.volume,
      containerConfig.category
    );
    return container;
  }

  releaseContainer(container: Container): void {
    this.containerPool.release(container);
  }
}
