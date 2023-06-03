import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';

const logger = getLogger('entity');
const phaserSprites: Phaser.GameObjects.Sprite[] = [];

const PhaserSprite = defineComponent({
  spriteIndex: Types.ui16,
});

export function addPhaserSprite(
  world: IWorld,
  eid: number,
  sprite: Phaser.GameObjects.Sprite
) {
  addComponent(world, PhaserSprite, eid);
  PhaserSprite.spriteIndex[eid] = phaserSprites.length;
  phaserSprites.push(sprite);
  logger.debugVerbose(
    `Adding sprite ${eid} with texture ${sprite.texture.key}`
  );
}

export function removePhaserSprite(eid: number) {
  const sprite = getSprite(eid);
  if (!sprite) {
    throw new Error(`No sprite found for entity ${eid}`);
  } else {
    sprite.setActive(false);
    sprite.setVisible(false);
    sprite.setTexture('');
  }
  logger.debugVerbose(`Removing sprite ${eid}`);
  return sprite;
}

export function getSprite(eid: number): Phaser.GameObjects.Sprite | undefined {
  const index = PhaserSprite.spriteIndex[eid];
  return phaserSprites[index];
}

export default PhaserSprite;
