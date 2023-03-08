import { log } from '@src/utilities';
import { IComponent, IValue } from './';
import { EventBus } from '@src/systems';

export interface DamageEvent {
    target: string;
    damage: number;
}

export interface HealthValue extends IValue {
    value: number;
    maxValue: number;
    brokenThreshold?: number;
}

export class Health implements IComponent {
    private _eventBus!: EventBus;

    constructor(private _healthValue: HealthValue) {}

    get value() {
        return this._healthValue.value;
    }

    set value(amount) {
        this._healthValue.value = amount;
        this._eventBus.publish('healthChanged', this._healthValue.value);
        if (this._healthValue.value <= 0) {
            this._isDestroyed = true;
            log.info(`Object is destroyed`);
            this._eventBus.publish('destroyed', this.constructor.name);
        }
        this.checkBroken();
    }

    private _isBroken = false;

    get isBroken(): boolean {
        return this._isBroken;
    }

    private _isDestroyed = false;

    get isDestroyed() {
        return this._isDestroyed;
    }

    get healthValue() {
        return this._healthValue;
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
        this.value -= amount;
    };

    private checkBroken() {
        if (this._healthValue.brokenThreshold) {
            if (
                this._healthValue.value <= this._healthValue.brokenThreshold &&
                !this._isBroken
            ) {
                this._isBroken = true;
                this._eventBus.publish('broken', this._healthValue.value);
                log.info(`Object is broken`); // TODO: move logging to subscriber
            } else if (
                this._healthValue.value >= this._healthValue.brokenThreshold &&
                this._isBroken
            ) {
                this._isBroken = false;
                this._eventBus.publish('fixed', this._healthValue.value);
                log.info(`Object is no longer broken`);
            }
        }
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('takeDamage', this.handleTakeDamage);
    }
}
