// Start of file: timeSystem.test.ts
import { TimeState, TimeSystem } from '@src/ecs/systems/timeSystem';

describe('Time System', () => {
  it('returns adjusted delta times based on the current time state', () => {
    const timeSystem = new TimeSystem();
    const deltaTime = 1;

    timeSystem.setTimeState(TimeState.PAUSED);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(0);

    timeSystem.setTimeState(TimeState.RUNNING);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(1);

    timeSystem.setTimeState(TimeState.SLOW_MOTION);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(0.5);
  });
});
