import { getLogger } from '@src/telemetry/systems/logger';
import PlayerManager from '@src/entity/systems/playerManager';
import ObjectManager from '@src/entity/systems/objectManager';
import EventHandler from '@src/core/systems/eventHandler';
import { TimeState, TimeSystem } from '@src/time/systems/timeSystem';
import { PhaserTimeController } from '@src/time/systems/phaserTimeController';
import { createWorld, IWorld } from 'bitecs';
import * as Phaser from 'phaser';

export default class Universe {
  private logger;
  private playerManager!: PlayerManager;
  private objectManager!: ObjectManager;
  private eventHandler!: EventHandler;
  private timeSystem!: TimeSystem;
  private timeController!: PhaserTimeController;
  private readonly world: IWorld;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.logger = getLogger('core');
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
