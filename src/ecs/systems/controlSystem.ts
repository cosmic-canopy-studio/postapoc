// Part: src/ecs/systems/controlSystem.ts

import { IControlMapping } from "@src/core/interfaces";
import EventBus from "@src/core/eventBus";
import controlMapping from "@src/config/controlMapping.json";
import { getLogger } from "@src/core/logger";

export default class ControlSystem {
  private controlMapping: IControlMapping;
  private logger = getLogger("controls");
  private controlledEntity!: number;

  constructor() {
    this.controlMapping = controlMapping;
  }

  initialize(scene: Phaser.Scene, controlledEntity: number) {
    this.controlledEntity = controlledEntity;
    scene.input.removeAllListeners();

    scene.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      this.logger.debug(`Key Pressed: ${event.code}`);
      if (!event.repeat) {
        const action = this.controlMapping[event.code];
        if (action) {
          console.log(action);
          EventBus.emit(action, { entity: this.controlledEntity });
        }
      }
    });

    scene.input.keyboard.on("keyup", (event: KeyboardEvent) => {
      this.logger.debug(`Key Released: ${event.code}`);

      const action = this.controlMapping[event.code];
      if (action) {
        EventBus.emit(`${action}_up`, { entity: this.controlledEntity });
      }
    });
  }
}
