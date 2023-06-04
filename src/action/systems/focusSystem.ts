import Collider, {
  getBoundingBox,
  ICollider,
} from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { ECS_NULL, PLAYER_FOCUS_DISTANCE } from '@src/core/config/constants';
import RBush from 'rbush';
import * as Phaser from 'phaser';
import { getEntityNameWithID } from '@src/entity/components/names';
import {
  clearFocusTarget,
  getFocusTarget,
  updateFocusTarget,
} from '@src/action/components/focus';

interface IFocusTarget {
  distance: number;
  target: ICollider;
}

export function focusSystem(
  playerEid: number,
  objectsSpatialIndex: RBush<ICollider>,
  arrow: Phaser.GameObjects.Sprite
) {
  const logger = getLogger('action');
  let focusTargetEid = getFocusTarget(playerEid);

  if (focusTargetEid) {
    const playerBounds = getBoundingBox(playerEid);
    const focusTargetBounds = getBoundingBox(focusTargetEid);
    if (focusTargetBounds) {
      const distance = Phaser.Math.Distance.Between(
        playerBounds.minX + playerBounds.maxX / 2,
        playerBounds.minY + playerBounds.maxY / 2,
        focusTargetBounds.minX + focusTargetBounds.maxX / 2,
        focusTargetBounds.minY + focusTargetBounds.maxY / 2
      );
      if (distance > PLAYER_FOCUS_DISTANCE) {
        logger.info(
          `${getEntityNameWithID(focusTargetEid)} out of range, clearing focus.`
        );
        clearFocusTarget(playerEid);
        removeFocusArrow(arrow);
        focusTargetEid = ECS_NULL;
      }
    } else {
      logger.warn(
        `No bounds found for focus target ${getEntityNameWithID(
          focusTargetEid
        )}, clearing focus.`
      );
      clearFocusTarget(playerEid);
      removeFocusArrow(arrow);
      focusTargetEid = ECS_NULL;
    }
  }

  if (focusTargetEid === ECS_NULL) {
    focusTargetEid = getNearestTargetInRange(
      playerEid,
      objectsSpatialIndex,
      arrow
    );
    if (focusTargetEid !== ECS_NULL) {
      updateFocusTarget(playerEid, focusTargetEid);
    }
  }
}

export function getNearestTargetInRange(
  playerEid: number,
  objectsSpatialIndex: RBush<ICollider>,
  arrow: Phaser.GameObjects.Sprite
) {
  const logger = getLogger('action');
  const playerBounds = getBoundingBox(playerEid); // assuming getPlayer() method is in PlayerManager
  if (!playerBounds) {
    logger.warn('Player has no bounds');
    return ECS_NULL;
  }

  const nearbyObjects = objectsSpatialIndex.search({
    minX: playerBounds.minX - PLAYER_FOCUS_DISTANCE,
    minY: playerBounds.minY - PLAYER_FOCUS_DISTANCE,
    maxX: playerBounds.maxX + PLAYER_FOCUS_DISTANCE,
    maxY: playerBounds.maxY + PLAYER_FOCUS_DISTANCE,
  });

  if (nearbyObjects === undefined || nearbyObjects.length === 0) {
    arrow.setVisible(false);
    logger.debugVerbose('No nearby objects');
    return ECS_NULL;
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
      if (distance <= PLAYER_FOCUS_DISTANCE) {
        objectsInRange.push({ distance, target: staticObject });
      }
    }
  }

  objectsInRange.sort((a, b) => a.distance - b.distance);
  logger.debug('Sorted objects', objectsInRange);
  logger.debug('Nearest object', objectsInRange[0]);
  const nearestObject = objectsInRange[0];
  if (nearestObject) {
    return setFocusArrow(nearestObject.target, arrow);
  } else {
    return removeFocusArrow(arrow);
  }
}

export function setFocusArrow(
  target: ICollider,
  arrow: Phaser.GameObjects.Sprite
) {
  const logger = getLogger('action');
  logger.info(`Setting focus to ${getEntityNameWithID(target.eid)}`);
  const centerX = target.minX + (target.maxX - target.minX);

  const arrowX = centerX - arrow.width / 2;
  const arrowY = target.minY - arrow.height / 2;
  arrow.setPosition(arrowX, arrowY);
  arrow.setVisible(true);
  arrow.setDepth(10);
  if (!target.eid) throw new Error('No eid for target');
  return target.eid;
}

export function removeFocusArrow(arrow: Phaser.GameObjects.Sprite) {
  const logger = getLogger('action');
  logger.debugVerbose(`FocusSystem removing focus`);
  arrow.setVisible(false);
  return ECS_NULL;
}
