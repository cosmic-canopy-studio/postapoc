export default class Noun {
  readonly id: string;
  readonly moveable: boolean;
  protected _health: number;

  constructor(id: string, health = 3, moveable = false) {
    this.id = id;
    this._health = health;
    this.moveable = moveable;
  }

  takeDamage(damage = 1) {
    if (this.health - damage >= 0) {
      this._health -= damage;
      console.log(this.health);
    } else {
      this._health = 0;
      console.log(this.id + ' out of health, ready for destruction');
      //TODO: Fire destruction event
    }
  }

  get health() {
    return this._health;
  }
}
