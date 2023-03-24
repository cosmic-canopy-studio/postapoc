// Part: src/core/debugPanel.ts

import { Pane } from "tweakpane";
import { getLogger } from "@src/core/logger";
import EventBus from "@src/core/eventBus";
import { IWorld } from "bitecs";
import Movement from "@src/ecs/components/movement";

export default class DebugPanel {
  private pane: Pane;
  private readonly modules: Record<string, boolean>;
  private readonly events: Record<string, boolean>;
  private playerFolder: any;
  private player: number;

  constructor(private world: IWorld, private player: number) {
    this.modules = {
      movement: false,
      eventBus: false
      // Add more modules here
    };
    this.player = player;

    this.events = {
      testEvent: false
      // Add more events here
    };

    this.pane = new Pane({ title: "Debug Panel" });
    this.setupModuleDebug();
    this.setupEventDebug();
    this.setupPlayerDebug();

    this.listenToDebugChanges();
  }

  private setupModuleDebug() {
    const moduleFolder = this.pane.addFolder({ title: "Modules" });

    for (const moduleName in this.modules) {
      const moduleLogger = getLogger(moduleName);

      moduleFolder.addInput(this.modules, moduleName).on("change", (value) => {
        if (value) {
          moduleLogger.setLevel(moduleLogger.levels.DEBUG);
        } else {
          moduleLogger.setLevel(moduleLogger.levels.SILENT);
        }
      });
    }
  }

  private setupEventDebug() {
    const eventFolder = this.pane.addFolder({ title: "Events" });

    for (const eventName in this.events) {
      eventFolder.addInput(this.events, eventName).on("change", (value) => {
        if (value) {
          EventBus.on(eventName, (eventData) => {
            console.debug(`Event triggered: ${eventName}`, eventData);
          });
        } else {
          EventBus.off(eventName);
        }
      });
    }
  }

  private playerPosition = {
    x: 0,
    y: 0,
    direction: 0,
    speed: 0
  };

  private updatePlayerPosition() {
    this.playerPosition.x = Movement.x[this.player];
    this.playerPosition.y = Movement.y[this.player];
    this.playerPosition.direction = Movement.direction[this.player];
    this.playerPosition.speed = Movement.speed[this.player];
  }

  private setupPlayerDebug() {
    this.playerFolder = this.pane.addFolder({ title: "Player" });
    this.playerFolder.addMonitor(this.playerPosition, 'x');
    this.playerFolder.addMonitor(this.playerPosition, 'y');
    this.playerFolder.addMonitor(this.playerPosition, 'direction');
    this.playerFolder.addMonitor(this.playerPosition, 'speed');
  }

  private listenToDebugChanges() {
    const logger = getLogger("DebugPanel");
    logger.debug("DebugPanel initialized");

    setInterval(() => {
      this.updatePlayerPosition();
    }, 100); // Update the position every 100 ms
  }

}
