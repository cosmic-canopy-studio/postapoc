import { EventPayload } from '@src/core/events';

export interface TimeEventsMap {
  togglePause: EventPayload;
  toggleSlowTime: EventPayload;
}

export type TimeEvents = {
  [K in keyof TimeEventsMap]: TimeEventsMap[K];
};
