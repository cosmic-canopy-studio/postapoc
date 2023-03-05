import { IComponent } from './';
import { HealthBarUI } from '@src/ui';
import { EventBus } from '@src/systems';
import Vector2 = Phaser.Math.Vector2;

export class HealthBarComponent implements IComponent {
    private _eventBus!: EventBus;

    constructor(readonly _healthBar: HealthBarUI) {}

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe('healthChanged', this.updateHealth.bind(this));
        this._eventBus.subscribe(
            'positionChanged',
            this.updatePosition.bind(this)
        );
    }

    public updateHealth(amount: number): void {
        this._healthBar.updateHealth(amount);
    }

    public updatePosition(position: Vector2): void {
        const { x, y } = position;
        this._healthBar.updatePosition(x, y);
    }

    public destroy(): void {
        this._healthBar.destroy();
        this.unsubscribe();
    }

    private unsubscribe() {
        this._eventBus.unsubscribe('healthChanged', this.updateHealth);
        this._eventBus.unsubscribe('positionChanged', this.updatePosition);
    }
}
