// Part: src/core/systems/eventTypes.ts
// Code Reference:
// Documentation:

import { MoveDirections } from '@src/ecs/systems/initMovementEvents';

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

export interface AttackEventPayload extends EventPayload {
  entity: number;
}

export interface DamageEventPayload extends EventPayload {
  entity: number;
  damage: number;
}

export interface DestroyEntityEventPayload {
  entityId: number;
}

export interface EventsMap {
  testEvent: EventPayload;
  move: MoveEventPayload;
  attack: AttackEventPayload;
  damage: DamageEventPayload;
  debug: DebugEventPayload;
  destroyEntity: DestroyEntityEventPayload;
  togglePause: EventPayload;
  toggleSlowTime: EventPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
