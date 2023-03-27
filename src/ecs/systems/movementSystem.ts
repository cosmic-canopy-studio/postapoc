// Part: src/ecs/systems/movementSystem.ts

import { defineQuery, IWorld } from "bitecs";
import Movement from "@src/ecs/components/movement";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";
import StaticObject from "@src/phaser/objects/staticObject";
import RBush from "rbush";
import { handleCollision } from "@src/ecs/systems/collisionSystem";

const movementQuery = defineQuery([Movement]);

export function movementSystem(
  world: IWorld,
  delta: number,
  staticObjects: RBush<StaticObject>
) {
  const entities = movementQuery(world);

  for (const eid of entities) {
    const xSpeed = Movement.xSpeed[eid];
    const ySpeed = Movement.ySpeed[eid];

    let collisionModifier = 1;
    const sprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
    if (sprite) {
      // Handle collisions and update the movement component's position
      collisionModifier = handleCollision(sprite, staticObjects);
      if (collisionModifier === 0) {
        Movement.x[eid] = sprite.x -= xSpeed * delta;
        Movement.y[eid] = sprite.y -= ySpeed * delta;
        Movement.xSpeed[eid] = 0;
        Movement.ySpeed[eid] = 0;
      }
    }

    // Update the position based on the velocity
    Movement.x[eid] += xSpeed * collisionModifier * delta;
    Movement.y[eid] += ySpeed * collisionModifier * delta;

    // Update the sprite's position based on the Movement component
    sprite.setPosition(Movement.x[eid], Movement.y[eid]);
  }
}
