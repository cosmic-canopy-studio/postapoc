import { getEntityCollisionModifier } from '@src/entity/systems/dataManager';
import {
  getEntityName,
  getEntityNameWithID,
} from '@src/entity/systems/entityNames';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { FULL_MOVEMENT } from '@src/movement/data/constants';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import RBush from 'rbush';

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

  let collisionModifier = FULL_MOVEMENT;
  for (const staticObject of nearbyObjects) {
    collisionModifier *= getEntityCollisionModifier(staticObject.entityId);
    //TODO: Change this to all tile types.
    if (getEntityName(staticObject.entityId) !== 'Grass') {
      logger.debug(
        `Collision: ${getEntityNameWithID(entityId)} with ${getEntityNameWithID(
          staticObject.entityId
        )}`
      );
    } else {
      logger.debugVerbose(
        `Collision: ${getEntityNameWithID(entityId)} with ${getEntityNameWithID(
          staticObject.entityId
        )}`
      );
    }
  }

  logger.debug(`Collision modifier: ${collisionModifier}`);

  return collisionModifier;
}
