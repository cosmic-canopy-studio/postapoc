// src/ecs/systems/TimeSystem.ts
export enum TimeState {
  PAUSED,
  RUNNING,
  SLOWED_DOWN,
  FAST_FORWARD,
}

export class TimeSystem {
  private timeState: TimeState;
  private slowedDownSpeed: number;
  private fastForwardSpeed: number;

  constructor() {
    this.timeState = TimeState.RUNNING;
    this.slowedDownSpeed = 0.5;
    this.fastForwardSpeed = 2;
  }

  setTimeState(timeState: TimeState) {
    this.timeState = timeState;
  }

  getTimeState(): TimeState {
    return this.timeState;
  }

  getDeltaTime(deltaTime: number): number {
    switch (this.timeState) {
      case TimeState.PAUSED:
        return 0;
      case TimeState.SLOWED_DOWN:
        return deltaTime * this.slowedDownSpeed;
      case TimeState.FAST_FORWARD:
        return deltaTime * this.fastForwardSpeed;
      case TimeState.RUNNING:
      default:
        return deltaTime;
    }
  }
}
