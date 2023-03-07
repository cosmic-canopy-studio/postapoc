import { log } from '@src/utilities';
import { IComponent } from './';
import { EventBus } from '@src/systems';

export interface DamageEvent {
    target: string;
    damage: number;
}

export class Health implements IComponent {
    private readonly _maxHealth: number;
    private readonly _brokenThreshold: number;
    private _eventBus!: EventBus;

    constructor(
        amount: number,
        maxHealth: number = amount,
        brokenThreshold = 1
    ) {
        this._amount = amount;
        this._maxHealth = maxHealth;
        this._brokenThreshold = brokenThreshold;
    }

    private _amount: number;

    get amount() {
        return this._amount;
    }

    set amount(amount) {
        this._amount = amount;
        this._eventBus.publish('healthChanged', this._amount);
        if (this._amount <= 0) {
            this._isDestroyed = true;
            log.info(`Object is destroyed`);
            this._eventBus.publish('destroyed', this.amount);
        }
        if (this._amount <= this._brokenThreshold && !this._isBroken) {
            this._isBroken = true;
            this._eventBus.publish('broken', this._amount);
            log.info(`Object is broken`); // TODO: move logging to subscriber
        } else if (this._amount >= this._brokenThreshold && this._isBroken) {
            this._isBroken = false;
            this._eventBus.publish('fixed', this._amount);
            log.info(`Object is no longer broken`);
        }
    }

    private _isBroken = false;

    get isBroken(): boolean {
        return this._isBroken;
    }

    private _isDestroyed = false;

    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'takeDamage',
            this.handleTakeDamage.bind(this),
            this.constructor.name
        );
    }

    public destroy() {
        this.unsubscribe();
    }

    public handleTakeDamage = (amount: number) => {
        this.takeDamage(amount);
    };

    public takeDamage(amount: number) {
        this.amount = Math.max(0, this.amount - amount);
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('takeDamage', this.handleTakeDamage);
    }
}
