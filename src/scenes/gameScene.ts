import { Actor, Interactable } from '../entities';
import { log } from '../utilities';
import { Universe } from '../systems';
import { HealthBar } from '../ui';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game'
};

export class GameScene extends Phaser.Scene {
    private universe!: Universe;

    constructor() {
        super(sceneConfig);
    }

    public create(): void {
        this.universe = new Universe(this);

        this.initTileset();

        this.initPlayer();

        this.initObjects();
        log.debug('game scene created');
        this.scene.launch('UI');
        log.debug('ui scene launched');
    }

    update() {
        this.universe.update();
    }

    private initObjects() {
        const bench = new Interactable('bench');
        bench.setSprite(this.createSprite(200, 200, 'bench'));
        this.universe.addInteractable(bench);

        const currentPlayerActor = this.universe.getControlledActor();
        if (!currentPlayerActor.sprite || !bench.sprite) {
            throw Error('Collision object not defined');
        } else {
            this.physics.add.collider(
                currentPlayerActor.sprite,
                bench.sprite,
                () => this.handlePlayerInteractableCollision(bench),
                undefined,
                this
            );
        }
    }

    private initPlayer() {
        const player = new Actor('player');
        player.setSprite(this.createSprite(100, 200, 'character', true));
        this.universe.addActor(player);
        this.universe.setControlledActor(player);
        this.universe.setSceneCameraToPlayer();
        player.healthBar = new HealthBar(player);
    }

    private initTileset() {
        const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
        interiorTilemap.addTilesetImage('interior', 'interior');
        for (let i = 0; i < interiorTilemap.layers.length; i++) {
            interiorTilemap.createLayer(i, 'interior', 0, 0);
        }
    }

    private handlePlayerInteractableCollision(interactable: Interactable) {
        this.universe.getControlledActor().setFocus(interactable);
    }

    private createSprite(x: number, y: number, key: string, moveable = false) {
        const sprite = new Phaser.Physics.Arcade.Sprite(this, x, y, key);
        this.add.existing(sprite);
        this.physics.add.existing(sprite);
        if (moveable) {
            sprite.setPushable(true);
            sprite.setDrag(200, 200);
        } else {
            sprite.setPushable(false);
            sprite.setImmovable(true);
        }
        return sprite;
    }
}