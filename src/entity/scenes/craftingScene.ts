import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/systems/eventBus';
import items from '@src/entity/data/items.json';
import { Actions } from '@src/action/data/enums';
import { Item, XYCoordinates } from '@src/entity/data/types';

const DRAG_START_POSITION = { x: 325, y: 150 };
const ITEM_TEXT_CONFIG = { color: 'aqua' };
const TITLE_TEXT_CONFIG = { color: 'white' };
const PADDING = 10;
const MARGIN_Y = 20;
const SEMI_TRANSPARENT = 0.5;
const OPAQUE = 1;
const BLACK = 0x000000;
const WHITE = 0xffffff;
const BORDER_WIDTH = 2;

export default class CraftingScene extends Phaser.Scene {
  private entityId!: number;
  private logger = getLogger('crafting');

  private dragPosition = { ...DRAG_START_POSITION };
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

  private clearDisplay() {
    this.children.removeAll();
  }

  private getCraftableItems() {
    return items.filter((item) => item.recipe !== undefined) as Item[];
  }

  private drawItemText(item: Item, position: XYCoordinates) {
    const itemText = this.add.text(
      position.x,
      position.y,
      `  ${item.name}`,
      ITEM_TEXT_CONFIG
    );
    itemText.setDepth(1);
    itemText.setInteractive({ useHandCursor: true });

    itemText.on('pointerdown', () => {
      EventBus.emit('action', {
        action: 'craft' as Actions,
        entity: this.entityId,
        options: { recipe: item.id },
      });
    });

    return itemText;
  }

  private updateCraftableItemsDisplay() {
    this.logger.debugVerbose(`Updating crafting display`);
    this.clearDisplay();

    const craftableItems = this.getCraftableItems();

    const nextPosition: XYCoordinates = {
      x: this.dragPosition.x + PADDING,
      y: this.dragPosition.y + PADDING,
    };
    const title = this.add.text(
      nextPosition.x,
      nextPosition.y,
      `Craftable Items:`,
      TITLE_TEXT_CONFIG
    );
    let longestWidth = title.width;

    nextPosition.y += MARGIN_Y;
    const itemsText = [title];

    for (const item of craftableItems) {
      const itemText = this.drawItemText(item, nextPosition);
      itemsText.push(itemText);
      longestWidth = Math.max(longestWidth, itemText.width);
      nextPosition.y += MARGIN_Y;
    }

    const width = longestWidth + 2 * PADDING;
    const height = nextPosition.y - this.dragPosition.y;
    this.drawBackground(
      this.dragPosition.x,
      this.dragPosition.y,
      width,
      height,
      itemsText
    );
    this.makeWindowDraggable(
      this.dragPosition.x,
      this.dragPosition.y,
      width,
      height
    );
  }

  private drawBackground(
    x: number,
    y: number,
    width: number,
    height: number,
    itemsText: Phaser.GameObjects.Text[]
  ) {
    const graphics = this.add.graphics();

    // Semi-transparent black rectangle
    graphics.fillStyle(BLACK, SEMI_TRANSPARENT);
    graphics.fillRect(x, y, width, height);

    // White border
    graphics.lineStyle(BORDER_WIDTH, WHITE, OPAQUE);
    graphics.strokeRect(x, y, width, height);

    // Make sure text appears above the rectangle
    itemsText.forEach((item) => this.children.bringToTop(item));
  }

  private makeWindowDraggable(
    startX: number,
    startY: number,
    width: number,
    height: number
  ) {
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

    this.dragPosition.x = newX;
    this.dragPosition.y = newY;

    this.updateCraftableItemsDisplay();
  }
}
