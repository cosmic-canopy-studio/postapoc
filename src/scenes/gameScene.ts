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
            const player = new Actor('player');
            player.create(this);
            this._universe.addInteractable(player);
            this._universe.setControlledActor(player);
            this._universe.setSceneCameraToPlayer();
            player.initPlayer(); // TODO: refactor dependency chain
        };

        const initObjects = () => {
            const interactablesGroup = this.physics.add.group();

            const bench = new Interactable('bench');
            this._universe.addInteractable(bench);
            bench.addComponent(Sprite, createSprite(this, 200, 200, 'bench'));
            const benchSprite = bench.getComponent(Sprite);
            if (!benchSprite) throw new Error(`benchSprite is undefined`);
            benchSprite.setObjectSpriteProperties();
            interactablesGroup.add(benchSprite.sprite);
            benchSprite.sprite.setData('interactable', bench);

            const board = new Interactable('board');
            this._universe.addInteractable(board);
            board.addComponent(Sprite, createSprite(this, 100, 100, 'board'));
            const boardSprite = board.getComponent(Sprite);
            if (!boardSprite) throw new Error(`boardSprite is undefined`);
            boardSprite.setObjectSpriteProperties();
            interactablesGroup.add(boardSprite.sprite);
            boardSprite.sprite.setData('interactable', board);

            const currentPlayerActor = this._universe.getControlledActor();
            const playerSprite = currentPlayerActor.getComponent(Sprite);

            if (!playerSprite)
                throw Error(`Player sprite is undefined: ${playerSprite}}`);

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
        log.info(`Player collided with ${interactable.id}`);
        if (interactable) {
            player.interactableEventBus.publish(
                'focusChanged',
                interactable.id
            );
        }
    }
}
