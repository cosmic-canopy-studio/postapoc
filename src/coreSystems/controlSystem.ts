import controlMappingJson from '@src/config/controlMapping.json';
import { getLogger } from '@src/telemetry/logger';
import EventBus from '@src/coreSystems/eventBus';
import { GameAction, KeyBindings } from '@src/coreSystems/keyBindings';
import Phaser from 'phaser';
import { ControlMapping } from '@src/definitions/interfaces';
import { Actions, MoveDirections } from '@src/config/enums';

export default class ControlSystem {
  private player!: number;
  private scene!: Phaser.Scene;
  private keyBindings: KeyBindings;
  private pressedKeys: Set<string> = new Set();
  private logger = getLogger('control');

  constructor() {
    const controlMapping: ControlMapping = controlMappingJson as ControlMapping;
    this.keyBindings = new KeyBindings(controlMapping);
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
    this.logger.debug(
      `Handling action ${GameAction[action]} with state ${state}`
    );
    switch (action) {
      case GameAction.MoveUp:
        EventBus.emit('move', {
          action: MoveDirections.UP,
          state,
          entity: this.player,
        });
        break;
      case GameAction.MoveDown:
        EventBus.emit('move', {
          action: MoveDirections.DOWN,
          state,
          entity: this.player,
        });
        break;
      case GameAction.MoveLeft:
        EventBus.emit('move', {
          action: MoveDirections.LEFT,
          state,
          entity: this.player,
        });
        break;
      case GameAction.MoveRight:
        EventBus.emit('move', {
          action: MoveDirections.RIGHT,
          state,
          entity: this.player,
        });
        break;
      case GameAction.Attack:
        if (state) {
          EventBus.emit('action', {
            action: 'attack' as Actions,
            entity: this.player,
          });
        }
        break;
      case GameAction.Interact:
        if (state) {
          EventBus.emit('action', {
            action: 'interact' as Actions,
            entity: this.player,
          });
        }
        break;
      case GameAction.Pause:
        if (state) {
          EventBus.emit('togglePause', {});
        }
        break;
      case GameAction.SlowTime:
        if (state) {
          EventBus.emit('toggleSlowTime', {});
        }
        break;
      case GameAction.DebugPanel:
        if (state) {
          EventBus.emit('debugPanel', {});
        }
        break;
    }
  }
}
