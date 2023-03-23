// Start of file: timeController.test.ts
import { TimeController } from '@src/phaser/systems/timeController';

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

  it('correctly updates the time scale in Phaser', () => {
    timeController.setTimeScale(0);
    expect(mockScene.time.timeScale).toEqual(0);

    timeController.setTimeScale(0.5);
    expect(mockScene.time.timeScale).toEqual(0.5);

    timeController.setTimeScale(2);
    expect(mockScene.time.timeScale).toEqual(2);

    timeController.setTimeScale(1);
    expect(mockScene.time.timeScale).toEqual(1);
  });
});
// End of file: timeController.test.ts
