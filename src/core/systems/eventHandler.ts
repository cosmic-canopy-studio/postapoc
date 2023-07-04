import ActionHandler from '@src/action/systems/actionHandler';

import { IHandler } from '@src/core/data/types';
import EntityHandler from '@src/entity/systems/entityHandler';
import EntityManager from '@src/entity/systems/entityManager';
import UIHandler from '@src/entity/systems/uiHandler';
import MovementHandler from '@src/movement/systems/movementHandler';
import { getLogger } from '@src/telemetry/systems/logger';
import { IWorld } from 'bitecs';
import * as Phaser from 'phaser';

export default class EventHandler {
  private logger;
  private readonly world: IWorld;
  private handlers: IHandler[];

  constructor(world: IWorld) {
    this.logger = getLogger('core');
    this.world = world;
    this.handlers = [];
  }

  initialize(scene: Phaser.Scene, entityManager: EntityManager) {
    this.addHandler(new MovementHandler());
    this.addHandler(new ActionHandler());
    this.addHandler(new EntityHandler(scene, this.world, entityManager));
    this.addHandler(new UIHandler(scene));
    this.initializeHandlers();
  }

  addHandler(handler: IHandler): void {
    this.handlers.push(handler);
  }

  initializeHandlers(): void {
    this.handlers.forEach((handler) => handler.initialize());
  }
}
