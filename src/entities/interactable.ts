import { DamageEvent, Health } from '@src/components/health';
import { ComponentMap, IComponent } from '@src/components';
import { EventBus } from '@src/systems';
import { log } from '@src/utilities';
import { Debuggable } from '@src/systems/debuggable';

export class Interactable extends Debuggable {
    public interactableEventBus: EventBus;
    public universeEventBus!: EventBus;
    protected components: ComponentMap = {};
    protected dirtyComponents: string[] = [];
    protected debug = false;

    constructor(id: string) {
        super();
        this.interactableEventBus = new EventBus(`interactableEventBus`);
        this.interactableEventBus.initGlobalEventBusForInstance();
        this._id = id;
        this.addComponent(Health, {
            value: 3,
            maxValue: 3,
            brokenThreshold: 1
        });

        this.interactableEventBus.subscribe(
            'destroyed',
            this.handleDestruction.bind(this),
            this.constructor.name
        );
        this.interactableEventBus.subscribe(
            'componentDirty',
            this.markComponentDirty.bind(this),
            this.constructor.name
        );
        if (this.debug) log.debug(`Interactable ${id} created`);
    }

    protected _id: string;

    public get id() {
        if (this.debug) log.debug(`Interactable ${this._id} id requested`);
        return this._id;
    }

    public subscribe(universeEventBus: EventBus) {
        this.universeEventBus = universeEventBus;
        this.universeEventBus.subscribe(
            'attackPerformed',
            this.handleAttackPerformed,
            this.constructor.name
        );
        if (this.debug)
            log.debug(
                `Interactable ${this._id} subscribed to universeEventBus`
            );
    }

    public addComponent<T extends IComponent>(
        type: new (...args: any[]) => T,
        ...args: ConstructorParameters<typeof type>
    ): void {
        const componentName = type.name;
        if (this.components[componentName]) {
            throw new Error(
                `Interactable already has component of type ${componentName}`
            );
        }
        const component = new type(...args);
        this.components[componentName] = component;
        if (this.debug)
            log.debug(
                `Interactable ${this._id} added component ${componentName}`
            );
        if (component.subscribe) {
            component.subscribe(this.interactableEventBus);
            if (this.debug)
                log.debug(
                    `Interactable ${this._id} subscribed component ${componentName} to interactableEventBus`
                );
        }
    }

    public getComponent<T extends IComponent>(
        type: new (...args: any[]) => T
    ): T | undefined {
        const componentName = type.name;
        if (this.debug)
            log.debug(
                `Interactable ${this._id} requested component ${componentName}`
            );
        return this.components[componentName] as T | undefined;
    }

    public hasComponent<T extends IComponent>(
        type: new (...args: any[]) => T
    ): boolean {
        const componentName = type.name;
        if (this.debug)
            log.debug(
                `Interactable ${this._id} confirmed existence of ${componentName}`
            );
        return !!this.components[componentName];
    }

    public removeComponentByType<T extends IComponent>(
        type: new (...args: any[]) => T
    ): void {
        const componentName = type.name;
        if (this.components[componentName]) {
            const component = this.components[componentName];
            if (this.debug)
                log.debug(
                    `Interactable ${this._id} removing component ${componentName}`
                );
            if (component.destroy) {
                component.destroy();
                if (this.debug)
                    log.debug(
                        `Interactable ${this._id} destroyed component ${componentName}`
                    );
            }
            delete this.components[componentName];
            const index = this.dirtyComponents.indexOf(componentName);
            if (index !== -1) {
                this.dirtyComponents.splice(index, 1);
                if (this.debug)
                    log.debug(
                        `Interactable ${this._id} removed dirty component ${componentName}`
                    );
            }
        }
    }

    public update(): void {
        const dirtyComponents = this.dirtyComponents;
        this.dirtyComponents = [];
        for (const componentName of dirtyComponents) {
            const component = this.components[componentName];
            if (component && component.update) {
                if (this.debug)
                    log.debug(
                        `Interactable ${this._id} updating component ${componentName}`
                    );
                component.update();
            }
        }
    }

    public destroy(): void {
        for (const componentName in this.components) {
            const component = this.components[componentName];
            if (this.debug)
                log.debug(
                    `Interactable ${this._id} destroying component ${componentName}`
                );
            if (component.destroy) {
                component.destroy();
                if (this.debug)
                    log.debug(
                        `Interactable ${this._id} destroyed component ${componentName}`
                    );
            }
            delete this.components[componentName];
        }
        if (this.debug) log.debug(`Interactable ${this._id} destroyed`);
    }

    public markComponentDirty(componentName: string): void {
        if (!this.dirtyComponents.includes(componentName)) {
            this.dirtyComponents.push(componentName);
            if (this.debug)
                log.debug(
                    `Interactable ${this._id} marked component ${componentName} dirty`
                );
            this.universeEventBus.publish('interactableDirty', this);
        }
    }

    private handleDestruction() {
        if (this.debug)
            log.debug(`Interactable ${this._id} ready for destruction`);
        this.universeEventBus.publish('interactableDestroyed', this.id); // TODO: Add event signature
    }

    private handleAttackPerformed = (damageEvent: DamageEvent) => {
        if (damageEvent.target === this.id) {
            if (this.debug)
                log.debug(
                    `Interactable ${this._id} received ${damageEvent.damage} damage.`
                );
            this.interactableEventBus.publish('takeDamage', damageEvent.damage);
        }
    };
}
