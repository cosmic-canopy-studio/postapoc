import { log } from '../utilities';

export default class Thing {
  readonly id: string;
  readonly moveable: boolean;
  protected _health: number;

  constructor(id: string, health = 3, moveable = false) {
    this.id = id;
    this._health = health;
    this.moveable = moveable;
  }

  set health(health: number) {
    this._health = health;
    log.debug(`${this.id} health: ${this._health}`);
  }

  get health() {
    return this._health;
  }
}
