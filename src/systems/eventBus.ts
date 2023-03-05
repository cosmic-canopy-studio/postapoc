import { log } from '@src/utilities';
import { DebugEvent } from '@systems/debuggable';

type EventHandler = (event: any) => void;
type Subscriber = [EventHandler, string];

export class EventBus {
    private static instance: EventBus;
    private subscribers: Map<string, Subscriber[]>;
    private debug = false;
    private globalEventBus!: EventBus;

    constructor(readonly _id: string) {
        this.subscribers = new Map<string, Subscriber[]>();
    }

    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            this.initSingleton();
        }
        return EventBus.instance;
    }

    private static initSingleton() {
        EventBus.instance = new EventBus(`globalEventBus`);
        const singletonEventBus = EventBus.instance;
        singletonEventBus.debug = true;
        if (singletonEventBus.debug) {
            log.debug(`globalEventBus created`);
        }
        singletonEventBus.subscribe(
            'toggleDebug',
            singletonEventBus.toggleDebugMode.bind(singletonEventBus),
            singletonEventBus._id
        );
    }

    public toggleDebugMode(debugEvent: DebugEvent) {
        if (
            debugEvent.className === 'all' ||
            debugEvent.className === this._id
        ) {
            this.debug = !this.debug;
            log.debug(
                `${this._id}: debug mode is now ${
                    this.debug ? 'enabled' : 'disabled'
                }`
            );
        }
    }

    public subscribe(
        eventType: string,
        handler: EventHandler,
        callingClass: string
    ) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType)?.push([handler, callingClass]);
        if (this.debug) {
            log.debug(`${callingClass} subscribed to ${eventType}`);
        }
    }

    public unsubscribe(eventType: string, handler: EventHandler) {
        const subscribers = this.subscribers.get(eventType);
        if (subscribers) {
            const index = subscribers.findIndex(([h]) => h === handler);
            if (index !== -1) {
                const [_, callingClass] = subscribers[index];
                subscribers.splice(index, 1);
                if (this.debug) {
                    log.debug(`${callingClass} unsubscribed from ${eventType}`);
                }
            }
        }
    }

    public publish(eventType: string, event: any) {
        const subscribers = this.subscribers.get(eventType);
        if (subscribers) {
            subscribers.forEach(([handler, callingClass]) => {
                if (this.debug) {
                    log.debug(
                        `${callingClass} received ${eventType} event: ${JSON.stringify(
                            event
                        )}`
                    );
                }
                handler(event);
            });
        }
    }

    public initGlobalEventBusForInstance() {
        this.globalEventBus = EventBus.getInstance();
        this.globalEventBus.subscribe(
            'toggleDebug',
            this.toggleDebugMode.bind(this),
            this._id
        );
    }
}
