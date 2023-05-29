import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/logger';

const logger = getLogger('phaserSprite');
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
  logger.debug(`Adding sprite ${eid}`);
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
  logger.debug(`Removing sprite ${eid}`);
  return sprite;
}

export function getSprite(eid: number): Phaser.GameObjects.Sprite | undefined {
  const index = PhaserSprite.spriteIndex[eid];
  return phaserSprites[index];
}

export default PhaserSprite;
