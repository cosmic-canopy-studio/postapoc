import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/systems/eventBus';
import items from '@src/entity/data/items.json';
import { Actions } from '@src/action/data/enums';

export default class CraftScene extends Phaser.Scene {
  private entityId!: number;
  private logger = getLogger('crafting');

  private dragStart = { x: 325, y: 150 };
  private dragOffset = { x: 0, y: 0 };

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

    const startX = this.dragStart.x;
    const startY = this.dragStart.y;
    const marginY = 20;
    const padding = 10;
    const nextX = startX + padding;
    let nextY = startY + padding;

    const title = this.add.text(nextX, nextY, `Craftable Items:`, {
      color: 'white',
    });
    let longestWidth = title.width;

    nextY += marginY;
    const itemsText = [];
    itemsText.push(title);

    for (const item of craftableItems) {
      const itemText = this.add.text(nextX, nextY, `  ${item.name}`, {
        color: 'aqua',
      });

      itemText.setDepth(1);
      itemText.setInteractive({ useHandCursor: true });

      itemText.on('pointerdown', () => {
        EventBus.emit('action', {
          action: 'craft' as Actions,
          entity: this.entityId,
          options: { recipe: item.id },
        });
      });

      itemsText.push(itemText);
      longestWidth = Math.max(longestWidth, itemText.width);
      nextY += marginY;
    }

    const width = longestWidth + 2 * padding;
    const height = nextY - startY;
    this.drawBackground(startX, startY, width, height, itemsText);

    // Making the window draggable
    const draggableArea = this.add
      .zone(startX, startY, width, height)
      .setOrigin(0);
    draggableArea.setInteractive();

    draggableArea.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.dragOffset.x = pointer.x - startX;
      this.dragOffset.y = pointer.y - startY;
      this.input.on('pointermove', this.handleDrag, this);
    });

    this.input.on('pointerup', () => {
      this.input.off('pointermove', this.handleDrag, this);
    });
  }

  handleDrag(pointer: Phaser.Input.Pointer) {
    const newX = pointer.x - this.dragOffset.x;
    const newY = pointer.y - this.dragOffset.y;

    this.dragStart.x = newX;
    this.dragStart.y = newY;

    this.updateCraftableItemsDisplay();
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
