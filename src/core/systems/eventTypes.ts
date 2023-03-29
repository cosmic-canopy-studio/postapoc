// Part: src/core/systems/eventTypes.ts

import { MoveDirections } from "@src/ecs/systems/initMovementEvents";

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

export interface EventsMap {
  move: MoveEventPayload;
  attack: AttackEventPayload;
  debug: DebugEventPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
