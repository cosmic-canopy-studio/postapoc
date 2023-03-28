// Part: src/core/systems/eventBus.ts

import { getLogger } from "@src/core/components/logger";
import { Events } from "@src/core/eventTypes";
import mitt, { Emitter, WildcardHandler } from "mitt";

const EventBus: Emitter<Events> = mitt<Events>();

const wildcardHandler: WildcardHandler<Events> = (event, type) => {
  getLogger("eventBus").debug(`Event triggered: ${event} ${JSON.stringify(type)}`);
};

EventBus.on("*", wildcardHandler);

export default EventBus;
