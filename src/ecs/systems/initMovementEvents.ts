// Part: src/ecs/systems/initMovementEvents.ts

import EventBus from "@src/core/eventBus";
import Movement from "@src/ecs/components/movement";

export function initMovementEvents() {
  EventBus.on("move_up", (event) => {
    const eid = event.entity;
    Movement.ySpeed[eid] = -200;
  });

  EventBus.on("move_down", (event) => {
    const eid = event.entity;
    Movement.ySpeed[eid] = 200;
  });

  EventBus.on("move_left", (event) => {
    const eid = event.entity;
    Movement.xSpeed[eid] = -200;
  });

  EventBus.on("move_right", (event) => {
    const eid = event.entity;
    Movement.xSpeed[eid] = 200;
  });

  EventBus.on("move_up_up", (event) => {
    const eid = event.entity;
    Movement.ySpeed[eid] = 0;
  });

  EventBus.on("move_down_up", (event) => {
    const eid = event.entity;
    Movement.ySpeed[eid] = 0;
  });

  EventBus.on("move_left_up", (event) => {
    const eid = event.entity;
    Movement.xSpeed[eid] = 0;
  });

  EventBus.on("move_right_up", (event) => {
    const eid = event.entity;
    Movement.xSpeed[eid] = 0;
  });
}
