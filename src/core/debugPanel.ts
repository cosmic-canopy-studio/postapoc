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

  private setupPlayerDebug() {
    this.playerFolder = this.pane.addFolder({ title: "Player" });
    this.playerFolder.addMonitor(Movement.x, "x", { eid: this.player });
    this.playerFolder.addMonitor(Movement.y, "y", { eid: this.player });

    //this.playerFolder.addMonitor(this.world.velocity.x, "vx");
    //this.playerFolder.addMonitor(this.world.velocity.y, "vy");
    // Add more player properties here
  }

  private listenToDebugChanges() {
    const logger = getLogger("DebugPanel");
    logger.debug("DebugPanel initialized");
  }
}
