import { defineFeature, loadFeature } from 'jest-cucumber';
import { Actor, Interactable } from '@src/entities';
import { Action, Actions } from '@src/systems';
import { GameScene } from '@src/scenes/gameScene';
import { gameConfig } from '@src/phaserGame';
import Phaser from 'phaser';
import GameConfig = Phaser.Types.Core.GameConfig;

const mockBenchSprite = {
    setTexture: jest
        .fn()
        .mockImplementation(function (
            this: Phaser.Physics.Arcade.Sprite,
            key: string
        ) {
            this.texture = { key };
        }),
    texture: {},
    scene: {},
    destroy: jest.fn()
} as unknown as Phaser.Physics.Arcade.Sprite;
jest.mock('@src/ui', () => ({
    HealthBar: jest.fn().mockImplementation(() => {
        return {
            setHealth: jest.fn(),
            updatePosition: jest.fn(),
            destroy: jest.fn()
        };
    })
}));

const feature = loadFeature('test/features/player-interaction.feature');
defineFeature(feature, (test) => {
    let player: Actor;
    let bench: Interactable;
    let scene: GameScene;
    let phaser: Phaser.Game;

    beforeAll(() => {
        phaser = new Phaser.Game(gameConfig as GameConfig);
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        scene = phaser.scene.start('GameScene');
        player = new Actor('player');
        bench = new Interactable('bench');
        mockBenchSprite.setTexture('bench');
        mockBenchSprite.scene = scene;
        bench.setSprite(mockBenchSprite);
    });

    test('A player attacking a bench', ({ given, when, then }) => {
        given('a player focused on a bench', () => {
            player.setFocus(bench);
        });
        when(/^the player attacks the bench (.*) times$/, (arg0: string) => {
            for (let i = 0; i < parseInt(arg0); i++) {
                Action.performAction(Actions.attack, player);
            }
        });
        then('the bench should have a healthBar', () => {
            expect(bench.healthBar).not.toBeNull();
        });
        then(/^the bench should have (.*) health left$/, (arg0: string) => {
            expect(bench.thing.health).toBe(parseInt(arg0));
        });
        then(/^the (.*) texture should show on the bench$/, (arg0: string) => {
            if (arg0 === 'undefined') {
                expect(bench.sprite?.texture.key).toBeUndefined();
            } else {
                expect(bench.sprite?.texture.key).toBe(arg0);
            }
        });
        then(/^the bench should be (.*) destroyed$/, (arg0) => {
            if (arg0 === 'not') {
                expect(bench.thing.health).toBeGreaterThan(0);
                expect(bench.sprite).not.toBeNull();
            } else {
                expect(bench.thing.health).toBe(0);
                expect(bench.sprite).toBeUndefined();
            }
        });
    });
});
