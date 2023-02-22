import { Interactable } from '../entities';
import { log } from '../utilities';

export enum Verbs {
  attack = 'attack'
}
export class Verb {
  static interact(verb: Verbs, interactable?: Interactable) {
    log.debug(`Verb: ${verb} |  Focus: ${interactable?.noun.id || 'no focus'}`);
    switch (verb) {
      case Verbs.attack:
        if (interactable) {
          interactable.noun.takeDamage(1);
        } else {
          log.debug('No interactable to attack');
        }
        break;
    }
  }
}
