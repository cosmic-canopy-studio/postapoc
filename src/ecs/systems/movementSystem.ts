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

    const sprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
    if (sprite) {
      const collisionModifier = handleCollision(sprite, staticObjects);

      let newX, newY;
      if (collisionModifier > 0) {
        newX = Movement.x[eid] + xSpeed * collisionModifier * delta;
        newY = Movement.y[eid] + ySpeed * collisionModifier * delta;
      } else {
        newX = Movement.x[eid] - xSpeed * delta;
        newY = Movement.y[eid] - ySpeed * delta;
        Movement.xSpeed[eid] = 0;
        Movement.ySpeed[eid] = 0;
      }

      Movement.x[eid] = newX;
      Movement.y[eid] = newY;

      sprite.setPosition(newX, newY);
    }
  }
}
