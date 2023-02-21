export default class Thing {
  readonly id: string;
  readonly moveable: boolean;
  protected _health: number;

  constructor(id: string, health = 3, moveable = false) {
    this.id = id;
    this._health = health;
    this.moveable = moveable;
  }

  takeDamage(damage = 1) {
    if (this.health > 1) {
      this._health -= damage;
      console.log(this.health);
    } else if (this.health === 1) {
      this._health = 0;
      console.log(this.id + ' out of health');
    }
  }

  get health() {
    return this._health;
  }
}
