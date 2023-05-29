import PlayerManager from '@src/entity/playerManager';
import ObjectManager from '@src/entity/objectManager';
import { MovementHandler } from '@src/movement/movementHandler';
import { ActionHandler } from '@src/action/systems/actionHandler';
import { EntityHandler } from '@src/entity/entityHandler';
import { getLogger } from '@src/telemetry/logger';
import { IWorld } from 'bitecs';
import { IHandler, IUpdatableHandler } from '@src/config/interfaces';
import * as Phaser from 'phaser';

export default class EventHandler {
  private logger;
  private readonly playerManager: PlayerManager;
  private readonly objectManager: ObjectManager;
  private world: IWorld;
  private nonUpdateHandlers: IHandler[];
  private updateHandlers: IUpdatableHandler[];

  constructor(
    playerManager: PlayerManager,
    objectManager: ObjectManager,
    world: IWorld
  ) {
    this.logger = getLogger('core');
    this.playerManager = playerManager;
    this.objectManager = objectManager;
    this.world = world;
    this.nonUpdateHandlers = [];
    this.updateHandlers = [];
  }

  initialize(scene: Phaser.Scene) {
    this.addNonUpdateHandler(new MovementHandler());
    this.addNonUpdateHandler(new ActionHandler());
    this.addUpdateHandler(
      new EntityHandler(scene, this.playerManager, this.objectManager)
    );
    this.initializeHandlers();
  }

  addNonUpdateHandler(handler: IHandler): void {
    this.nonUpdateHandlers.push(handler);
  }

  addUpdateHandler(handler: IUpdatableHandler): void {
    this.updateHandlers.push(handler);
  }

  initializeHandlers(): void {
    this.nonUpdateHandlers.forEach((handler) => handler.initialize());
    this.updateHandlers.forEach((handler) => handler.initialize());
  }

  update() {
    this.updateHandlers.forEach((handler) => handler.update());
  }
}
