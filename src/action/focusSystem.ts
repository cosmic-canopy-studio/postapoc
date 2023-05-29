import Collider, { getBoundingBox, ICollider } from '@src/movement/collider';
import { getLogger } from '@src/telemetry/logger';
import { PLAYER_FOCUS_DISTANCE } from '@src/config/constants';
import RBush from 'rbush';
import * as Phaser from 'phaser';

interface IFocusTarget {
  distance: number;
  target: ICollider;
}

export function focusSystem(
  playerEid: number,
  objectsSpatialIndex: RBush<ICollider>,
  arrow: Phaser.GameObjects.Sprite
): number | null {
  const logger = getLogger('focus');
  const playerBounds = getBoundingBox(playerEid); // assuming getPlayer() method is in PlayerManager
  if (!playerBounds) {
    logger.warn('Player has no bounds');
    return null;
  }

  const nearbyObjects = objectsSpatialIndex.search({
    minX: playerBounds.minX - PLAYER_FOCUS_DISTANCE,
    minY: playerBounds.minY - PLAYER_FOCUS_DISTANCE,
    maxX: playerBounds.maxX + PLAYER_FOCUS_DISTANCE,
    maxY: playerBounds.maxY + PLAYER_FOCUS_DISTANCE,
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

  objectsInRange.sort((a, b) => a.distance - b.distance);
  logger.debug('Sorted objects', objectsInRange);
  logger.debug('Nearest object', objectsInRange[0]);
  const nearestObject = objectsInRange[0];
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
