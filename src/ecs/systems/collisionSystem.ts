import { getLogger } from "@src/core/components/logger";
import { getBoundingBox, ICollider } from "@src/ecs/components/collider";
import { IWorld } from "bitecs";
import RBush from "rbush";

export function handleCollision(
  eid: number,
  world: IWorld,
  objectsSpatialIndex: RBush<ICollider>
): number {
  const logger = getLogger("collision");
  const searchBounds = getBoundingBox(eid);
  if (!searchBounds) {
    logger.error(`Could not find bounding box for entity ${eid}`);
    return 1;
  }

  const nearbyObjects = objectsSpatialIndex.search(searchBounds);

  logger.debug(`Found ${nearbyObjects.length} nearby objects for entity ${eid}`);

  let collisionModifier = 1;
  for (const staticObject of nearbyObjects) {
    collisionModifier *= staticObject.collisionModifier;
    logger.debug(`Collision detected between ${eid} and ${staticObject.eid}`);
  }

  return collisionModifier;
}
