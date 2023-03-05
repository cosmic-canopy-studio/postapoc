import { log } from '@src/utilities';

type EventHandler = (event: any) => void;
type Subscriber = [EventHandler, string];

export class EventBus {
    private subscribers: Map<string, Subscriber[]>;
    private debug = true;

    constructor() {
        this.subscribers = new Map<string, Subscriber[]>();
    }

    public toggleDebugMode() {
        this.debug = !this.debug;
    }

    public subscribe(
        eventType: string,
        handler: EventHandler,
        callingClass = 'unknown'
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
}
