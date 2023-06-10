import ControlSystem from '@src/core/systems/controlSystem';
import EntityCreator from '@src/entity/factories/entityFactory';
import { healthSystem } from '@src/entity/systems/healthSystem';
import DebugPanel from '@src/telemetry/systems/debugPanel';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';

export default class CreatureManager {
  private logger;
  private creatureFactory!: EntityCreator;
  private readonly world: IWorld;
  private player!: number;
  private debugPanel!: DebugPanel;

  constructor(private scene: Phaser.Scene, world: IWorld) {
    this.logger = getLogger('entity');
    this.world = world;
  }

  initialize() {
    this.creatureFactory = new EntityCreator(this.scene, this.world);
    this.logger.debug('CreatureManager initialized');
  }

  update() {
    healthSystem(this.world);
  }

  spawnPlayer(x: number, y: number, playerId: string) {
    this.player = this.creatureFactory.createEntity('creature', x, y, playerId);
    const controlSystem = new ControlSystem();
    controlSystem.initialize(this.scene, this.player);
    this.debugPanel = new DebugPanel(this.world, this.player);
  }

  getPlayer() {
    return this.player;
  }
}
