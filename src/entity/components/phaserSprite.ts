import Collider from '@src/movement/components/collider';
import { getLogger } from '@src/telemetry/systems/logger';
import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import Phaser from 'phaser';

const logger = getLogger('entity');
const phaserSprites: Phaser.GameObjects.Sprite[] = [];

const PhaserSprite = defineComponent({
  spriteIndex: Types.ui16,
});

export function addPhaserSprite(
  world: IWorld,
  entityId: number,
  sprite: Phaser.GameObjects.Sprite
) {
  addComponent(world, PhaserSprite, entityId);
  PhaserSprite.spriteIndex[entityId] = phaserSprites.length;
  phaserSprites.push(sprite);
  logger.debugVerbose(
    `Adding sprite ${entityId} with texture ${sprite.texture.key}`
  );
}

export function removePhaserSprite(entityId: number) {
  const sprite = getSprite(entityId);
  if (!sprite) {
    throw new Error(`No sprite found for entity ${entityId}`);
  } else {
    sprite.setActive(false);
    sprite.setVisible(false);
    sprite.setTexture('');
  }
  logger.debugVerbose(`Removing sprite ${entityId}`);
  return sprite;
}

export function getSprite(entityId: number) {
  const index = PhaserSprite.spriteIndex[entityId];
  if (index === undefined) {
    throw new Error(`No sprite found for entity ${entityId}`);
  }
  return phaserSprites[index];
}

export function updateSpriteColliderBounds(entityId: number) {
  const sprite = getSprite(entityId);
  if (!sprite) {
    logger.error(
      `Could not update collider bounds for entity ${entityId}, no sprite found`
    );
    return;
  }
  const bounds = sprite.getBounds();

  Collider.minX[entityId] = bounds.x;
  Collider.minY[entityId] = bounds.y;
  Collider.maxX[entityId] = bounds.right; // x + width
  Collider.maxY[entityId] = bounds.bottom; // y + height
  logger.debugVerbose(`Updated collider bounds for entity ${entityId}`);
}

export default PhaserSprite;
