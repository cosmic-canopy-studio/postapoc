// Part: src/phaser/systems/timeController.ts

import { Scene } from "phaser";
import { ITimeController } from "@src/utils/interfaces";
import EventBus from "@src/core/eventBus";
import { inject, injectable } from "inversify";
import { TIME_CONTROLLER } from "@src/utils/constants";

@injectable()
export class TimeController implements ITimeController {
  private scene: Scene;

  constructor(@inject(TIME_CONTROLLER) scene: Scene) {
    this.scene = scene;
    EventBus.on("timeScaleChange", this.setTimeScale.bind(this));
  }

  setTimeScale(factor: number) {
    this.scene.time.timeScale = factor;
  }
}
