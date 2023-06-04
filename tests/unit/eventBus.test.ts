import EventBus from '@src/core/systems/eventBus';

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
