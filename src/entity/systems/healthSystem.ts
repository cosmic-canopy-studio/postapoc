import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/eventBus';
import Health from '@src/entity/components/health';
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
