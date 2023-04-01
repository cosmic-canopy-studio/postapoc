// Part: src/core/components/debugPanel.ts
// Code Reference:
// Documentation:

import debug from '@src/config/debug.json';
import { getLogger } from '@src/core/components/logger';
import EventBus from '@src/core/systems/eventBus';
import Movement, { IMovement } from '@src/ecs/components/movement';
import { IWorld } from 'bitecs';
import { Logger } from 'loglevel';
import { Pane } from 'tweakpane';

export default class DebugPanel {
  private pane: Pane;
  private readonly modules: Record<string, boolean>;
  private readonly events: Record<string, boolean>;
  private playerFolder: any;
  private player: number;
  private playerPosition: IMovement = {
    x: 0,
    y: 0,
    xSpeed: 0,
    ySpeed: 0,
  };

  constructor(world: IWorld, player: number) {
    this.modules = debug.modules;
    this.events = debug.events;
    this.player = player;

    this.pane = new Pane({ title: 'Debug Panel' });
    this.setupModuleDebug();
    this.setupEventDebug();
    this.setupPlayerDebug();

    this.listenToDebugChanges();
    setInterval(() => {
      this.updatePlayerPosition();
    }, 100);
  }

  private setLoggingDebug(logger: Logger, enableDebug: boolean) {
    logger.info(`Setting ${logger.name} to ${enableDebug}`);
    if (enableDebug) {
      logger.setLevel(logger.levels.DEBUG);
    } else {
      logger.setLevel(logger.levels.INFO);
    }
  }

  private setupModuleDebug() {
    const moduleFolder = this.pane.addFolder({ title: 'Modules' });

    for (const moduleName in this.modules) {
      const moduleLogger = getLogger(moduleName);
      this.setLoggingDebug(moduleLogger, this.modules[moduleName]);
      moduleFolder.addInput(this.modules, moduleName).on('change', (value) => {
        this.setLoggingDebug(moduleLogger, value.value);
      });
    }
  }

  private setupEventDebug() {
    const eventFolder = this.pane.addFolder({ title: 'Events' });

    for (const eventName in this.events) {
      eventFolder.addInput(this.events, eventName).on('change', (value) => {
        EventBus.emit('debug', { state: value.value, type: eventName });
      });
    }
  }

  private updatePlayerPosition() {
    this.playerPosition.x = Movement.x[this.player];
    this.playerPosition.y = Movement.y[this.player];
    this.playerPosition.xSpeed = Movement.xSpeed[this.player];
    this.playerPosition.ySpeed = Movement.ySpeed[this.player];
  }

  private setupPlayerDebug() {
    this.playerFolder = this.pane.addFolder({ title: 'Player' });
    this.playerFolder.addMonitor(this.playerPosition, 'x');
    this.playerFolder.addMonitor(this.playerPosition, 'y');
    this.playerFolder.addMonitor(this.playerPosition, 'xSpeed');
    this.playerFolder.addMonitor(this.playerPosition, 'ySpeed');
  }

  private listenToDebugChanges() {
    const logger = getLogger('DebugPanel');
    logger.debug('DebugPanel initialized');
  }
}
