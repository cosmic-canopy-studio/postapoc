// Part: src/ecs/systems/TimeSystem.ts

// src/ecs/systems/TimeSystem.ts
import EventBus from '@src/core/EventBus';
import { injectable } from 'inversify';

export enum TimeState {
  PAUSED,
  RUNNING,
  SLOWED_DOWN,
  FAST_FORWARD,
}

@injectable()
export class TimeSystem {
  private timeState: TimeState;
  private readonly slowedDownSpeed: number;
  private readonly fastForwardSpeed: number;

  constructor() {
    this.timeState = TimeState.RUNNING;
    this.slowedDownSpeed = 0.5;
    this.fastForwardSpeed = 2;
  }

  setTimeState(timeState: TimeState) {
    this.timeState = timeState;
    const timeScale = this.getTimeScale();
    EventBus.emit('timeScaleChange', timeScale);
  }

  getTimeState(): TimeState {
    return this.timeState;
  }

  getDeltaTime(deltaTime: number): number {
    return deltaTime * this.getTimeScale();
  }

  private getTimeScale(): number {
    switch (this.timeState) {
      case TimeState.PAUSED:
        return 0;
      case TimeState.SLOWED_DOWN:
        return this.slowedDownSpeed;
      case TimeState.FAST_FORWARD:
        return this.fastForwardSpeed;
      case TimeState.RUNNING:
      default:
        return 1;
    }
  }
}
