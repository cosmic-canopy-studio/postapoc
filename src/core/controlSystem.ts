import controlMappingJson from '@src/config/controlMapping.json';
import { getLogger } from '@src/telemetry/logger';
import EventBus from '@src/core/eventBus';
import { GameAction, KeyBindings } from '@src/core/keyBindings';
import Phaser from 'phaser';
import { ControlMapping } from '@src/config/interfaces';
import { MoveActions } from '@src/movement/data/enums';
import { Actions } from '@src/action/data/enums';
import { TelemetryActions } from '@src/telemetry/enums';
import { TimeActions } from '@src/time/enums';

export default class ControlSystem {
  private player!: number;
  private scene!: Phaser.Scene;
  private keyBindings: KeyBindings;
  private pressedKeys: Set<string> = new Set();
  private logger = getLogger('core');
  private actionHandlers: Map<GameAction, GameActionHandler>;

  constructor() {
    const controlMapping: ControlMapping = controlMappingJson as ControlMapping;
    this.keyBindings = new KeyBindings(controlMapping);
    const moveDirections = Object.values(MoveActions);
    const actions = Object.values(Actions);
    const telemetryActions = Object.values(TelemetryActions);
    const timeActions = Object.values(TimeActions);

    this.actionHandlers = new Map<GameAction, GameActionHandler>([
      ...moveDirections.map(
        (direction) =>
          [direction, (state: boolean) => this.emitMove(direction, state)] as [
            GameAction,
            GameActionHandler
          ]
      ),
      ...actions.map(
        (action) =>
          [action, (state: boolean) => this.emitAction(action, state)] as [
            GameAction,
            GameActionHandler
          ]
      ),
      ...telemetryActions.map(
        (action) =>
          [action, (state: boolean) => this.emitBasicAction(action, state)] as [
            GameAction,
            GameActionHandler
          ]
      ),
      ...timeActions.map(
        (action) =>
          [action, (state: boolean) => this.emitBasicAction(action, state)] as [
            GameAction,
            GameActionHandler
          ]
      ),
    ]);
  }

  initialize(scene: Phaser.Scene, player: number) {
    this.scene = scene;
    this.player = player;

    if (!this.scene.input.keyboard) {
      throw new Error('Keyboard not available');
    }

    this.scene.input.keyboard.on('keydown', this.onKeyDown.bind(this));
    this.scene.input.keyboard.on('keyup', this.onKeyUp.bind(this));
    this.logger.debug('Initialized');
  }

  onKeyDown(event: KeyboardEvent) {
    this.logger.debug(`Keydown event: ${event.code}`);
    const code = event.code;
    if (this.pressedKeys.has(code)) {
      this.logger.debug('Ignoring repeated keydown event');
      return;
    }
    this.pressedKeys.add(code);

    const action = this.keyBindings.getActionForKeyCode(code);
    if (action !== undefined) {
      this.handleAction(action, true);
    } else {
      this.logger.info(`No action bound to key ${code}`);
    }
  }

  onKeyUp(event: KeyboardEvent) {
    const code = event.code;
    this.logger.debug(`Keyup event: ${code}`);
    this.pressedKeys.delete(code);

    const action = this.keyBindings.getActionForKeyCode(code);
    if (action !== undefined) {
      this.handleAction(action, false);
    }
  }

  private handleAction(action: GameAction, state: boolean) {
    this.logger.debug(`Handling action ${action} with state ${state}`);

    const handler = this.actionHandlers.get(action);
    if (handler) {
      handler(state);
    } else {
      this.logger.warn(`No handler for action ${action}`);
    }
  }

  private emitMove(direction: MoveActions, state: boolean) {
    EventBus.emit('move', {
      action: direction,
      state,
      entity: this.player,
    });
  }

  private emitAction(action: Actions, state: boolean) {
    if (state) {
      EventBus.emit('action', {
        action,
        entity: this.player,
      });
    }
  }

  private emitBasicAction(
    action: TimeActions | TelemetryActions,
    state: boolean
  ) {
    if (state) {
      EventBus.emit(action, {});
    }
  }
}
