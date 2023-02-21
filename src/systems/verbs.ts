import { Interactable } from '../entities';

export enum Verbs {
  attack = 'attack'
}
export class Verb {
  static interact(verb: Verbs, interactable?: Interactable) {
    switch (verb) {
      case Verbs.attack:
        interactable?.thing.takeDamage(1);
        break;
    }
  }
}
