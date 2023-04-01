// Part: src/core/interfaces.ts
// Code Reference:
// Documentation:

import { TimeState } from '@src/ecs/systems/timeSystem';

export interface ITimeController {
  setTimeScale(scale: number): void;
}

export interface ITimeSystem {
  setTimeState(timeState: TimeState): void;

  getTimeState(): TimeState;

  getAdjustedDeltaTime(deltaTime: number): number;
}
