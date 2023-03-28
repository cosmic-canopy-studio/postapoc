// Part: src/ecs/systems/controlSystem.ts

import controlMapping from "@src/config/controlMapping.json";
import { getLogger } from "@src/core/components/logger";
import { IControlMapping } from "@src/core/interfaces";
import EventBus from "@src/core/systems/eventBus";
import { MoveDirections } from "@src/ecs/systems/initMovementEvents";

export default class ControlSystem {
  private controlMapping: IControlMapping;
  private logger = getLogger("control");
  private controlledEntity!: number;

  constructor() {
    this.controlMapping = controlMapping.move;
  }

  initialize(scene: Phaser.Scene, controlledEntity: number) {
    this.controlledEntity = controlledEntity;
    scene.input.removeAllListeners();

    scene.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      if (!event.repeat) {
        this.logger.debug(`Key Pressed: ${event.code}`);
        const action = this.controlMapping[event.code];
        if (action) {
          EventBus.emit("move", { state: true, action: action as MoveDirections, entity: this.controlledEntity });
        }
      }
    });

    scene.input.keyboard.on("keyup", (event: KeyboardEvent) => {
      this.logger.debug(`Key Released: ${event.code}`);

      const action = this.controlMapping[event.code];
      if (action) {
        EventBus.emit("move", { state: false, action: action as MoveDirections, entity: this.controlledEntity });
      }
    });
  }
}
