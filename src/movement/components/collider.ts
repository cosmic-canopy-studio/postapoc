import { updateSpriteColliderBounds } from '@src/entity/components/phaserSprite';
import logger from '@src/telemetry/systems/logger';
import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { BBox } from 'rbush';

export interface ICollider {
  entityId: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const Collider = defineComponent({
  minX: Types.f32,
  minY: Types.f32,
  maxX: Types.f32,
  maxY: Types.f32,
});

export function addCollider(world: IWorld, entityId: number) {
  addComponent(world, Collider, entityId);
  updateSpriteColliderBounds(entityId);
  logger.debug(`Added collider to entity ${entityId}`);
}

export function getCollider(entityId: number) {
  return {
    entityId: entityId,
    minX: Collider.minX[entityId],
    minY: Collider.minY[entityId],
    maxX: Collider.maxX[entityId],
    maxY: Collider.maxY[entityId],
  } as ICollider;
}

export function getBoundingBox(entityId: number) {
  return {
    minX: Collider.minX[entityId],
    minY: Collider.minY[entityId],
    maxX: Collider.maxX[entityId],
    maxY: Collider.maxY[entityId],
  } as BBox;
}

export default Collider;
