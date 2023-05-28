import { getLogger } from '@src/telemetry/logger';
import mitt, { Emitter, WildcardHandler } from 'mitt';
import { Events } from '@src/definitions/eventTypes';

const EventBus: Emitter<Events> = mitt<Events>();

const wildcardHandler: WildcardHandler<Events> = (event, type) => {
  getLogger('eventBus').debug(
    `Event triggered: ${event} ${JSON.stringify(type)}`
  );
};

EventBus.on('*', wildcardHandler);

export default EventBus;
