// Start of file: TimeSystem.test.ts
import { TimeState, TimeSystem } from '@src/ecs/systems/TimeSystem';

describe('Time System', () => {
  it('returns adjusted delta times based on the current time state', () => {
    const timeSystem = new TimeSystem();
    const deltaTime = 1;

    timeSystem.setTimeState(TimeState.PAUSED);
    expect(timeSystem.getDeltaTime(deltaTime)).toBe(0);

    timeSystem.setTimeState(TimeState.RUNNING);
    expect(timeSystem.getDeltaTime(deltaTime)).toBe(1);

    timeSystem.setTimeState(TimeState.SLOWED_DOWN);
    expect(timeSystem.getDeltaTime(deltaTime)).toBe(0.5);

    timeSystem.setTimeState(TimeState.FAST_FORWARD);
    expect(timeSystem.getDeltaTime(deltaTime)).toBe(2);
  });
});
// End of file: TimeSystem.test.ts
