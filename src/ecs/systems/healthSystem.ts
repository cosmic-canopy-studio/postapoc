// Part: src/ecs/systems/healthSystem.ts

import { getLogger } from "@src/core/components/logger";
import Health from "@src/ecs/components/health";
import { phaserEntityMapper } from "@src/ecs/components/phaserEntity";
import { StaticObjectFactory } from "@src/phaser/factories/staticObjectFactory";
import StaticObject from "@src/phaser/objects/staticObject";
import { defineQuery, IWorld, removeEntity } from "bitecs";
import RBush from "rbush";

const healthQuery = defineQuery([Health]);

export function healthSystem(
  world: IWorld,
  staticObjects: RBush<StaticObject>,
  staticObjectFactory: StaticObjectFactory
) {
  const entities = healthQuery(world);

  for (const eid of entities) {
    if (Health.current[eid] <= 0) {
      getLogger("healthSystem").info("Entity died", { eid });
      const sprite = phaserEntityMapper[eid] as Phaser.GameObjects.Sprite;
      if (sprite) {
        staticObjects.const;
        object = staticObjects.all().find((obj) => obj.eid === eid);
        if (object) {
          staticObjects.remove(object);
          staticObjectFactory.release(object);
        }
      }
      removeEntity(world, eid);
    }
  }
}
