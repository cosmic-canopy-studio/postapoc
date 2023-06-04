import Phaser from 'phaser';
import { getInventory } from '@src/entity/components/inventory';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import EventBus from '@src/core/systems/eventBus';
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

    const startY = 10;
    const startX = 10;
    const marginY = 20;
    const padding = 10;
    const nextX = startX + padding;
    let nextY = startY + padding;

    const title = this.add.text(
      nextX,
      nextY,
      `${getEntityNameWithID(this.entityId)}'s inventory:`,
      { color: '#ffffff' }
    );
    let longestWidth = title.width;

    nextY += marginY;
    const itemsText = [];
    itemsText.push(title);
    for (const element of this.inventory) {
      if (element !== 0) {
        const itemText = this.add.text(
          nextX,
          nextY,
          `  -${getEntityNameWithID(element)}`,
          {
            color: '#ffffff',
          }
        );
        itemsText.push(itemText);
        longestWidth = Math.max(longestWidth, itemText.width);
        nextY += marginY;
      }
    }

    const height = nextY;
    this.drawBackground(
      startX,
      startY,
      longestWidth + 2 * padding,
      height,
      itemsText
    );
  }

  drawBackground(
    x: number,
    y: number,
    width: number,
    height: number,
    itemsText: Phaser.GameObjects.Text[]
  ) {
    const graphics = this.add.graphics();

    // Semi-transparent black rectangle
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillRect(x, y, width, height);

    // White border
    graphics.lineStyle(2, 0xffffff, 1);
    graphics.strokeRect(x, y, width, height);

    // Make sure text appears above the rectangle
    itemsText.forEach((item) => this.children.bringToTop(item));
  }

  clearInventoryDisplay() {
    this.children.removeAll();
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
