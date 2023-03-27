// Part: src/ecs/systems/collisionSystem.ts

import RBush from "rbush";
import StaticObject from "@src/phaser/objects/staticObject";
import { getLogger } from "@src/core/logger";

export function handleCollision(
  sprite: Phaser.GameObjects.Sprite,
  objectsSpatialIndex: RBush<StaticObject>
) {
  const nearbyObjects = objectsSpatialIndex.search({
    minX: sprite.x,
    minY: sprite.y,
    maxX: sprite.x + sprite.width,
    maxY: sprite.y + sprite.height
  });

  let collisionModifier = 1;
  for (const staticObject of nearbyObjects) {
    if (Phaser.Geom.Intersects.RectangleToRectangle(sprite.getBounds(), staticObject.getBounds())) {
      getLogger("collisionSystem").debug(`${sprite.texture.key} collided with ${staticObject.name}`);
      collisionModifier = staticObject.collisionModifier;
    }
  }

  return collisionModifier;
}
