// Part: src/ecs/systems/timeController.ts

// Part: src/phaser/systems/timeController.ts

import { TIME_CONTROLLER } from "@src/core/constants";
import { ITimeController } from "@src/core/interfaces";
import EventBus from "@src/core/systems/eventBus";
import { inject, injectable } from "inversify";
import { Scene } from "phaser";

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
