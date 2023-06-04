import PlayerFactory from '@src/entity/systems/playerFactory';
import { getLogger } from '@src/telemetry/systems/logger';
import DebugPanel from '@src/telemetry/systems/debugPanel';
import ControlSystem from '@src/core/systems/controlSystem';
import { IWorld } from 'bitecs';
import { healthSystem } from '@src/entity/systems/healthSystem';

export default class PlayerManager {
  private logger;
  private playerFactory!: PlayerFactory;
  private readonly world: IWorld;
  private player!: number;
  private debugPanel!: DebugPanel;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
  }

  initialize() {
    this.playerFactory = new PlayerFactory(this.scene, this.world);
    this.logger.debug('PlayerManager initialized');
  }

  spawnPlayer() {
    this.player = this.playerFactory.createPlayer();
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    this.debugPanel = new DebugPanel(this.world, this.player);
  }

  update() {
    healthSystem(this.world);
  }

  getPlayer() {
    return this.player;
  }
}
