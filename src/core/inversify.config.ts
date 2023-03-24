// Part: src/core/inversify.config.ts

import { Container } from "inversify";
import {TERRAIN_GENERATOR, TIME_CONTROLLER_FACTORY, TIME_SYSTEM} from "@src/core/constants";
import { TimeController } from "@src/phaser/systems/timeController";
import { TimeSystem } from "@src/ecs/systems/timeSystem";
import {ITerrainGenerator, ITimeController} from "@src/core/interfaces";
import { Scene } from "phaser";
import StaticTerrainGenerator from "@src/core/staticTerrainGenerator";

const container = new Container();

container.bind<TimeSystem>(TIME_SYSTEM).to(TimeSystem);

container.bind<(scene: Scene) => ITimeController>(TIME_CONTROLLER_FACTORY).toFactory<ITimeController>((context) => {
  return (scene: Scene) => {
    return new TimeController(scene);
  };
});

export default container;
