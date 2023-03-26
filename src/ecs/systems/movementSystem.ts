// Part: src/ecs/systems/movementSystem.ts

import { defineQuery, IWorld } from "bitecs";
import Movement from "@src/ecs/components/movement";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";
import EventBus from "@src/core/eventBus";

const movementQuery = defineQuery([Movement]);

function initMovementEvents() {
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

export function movementSystem(world: IWorld, delta: number) {
  const entities = movementQuery(world);

  initMovementEvents();

  for (const eid of entities) {
    const xSpeed = Movement.xSpeed[eid];
    const ySpeed = Movement.ySpeed[eid];

    // Update the position based on the velocity
    Movement.x[eid] += xSpeed * delta;
    Movement.y[eid] += ySpeed * delta;

    // Update the sprite's position based on the Movement component
    const sprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
    if (sprite) {
      sprite.x = Movement.x[eid];
      sprite.y = Movement.y[eid];
    }
  }
}
