import { getLogger } from '@src/telemetry/logger';
import { ControlMapping } from '@src/config/interfaces';

export enum GameAction {
  MoveUp,
  MoveDown,
  MoveLeft,
  MoveRight,
  Attack,
  PickUp,
  Pause,
  SlowTime,
  DebugPanel,
}

export class KeyBindings {
  private bindings: Map<string, GameAction> = new Map();
  private logger = getLogger('core');

  constructor(controlMapping: ControlMapping) {
    this.loadBindingsFromControlMapping(controlMapping);
    this.logger.debug('Key bindings loaded', this.bindings);
  }

  bind(action: GameAction, key: string) {
    this.bindings.set(key, action);
    this.logger.debug(`Bound ${GameAction[action]} to ${key}`);
  }

  getActionForKeyCode(keyCode: string): GameAction | undefined {
    this.logger.debug(`Looking up action for key code ${keyCode}`);
    return this.bindings.get(keyCode);
  }

  private loadBindingsFromControlMapping(controlMapping: ControlMapping) {
    this.logger.debug(
      'Loading key bindings from control mapping',
      controlMapping
    );
    for (const key in controlMapping.move) {
      this.logger.debug(`Loading key binding for ${key}`);
      const action = controlMapping.move[key];
      switch (action) {
        case 'up':
          this.bind(GameAction.MoveUp, key);
          break;
        case 'down':
          this.bind(GameAction.MoveDown, key);
          break;
        case 'left':
          this.bind(GameAction.MoveLeft, key);
          break;
        case 'right':
          this.bind(GameAction.MoveRight, key);
          break;
      }
    }

    for (const key in controlMapping.action) {
      this.logger.debug(`Loading key binding for ${key}`);
      const action = controlMapping.action[key];
      switch (action) {
        case 'pause':
          this.bind(GameAction.Pause, key);
          break;
        case 'attack':
          this.bind(GameAction.Attack, key);
          break;
        case 'pickUp':
          this.bind(GameAction.PickUp, key);
          break;
        case 'slowTime':
          this.bind(GameAction.SlowTime, key);
          break;
        case 'debugPanel':
          this.bind(GameAction.DebugPanel, key);
      }
    }
  }
}
