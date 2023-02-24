import { log } from '../utilities';
import { Action, Actions } from './action';
import { Universe } from './universe';
import config from '../../config/config.json' assert { type: 'json' };

export class PlayerControl {
  private keyMap: Map<string, string>;
  private universe: Universe;

  constructor(universe: Universe) {
    this.keyMap = new Map(Object.entries(config.controls));
    this.universe = universe;
  }

  loadKeyEvents(scene: Phaser.Scene) {
    scene.input.removeAllListeners();
    log.debug('Loading key events');
    scene.input.keyboard.on('keydown', (input: KeyboardEvent) => {
      const action = this.getActionFromKeyCode(input.code);
      if (action) {
        const controlledActor = this.universe.getControlledActor();
        if (controlledActor) {
          Action.performAction(action, controlledActor);
        }
      } else {
        log.debug(`Unconfigured key pressed: ${input.code}`);
      }
    });
  }

  private getActionFromKeyCode(input: string) {
    const action = this.keyMap.get(input);
    if (action) {
      return action as Actions;
    }
    log.debug(`No action mapped to key: ${input}`);
    return null;
  }
}
