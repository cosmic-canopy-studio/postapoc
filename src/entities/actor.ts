import { log } from '../utilities';
import Interactable from './interactable';
import { HealthBar } from '../ui';

export default class Actor extends Interactable {
    protected focus?: Interactable;
    protected damage = 1;

    constructor(id: string) {
        super(id);
    }

    setSprite(sprite: Phaser.Physics.Arcade.Sprite): void {
        super.setSprite(sprite);
        if (this.sprite) {
            this.sprite.setCollideWorldBounds(true);
            this.sprite.setPushable(false);
            this.sprite.setImmovable(false);
            this.sprite.play('idle-down');
        } else {
            throw Error('No sprite defined for actor');
        }
    }

    getFocus() {
        return this.focus;
    }

    getDamage() {
        return this.damage;
    }

    update() {
        if (this.sprite) {
            if (this.thing.health < 1) {
                log.debug(`${this.thing.id} dead`);
                this.sprite.destroy();
                return;
            }

            if (
                this.sprite.body.velocity.x === 0 &&
                this.sprite.body.velocity.y === 0
            ) {
                this.sprite.play(`idle-${this.direction}`, true);
            } else {
                this.sprite.scene.events.emit(`${this.id}PositionChanged`);
            }
        }
    }

    setFocus(interactable: Interactable) {
        this.focus = interactable;
        if (!interactable.healthBar) {
            interactable.healthBar = new HealthBar(interactable);
        }
    }

    clearFocus() {
        if (this.focus) {
            this.focus.healthBar.destroy();
            this.focus.healthBar = undefined;
            this.focus = undefined;
        }
    }
}
