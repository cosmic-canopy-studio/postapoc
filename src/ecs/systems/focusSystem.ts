// Part: src/ecs/systems/focusSystem.ts
// Code Reference:
// Documentation:

import Collider, {
  getBoundingBox,
  ICollider,
} from '@src/ecs/components/collider';
import { IWorld } from 'bitecs';
import { getLogger } from 'loglevel';
import RBush from 'rbush';

const PLAYER_DISTANCE = 100;

interface IFocusTarget {
  distance: number;
  target: ICollider;
}

export function focusSystem(
  world: IWorld,
  eid: number,
  objectsSpatialIndex: RBush<ICollider>,
  arrow: Phaser.GameObjects.Sprite
) {
  const logger = getLogger('focus');
  const playerBounds = getBoundingBox(eid);
  if (!playerBounds) {
    logger.warn('Player has no bounds');
    return null;
  }

  const nearbyObjects = objectsSpatialIndex.search({
    minX: playerBounds.minX - PLAYER_DISTANCE,
    minY: playerBounds.minY - PLAYER_DISTANCE,
    maxX: playerBounds.maxX + PLAYER_DISTANCE,
    maxY: playerBounds.maxY + PLAYER_DISTANCE,
  });

  if (nearbyObjects === undefined || nearbyObjects.length === 0) {
    arrow.setVisible(false);
    logger.debug('No nearby objects');
    return null;
  }

  const objectsInRange: IFocusTarget[] = [];

  for (const staticObject of nearbyObjects) {
    if (!Collider.exempt[staticObject.eid]) {
      const distance = Phaser.Math.Distance.Between(
        playerBounds.minX + playerBounds.maxX / 2,
        playerBounds.minY + playerBounds.maxY / 2,
        staticObject.minX + staticObject.maxX / 2,
        staticObject.minY + staticObject.maxY / 2
      );
      objectsInRange.push({ distance, target: staticObject });
    }
  }

  const sortedObjects = objectsInRange.sort((a, b) => a.distance - b.distance);
  logger.debug('Sorted objects', sortedObjects);
  logger.debug('Nearest object', sortedObjects[0]);
  const nearestObject = sortedObjects[0];
  if (nearestObject) {
    return setFocus(nearestObject.target, arrow);
  } else {
    arrow.setVisible(false);
    return null;
  }
}

export function setFocus(target: ICollider, arrow: Phaser.GameObjects.Sprite) {
  const logger = getLogger('focusSystem');
  logger.debug(`Setting focus to ${target.eid}`);
  const centerX = target.minX + (target.maxX - target.minX);

  const arrowX = centerX - arrow.width / 2;
  const arrowY = target.minY - arrow.height / 2;
  arrow.setPosition(arrowX, arrowY);
  arrow.setVisible(true);
  arrow.setDepth(10);
  return target.eid;
}
