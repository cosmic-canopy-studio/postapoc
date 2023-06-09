import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/systems/eventBus';
import items from '@src/entity/data/items.json';
import { craftSimpleItem } from '@src/action/systems/craftSystem';
import { Actions } from '@src/action/data/enums';

export default class CraftScene extends Phaser.Scene {
  private entityId!: number;
  private logger = getLogger('crafting');

  constructor() {
    super({ key: 'CraftScene' });
  }

  init(data: { entityId: number }) {
    this.entityId = data.entityId;
  }

  create() {
    this.updateCraftableItemsDisplay();
    EventBus.on('refreshCrafting', this.updateCraftableItemsDisplay.bind(this));
  }

  updateCraftableItemsDisplay() {
    this.logger.debugVerbose(`Updating crafting display`);
    this.clearCraftingDisplay();

    const craftableItems = items.filter((item) => item.recipe !== undefined);

    const startY = 10;
    const startX = 10;
    const marginY = 20;
    const padding = 10;
    const nextX = startX + padding;
    let nextY = startY + padding;

    const title = this.add.text(nextX, nextY, `Craftable Items:`, {
      color: '#ffffff',
    });
    let longestWidth = title.width;

    nextY += marginY;
    const itemsText = [];
    itemsText.push(title);
    for (const item of craftableItems) {
      const itemText = this.add.text(nextX, nextY, `  ${item.name}`, {
        color: '#ffffff',
      });

      itemText.setInteractive({ useHandCursor: true });

      itemText.on('pointerdown', () => {
        EventBus.emit('action', {
          action: 'craft' as Actions,
          entity: this.entityId,
          options: { recipe: item.id },
        });
        const result = craftSimpleItem(this.entityId, item.id);
        if (result) {
          this.logger.info(`${result.itemName} crafted!`);
        }
      });

      itemsText.push(itemText);
      longestWidth = Math.max(longestWidth, itemText.width);
      nextY += marginY;
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

  clearCraftingDisplay() {
    this.children.removeAll();
  }
}
