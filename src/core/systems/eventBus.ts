import { getLogger } from '@src/telemetry/systems/logger';
import mitt, { Emitter, WildcardHandler } from 'mitt';
import { MovementEvents } from '@src/movement/data/events';
import { ActionEvents } from '@src/action/data/events';
import { TelemetryEvents } from '@src/telemetry/data/events';
import { EntityEvents } from '@src/entity/data/events';
import { CoreEvents } from '@src/core/data/events';
import { TimeEvents } from '@src/time/data/events';

export type Events = CoreEvents &
  MovementEvents &
  ActionEvents &
  TelemetryEvents &
  TimeEvents &
  EntityEvents;

const EventBus: Emitter<Events> = mitt<Events>();

const wildcardHandler: WildcardHandler<Events> = (event, type) => {
  getLogger('core').debug(`Event triggered: ${event} ${JSON.stringify(type)}`);
};

EventBus.on('*', wildcardHandler);

export default EventBus;
