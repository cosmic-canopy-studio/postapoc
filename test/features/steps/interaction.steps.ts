import { defineFeature, loadFeature } from 'jest-cucumber';
import { Actor, Interactable } from '@src/entities';
import { EventBus } from '@src/systems';
import { Health, HealthBarComponent } from '@src/components';

const feature = loadFeature('test/features/player-interaction.feature');
defineFeature(feature, (test) => {
    let player: Actor;
    let bench: Interactable;

    beforeEach(async () => {
        const universeEventBus = new EventBus();
        player = new Actor('player', universeEventBus);
        bench = new Interactable('bench', universeEventBus);
    });

    test('A player attacking a bench', ({ given, when, then }) => {
        given('a player focused on a bench', () => {
            player.interactableEventBus.publish('focusChanged', 'bench');
        });
        when(/^the player attacks the bench (.*) times$/, (arg0: string) => {
            for (let i = 0; i < parseInt(arg0); i++) {
                player.universeEventBus.publish('attackRequested', player.id);
            }
        });
        then('the bench should have a healthBar', () => {
            const healthBar = bench.getComponent(HealthBarComponent);
            expect(healthBar).not.toBeNull();
        });
        then(/^the bench should have (\d+) health left$/, (amount) => {
            const num = parseInt(amount);
            const health = bench.getComponent(Health);
            if (num > 0) {
                expect(health?.amount).toBe(num);
            } else {
                expect(health).toBeUndefined();
            }
        });
        then(/^the bench should be (.*)$/, (arg0) => {
            const health = bench.getComponent(Health);
            if (arg0 === 'destroyed') {
                expect(health).toBeUndefined();
            } else if (arg0 === 'broken') {
                // Add broken check
            } else if (arg0 === 'not destroyed') {
                expect(health).toBeDefined();
            }
        });
    });
});
