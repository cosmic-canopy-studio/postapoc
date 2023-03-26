// Part: src/core/eventBus.ts

import mitt, { Emitter, WildcardHandler } from "mitt";
import logger from "@src/core/logger";

export type Events = Record<string, any>;

const EventBus: Emitter<Events> = mitt<Events>();

const wildcardHandler: WildcardHandler<Events> = (event, type) => {
  logger.debug(`Event triggered: ${event} ${JSON.stringify(type)}`);
};

EventBus.on("*", wildcardHandler);

export default EventBus;
