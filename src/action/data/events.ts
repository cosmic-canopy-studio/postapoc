import { Actions } from './enums';
import { EventPayload } from '@src/core/data/events';

export interface ActionEventPayload {
  action: Actions;
  entity: number;
  options?: ActionEventOptions;
}

export interface ActionEventOptions {
  recipe?: string;
}

export interface DamageEventPayload extends EventPayload {
  entity: number;
  damage: number;
}

export interface ActionEventsMap {
  action: ActionEventPayload;
  damage: DamageEventPayload;
  refreshCrafting: EventPayload;
}

export type ActionEvents = {
  [K in keyof ActionEventsMap]: ActionEventsMap[K];
};
