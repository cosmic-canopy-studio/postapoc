// tests/MovementSystem.test.ts
import { addEntity, createWorld } from 'bitecs';
import { addMovement, Movement } from '@src/ecs/components/Movement';
import { movementSystem } from '@src/ecs/systems/MovementSystem';
import { TimeState, TimeSystem } from '@src/ecs/systems/TimeSystem';

describe('Movement System', () => {
  it('updates the position of an entity with a movement component', () => {
    const world = createWorld();
    const entity = addEntity(world);
    addMovement(world, entity, 100, 200, 50);

    // Use TimeSystem
    const timeSystem = new TimeSystem();
    timeSystem.setTimeState(TimeState.RUNNING);
    const deltaTime = 1; // Set deltaTime value
    const adjustedDeltaTime = timeSystem.getDeltaTime(deltaTime);

    movementSystem(world, adjustedDeltaTime);
    expect(Movement.x[entity]).toBe(150);
    expect(Movement.y[entity]).toBe(250);
  });
});
