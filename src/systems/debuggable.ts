import { EventBus } from '@src/systems/eventBus';
import { log } from '@src/utilities';

export interface DebugEvent {
    className: string;
    pattern: RegExp;
}

export class Debuggable {
    protected debug = false;
    protected globalEventBus: EventBus;

    constructor() {
        this.globalEventBus = EventBus.getInstance();
        this.globalEventBus.subscribe(
            'toggleDebug',
            this.toggleDebugMode.bind(this),
            this.constructor.name
        );
        if (this.debug)
            log.debug(`Debuggable: ${this.constructor.name} created`);
    }

    public toggleDebugMode(debugEvent: DebugEvent): void {
        if (
            debugEvent.className === 'all' ||
            debugEvent.className === this.constructor.name
        ) {
            this.debug = !this.debug;
            log.info(
                `${this.constructor.name}: debug mode is now ${
                    this.debug ? 'enabled' : 'disabled'
                }`
            );
        }
    }

    public destroy(): void {
        if (this.debug)
            log.debug(`Debuggable: ${this.constructor.name} destroyed`);
        this.globalEventBus.unsubscribe('toggleDebug', this.toggleDebugMode);
    }
}
