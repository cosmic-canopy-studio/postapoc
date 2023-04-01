// Part: src/ecs/systems/timeSystem.ts

import { getLogger } from "@src/core/components/logger";
import { ITimeSystem } from "@src/core/interfaces";
import EventBus from "@src/core/systems/eventBus";
import { injectable } from "inversify";

export enum TimeState {
  PAUSED,
  RUNNING,
  SLOW_MOTION,
}

@injectable()
export class TimeSystem implements ITimeSystem {
  private timeState: TimeState;
  private logger = getLogger("time");
  private lastUpdateTime: number;

  constructor() {
    this.timeState = TimeState.RUNNING;
    this.lastUpdateTime = Date.now();
    EventBus.on("togglePause", this.togglePause.bind(this));
    EventBus.on("toggleSlowTime", this.toggleSlowTime.bind(this));
    this.logger.debug("Initialized");
  }

  setTimeState(timeState: TimeState) {
    this.timeState = timeState;
    this.logger.debug(`Time state: ${TimeState[this.timeState]}`);
  }

  getTimeState(): TimeState {
    this.logger.debug(`Time state: ${TimeState[this.timeState]}`);
    return this.timeState;
  }

  getAdjustedDeltaTime(deltaTime: number): number {
    const adjustedDeltaTime = deltaTime * (this.timeState === TimeState.SLOW_MOTION ? 0.5 : 1);
    const now = Date.now();
    const deltaTimeSeconds = (now - this.lastUpdateTime);
    this.lastUpdateTime = now;
    this.logger.debug(`Delta time: ${deltaTimeSeconds}`);
    return adjustedDeltaTime > deltaTimeSeconds ? deltaTimeSeconds : adjustedDeltaTime;
  }

  togglePause() {
    this.setTimeState(this.timeState === TimeState.PAUSED ? TimeState.RUNNING : TimeState.PAUSED);
  }

  toggleSlowTime() {
    this.setTimeState(this.timeState === TimeState.SLOW_MOTION ? TimeState.RUNNING : TimeState.SLOW_MOTION);
  }
}
