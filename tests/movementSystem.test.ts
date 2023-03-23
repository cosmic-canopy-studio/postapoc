// tests/movementSystem.test.ts
import { addEntity, createWorld } from 'bitecs';
import { addMovement, Movement } from '@src/ecs/components/movement';
import { movementSystem } from '@src/ecs/systems/movementSystem';
import { TimeState } from '@src/ecs/systems/timeSystem';
import { ITimeSystem } from '@src/utils/interfaces';
import { TIME_SYSTEM } from '@src/utils/constants';
import container from '@src/core/inversify.config';

describe('Movement System', () => {
  it('updates the position of an entity with a movement component', () => {
    const world = createWorld();
    const entity = addEntity(world);
    addMovement(world, entity, 100, 200, 50);

    const timeSystem = container.get<ITimeSystem>(TIME_SYSTEM);
    timeSystem.setTimeState(TimeState.RUNNING);
    const deltaTime = 1;
    const adjustedDeltaTime = timeSystem.getDeltaTime(deltaTime);

    movementSystem(world, adjustedDeltaTime);
    expect(Movement.x[entity]).toBe(150);
    expect(Movement.y[entity]).toBe(250);
  });
});
