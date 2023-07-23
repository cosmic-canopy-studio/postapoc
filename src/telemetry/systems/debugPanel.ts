import EventBus from '@src/core/systems/eventBus';
import Motion, { IMotion } from '@src/movement/components/motion';
import Position, { IPosition } from '@src/movement/components/position';
import debug from '@src/telemetry/config/debug.json';
import { getLogger } from '@src/telemetry/systems/logger';
import { Logger } from 'loglevel';
import { Pane } from 'tweakpane';

export default class DebugPanel {
  private pane: Pane;
  private logger = getLogger('telemetry');
  private readonly modules: Record<string, boolean>;
  private readonly events: Record<string, boolean>;
  private playerFolder: any;
  private player!: number;
  private playerMotion: IMotion = {
    xSpeed: 0,
    ySpeed: 0,
  };
  private playerPosition: IPosition = {
    x: 0,
    y: 0,
  };

  constructor() {
    this.modules = debug.modules;
    this.events = debug.events;

    this.pane = new Pane({ title: 'Debug Panel' });
    this.setupModuleDebug();
    this.setupEventDebug();
    this.setupPlayerDebug();

    this.listenToDebugChanges();
    setInterval(() => {
      this.updatePlayerPosition();
    }, 100);

    this.listenToDebugPanelToggleEvent();
    this.pane.hidden = true;
  }

  setPlayer(player: number) {
    this.player = player;
    this.setupPlayerDebug();
  }

  private setLoggingDebug(
    logger: Logger,
    enableDebug: boolean,
    loggerName: string
  ) {
    logger.info(`Setting ${loggerName} to ${enableDebug}`);
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
      this.setLoggingDebug(moduleLogger, this.modules[moduleName], moduleName);
      moduleFolder.addInput(this.modules, moduleName).on('change', (value) => {
        this.setLoggingDebug(moduleLogger, value.value, moduleName);
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
    this.playerPosition.x = Position.x[this.player];
    this.playerPosition.y = Position.y[this.player];
    this.playerMotion.xSpeed = Motion.xSpeed[this.player];
    this.playerMotion.ySpeed = Motion.ySpeed[this.player];
  }

  private setupPlayerDebug() {
    if (this.playerFolder) {
      this.updatePlayerPosition();
    } else {
      this.playerFolder = this.pane.addFolder({ title: 'Player' });
      this.playerFolder.addMonitor(this.playerPosition, 'x');
      this.playerFolder.addMonitor(this.playerPosition, 'y');
      this.playerFolder.addMonitor(this.playerMotion, 'xSpeed');
      this.playerFolder.addMonitor(this.playerMotion, 'ySpeed');
    }
  }

  private listenToDebugChanges() {
    this.logger.debug('DebugPanel initialized');
  }

  private listenToDebugPanelToggleEvent() {
    EventBus.on('debugPanel', () => {
      this.toggleDebugPanel();
    });
  }

  private toggleDebugPanel() {
    this.logger.debug(`Toggling debug panel to ${this.pane.hidden}`);
    this.pane.hidden = !this.pane.hidden;
  }
}
