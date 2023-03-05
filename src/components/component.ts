import { EventBus } from '@src/systems';

export interface ComponentMap {
    [componentName: string]: IComponent;
}

export interface IComponent {
    subscribe?: (eventBus: EventBus) => void;
    update?: () => void;
    destroy?: () => void;
}
