// Part: src/core/inversify.config.ts

import { Container } from "inversify";
import { TIME_CONTROLLER_FACTORY, TIME_SYSTEM } from "@src/utils/constants";
import { TimeController } from "@src/phaser/systems/timeController";
import { TimeSystem } from "@src/ecs/systems/timeSystem";
import { ITimeController } from "@src/utils/interfaces";
import { Scene } from "phaser";

const container = new Container();

container.bind<TimeSystem>(TIME_SYSTEM).to(TimeSystem);

// Bind the factory function to create instances of TimeController
container.bind<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY).toFactory<ITimeController>((context) => {
  return (scene: Scene) => {
    return new TimeController(scene);
  };
});

export default container;
