export interface EventPayload {
  state?: boolean;
  eid?: number;
}

export interface CoreEventsMap {
  testEvent: EventPayload;
  toggleHelp: EventPayload;
}

export type CoreEvents = {
  [K in keyof CoreEventsMap]: CoreEventsMap[K];
};
