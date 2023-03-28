// Part: src/ecs/systems/initMovementEvents.ts

import { getLogger } from "@src/core/components/logger";
import EventBus from "@src/core/systems/eventBus";
import { MoveEventPayload } from "@src/core/systems/eventTypes";
import Movement from "@src/ecs/components/movement";

export enum MoveDirections {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export function initMovementEvents() {
  const movementEventHandler = (state: boolean, direction: MoveDirections, eid: number) => {
    if (state) {
      switch (direction) {
        case MoveDirections.UP:
          Movement.ySpeed[eid] = -250;
          break;
        case MoveDirections.DOWN:
          Movement.ySpeed[eid] = 250;
          break;
        case MoveDirections.LEFT:
          Movement.xSpeed[eid] = -250;
          break;
        case MoveDirections.RIGHT:
          Movement.xSpeed[eid] = 250;
          break;
      }
    } else {
      switch (direction) {
        case MoveDirections.UP:
        case MoveDirections.DOWN:
          Movement.ySpeed[eid] = 0;
          break;
        case MoveDirections.LEFT:
        case MoveDirections.RIGHT:
          Movement.xSpeed[eid] = 0;
          break;
      }
    }

    getLogger("movement").debug(`Entity ${eid} move ${direction} ${state ? "start" : "stop"}`);
  };

  EventBus.on("move", (event: MoveEventPayload) => {
    const { entity, state, action } = event;
    movementEventHandler(state, action, entity);
  });
}
