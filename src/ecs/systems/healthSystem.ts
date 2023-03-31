// Part: src/ecs/systems/healthSystem.ts

import { getLogger } from "@src/core/components/logger";
import Health from "@src/ecs/components/health";
import { removePhaserSprite } from "@src/ecs/components/phaserSprite";
import { defineQuery, IWorld, removeEntity } from "bitecs";

const healthQuery = defineQuery([Health]);

export function healthSystem(
  world: IWorld
) {
  const entities = healthQuery(world);

  for (const eid of entities) {
    if (Health.current[eid] <= 0) {
      getLogger("healthSystem").info("Entity died", { eid });
      removePhaserSprite(world, eid);
      removeEntity(world, eid);
    }
  }
}
