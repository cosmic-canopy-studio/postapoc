// src/events/EventBus.ts
import mitt from 'mitt';
import logger from '@/logger';

const EventBus = mitt();

EventBus.on('*', (type, event) => {
  logger.debug(`Event triggered: ${type}`, event);
});

export default EventBus;
