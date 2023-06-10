import EventHandler from '@src/core/systems/eventHandler';
import PlayerManager from '@src/entity/systems/creatureManager';
import ObjectManager from '@src/entity/systems/objectManager';
import { getLogger } from '@src/telemetry/systems/logger';
import { PhaserTimeController } from '@src/time/systems/phaserTimeController';
import { TimeState, TimeSystem } from '@src/time/systems/timeSystem';
import { addEntity, createWorld, IWorld } from 'bitecs';
import * as Phaser from 'phaser';

export default class Universe {
  private logger;
  private creatureManager!: PlayerManager;
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
    this.logger.debug(`Creating ECS_NULL ${addEntity(this.world)}`);
  }

  initialize() {
    this.creatureManager = new PlayerManager(this.scene, this.world);
    this.creatureManager.initialize();

    this.objectManager = new ObjectManager(this.scene, this.world);
    this.objectManager.initialize();

    this.eventHandler = new EventHandler(
      this.creatureManager,
      this.objectManager,
      this.world
    );
    this.eventHandler.initialize(this.scene);

    this.timeSystem = new TimeSystem();
    this.timeController = new PhaserTimeController(this.scene);

    this.objectManager.generateTileset();
    this.objectManager.generateStaticObject(200, 200, 'tree');
    this.objectManager.generateStaticObject(400, 400, 'bench');
    this.objectManager.generateItem(600, 200, 'hammer');
    this.objectManager.generateItem(500, 300, 'rock');
    this.creatureManager.spawnPlayer(400, 300, 'player');

    this.logger.info('Universe created');
  }

  update(time: number, deltaTime: number) {
    const adjustedDeltaTime = this.timeSystem.getAdjustedDeltaTime(deltaTime);
    const timeState = this.timeSystem.getTimeState();
    if (timeState !== TimeState.PAUSED) {
      this.eventHandler.update();
      this.creatureManager.update();
      this.objectManager.update(adjustedDeltaTime);
    }
  }

  getTimeState() {
    return this.timeSystem.getTimeState();
  }
}
