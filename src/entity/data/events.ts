import { EventPayload } from '@src/core/events';

export interface EntityIDPayload extends EventPayload {
  entityId: number;
}

export interface EntityEventsMap {
  destroyEntity: EntityIDPayload;
}

export type EntityEvents = {
  [K in keyof EntityEventsMap]: EntityEventsMap[K];
};
