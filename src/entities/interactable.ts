import { DamageEvent, Health } from '@components/health';
import { ComponentMap, IComponent } from '@src/components';
import { EventBus } from '@src/systems';

export class Interactable {
    public interactableEventBus: EventBus = new EventBus();
    public universeEventBus!: EventBus;
    protected components: ComponentMap = {};
    protected dirtyComponents: string[] = [];

    constructor(id: string, universalEventBus: EventBus) {
        this._id = id;
        this.addComponent(Health, 3);
        this.universeEventBus = universalEventBus;
        this.universeEventBus.subscribe(
            'attackPerformed',
            this.handleAttackPerformed
        );
        this.interactableEventBus.subscribe('destroyed', this.destroy);
        this.interactableEventBus.subscribe(
            'componentDirty',
            this.markComponentDirty
        );
    }

    protected _id: string;

    public get id() {
        return this._id;
    }

    public subscribe(universeEventBus: EventBus) {
        this.universeEventBus = universeEventBus;
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
        if (component.subscribe) {
            component.subscribe(this.interactableEventBus);
        }
    }

    public getComponent<T extends IComponent>(
        type: new (...args: any[]) => T
    ): T | undefined {
        const componentName = type.name;
        return this.components[componentName] as T | undefined;
    }

    public hasComponent<T extends IComponent>(
        type: new (...args: any[]) => T
    ): boolean {
        const componentName = type.name;
        return !!this.components[componentName];
    }

    public removeComponentByType<T extends IComponent>(
        type: new (...args: any[]) => T
    ): void {
        const componentName = type.name;
        if (this.components[componentName]) {
            const component = this.components[componentName];
            if (component.destroy) {
                component.destroy();
            }
            delete this.components[componentName];
            const index = this.dirtyComponents.indexOf(componentName);
            if (index !== -1) {
                this.dirtyComponents.splice(index, 1);
            }
        }
    }

    public update(): void {
        for (const componentName of this.dirtyComponents) {
            const component = this.components[componentName];
            if (component && component.update) {
                component.update();
            }
        }
        this.dirtyComponents = [];
    }

    public destroy(): void {
        for (const componentName in this.components) {
            const component = this.components[componentName];
            if (component.destroy) {
                component.destroy();
            }
            delete this.components[componentName];
        }
        this.universeEventBus.publish('interactableDestroyed', this.id);
    }

    public markComponentDirty(componentName: string): void {
        if (!this.dirtyComponents.includes(componentName)) {
            this.dirtyComponents.push(componentName);
            this.universeEventBus.publish('interactableDirty', this);
        }
    }

    private handleAttackPerformed = (targetDamage: DamageEvent) => {
        if (targetDamage.target === this.id) {
            this.interactableEventBus.publish(
                'takeDamage',
                targetDamage.damage
            );
        }
    };
}
