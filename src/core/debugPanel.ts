// Part: src/core/debugPanel.ts

import { Pane } from "tweakpane";
import { getLogger } from "@src/core/logger";
import EventBus from "@src/core/eventBus";
import { IWorld } from "bitecs";
import Movement, { IMovement } from "@src/ecs/components/movement";
import debug from "@src/config/debug.json";
import { Logger } from "loglevel";

export default class DebugPanel {
  private pane: Pane;
  private readonly modules: Record<string, boolean>;
  private readonly events: Record<string, boolean>;
  private playerFolder: any;
  private player: number;
  private playerPosition: IMovement = {
    x: 0,
    y: 0,
    direction: 0,
    speed: 0
  };

  constructor(world: IWorld, player: number) {
    const initDebug = debug.global === "true";
    this.modules = {
      movement: initDebug,
      eventBus: initDebug,
      controls: initDebug
    };
    this.player = player;

    this.events = {
      keyDown: false
    };

    this.pane = new Pane({ title: "Debug Panel" });
    this.setupModuleDebug(initDebug);
    this.setupEventDebug(initDebug);
    this.setupPlayerDebug();

    this.listenToDebugChanges();
    setInterval(() => {
      this.updatePlayerPosition();
    }, 100); // Update the position every 100 ms
  }

  private setLoggingDebug(logger: Logger, enableDebug: boolean) {
    logger.info(`Setting ${logger.name} to ${enableDebug}`);
    if (enableDebug) {
      logger.setLevel(logger.levels.DEBUG);
    } else {
      logger.setLevel(logger.levels.INFO);
    }
  }

  private setupModuleDebug(initDebug) {
    const moduleFolder = this.pane.addFolder({ title: "Modules" });

    for (const moduleName in this.modules) {
      const moduleLogger = getLogger(moduleName);
      this.setLoggingDebug(moduleLogger, initDebug);
      console.log(moduleLogger);
      console.log(moduleLogger.getLevel());
      moduleFolder.addInput(this.modules, moduleName).on("change", (value) => {
        this.setLoggingDebug(moduleLogger, value.value);
      });
    }
  }

  private setupEventDebug() {
    const eventFolder = this.pane.addFolder({ title: "Events" });

    for (const eventName in this.events) {
      eventFolder.addInput(this.events, eventName).on("change", (value) => {
        if (value.value) {
          EventBus.on(eventName, (eventData) => {
            console.debug(`Event triggered: ${eventName}`, eventData);
          });
        } else {
          EventBus.off(eventName);
        }
      });
    }
  }

  private updatePlayerPosition() {
    this.playerPosition.x = Movement.x[this.player];
    this.playerPosition.y = Movement.y[this.player];
    this.playerPosition.direction = Movement.direction[this.player];
    this.playerPosition.speed = Movement.speed[this.player];
  }

  private setupPlayerDebug() {
    this.playerFolder = this.pane.addFolder({ title: "Player" });
    this.playerFolder.addMonitor(this.playerPosition, "x");
    this.playerFolder.addMonitor(this.playerPosition, "y");
    this.playerFolder.addMonitor(this.playerPosition, "direction");
    this.playerFolder.addMonitor(this.playerPosition, "speed");
  }

  private listenToDebugChanges() {
    const logger = getLogger("DebugPanel");
    logger.debug("DebugPanel initialized");
  }

}
