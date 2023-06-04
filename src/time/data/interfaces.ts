import { TimeState } from '@src/time/systems/timeSystem';

export interface ITimeController {
  setTimeScale(scale: number): void;
}

export interface ITimeSystem {
  setTimeState(timeState: TimeState): void;

  getTimeState(): TimeState;

  getAdjustedDeltaTime(deltaTime: number): number;
}
