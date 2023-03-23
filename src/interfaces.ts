// Part: src/interfaces.ts

// src/interfaces.ts
import { TimeState } from '@src/ecs/systems/TimeSystem';

export interface ITimeController {
  setTimeScale(scale: number): void;
}

export interface ITimeSystem {
  setTimeState(timeState: TimeState): void;

  getTimeState(): TimeState;

  getDeltaTime(deltaTime: number): number;
}
