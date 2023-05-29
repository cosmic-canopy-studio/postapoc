import { getLogger } from '@src/telemetry/logger';
import mitt, { Emitter, WildcardHandler } from 'mitt';
import { MovementEvents } from '@src/movement/events';
import { ActionEvents } from '@src/action/events';
import { TelemetryEvents } from '@src/telemetry/events';
import { EntityEvents } from '@src/entity/events';
import { CoreEvents } from '@src/core/events';

type Events = CoreEvents &
  MovementEvents &
  ActionEvents &
  TelemetryEvents &
  EntityEvents;

const EventBus: Emitter<Events> = mitt<Events>();

const wildcardHandler: WildcardHandler<Events> = (event, type) => {
  getLogger('core').debug(`Event triggered: ${event} ${JSON.stringify(type)}`);
};

EventBus.on('*', wildcardHandler);

export default EventBus;
