// Start of file: timeController.test.ts
import { TimeController } from '@src/ecs/systems/timeController';

describe('Time Controller', () => {
  const mockScene = {
    time: {
      timeScale: 1,
    },
  };

  const timeController = new TimeController(mockScene as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('correctly updates the time scale to 0 in Phaser', () => {
    timeController.setTimeScale(0);
    const timeScale = mockScene.time.timeScale;
    expect(timeScale).toEqual(0);
  });

  it('correctly updates the time scale to 0.5 in Phaser', () => {
    timeController.setTimeScale(0.5);
    expect(mockScene.time.timeScale).toEqual(0.5);
  });

  it('correctly updates the time scale to 2 in Phaser', () => {
    timeController.setTimeScale(2);
    expect(mockScene.time.timeScale).toEqual(2);
  });

  it('correctly updates the time scale to 1 after being set to 0 in Phaser', () => {
    timeController.setTimeScale(0);
    expect(mockScene.time.timeScale).toEqual(0);

    timeController.setTimeScale(1);
    expect(mockScene.time.timeScale).toEqual(1);
  });
});
// End of file: timeController.test.ts
