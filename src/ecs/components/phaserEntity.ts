// Part: src/ecs/components/phaserEntity.ts

import { addComponent, defineComponent, IWorld } from "bitecs";

const PhaserEntity = defineComponent({});

export const phaserEntityMapper: Record<number, Phaser.GameObjects.Sprite> = {};

export function addPhaserEntitySprite(
  world: IWorld,
  eid: number,
  sprite: Phaser.GameObjects.Sprite
) {
  addComponent(world, PhaserEntity, eid);
  phaserEntityMapper[eid] = sprite;
}

export default PhaserEntity;
