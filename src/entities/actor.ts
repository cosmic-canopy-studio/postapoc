import { Interactable } from './';
import { BaseDamage, MoveEvent, Speed } from '@src/components';
import { Movement } from '@components/movement';
import { Attack } from '@components/attack';
import { EventBus } from '@src/systems';
import { GameScene } from '@scenes/gameScene';
import { log } from '@src/utilities';

export class Actor extends Interactable {
    constructor(id: string, universeEventBus: EventBus, scene: GameScene) {
        super(id, universeEventBus);

        this.addComponent(BaseDamage, 1);
        this.addComponent(Attack, this.getComponent(BaseDamage)?.amount);
        this.addComponent(Speed, 100);
        this.addComponent(Movement, this.getComponent(Speed)?.amount, scene);
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

        if (this.debug) log.debug(`Actor ${id} created`);
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
