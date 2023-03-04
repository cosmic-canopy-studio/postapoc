import Interactable from './interactable';

export default class Actor extends Interactable {
    protected focus: Interactable | undefined;
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

    public update() {
        super.update();
        if (this.sprite) {
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
            interactable.addHealthBar();
        }
    }

    clearFocus() {
        if (this.focus) {
            this.focus.removeHealthBar();
        }
    }
}
