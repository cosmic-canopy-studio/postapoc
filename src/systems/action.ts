import { Actor, Interactable } from '../entities';
import { log } from '../utilities';

export enum Actions {
  attack = 'attack',
  moveUp = 'moveUp',
  moveLeft = 'moveLeft',
  moveDown = 'moveDown',
  moveRight = 'moveRight'
}

export enum Directions {
  up = 'up',
  left = 'left',
  down = 'down',
  right = 'right'
}

export class Action {
  static interact(action: Actions, interactable?: Interactable) {
    log.debug(
      `Action: ${action} |  Focus: ${interactable?.thing.id || 'no focus'}`
    );
    switch (action) {
      case Actions.attack:
        if (interactable) {
          interactable.thing.takeDamage(1);
        } else {
          log.debug('Nothing to attack');
        }
        break;
      case Actions.moveUp:
    }
  }

  static performAction(action: Actions, actor: Actor) {
    switch (action) {
      case Actions.attack:
        actor.attack();
        break;
      case Actions.moveUp:
        actor.move(Directions.up);
        break;
      case Actions.moveDown:
        actor.move(Directions.down);
        break;
      case Actions.moveLeft:
        actor.move(Directions.left);
        break;
      case Actions.moveRight:
        actor.move(Directions.right);
        break;
    }
  }
}
