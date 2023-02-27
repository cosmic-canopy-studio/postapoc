import { defineFeature, loadFeature } from 'jest-cucumber';
import { Actor, Interactable } from '../../../src/entities';
import { Action, Actions } from '../../../src/systems';

const feature = loadFeature('test/features/player-interaction.feature');

defineFeature(feature, (test) => {
  let player: Actor;
  let bench: Interactable;

  beforeEach(() => {
    player = new Actor('player');
    bench = new Interactable('bench');
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
    then(/^the bench should have (.*) health left$/, (arg0: string) => {
      expect(bench.thing.health).toBe(parseInt(arg0));
    });
  });
});
