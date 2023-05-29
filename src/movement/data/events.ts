import { MoveDirections } from './enums';

export interface MoveEventPayload {
  state: boolean;
  action: MoveDirections;
  entity: number;
}

export interface MovementEventsMap {
  move: MoveEventPayload;
}

export type MovementEvents = {
  [K in keyof MovementEventsMap]: MovementEventsMap[K];
};
