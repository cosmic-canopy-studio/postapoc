import { IComponent } from './';

export class Stat implements IComponent {
    constructor(private _amount: number) {}

    get amount() {
        return this._amount;
    }

    set amount(amount) {
        this._amount = amount;
    }

    public update() {
        // do nothing
    }

    public destroy() {
        // do nothing
    }
}

export class Speed extends Stat {
    constructor(amount: number) {
        super(amount);
    }
}

export class BaseDamage extends Stat {
    constructor(amount: number) {
        super(amount);
    }
}
