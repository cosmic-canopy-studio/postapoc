import { Scene } from 'phaser';
import PlayerInputState from '../states/playerInputState';

export default class Actor extends Phaser.GameObjects.Sprite {
  private id: string;
  private health: number;
  private alive: boolean;
  private controlState?: PlayerInputState;

  constructor(scene: Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.id = texture;
    if (this.id === 'player') {
      // confirm eqeqeq
      this.health = 5;
      this.alive = true;
    } else {
      this.health = 3;
      this.alive = true;
    }
  }

  setControlState(controlState: PlayerInputState) {
    this.controlState = controlState;
  }

  update() {
    if (!this.controlState) {
      return;
    }

    this.controlState.update(this.id);
  }

  attack(target: Actor) {
    // face target
    // check distance
    // animate
    // calculate
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  'actor',
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string
  ) {
    const actor = new Actor(this.scene, x, y, texture);

    this.displayList.add(actor);
    this.updateList.add(actor);

    return actor;
  }
);
