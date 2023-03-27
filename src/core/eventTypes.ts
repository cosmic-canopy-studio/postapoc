// Part: src/core/eventTypes.ts

import { MoveDirections } from "@src/ecs/systems/initMovementEvents";

export interface EventPayload {
  state: boolean;
}

export interface MoveEventPayload extends EventPayload {
  state: boolean;
  action: MoveDirections;
  entity: number;
}

export interface EventsMap {
  move: MoveEventPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
