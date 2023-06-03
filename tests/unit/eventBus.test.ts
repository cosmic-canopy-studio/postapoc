import EventBus from '@src/core/eventBus';

describe('Event Bus', () => {
  it('emits and listens to events', (done) => {
    const state = true;
    EventBus.on('testEvent', (eventData) => {
      expect(eventData.state).toEqual(state);
      done();
    });
    EventBus.emit('testEvent', { state });
  });
});
