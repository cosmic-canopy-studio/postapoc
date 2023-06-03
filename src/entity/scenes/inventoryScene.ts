import Phaser from 'phaser';
import { getInventory } from '@src/entity/components/inventory';
import { getEntityNameWithID } from '@src/entity/components/names';
import EventBus from '@src/core/eventBus';
import { getLogger } from '@src/telemetry/systems/logger';

export default class InventoryScene extends Phaser.Scene {
  private inventory: number[] = [];
  private entityId!: number;
  private visible = true;
  private logger = getLogger('entity');
  constructor() {
    super({ key: 'InventoryScene' });
  }

  init(data: { entityId: number }) {
    this.entityId = data.entityId;
  }

  create() {
    this.inventory = getInventory(this.entityId);
    this.updateInventoryDisplay();
    EventBus.on('itemPickedUp', this.updateInventoryDisplay.bind(this));
  }

  updateInventoryDisplay() {
    this.logger.debugVerbose(
      `Updating inventory display for ${getEntityNameWithID(this.entityId)}`
    );
    this.inventory = getInventory(this.entityId);
    this.clearInventoryDisplay();
    let startY = 10;
    const marginY = 20;
    this.add.text(
      10,
      startY,
      `${getEntityNameWithID(this.entityId)}'s inventory:`,
      { color: '#ffffff' }
    );
    startY += marginY;

    for (const element of this.inventory) {
      if (element !== 0) {
        this.add.text(10, startY, `  -${getEntityNameWithID(element)}`, {
          color: '#ffffff',
        });
        startY += marginY;
      }
    }
  }

  clearInventoryDisplay() {
    this.children.removeAll();
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
