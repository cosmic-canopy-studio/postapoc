import { IComponent } from './';
import { EventBus } from '@src/systems';

export interface SpriteUpdate {
    velocity: Phaser.Math.Vector2;
    animationKey: string;
    ignoreIfPlaying?: boolean;
}

export class Sprite implements IComponent {
    private _eventBus!: EventBus;

    constructor(private _sprite: Phaser.Physics.Arcade.Sprite) {}

    get sprite() {
        return this._sprite;
    }

    set sprite(sprite: Phaser.Physics.Arcade.Sprite) {
        this._sprite = sprite;
    }

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'spriteShouldUpdate',
            this.handleSpriteUpdate.bind(this),
            this.constructor.name
        );
    }

    public setPlayerSpriteProperties() {
        this._sprite.setCollideWorldBounds(true);
        this._sprite.setPushable(false);
        this._sprite.setImmovable(false);
        this._sprite.play('idle-down');
    }

    public setObjectSpriteProperties() {
        this._sprite.setPushable(false);
        this._sprite.setImmovable(true);
    }

    public handleSpriteUpdate = (update: SpriteUpdate) => {
        this._sprite.play(update.animationKey, update.ignoreIfPlaying);
        this._sprite.setVelocity(update.velocity.x, update.velocity.y);
    };

    public update(): void {
        this._sprite.update();
    }

    public destroy(): void {
        this._sprite.destroy();
        this.unsubscribe();
    }

    private unsubscribe() {
        this._eventBus.unsubscribe(
            'spriteShouldUpdate',
            this.handleSpriteUpdate
        );
    }
}
