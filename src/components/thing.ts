import { log } from '../utilities';

export default class Thing {
    constructor(
        public readonly id: string,
        protected _health = 3,
        public readonly moveable = false
    ) {}

    get health() {
        return this._health;
    }

    set health(health: number) {
        this._health = health;
        log.debug(`${this.id} health: ${this._health}`);
    }
}
