import ObjectPool from '@src/core/systems/objectPool';
import { Container } from '@src/ecs/components/container';

export class ContainerFactory {
  private containerPool: ObjectPool<Container>;

  constructor() {
    this.containerPool = new ObjectPool<Container>(
      () => new Container('', '', 0, 0, '')
    );
  }

  createContainer(
    id: string,
    name: string,
    weight: number,
    volume: number,
    category: string
  ): Container {
    const container = this.containerPool.get();
    container.initialize(id, name, weight, volume, category);
    return container;
  }

  releaseContainer(container: Container): void {
    this.containerPool.release(container);
  }
}
