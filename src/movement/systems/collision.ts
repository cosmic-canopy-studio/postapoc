import { getLogger } from '@src/telemetry/systems/logger';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { IWorld } from 'bitecs';
import RBush from 'rbush';
import { getEntityNameWithID } from '@src/entity/components/names';

export function handleCollision(
  entityId: number,
  world: IWorld,
  objectsSpatialIndex: RBush<ICollider>
): number {
  const logger = getLogger('movement');
  const searchBounds = getBoundingBox(entityId);
  if (!searchBounds) {
    logger.error(`Could not find bounding box for entity ${entityId}`);
    return 1;
  }

  const nearbyObjects = objectsSpatialIndex.search(searchBounds);

  logger.debugVerbose(
    `Found ${nearbyObjects.length} nearby objects for entity ${entityId}`
  );

  let collisionModifier = 1;
  for (const staticObject of nearbyObjects) {
    collisionModifier *= staticObject.collisionModifier;
    logger.debug(
      `Collision detected between ${getEntityNameWithID(
        entityId
      )} and ${getEntityNameWithID(staticObject.eid)}`
    );
  }

  return collisionModifier;
}
