import { Actions } from '@src/action/enums';
import { MoveDirections } from '@src/movement/enums';

export interface EventPayload {
  state?: boolean;
  eid?: number;
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

export interface EntityIDPayload extends EventPayload {
  entityId: number;
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
  itemPickedUp: EntityIDPayload;
}

export type Events = {
  [K in keyof EventsMap]: EventsMap[K];
};
