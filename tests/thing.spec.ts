import Thing from '../src/components/thing';
import { Logger } from 'tslog';

jest.deepUnmock('../src/components/thing');

let thing: Thing;
describe('A thing', () => {
  beforeEach(() => {
    thing = new Thing('thing');
  });

  it('should lose 1 health when taking damage with no amount is specified', () => {
    thing.takeDamage();
    expect(thing.health).toBe(2);
  });

  it('should lose 1 health when taking 2 damage', () => {
    thing.takeDamage(2);
    expect(thing.health).toBe(1);
  });

  it('should log ready for destruction when out of health', () => {
    Logger;
    const logSpy = jest.spyOn(console, 'log');
    thing.takeDamage(3);
    expect(logSpy).toHaveBeenCalledTimes(1);
    /* expect(logSpy).toHaveBeenCalledWith(
      thing.id + ' out of health, ready for destruction'
    ); */
  });
});
