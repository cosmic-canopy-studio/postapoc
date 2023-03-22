import { addEntity, createWorld } from 'bitecs';
import { addMovement, Movement } from '@src/ecs/components/Movement';

describe('Movement Component', () => {
  it('adds a movement component to an entity', () => {
    const world = createWorld();
    const entity = addEntity(world);
    addMovement(world, entity, 100, 200, 50); // Pass the world parameter
    expect(Movement.x[entity]).toBe(100);
    expect(Movement.y[entity]).toBe(200);
    expect(Movement.speed[entity]).toBe(50);
  });
});
