import { EventPayload } from '@src/core/data/events';

export interface EntityIDPayload extends EventPayload {
  entityId: number;
}

export interface CraftedItemsPayload extends EventPayload {
  creatingEntityId: number;
  createdItemName: string;
  createdItemQuantity: number;
}

export interface EntityEventsMap {
  destroyEntity: EntityIDPayload;
  itemPickedUp: EntityIDPayload;
  toggleInventory: EntityIDPayload;
  refreshInventory: EntityIDPayload;
  switchFocus: EntityIDPayload;
  itemCrafted: CraftedItemsPayload;
}

export type EntityEvents = {
  [K in keyof EntityEventsMap]: EntityEventsMap[K];
};
