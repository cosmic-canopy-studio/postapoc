import { getLogger } from '@src/telemetry/logger';
import PlayerManager from '@src/managers/playerManager';
import ObjectManager from '@src/managers/objectManager';
import EventHandler from '@src/coreSystems/eventHandler';
import { TimeState, TimeSystem } from '@src/coreSystems/timeSystem';
import { PhaserTimeController } from '@src/coreSystems/phaserTimeController';
import { createWorld, IWorld } from 'bitecs';

export default class Universe {
  private logger;
  private playerManager!: PlayerManager;
  private objectManager!: ObjectManager;
  private eventHandler!: EventHandler;
  private timeSystem!: TimeSystem;
  private timeController!: PhaserTimeController;
  private world: IWorld;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.logger = getLogger('universe');
    this.world = createWorld();
  }

  initialize() {
    this.playerManager = new PlayerManager(this.scene, this.world);
    this.playerManager.initialize();

    this.objectManager = new ObjectManager(this.scene, this.world);
    this.objectManager.initialize();

    this.eventHandler = new EventHandler(
      this.playerManager,
      this.objectManager,
      this.world
    );
    this.eventHandler.initialize(this.scene);

    this.timeSystem = new TimeSystem();
    this.timeController = new PhaserTimeController(this.scene);

    this.objectManager.generateTileset();
    this.objectManager.generateStaticObject(200, 200, 'tree');
    this.objectManager.generateStaticObject(400, 400, 'bench');
    this.playerManager.spawnPlayer();

    this.logger.info('Universe created');
  }

  update(time: number, deltaTime: number) {
    const adjustedDeltaTime = this.timeSystem.getAdjustedDeltaTime(deltaTime);
    const timeState = this.timeSystem.getTimeState();
    if (timeState !== TimeState.PAUSED) {
      this.eventHandler.update();
      this.playerManager.update();
      this.objectManager.update(adjustedDeltaTime);
    }
  }

  getTimeState() {
    return this.timeSystem.getTimeState();
  }
}
