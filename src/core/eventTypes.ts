// Part: src/core/eventTypes.ts

import { MoveDirections } from "@src/ecs/systems/initMovementEvents";

export interface EventPayload {
  state: boolean;
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

export interface EventsMap {
  move: MoveEventPayload;
  debug: DebugEventPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
