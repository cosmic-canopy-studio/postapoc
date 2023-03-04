import Thing from '../components/thing';
import { Directions } from '../systems';
import { log } from '../utilities';
import { HealthBar } from '../ui';

export default class Interactable {
    public thing: Thing;
    public sprite?: Phaser.Physics.Arcade.Sprite;
    protected speed = 100;
    protected direction = Directions.down;
    protected healthBar?: HealthBar;

    constructor(id: string) {
        this.thing = new Thing(id);
    }

    get health() {
        return this.thing.health;
    }

    set health(health: number) {
        this.thing.health = health;
        if (this.healthBar) {
            this.healthBar.setHealth(health);
        }
        if (this.thing.health <= 0) {
            this.destroy();
        }
        if (this.thing.health < 2) {
            this.isBroken();
        }
    }

    get id() {
        return this.thing.id;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    getSpeed(): number {
        return this.speed;
    }

    setSprite(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite;
    }

    unsetSprite() {
        this.sprite?.destroy();
        this.sprite = undefined;
    }

    setDirection(direction: Directions) {
        this.direction = direction;
    }

    getDirection() {
        return this.direction;
    }

    addHealthBar() {
        this.healthBar = new HealthBar(this);
    }

    removeHealthBar() {
        if (this.healthBar) {
            this.healthBar.destroy();
            this.healthBar = undefined;
        }
    }

    public update() {
        return;
    }

    public destroy() {
        log.info(`${this.thing.id} has died.`);
        this.removeHealthBar();
        if (this.sprite) {
            this.sprite.destroy();
        }
    }

    private isBroken() {
        if (this.sprite && this.sprite.texture.key !== 'bench-broken') {
            this.sprite.setTexture('bench-broken');
        }
        log.info(`${this.thing.id} is broken`);
    }
}
