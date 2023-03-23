// Part: src/core/DebugPanel.ts

// Part: src/DebugPanel.ts

import { Pane } from 'tweakpane';
import { getLogger } from '@src/core/logger';
import EventBus from '@src/core/EventBus';

export default class DebugPanel {
  private pane: Pane;
  private readonly modules: Record<string, boolean>;
  private readonly events: Record<string, boolean>;

  constructor() {
    this.modules = {
      movement: false,
      eventBus: false,
      // Add more modules here
    };

    this.events = {
      testEvent: false,
      // Add more events here
    };

    this.pane = new Pane({ title: 'Debug Panel' });
    this.setupModuleDebug();
    this.setupEventDebug();

    this.listenToDebugChanges();
  }

  private setupModuleDebug() {
    const moduleFolder = this.pane.addFolder({ title: 'Modules' });

    for (const moduleName in this.modules) {
      const moduleLogger = getLogger(moduleName);

      moduleFolder.addInput(this.modules, moduleName).on('change', (value) => {
        if (value) {
          moduleLogger.setLevel(moduleLogger.levels.DEBUG);
        } else {
          moduleLogger.setLevel(moduleLogger.levels.SILENT);
        }
      });
    }
  }

  private setupEventDebug() {
    const eventFolder = this.pane.addFolder({ title: 'Events' });

    for (const eventName in this.events) {
      eventFolder.addInput(this.events, eventName).on('change', (value) => {
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

  private listenToDebugChanges() {
    const logger = getLogger('DebugPanel');
    logger.debug('DebugPanel initialized');
  }
}
