// Part: src/ecs/systems/movementSystem.ts

import { defineQuery, IWorld } from "bitecs";
import Movement from "@src/ecs/components/movement";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";

const movementQuery = defineQuery([Movement]);

export function movementSystem(world: IWorld, delta: number) {
  const entities = movementQuery(world);

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
