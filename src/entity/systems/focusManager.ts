import { CREATURE_FOCUS_DISTANCE, ECS_NULL } from '@src/core/config/constants';
import {
  clearFocusTarget,
  getFocusTarget,
  updateFocusTarget,
} from '@src/entity/components/focus';
import { Boundaries, IFocusTarget } from '@src/entity/data/types';
import { isEntityFocusExempt } from '@src/entity/systems/dataManager';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import { getBoundingBox, ICollider } from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import * as Phaser from 'phaser';
import RBush from 'rbush';

function calculateDistance(a: Boundaries, b: Boundaries): number {
  let xDistance = 0;
  let yDistance = 0;

  if (a.maxX < b.minX) {
    xDistance = b.minX - a.maxX;
  } else if (b.maxX < a.minX) {
    xDistance = a.minX - b.maxX;
  }

  if (a.maxY < b.minY) {
    yDistance = b.minY - a.maxY;
  } else if (b.maxY < a.minY) {
    yDistance = a.minY - b.maxY;
  }

  return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
}

export default class FocusManager {
  private arrow: Phaser.GameObjects.Sprite;
  private logger;

  constructor(scene: Phaser.Scene) {
    this.arrow = this.createArrow(scene);
    this.logger = getLogger('entity');
  }

  update(playerEid: number, objectsSpatialIndex: RBush<ICollider>) {
    const focusTargetEid = getFocusTarget(playerEid);

    if (focusTargetEid) {
      this.updateFocusTarget(playerEid);
    } else {
      this.findAndSetNewFocusTarget(playerEid, objectsSpatialIndex);
    }
  }

  updateFocusTarget(playerEid: number) {
    const focusTargetEid = getFocusTarget(playerEid);

    const playerBounds = getBoundingBox(playerEid);
    const focusTargetBounds = getBoundingBox(focusTargetEid);

    if (!focusTargetBounds) {
      this.logAndRemoveFocus(
        `No bounds found for focus target ${getEntityNameWithID(
          focusTargetEid
        )}`,
        playerEid
      );
      return;
    }

    const distance = calculateDistance(playerBounds, focusTargetBounds);
    if (distance > CREATURE_FOCUS_DISTANCE) {
      this.logAndRemoveFocus(
        `${getEntityNameWithID(focusTargetEid)} out of range`,
        playerEid
      );
    }
  }

  findAndSetNewFocusTarget(
    playerEid: number,
    objectsSpatialIndex: RBush<ICollider>
  ) {
    const newFocusTargetEid = this.getNearestTargetInRange(
      playerEid,
      objectsSpatialIndex
    );

    if (newFocusTargetEid !== ECS_NULL) {
      updateFocusTarget(playerEid, newFocusTargetEid);
    }
  }

  logAndRemoveFocus(message: string, focusOwnerEid: number) {
    this.logger.info(message + ', clearing focus.');
    this.removeFocus(focusOwnerEid);
  }

  removeFocus(focusOwnerEid: number) {
    clearFocusTarget(focusOwnerEid);
    this.logger.debugVerbose(`FocusSystem removing focus`);
    this.arrow.setVisible(false);
    return ECS_NULL;
  }

  private createArrow(scene: Phaser.Scene, visible = false) {
    const arrow = scene.add.sprite(0, 0, 'red_arrow');
    arrow.setOrigin(0, 0.5);
    arrow.setVisible(visible);
    return arrow;
  }

  private getNearestTargetInRange(
    focusOwnerEntityId: number,
    objectsSpatialIndex: RBush<ICollider>
  ) {
    const focusOwnerBounds = getBoundingBox(focusOwnerEntityId);
    if (!focusOwnerBounds) {
      this.logger.warn('Player has no bounds');
      return ECS_NULL;
    }

    const nearbyObjects = objectsSpatialIndex.search({
      minX: focusOwnerBounds.minX - CREATURE_FOCUS_DISTANCE,
      minY: focusOwnerBounds.minY - CREATURE_FOCUS_DISTANCE,
      maxX: focusOwnerBounds.maxX + CREATURE_FOCUS_DISTANCE,
      maxY: focusOwnerBounds.maxY + CREATURE_FOCUS_DISTANCE,
    });

    if (nearbyObjects === undefined || nearbyObjects.length === 0) {
      this.arrow.setVisible(false);
      this.logger.debugVerbose('No nearby objects');
      return ECS_NULL;
    }

    const objectsInRange: IFocusTarget[] = [];

    for (const staticObject of nearbyObjects) {
      if (!isEntityFocusExempt(staticObject.entityId)) {
        const staticObjectBounds = {
          minX: staticObject.minX,
          minY: staticObject.minY,
          maxX: staticObject.maxX,
          maxY: staticObject.maxY,
        };
        const distance = calculateDistance(
          focusOwnerBounds,
          staticObjectBounds
        );
        if (distance <= CREATURE_FOCUS_DISTANCE) {
          objectsInRange.push({ distance, target: staticObject });
        }
      }
    }

    objectsInRange.sort((a, b) => a.distance - b.distance);

    const previousFocusId = getFocusTarget(focusOwnerEntityId);

    // Check the position of the last focused entity in the sorted entities array
    const indexOfLastFocus = objectsInRange.findIndex(
      ({ target }) => target.entityId === previousFocusId
    );

    // If the last focused entity was found and is not the last one, focus the next one
    if (indexOfLastFocus >= 0 && indexOfLastFocus < objectsInRange.length - 1) {
      return this.setFocusArrow(objectsInRange[indexOfLastFocus + 1].target);
    } else if (objectsInRange.length > 0) {
      // If the last focused entity was not found or was the last one, focus the first one
      return this.setFocusArrow(objectsInRange[0].target);
    } else {
      return this.removeFocus(focusOwnerEntityId);
    }
  }

  private setFocusArrow(target: ICollider) {
    this.logger.info(
      `Setting focus to ${getEntityNameWithID(target.entityId)}`
    );
    const lengthX = target.maxX - target.minX;
    const centerX = target.minX + lengthX / 2;
    const arrowX = centerX - this.arrow.width / 2;
    const arrowY = target.minY - this.arrow.height / 2;
    this.arrow.setPosition(arrowX, arrowY);
    this.arrow.setVisible(true);
    this.arrow.setDepth(10);
    if (!target.entityId) throw new Error('No eid for target');
    return target.entityId;
  }
}
