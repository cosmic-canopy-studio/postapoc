import {
  getSprite,
  updateSpriteColliderBounds,
} from '@src/entity/components/phaserSprite';
import { ICollider } from '@src/movement/components/collider';
import Motion from '@src/movement/components/motion';
import Position from '@src/movement/components/position';
import { handleCollision } from '@src/movement/systems/collision';
import { defineQuery, IWorld } from 'bitecs';
import RBush from 'rbush';

const movementQuery = defineQuery([Motion]);

export function movement(
  world: IWorld,
  delta: number,
  staticObjects: RBush<ICollider>
) {
  const entities = movementQuery(world);

  for (const eid of entities) {
    const xSpeed = Motion.xSpeed[eid];
    const ySpeed = Motion.ySpeed[eid];

    const sprite = getSprite(eid);
    if (sprite) {
      const collisionModifier = handleCollision(eid, world, staticObjects);

      let newX, newY;
      if (collisionModifier > 0) {
        newX = Position.x[eid] + xSpeed * collisionModifier * delta;
        newY = Position.y[eid] + ySpeed * collisionModifier * delta;
      } else {
        newX = Position.x[eid] - xSpeed * delta;
        newY = Position.y[eid] - ySpeed * delta;
        Motion.xSpeed[eid] = 0;
        Motion.ySpeed[eid] = 0;
      }

      Position.x[eid] = newX;
      Position.y[eid] = newY;

      sprite.setPosition(newX, newY);
      updateSpriteColliderBounds(eid);
    }
  }
}
