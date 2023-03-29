// Part: src/ecs/systems/focusSystem.ts

import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";
import StaticObject from "@src/phaser/objects/staticObject";
import { IWorld } from "bitecs";
import RBush from "rbush";

const PLAYER_DISTANCE = 100;

export function focusSystem(
  world: IWorld,
  eid: number,
  objectsSpatialIndex: RBush<StaticObject>,
  arrow: StaticObject
) {
  const playerSprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
  const playerBounds = playerSprite.getBounds();
  let nearestObject: StaticObject | null = null;
  let minDistance = Infinity;

  const nearbyObjects = objectsSpatialIndex.search({
    minX: playerBounds.x - PLAYER_DISTANCE,
    minY: playerBounds.y - PLAYER_DISTANCE,
    maxX: playerBounds.x + playerBounds.width + PLAYER_DISTANCE,
    maxY: playerBounds.y + playerBounds.height + PLAYER_DISTANCE
  });

  for (const staticObject of nearbyObjects) {
    if (!staticObject.exempt) {
      const objectBounds = staticObject.getBounds();
      const distance = Phaser.Math.Distance.Between(
        playerBounds.centerX,
        playerBounds.centerY,
        objectBounds.centerX,
        objectBounds.centerY
      );

      if (distance < PLAYER_DISTANCE && distance < minDistance) {
        nearestObject = staticObject;
        minDistance = distance;
      }
    }
  }

  if (nearestObject) {
    const arrowX = nearestObject.x + nearestObject.width / 2 - arrow.width / 2;
    const arrowY = nearestObject.y - nearestObject.height;
    arrow.setPosition(arrowX, arrowY);
    arrow.setVisible(true);
    arrow.setDepth(10);
  } else {
    arrow.setVisible(false);
  }
}
