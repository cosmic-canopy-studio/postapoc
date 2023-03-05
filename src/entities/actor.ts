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

export class Actor extends Interactable {
    constructor(id: string, universeEventBus: EventBus) {
        super(id, universeEventBus);

        this.addComponent(BaseDamage, 1);
        this.addComponent(Attack, this.getComponent(BaseDamage)?.amount);
        this.addComponent(Speed, 100);
        this.addComponent(Movement, this.getComponent(Speed)?.amount);
        this.addComponent(
            HealthBarComponent,
            this.getComponent(Health)?.amount
        );
        this.universeEventBus.subscribe(
            'attackRequested',
            this.handleAttackRequested.bind(this)
        );
        this.universeEventBus.subscribe('move', this.handleMove.bind(this));
        this.universeEventBus.subscribe('stop', this.handleStop.bind(this));
    }

    private handleAttackRequested(interactableId: string) {
        if (interactableId === this._id) {
            this.interactableEventBus.publish(
                'performAttack',
                this.universeEventBus
            );
        }
    }

    private handleMove(movement: MoveEvent) {
        if (movement.interactableId === this.id) {
            const movementComponent = this.getComponent(Movement);
            if (movementComponent) {
                this.interactableEventBus.publish('move', movement.direction);
            }
        }
    }

    private handleStop(id: string) {
        if (id === this.id) {
            const movementComponent = this.getComponent(Movement);
            if (movementComponent) {
                this.interactableEventBus.publish('stop', undefined);
            }
        }
    }
}
