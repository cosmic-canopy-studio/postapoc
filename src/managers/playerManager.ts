import PlayerFactory from '@src/factories/playerFactory';
import { getLogger } from '@src/telemetry/logger';
import DebugPanel from '@src/telemetry/debugPanel';
import ControlSystem from '@src/coreSystems/controlSystem';
import { IWorld } from 'bitecs';
import { healthSystem } from '@src/componentSystems/healthSystem';

export default class PlayerManager {
  private logger;
  private playerFactory!: PlayerFactory;
  private readonly world: IWorld;
  private player!: number;
  private debugPanel!: DebugPanel;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('universe');
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
