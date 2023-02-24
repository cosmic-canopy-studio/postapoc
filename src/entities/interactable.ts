import Thing from '../components/thing';
import { log } from '../utilities';

export default class Interactable {
  public thing: Thing;
  public sprite?: Phaser.Physics.Arcade.Sprite;
  constructor(id: string) {
    this.thing = new Thing(id);
  }

  setSprite(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  unsetSprite() {
    this.sprite?.destroy();
  }

  update() {
    if (this.sprite) {
      if (this.thing.health < 1) {
        log.debug(`${this.thing.id} dead`);
        this.sprite.destroy();
        return;
      }
      if (
        this.thing.health < 2 &&
        this.sprite?.texture.key !== 'bench-broken'
      ) {
        this.sprite.setTexture('bench-broken');
        log.debug(`${this.thing.id} broken`);
      }
    }
  }
}
