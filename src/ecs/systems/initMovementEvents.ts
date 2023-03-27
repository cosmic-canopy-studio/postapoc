// Part: src/ecs/systems/initMovementEvents.ts

import EventBus from "@src/core/eventBus";
import { MoveEventPayload } from "@src/core/eventTypes";
import Movement from "@src/ecs/components/movement";

export enum MoveDirections {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right",
}

export function initMovementEvents() {
  let movementEventDebug = false;

  EventBus.on("moveEvents", (event) => {
    movementEventDebug = event.value;
  });

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

    if (movementEventDebug) {
      console.debug(`Movement event: ${state ? "move" : "stop"}_${direction} Entity: ${eid}`);
    }
  };

  EventBus.on("move", (event: MoveEventPayload) => {
    const { entity, state, action } = event;
    movementEventHandler(state, action, entity);
  });
}
