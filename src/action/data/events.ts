import { Actions } from './enums';
import { EventPayload } from '@src/core/data/events';

export interface ActionEventPayload {
  action: Actions;
  entity: number;
}

export interface DamageEventPayload extends EventPayload {
  entity: number;
  damage: number;
}

export interface ActionEventsMap {
  action: ActionEventPayload;
  damage: DamageEventPayload;
}

export type ActionEvents = {
  [K in keyof ActionEventsMap]: ActionEventsMap[K];
};
