// Part: src/core/systems/eventTypes.ts
// Code Reference: https://github.com/developit/mitt
// Documentation:

import { MoveDirections } from '@src/core/events/movementEvents';
import { Actions } from '@src/core/events/actionEvents';

export interface EventPayload {
  state?: boolean;
}

export interface DebugEventPayload extends EventPayload {
  state: boolean;
  type: string;
}

export interface MoveEventPayload extends EventPayload {
  state: boolean;
  action: MoveDirections;
  entity: number;
}

export interface ActionEventPayload extends EventPayload {
  action: Actions;
  entity: number;
}

export interface DamageEventPayload extends EventPayload {
  entity: number;
  damage: number;
}

export interface DestroyEntityEventPayload {
  entityId: number;
}

export interface ItemPickedUpEventPayload extends EventPayload {
  eid: number;
}

export interface EventsMap {
  testEvent: EventPayload;
  move: MoveEventPayload;
  action: ActionEventPayload;
  damage: DamageEventPayload;
  debug: DebugEventPayload;
  destroyEntity: DestroyEntityEventPayload;
  togglePause: EventPayload;
  toggleSlowTime: EventPayload;
  debugPanel: EventPayload;
  itemPickedUp: ItemPickedUpEventPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
