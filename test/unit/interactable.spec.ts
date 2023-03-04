import { Interactable } from '../../src/entities';
import { Action } from '../../src/systems';
import { log } from '../../src/utilities';

jest.deepUnmock('../../src/entities/interactable');
jest.deepUnmock('../../src/systems/action');
jest.deepUnmock('../../src/utilities/logging');

let bench: Interactable;

describe('An interactable', () => {
    beforeEach(() => {
        bench = new Interactable('bench');
    });

    it('should lose 1 health when taking damage with no amount is specified', () => {
        Action.takeDamage(bench);
        expect(bench.health).toBe(2);
    });

    it('should lose 2 health when taking 2 damage', () => {
        Action.takeDamage(bench, 2);
        expect(bench.thing.health).toBe(1);
    });

    it('should log ready for destruction when out of health', () => {
        const logSpy = jest.spyOn(log, 'info');
        Action.takeDamage(bench, 3);
        bench.update();
        expect(logSpy).toHaveBeenCalledWith(
            'bench took 3 damage, health is now 0'
        );
        expect(logSpy).toHaveBeenCalledWith('bench has died.');
    });
});
