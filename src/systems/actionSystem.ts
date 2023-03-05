import { EventBus } from './';
import { Direction, MoveEvent } from '@src/components';

export enum Action {
    attack = 'attack',
    moveUp = 'moveUp',
    moveLeft = 'moveLeft',
    moveDown = 'moveDown',
    moveRight = 'moveRight'
}

export interface ActionEvent {
    action: Action;
    interactableId: string;
}

export class ActionSystem {
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.eventBus.subscribe(
            'actionEvent',
            this.handleAction.bind(this),
            this.constructor.name
        );
        this.eventBus.subscribe(
            'resetEvent',
            this.handleResetAction.bind(this),
            this.constructor.name
        );
    }

    handleAction(actionEvent: ActionEvent) {
        const interactableId = actionEvent.interactableId;
        switch (actionEvent.action) {
            case Action.attack:
                this.eventBus.publish('attackRequested', interactableId);
                break;
            case Action.moveUp:
                this.publishMove(interactableId, Direction.up);
                break;
            case Action.moveDown:
                this.publishMove(interactableId, Direction.down);
                break;
            case Action.moveLeft:
                this.publishMove(interactableId, Direction.left);
                break;
            case Action.moveRight:
                this.publishMove(interactableId, Direction.right);
        }
    }

    handleResetAction(actionEvent: ActionEvent) {
        const interactableId = actionEvent.interactableId;
        switch (actionEvent.action) {
            case Action.attack:
                break;
            case Action.moveUp:
                this.publishMove(interactableId, Direction.stopUp);
                break;
            case Action.moveDown:
                this.publishMove(interactableId, Direction.stopDown);
                break;
            case Action.moveLeft:
                this.publishMove(interactableId, Direction.stopLeft);
                break;
            case Action.moveRight:
                this.publishMove(interactableId, Direction.stopRight);
        }
    }

    destroy() {
        this.eventBus.unsubscribe('actionEvent', this.handleAction);
        this.eventBus.unsubscribe('resetEvent', this.handleResetAction);
    }

    private publishMove(interactableId: string, direction: Direction) {
        const moveEvent: MoveEvent = {
            interactableId,
            direction
        };
        this.eventBus.publish('move', moveEvent);
    }
}