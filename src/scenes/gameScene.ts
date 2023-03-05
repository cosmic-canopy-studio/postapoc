import { Actor, Interactable } from '../entities';
import { createSprite, log } from '../utilities';
import { Universe } from '../systems';
import { Sprite } from '@components/sprite';
import { Health, HealthBarComponent } from '@src/components';

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
            const player = new Actor(
                'player',
                this._universe.universeEventBus,
                this
            );
            player.addComponent(
                Sprite,
                createSprite(this, 100, 200, 'character')
            );
            const sprite = player.getComponent(Sprite);
            sprite?.setPlayerSpriteProperties();
            player.addComponent(
                HealthBarComponent,
                sprite,
                player.getComponent(Health)?.amount
            );
            this._universe.addInteractable(player);
            this._universe.setControlledActor(player);
            this._universe.setSceneCameraToPlayer();
        };

        const initObjects = () => {
            const interactablesGroup = this.physics.add.group();

            const bench = new Interactable(
                'bench',
                this._universe.universeEventBus
            );
            bench.addComponent(Sprite, createSprite(this, 200, 200, 'bench'));
            const benchSprite = bench.getComponent(Sprite);
            benchSprite.setObjectSpriteProperties();
            interactablesGroup.add(benchSprite.sprite);
            benchSprite.sprite.setData('interactable', bench);

            const board = new Interactable(
                'board',
                this._universe.universeEventBus
            );
            board.addComponent(Sprite, createSprite(this, 100, 100, 'board'));
            const boardSprite = board.getComponent(Sprite);
            boardSprite.setObjectSpriteProperties();
            interactablesGroup.add(boardSprite.sprite);
            boardSprite.sprite.setData('interactable', board);

            const currentPlayerActor = this._universe.getControlledActor();
            const playerSprite = currentPlayerActor.getComponent(Sprite);

            if (!playerSprite) {
                throw Error(`Player sprite is undefined: ${playerSprite}}`);
            } else {
                this.physics.add.collider(
                    playerSprite.sprite,
                    interactablesGroup,
                    (playerSprite, interactableSprite) => {
                        const interactable = interactableSprite.getData(
                            'interactable'
                        ) as Interactable;
                        this.handlePlayerInteractableCollision(interactable);
                    },
                    undefined,
                    this
                );
            }
        };

        initTileset();
        initPlayer();
        initObjects();

        log.debug('game scene created');
        log.debug('ui scene launched');
    }

    update() {
        this._universe.update();
    }

    private handlePlayerInteractableCollision(interactable: Interactable) {
        const player = this._universe.getControlledActor();
        console.log(`interactable: ${interactable.id}`);
        if (interactable) {
            player.interactableEventBus.publish(
                'focusChanged',
                interactable.id
            );
        }
    }
}
