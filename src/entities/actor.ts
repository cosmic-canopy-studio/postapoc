import { Interactable } from './';
import {
    BaseDamage,
    Health,
    HealthBarComponent,
    MoveEvent,
    Speed
} from '@src/components';
import { Movement } from '@components/movement';
import { Attack } from '@components/attack';
import { EventBus } from '@src/systems';
import { GameScene } from '@scenes/gameScene';
import { createSprite, log } from '@src/utilities';
import { Sprite } from '@components/sprite';

export class Actor extends Interactable {
    constructor(id: string) {
        super(id);

        this.addComponent(BaseDamage, 1);
        this.addComponent(Attack, this.getComponent(BaseDamage)?.amount);
        this.addComponent(Speed, 100);
        if (this.debug) log.debug(`Actor ${id} created`);
    }

    public create(scene: GameScene) {
        this.addComponent(Movement, this.getComponent(Speed)?.amount, scene);
        this.addComponent(Sprite, createSprite(scene, 100, 200, 'character'));
        const sprite = this.getComponent(Sprite);
        sprite?.setPlayerSpriteProperties();
        this.addComponent(
            HealthBarComponent,
            sprite,
            this.getComponent(Health)?.amount
        );
    }

    public destroy(): void {
        this.universeEventBus.unsubscribe(
            'attackRequested',
            this.handleAttackRequested.bind(this)
        );
        this.universeEventBus.unsubscribe('move', this.handleMove.bind(this));
        if (this.debug) log.debug(`Actor ${this._id} destroyed`);
        super.destroy();
    }

    public subscribe(universeEventBus: EventBus) {
        super.subscribe(universeEventBus);
        this.universeEventBus.subscribe(
            'attackRequested',
            this.handleAttackRequested.bind(this),
            this.constructor.name
        );
        this.universeEventBus.subscribe(
            'move',
            this.handleMove.bind(this),
            this.constructor.name
        );
    }

    private handleAttackRequested(interactableId: string) {
        if (interactableId === this._id) {
            if (this.debug) log.debug(`Actor ${this._id} attack requested`);
            this.interactableEventBus.publish(
                'performAttack',
                this.universeEventBus
            );
        }
    }

    private handleMove(movement: MoveEvent) {
        if (movement.interactableId === this.id) {
            if (this.debug) log.debug(`Actor ${this._id} move requested`);
            const movementComponent = this.getComponent(Movement);
            if (movementComponent) {
                this.interactableEventBus.publish('move', movement.direction);
            }
        }
    }
}
