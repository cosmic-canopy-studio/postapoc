import logger from '@src/telemetry/logger';
import { getSprite } from '@src/entity/components/phaserSprite';
import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { BBox } from 'rbush';

export interface ICollider {
  eid: number;
  exempt: boolean;
  collisionModifier: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const Collider = defineComponent({
  exempt: Types.ui8,
  collisionModifier: Types.f32,
  minX: Types.f32,
  minY: Types.f32,
  maxX: Types.f32,
  maxY: Types.f32,
});

export function addCollider(
  world: IWorld,
  entity: number,
  exempt: boolean,
  collisionModifier: number
) {
  addComponent(world, Collider, entity);
  Collider.exempt[entity] = exempt ? 1 : 0;
  Collider.collisionModifier[entity] = collisionModifier;
  updateSpriteColliderBounds(entity);
  logger.debug(`Added collider to entity ${entity}`);
}

export function getCollider(entity: number) {
  return {
    eid: entity,
    exempt: Collider.exempt[entity] === 1,
    collisionModifier: Collider.collisionModifier[entity],
    minX: Collider.minX[entity],
    minY: Collider.minY[entity],
    maxX: Collider.maxX[entity],
    maxY: Collider.maxY[entity],
  } as ICollider;
}

export function updateSpriteColliderBounds(entity: number) {
  const sprite = getSprite(entity);
  if (!sprite) {
    logger.error(
      `Could not update collider bounds for entity ${entity}, no sprite found`
    );
    return;
  }
  Collider.minX[entity] = sprite.x;
  Collider.minY[entity] = sprite.y;
  Collider.maxX[entity] = sprite.x + sprite.width;
  Collider.maxY[entity] = sprite.y + sprite.height;
  logger.debug(`Updated collider bounds for entity ${entity}`);
}

export function getBoundingBox(entity: number) {
  return {
    minX: Collider.minX[entity],
    minY: Collider.minY[entity],
    maxX: Collider.maxX[entity],
    maxY: Collider.maxY[entity],
  } as BBox;
}

export default Collider;
