// Part: src/core/interfaces.ts
// Code Reference:
// Documentation:

import { TimeState } from '@src/core/systems/timeSystem';

export interface ITimeController {
  setTimeScale(scale: number): void;
}

export interface ITimeSystem {
  setTimeState(timeState: TimeState): void;

  getTimeState(): TimeState;

  getAdjustedDeltaTime(deltaTime: number): number;
}

export interface IDrop {
  id: string;
  weight: number;
  count: number;
}

export interface IItemGroup {
  [key: string]: IDrop[];
}

export interface ControlMapping {
  move: Record<string, string>;
  action: Record<string, string>;
}
