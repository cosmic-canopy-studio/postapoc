import { EventBus } from './';
import { Direction, MoveEvent } from '@src/components';
import { log } from '@src/utilities';
import { DebugEvent, Debuggable } from '@src/systems/debuggable';

export enum Action {
    attack = 'attack',
    moveUp = 'moveUp',
    moveLeft = 'moveLeft',
    moveDown = 'moveDown',
    moveRight = 'moveRight',
    toggleDebugAll = 'toggleDebugAll',
    toggleGlobalDebugEvents = 'toggleGlobalDebugEvents',
    toggleUniverseDebugEvents = 'toggleUniverseDebugEvents',
    toggleInteractableDebugEvents = 'toggleInteractableDebugEvents'
}

export interface ActionEvent {
    action: Action;
    interactableId: string;
}

export class ActionSystem extends Debuggable {
    protected debug = false;
    private universeEventBus: EventBus;

    constructor(eventBus: EventBus) {
        super();
        this.universeEventBus = eventBus;
        this.universeEventBus.subscribe(
            'actionEvent',
            this.handleAction.bind(this),
            this.constructor.name
        );
        this.universeEventBus.subscribe(
            'resetEvent',
            this.handleResetAction.bind(this),
            this.constructor.name
        );
        if (this.debug) log.debug('ActionSystem initialized');
    }

    handleAction(actionEvent: ActionEvent) {
        if (this.debug) log.debug(`Action: ${actionEvent.action}`);
        const interactableId = actionEvent.interactableId;
        switch (actionEvent.action) {
            case Action.attack:
                this.universeEventBus.publish(
                    'attackRequested',
                    interactableId
                );
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
                break;
            case Action.toggleDebugAll:
                this.globalEventBus.publish('toggleDebug', {
                    className: 'all'
                } as DebugEvent);
                break;
            case Action.toggleGlobalDebugEvents:
                this.globalEventBus.publish('toggleDebug', {
                    className: 'globalEventBus'
                } as DebugEvent);
                break;
            case Action.toggleUniverseDebugEvents:
                this.globalEventBus.publish('toggleDebug', {
                    className: 'universeEventBus'
                } as DebugEvent);
                break;
            case Action.toggleInteractableDebugEvents:
                this.globalEventBus.publish('toggleDebug', {
                    className: 'interactableEventBus'
                } as DebugEvent);
                break;
        }
    }

    handleResetAction(actionEvent: ActionEvent) {
        if (this.debug) log.debug(`Reset Action: ${actionEvent.action}`);
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
        if (this.debug) log.debug('Destroying ActionSystem');
        this.universeEventBus.unsubscribe('actionEvent', this.handleAction);
        this.universeEventBus.unsubscribe('resetEvent', this.handleResetAction);
    }

    private publishMove(interactableId: string, direction: Direction) {
        const moveEvent: MoveEvent = {
            interactableId,
            direction
        };
        this.universeEventBus.publish('move', moveEvent);
    }
}
