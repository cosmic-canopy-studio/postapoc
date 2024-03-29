import { EventPayload } from '@src/core/data/events';

export interface DebugEventPayload extends EventPayload {
  state: boolean;
  type: string;
}

export interface TelemetryEventsMap {
  debug: DebugEventPayload;
  debugPanel: EventPayload;
  toggleDebug: EventPayload;
}

export type TelemetryEvents = {
  [K in keyof TelemetryEventsMap]: TelemetryEventsMap[K];
};
