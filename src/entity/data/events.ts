import { EventPayload } from '@src/core/data/events';

export interface EntityIDPayload extends EventPayload {
  entityId: number;
}

export interface EntityEventsMap {
  destroyEntity: EntityIDPayload;
  itemPickedUp: EntityIDPayload;
  toggleInventory: EntityIDPayload;
  switchFocus: EntityIDPayload;
}

export type EntityEvents = {
  [K in keyof EntityEventsMap]: EntityEventsMap[K];
};
