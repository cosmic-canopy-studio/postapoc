// Part: src/DebugPanel.ts

import Tweakpane from 'tweakpane';
import logger from './logger';
import EventBus from './events/EventBus';

export default class DebugPanel {
  private pane: Tweakpane;
  private modules: Record<string, boolean>;
  private events: Record<string, boolean>;

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

    this.pane = new Tweakpane({ title: 'Debug Panel' });
    this.setupModuleDebug();
    this.setupEventDebug();

    this.listenToDebugChanges();
  }

  private setupModuleDebug() {
    const moduleFolder = this.pane.addFolder({ title: 'Modules' });

    for (const moduleName in this.modules) {
      moduleFolder.addInput(this.modules, moduleName).on('change', (value) => {
        logger.transports[0].silent = !value;
      });
    }
  }

  private setupEventDebug() {
    const eventFolder = this.pane.addFolder({ title: 'Events' });

    for (const eventName in this.events) {
      eventFolder.addInput(this.events, eventName).on('change', (value) => {
        if (value) {
          EventBus.on(eventName, (eventData) => {
            logger.debug(`Event triggered: ${eventName}`, eventData);
          });
        } else {
          EventBus.off(eventName);
        }
      });
    }
  }

  private listenToDebugChanges() {
    logger.debug('DebugPanel initialized');
  }
}
