import { IComponent } from './';
import { defaultBarDimensions, HealthBarUI, UIBarDimensions } from '@src/ui';
import { EventBus } from '@src/systems';
import { HealthValue } from '@src/components/health';

export class HealthBarComponent implements IComponent {
    private _eventBus!: EventBus;
    private _healthBar: HealthBarUI;
    private _sprite: Phaser.Physics.Arcade.Sprite;

    constructor(
        sprite: Phaser.Physics.Arcade.Sprite,
        healthValue: HealthValue,
        uiBarDimensions: UIBarDimensions
    ) {
        this._healthBar = new HealthBarUI(
            sprite,
            healthValue,
            uiBarDimensions || {
                ...defaultBarDimensions,
                yOffset: sprite.height
            }
        );
        this._sprite = sprite;
        this._visible = false;
    }

    private _visible;

    get visible(): boolean {
        return this._visible;
    }

    set visible(visible: boolean) {
        this._visible = visible;
        if (visible) {
            this._eventBus.publish('componentDirty', this.constructor.name);
        }
    }

    public subscribe(eventBus: EventBus) {
        this._eventBus = eventBus;
        this._eventBus.subscribe(
            'healthChanged',
            this.updateHealth.bind(this),
            this.constructor.name
        );
        this.visible = true;
    }

    public update(): void {
        if (this._visible) {
            this._healthBar.updatePosition(this._sprite.x, this._sprite.y);
            this._eventBus.publish('componentDirty', this.constructor.name);
        } else {
            this._healthBar.clear();
        }
    }

    public updateHealth(amount: number): void {
        this._healthBar.updateHealth(amount);
    }

    public destroy(): void {
        this._healthBar.destroy();
        this.unsubscribe();
    }

    private unsubscribe(): void {
        this._eventBus.unsubscribe('healthChanged', this.updateHealth);
    }
}
