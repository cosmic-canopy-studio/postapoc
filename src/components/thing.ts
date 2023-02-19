export default class Thing {
  readonly id: string;
  readonly moveable: boolean;
  protected health: number;

  constructor(id: string, health = 3, moveable = false) {
    this.id = id;
    this.health = health;
    this.moveable = moveable;
  }

  takeDamage() {
    if (this.health > 1) {
      this.health -= 1;
      console.log(this.health);
    } else if (this.health === 1) {
      this.health = 0;
      console.log(this.id + ' out of health');
    }
  }
}
