import { IComponent } from './';
import { EventBus } from '@src/systems';

export enum Direction {
    up = 'up',
    left = 'left',
    down = 'down',
    right = 'right',
    stopUp = 'stopUp',
    stopLeft = 'stopLeft',
    stopDown = 'stopDown',
    stopRight = 'stopRight'
}

export interface MoveEvent {
    interactableId: string;
    direction: Direction;
}

export class Movement implements IComponent {
    private _directions: Direction[] = [];
    private _velocity = new Phaser.Math.Vector2(0, 0);
    private _eventBus!: EventBus;
    private _facingDirection: Direction = Direction.down;

    constructor(private _speed: number) {}

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'move',
            this.handleMove.bind(this),
            this.constructor.name
        );
    }

    handleStop() {
        this._directions = [];
    }

    public destroy(): void {
        this.unsubscribe();
    }

    private handleMove(direction: Direction) {
        const stopDirectionRegex = /^stop(Up|Down|Left|Right)$/;
        if (stopDirectionRegex.test(direction)) {
            const nonStopDirection = direction
                .slice(4)
                .toLowerCase() as Direction;
            const index = this._directions.indexOf(nonStopDirection);
            if (index !== -1) {
                this._directions.splice(index, 1);
            }
        } else {
            const index = this._directions.indexOf(direction);
            if (index === -1) {
                this._directions.push(direction);
            }
            this._facingDirection = direction;
        }

        let animationKey;
        if (this._directions.length === 0) {
            animationKey = `idle-${this._facingDirection}`;
        } else {
            animationKey = `move-${this._facingDirection}`;
        }

        this.updateVelocity();

        this._eventBus.publish('spriteShouldUpdate', {
            velocity: this._velocity,
            animationKey: animationKey,
            ignoreIfPlaying: false
        });
    }

    private updateVelocity() {
        const totalVelocity = new Phaser.Math.Vector2(0, 0);
        for (const direction of this._directions) {
            switch (direction) {
                case 'up':
                    totalVelocity.y -= 1;
                    break;
                case 'down':
                    totalVelocity.y += 1;
                    break;
                case 'left':
                    totalVelocity.x -= 1;
                    break;
                case 'right':
                    totalVelocity.x += 1;
                    break;
            }
        }
        this._velocity.x = totalVelocity.x * this._speed;
        this._velocity.y = totalVelocity.y * this._speed;
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('move', this.handleMove);
    }
}
