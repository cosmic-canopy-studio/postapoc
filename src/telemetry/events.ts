import { EventPayload } from '@src/core/events';

export interface DebugEventPayload extends EventPayload {
  state: boolean;
  type: string;
}

export interface TelemetryEventsMap {
  debug: DebugEventPayload;
}

export type TelemetryEvents = {
  [K in keyof TelemetryEventsMap]: TelemetryEventsMap[K];
};
