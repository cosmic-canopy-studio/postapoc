type EventHandler = (event: any) => void;

export class EventBus {
    private subscribers: Map<string, EventHandler[]>;

    constructor() {
        this.subscribers = new Map<string, EventHandler[]>();
    }

    public subscribe(eventType: string, handler: EventHandler) {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType)?.push(handler);
    }

    public unsubscribe(eventType: string, handler: EventHandler) {
        const handlers = this.subscribers.get(eventType);
        if (handlers) {
            const index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }

    public publish(eventType: string, event: any) {
        const handlers = this.subscribers.get(eventType);
        if (handlers) {
            handlers.forEach((handler) => {
                handler(event);
            });
        }
    }
}
