import { EventBus } from './';

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

export enum Direction {
    up = 'up',
    left = 'left',
    down = 'down',
    right = 'right'
}

export class ActionSystem {
    private eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.eventBus.subscribe('actionEvent', this.handleAction);
        this.eventBus.subscribe('resetEvent', this.handleResetAction);
    }

    handleAction(actionEvent: ActionEvent) {
        const { interactableId } = actionEvent;
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
        const { interactableId } = actionEvent;
        switch (actionEvent.action) {
            case Action.attack:
                break;
            case Action.moveUp:
            case Action.moveDown:
            case Action.moveLeft:
            case Action.moveRight:
                this.eventBus.publish('stop', interactableId);
        }
    }

    destroy() {
        this.eventBus.unsubscribe('actionEvent', this.handleAction);
        this.eventBus.unsubscribe('resetEvent', this.handleResetAction);
    }

    private publishMove(interactableId: string, direction: Direction) {
        this.eventBus.publish('move', {
            interactableId: interactableId,
            Direction: direction
        });
    }
}
