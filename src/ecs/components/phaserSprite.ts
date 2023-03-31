// Part: src/ecs/components/phaserSprite.ts

// src/ecs/components/phaserSprite.ts

import { addComponent, defineComponent, IWorld, removeComponent, Types } from "bitecs";
import Phaser from "phaser";

const phaserSprites: Phaser.GameObjects.Sprite[] = [];

const PhaserSprite = defineComponent({
  spriteIndex: Types.ui16
});

export function addPhaserSprite(
  world: IWorld,
  eid: number,
  sprite: Phaser.GameObjects.Sprite
) {
  addComponent(world, PhaserSprite, eid);
  PhaserSprite.spriteIndex[eid] = phaserSprites.length;
  phaserSprites.push(sprite);
}

export function removePhaserSprite(world: IWorld, eid: number) {
  const sprite = getSprite(eid);
  if (sprite) {
    sprite.destroy();
  }
  removeComponent(world, PhaserSprite, eid);
}

export function getSprite(eid: number): Phaser.GameObjects.Sprite | undefined {
  const index = PhaserSprite.spriteIndex[eid];
  return phaserSprites[index];
}

export default PhaserSprite;
