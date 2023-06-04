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

export default class FocusManager {
  private arrow: Phaser.GameObjects.Sprite;
  private logger;

  constructor(scene: Phaser.Scene) {
    this.arrow = this.createArrow(scene);
    this.logger = getLogger('action');
  }

  update(playerEid: number, objectsSpatialIndex: RBush<ICollider>) {
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
          this.logger.info(
            `${getEntityNameWithID(
              focusTargetEid
            )} out of range, clearing focus.`
          );
          this.removeFocus(playerEid);
          focusTargetEid = ECS_NULL;
        }
      } else {
        this.logger.warn(
          `No bounds found for focus target ${getEntityNameWithID(
            focusTargetEid
          )}, clearing focus.`
        );
        this.removeFocus(playerEid);
        focusTargetEid = ECS_NULL;
      }
    }

    if (focusTargetEid === ECS_NULL) {
      focusTargetEid = this.getNearestTargetInRange(
        playerEid,
        objectsSpatialIndex
      );
      if (focusTargetEid !== ECS_NULL) {
        updateFocusTarget(playerEid, focusTargetEid);
      }
    }
  }

  removeFocus(focusOwnerEid: number) {
    clearFocusTarget(focusOwnerEid);
    this.logger.debugVerbose(`FocusSystem removing focus`);
    this.arrow.setVisible(false);
    return ECS_NULL;
  }

  private createArrow(scene: Phaser.Scene, visible = false) {
    const arrow = scene.add.sprite(0, 0, 'red_arrow');
    arrow.setVisible(visible);
    return arrow;
  }

  private getNearestTargetInRange(
    focusOwnerEntityId: number,
    objectsSpatialIndex: RBush<ICollider>
  ) {
    const focusOwnerBounds = getBoundingBox(focusOwnerEntityId); // assuming getPlayer() method is in PlayerManager
    if (!focusOwnerBounds) {
      this.logger.warn('Player has no bounds');
      return ECS_NULL;
    }

    const nearbyObjects = objectsSpatialIndex.search({
      minX: focusOwnerBounds.minX - PLAYER_FOCUS_DISTANCE,
      minY: focusOwnerBounds.minY - PLAYER_FOCUS_DISTANCE,
      maxX: focusOwnerBounds.maxX + PLAYER_FOCUS_DISTANCE,
      maxY: focusOwnerBounds.maxY + PLAYER_FOCUS_DISTANCE,
    });

    if (nearbyObjects === undefined || nearbyObjects.length === 0) {
      this.arrow.setVisible(false);
      this.logger.debugVerbose('No nearby objects');
      return ECS_NULL;
    }

    const objectsInRange: IFocusTarget[] = [];

    for (const staticObject of nearbyObjects) {
      if (!Collider.exempt[staticObject.eid]) {
        const distance = Phaser.Math.Distance.Between(
          focusOwnerBounds.minX + focusOwnerBounds.maxX / 2,
          focusOwnerBounds.minY + focusOwnerBounds.maxY / 2,
          staticObject.minX + staticObject.maxX / 2,
          staticObject.minY + staticObject.maxY / 2
        );
        if (distance <= PLAYER_FOCUS_DISTANCE) {
          objectsInRange.push({ distance, target: staticObject });
        }
      }
    }

    objectsInRange.sort((a, b) => a.distance - b.distance);
    this.logger.debug('Sorted objects', objectsInRange);
    this.logger.debug('Nearest object', objectsInRange[0]);
    const nearestObject = objectsInRange[0];
    if (nearestObject) {
      return this.setFocusArrow(nearestObject.target);
    } else {
      return this.removeFocus(focusOwnerEntityId);
    }
  }

  private setFocusArrow(target: ICollider) {
    this.logger.info(`Setting focus to ${getEntityNameWithID(target.eid)}`);
    const centerX = target.minX + (target.maxX - target.minX);

    const arrowX = centerX - this.arrow.width / 2;
    const arrowY = target.minY - this.arrow.height / 2;
    this.arrow.setPosition(arrowX, arrowY);
    this.arrow.setVisible(true);
    this.arrow.setDepth(10);
    if (!target.eid) throw new Error('No eid for target');
    return target.eid;
  }
}
