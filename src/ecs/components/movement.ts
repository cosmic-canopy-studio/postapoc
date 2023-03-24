// Part: src/ecs/components/movement.ts

import { addComponent, defineComponent, IWorld, Types } from "bitecs";
import MovableObject from "@src/objects/moveableObject";
import { addPhaserEntitySprite } from "@src/ecs/components/phaserEntity";

const Movement = defineComponent({
  x: Types.f32,
  y: Types.f32,
  speed: Types.f32,
  direction: Types.f32,
});

export function addMovement(
  world: IWorld,
  entity: number,
  x: number,
  y: number,
  speed: number,
  direction: number,
  scene: Phaser.Scene
) {
  addComponent(world, Movement, entity);
  Movement.x[entity] = x;
  Movement.y[entity] = y;
  Movement.speed[entity] = speed;
  Movement.direction[entity] = direction;

  const sprite = new MovableObject(scene, x, y, "player");
  addPhaserEntitySprite(world, entity, sprite);
}

export default Movement;
