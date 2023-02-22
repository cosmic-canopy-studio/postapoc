import Noun from '../src/components/noun';
import { Logger } from 'tslog';

jest.deepUnmock('../src/components/noun');

let noun: Noun;
describe('A noun', () => {
  beforeEach(() => {
    noun = new Noun('noun');
  });

  it('should lose 1 health when taking damage with no amount is specified', () => {
    noun.takeDamage();
    expect(noun.health).toBe(2);
  });

  it('should lose 1 health when taking 2 damage', () => {
    noun.takeDamage(2);
    expect(noun.health).toBe(1);
  });

  it('should log ready for destruction when out of health', () => {
    Logger;
    const logSpy = jest.spyOn(console, 'log');
    noun.takeDamage(3);
    expect(logSpy).toHaveBeenCalledTimes(1);
    /* expect(logSpy).toHaveBeenCalledWith(
      noun.id + ' out of health, ready for destruction'
    ); */
  });
});
