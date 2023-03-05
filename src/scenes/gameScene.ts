import { Actor, Interactable } from '../entities';
import { createSprite, log } from '../utilities';
import { Universe } from '../systems';
import { Sprite } from '@components/sprite';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game'
};

export class GameScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    private _universe!: Universe;

    get universe() {
        return this._universe;
    }

    public create(): void {
        this._universe = new Universe(this);

        const initTileset = () => {
            const interiorTilemap = this.make.tilemap({
                key: 'basic-interior'
            });
            interiorTilemap.addTilesetImage('interior', 'interior');
            for (let i = 0; i < interiorTilemap.layers.length; i++) {
                interiorTilemap.createLayer(i, 'interior', 0, 0);
            }
        };

        const initPlayer = () => {
            const player = new Actor('player', this._universe.eventBus);
            player.addComponent(
                Sprite,
                createSprite(this, 100, 200, 'character')
            );
            const sprite = player.getComponent(Sprite);
            sprite?.setPlayerSpriteProperties();
            this._universe.addInteractable(player);
            this._universe.setControlledActor(player);
            this._universe.setSceneCameraToPlayer();
        };

        const initObjects = () => {
            const bench = new Interactable('bench', this._universe.eventBus);
            bench.addComponent(Sprite, createSprite(this, 200, 200, 'bench'));
            const sprite = bench.getComponent(Sprite);
            sprite?.setObjectSpriteProperties();
            this._universe.addInteractable(bench);

            const currentPlayerActor = this._universe.getControlledActor();
            const playerSprite = currentPlayerActor.getComponent(Sprite);
            const benchSprite = bench.getComponent(Sprite);
            if (!playerSprite || !benchSprite) {
                throw Error(
                    `Player or bench sprite is undefined: ${playerSprite}, ${benchSprite}`
                );
            } else {
                this.physics.add.collider(
                    playerSprite.sprite,
                    benchSprite.sprite,
                    () => this.handlePlayerInteractableCollision(bench),
                    undefined,
                    this
                );
            }
        };

        initTileset();
        initPlayer();
        initObjects();

        log.debug('game scene created');
        this.scene.launch('UI');
        log.debug('ui scene launched');
    }

    update() {
        this._universe.update();
    }

    private handlePlayerInteractableCollision(interactable: Interactable) {
        const player = this._universe.getControlledActor();
        player.interactableEventBus.publish('focusChanged', interactable.id);
    }
}
