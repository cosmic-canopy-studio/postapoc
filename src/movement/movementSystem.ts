import { ICollider, updateSpriteColliderBounds } from '@src/movement/collider';
import Movement from '@src/movement/movement';
import { getSprite } from '@src/entity/phaserSprite';
import { handleCollision } from '@src/movement/collisionSystem';
import { defineQuery, IWorld } from 'bitecs';
import RBush from 'rbush';

const movementQuery = defineQuery([Movement]);

export function movementSystem(
  world: IWorld,
  delta: number,
  staticObjects: RBush<ICollider>
) {
  const entities = movementQuery(world);

  for (const eid of entities) {
    const xSpeed = Movement.xSpeed[eid];
    const ySpeed = Movement.ySpeed[eid];

    const sprite = getSprite(eid);
    if (sprite) {
      const collisionModifier = handleCollision(eid, world, staticObjects);

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
      updateSpriteColliderBounds(eid);
    }
  }
}
