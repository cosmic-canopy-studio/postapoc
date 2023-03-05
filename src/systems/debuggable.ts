import { EventBus } from '@systems/eventBus';

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
        console.log(`Debuggable: ${this.constructor.name} created`);
    }

    public toggleDebugMode(debugEvent: DebugEvent): void {
        console.log(debugEvent);
        if (
            debugEvent.className === 'all' ||
            debugEvent.className === this.constructor.name
        ) {
            this.debug = !this.debug;
            console.log(
                `${this.constructor.name}: debug mode is now ${
                    this.debug ? 'enabled' : 'disabled'
                }`
            );
        }
    }

    public destroy(): void {
        this.globalEventBus.unsubscribe('toggleDebug', this.toggleDebugMode);
    }
}
