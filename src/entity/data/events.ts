import { EventPayload } from '@src/core/events';
import { EntityActions } from '@src/entity/data/enums';

export interface EntityIDPayload extends EventPayload {
  entityId: number;
}

export interface EntityActionEventPayload {
  action: EntityActions;
  entity: number;
}

export interface EntityEventsMap {
  destroyEntity: EntityIDPayload;
  itemPickedUp: EntityIDPayload;
  toggleInventory: EntityIDPayload;
}

export type EntityEvents = {
  [K in keyof EntityEventsMap]: EntityEventsMap[K];
};
