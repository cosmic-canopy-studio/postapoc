// Part: src/ecs/systems/healthSystem.ts
// Code Reference:
// Documentation:

import { getLogger } from '@src/core/components/logger';
import EventBus from '@src/core/systems/eventBus';
import Health from '@src/ecs/components/health';
import { defineQuery, IWorld } from 'bitecs';

const healthQuery = defineQuery([Health]);

export function healthSystem(world: IWorld) {
  const entities = healthQuery(world);

  for (const eid of entities) {
    if (Health.current[eid] <= 0) {
      getLogger('health').info('Entity out of health', { eid });
      EventBus.emit('destroyEntity', { entityId: eid });
    }
  }
}
