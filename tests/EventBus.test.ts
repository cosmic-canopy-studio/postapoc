import EventBus from '@src/core/EventBus';

describe('Event Bus', () => {
  it('emits and listens to events', (done) => {
    const testData = 'testData';
    EventBus.on('testEvent', (eventData) => {
      expect(eventData).toEqual(testData);
      done();
    });
    EventBus.emit('testEvent', testData);
  });
});
