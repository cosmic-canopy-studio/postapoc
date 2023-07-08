import { TimeState, TimeSystem } from '@src/time/systems/timeSystem';

describe('Time System', () => {
  it('returns adjusted delta times based on the current time state', () => {
    const timeSystem = new TimeSystem();
    const deltaTime = 1;

    timeSystem.setTimeState(TimeState.PAUSED);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(0);

    timeSystem.setTimeState(TimeState.NORMAL);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(1);

    timeSystem.setTimeState(TimeState.SLOW);
    expect(timeSystem.getAdjustedDeltaTime(deltaTime)).toBe(0.5);
  });
});
