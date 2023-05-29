import { EventPayload } from '@src/core/events';

export interface DebugEventPayload extends EventPayload {
  state: boolean;
  type: string;
}

export interface TelemetryEventsMap {
  debug: DebugEventPayload;
  debugPanel: EventPayload;
}

export type TelemetryEvents = {
  [K in keyof TelemetryEventsMap]: TelemetryEventsMap[K];
};
