import { EventPayload } from '@src/core/data/events';

export interface TimeEventsMap {
  togglePause: EventPayload;
  toggleSlowTime: EventPayload;
}

export type TimeEvents = {
  [K in keyof TimeEventsMap]: TimeEventsMap[K];
};
