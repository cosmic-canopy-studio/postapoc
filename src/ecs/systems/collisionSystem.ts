// Part: src/ecs/systems/collisionSystem.ts

import RBush from "rbush";
import StaticObject from "@src/phaser/objects/staticObject";
import { getLogger } from "@src/core/logger";

export function handleCollision(
  sprite: Phaser.GameObjects.Sprite,
  objectsSpatialIndex: RBush<StaticObject>
): number {
  const spriteBounds = sprite.getBounds();

  const nearbyObjects = objectsSpatialIndex.search({
    minX: spriteBounds.x,
    minY: spriteBounds.y,
    maxX: spriteBounds.x + spriteBounds.width,
    maxY: spriteBounds.y + spriteBounds.height
  });

  let collisionModifier = 1;
  for (const staticObject of nearbyObjects) {
    if (Phaser.Geom.Intersects.RectangleToRectangle(sprite.getBounds(), staticObject.getBounds())) {
      collisionModifier *= staticObject.collisionModifier;
      if (staticObject.collisionModifier === 0) {
        getLogger("collisionSystem").debug(`${sprite.texture.key} collided with ${staticObject.name}`);
      }
    }
  }

  return collisionModifier;
}
