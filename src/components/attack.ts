import { EventBus } from '@src/systems';
import { IComponent } from '@components/component';

export class Attack implements IComponent {
    private _eventBus!: EventBus;

    constructor(amount: number) {
        this._amount = amount;
    }

    private _target = 'none';

    get target() {
        return this._target;
    }

    private _amount: number;

    get amount() {
        return this._amount;
    }

    set amount(amount) {
        this._amount = amount;
    }

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'performAttack',
            this.performAttack.bind(this),
            this.constructor.name
        );

        this._eventBus.subscribe(
            'focusChanged',
            this.focusChanged.bind(this),
            this.constructor.name
        );
    }

    public destroy() {
        this.unsubscribe();
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('performAttack', this.performAttack);
        this._eventBus.unsubscribe('focusChanged', this.focusChanged);
    }

    private performAttack(universeEventBus: EventBus) {
        universeEventBus.publish('attackPerformed', {
            target: this._target,
            damage: this._amount
        });
    }

    private focusChanged(interactableId: string) {
        this._target = interactableId;
    }
}
