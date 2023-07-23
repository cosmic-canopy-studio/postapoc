import { ControlMapping, GameAction } from '@src/core/data/types';
import { getLogger } from '@src/telemetry/systems/logger';

export class KeyBindings {
  private bindings: Map<string, GameAction> = new Map();
  private logger = getLogger('core');

  constructor(controlMapping: ControlMapping) {
    this.loadBindingsFromControlMapping(controlMapping);
    this.logger.debug('Key bindings loaded', this.bindings);
  }

  bind(action: GameAction, key: string) {
    this.bindings.set(key, action);
    this.logger.debug(`Bound ${action} to ${key}`);
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

    const mappings = [controlMapping.move, controlMapping.action];

    for (const mapping of mappings) {
      for (const key in mapping) {
        this.logger.debug(`Loading key binding for ${key}`);
        const action = mapping[key];
        this.bind(action as GameAction, key);
      }
    }
  }
}
