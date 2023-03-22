import EventBus from '@src/events/EventBus';

describe('Event Bus', () => {
  it('emits and listens to events', (done) => {
    const testData = { key: 'value' };
    EventBus.on('test-event', (eventData) => {
      expect(eventData).toEqual(testData);
      done();
    });
    EventBus.emit('test-event', testData);
  });
});
