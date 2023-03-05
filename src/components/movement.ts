import { IComponent } from './';
import { Direction, EventBus } from '@src/systems';

export interface MoveEvent {
    interactableId: string;
    direction: Direction;
}

export class Movement implements IComponent {
    private _direction = Direction.down;
    private _velocity = new Phaser.Math.Vector2(0, 0);
    private _eventBus!: EventBus;

    constructor(private _speed: number) {}

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'move',
            this.handleMove.bind(this),
            this.constructor.name
        );
    }

    handleStop() {}

    public destroy(): void {
        this.unsubscribe();
    }

    private handleMove(direction: Direction) {
        let animationKey;
        if (direction === 'stop') {
            this._velocity.x = 0;
            this._velocity.y = 0;
            animationKey = `idle-${this._direction}`;
        } else {
            this._direction = direction;
            this._velocity.x = this.calcVelocity().x * this._speed;
            this._velocity.y = this.calcVelocity().y * this._speed;
            animationKey = `move-${this._direction}`;
        }

        this._eventBus.publish('spriteShouldUpdate', {
            velocity: this._velocity,
            animationKey: animationKey,
            ignoreIfPlaying: false
        });
    }

    private calcVelocity() {
        const velocity = new Phaser.Math.Vector2(0, 0);
        switch (this._direction) {
            case 'up':
                velocity.y -= 1;
                break;
            case 'down':
                velocity.y += 1;
                break;
            case 'left':
                velocity.x -= 1;
                break;
            case 'right':
                velocity.x += 1;
                break;
        }
        return velocity.normalize();
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('move', this.handleMove);
    }
}
