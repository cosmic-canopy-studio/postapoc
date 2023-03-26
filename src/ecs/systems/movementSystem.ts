// Part: src/ecs/systems/movementSystem.ts

import { defineQuery, IWorld } from "bitecs";
import Movement from "@src/ecs/components/movement";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";
import EventBus from "@src/core/eventBus";

const movementQuery = defineQuery([Movement]);

function initMovementEvents() {
  EventBus.on("move_up", (event) => {
    const eid = event.entity;
    Movement.direction[eid] = -Math.PI / 2;
    Movement.speed[eid] = 200;
  });

  EventBus.on("move_down", (event) => {
    const eid = event.entity;
    Movement.direction[eid] = Math.PI / 2;
    Movement.speed[eid] = 200;
  });

  EventBus.on("move_left", (event) => {
    const eid = event.entity;
    Movement.direction[eid] = Math.PI;
    Movement.speed[eid] = 200;
  });

  EventBus.on("move_right", (event) => {
    const eid = event.entity;
    Movement.direction[eid] = 0;
    Movement.speed[eid] = 200;
  });
}

export function movementSystem(world: IWorld, delta: number) {
  const entities = movementQuery(world);

  initMovementEvents();

  for (const eid of entities) {
    const speed = Movement.speed[eid];
    const direction = Movement.direction[eid]; // Added direction

    // Calculate the velocity based on speed and direction
    const vx = Math.cos(direction) * speed;
    const vy = Math.sin(direction) * speed;

    // Update the position based on the velocity
    Movement.x[eid] += vx * delta;
    Movement.y[eid] += vy * delta;

    // Update the sprite's position based on the Movement component
    const sprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
    if (sprite) {
      sprite.x = Movement.x[eid];
      sprite.y = Movement.y[eid];
    }
  }
}
