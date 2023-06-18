import EventHandler from '@src/core/systems/eventHandler';
import EntityManager from '@src/entity/systems/entityManager';
import { getLogger } from '@src/telemetry/systems/logger';
import { PhaserTimeController } from '@src/time/systems/phaserTimeController';
import { TimeState, TimeSystem } from '@src/time/systems/timeSystem';
import { addEntity, createWorld, IWorld } from 'bitecs';
import * as Phaser from 'phaser';

export default class Universe {
  private logger;
  private entityManager!: EntityManager;
  private eventHandler!: EventHandler;
  private timeSystem!: TimeSystem;
  private timeController!: PhaserTimeController;
  private readonly world: IWorld;
  private readonly scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.logger = getLogger('core');
    this.world = createWorld();
    this.logger.debug(`Creating ECS_NULL ${addEntity(this.world)}`);
  }

  initialize() {
    this.entityManager = new EntityManager(this.scene, this.world);
    this.entityManager.initialize();

    this.eventHandler = new EventHandler(this.world);
    this.eventHandler.initialize(this.scene, this.entityManager);

    this.timeSystem = new TimeSystem();
    this.timeController = new PhaserTimeController(this.scene);

    this.entityManager.spawnOvermap();
    this.entityManager.spawnPlayer(400, 300, 'player');

    this.logger.info('Universe created');
  }

  update(time: number, deltaTime: number) {
    const adjustedDeltaTime = this.timeSystem.getAdjustedDeltaTime(deltaTime);
    const timeState = this.timeSystem.getTimeState();
    if (timeState !== TimeState.PAUSED) {
      this.entityManager.update(adjustedDeltaTime);
    }
  }

  getTimeState() {
    return this.timeSystem.getTimeState();
  }
}
