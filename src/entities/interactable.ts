import Noun from '../components/noun';
import { log } from '../utilities';

export default class Interactable {
  public noun: Noun;
  public sprite?: Phaser.Physics.Arcade.Sprite;
  constructor(id: string) {
    this.noun = new Noun(id);
  }

  setSprite(sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;
  }

  unsetSprite() {
    this.sprite?.destroy();
  }

  update() {
    if (this.sprite) {
      if (this.noun.health < 1) {
        this.sprite.destroy();
        return;
      }
      if (this.noun.health < 2 && this.sprite?.texture.key !== 'bench-broken') {
        this.sprite.setTexture('bench-broken');
        log.debug('bench broken');
      }
    }
  }
}
