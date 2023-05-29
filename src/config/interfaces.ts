import { TimeState } from '@src/coreSystems/timeSystem';

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

export interface IHandler {
  initialize(): void;
}

export interface IUpdatableHandler extends IHandler {
  update();
}
