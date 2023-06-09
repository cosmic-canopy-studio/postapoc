import * as Phaser from 'phaser';
import {
  BLACK,
  BORDER_WIDTH,
  DRAG_START_POSITION,
  MARGIN_Y,
  OPAQUE,
  PADDING,
  SEMI_TRANSPARENT,
  TITLE_TEXT_CONFIG,
  WHITE,
} from '@src/entity/data/constants';
import { getLogger } from '@src/telemetry/systems/logger';

export abstract class DraggableScene extends Phaser.Scene {
  protected dragPosition = DRAG_START_POSITION;
  protected dragOffset = { x: 0, y: 0 };
  protected nextPosition = { ...DRAG_START_POSITION };
  protected logger = getLogger('entity');

  handleDrag(pointer: Phaser.Input.Pointer) {
    const newX = pointer.x - this.dragOffset.x;
    const newY = pointer.y - this.dragOffset.y;

    this.dragPosition.x = newX;
    this.dragPosition.y = newY;

    this.updateDisplay();
  }

  protected drawBackground(
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

  protected makeWindowDraggable(
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

  protected abstract updateDisplay(): void;

  protected createDisplay<T>(
    items: T[],
    displayTextFunc: (item: T) => string,
    itemDrawFunc: (item: T) => Phaser.GameObjects.Text | null,
    titleText: string
  ) {
    this.nextPosition = {
      x: this.dragPosition.x + PADDING,
      y: this.dragPosition.y + PADDING,
    };

    const title = this.add.text(
      this.nextPosition.x,
      this.nextPosition.y,
      titleText,
      TITLE_TEXT_CONFIG
    );

    let longestWidth = title.width;

    this.nextPosition.y += MARGIN_Y;
    const itemsText = [title];

    for (const item of items) {
      const itemText = itemDrawFunc(item);
      if (itemText) {
        itemsText.push(itemText);
        longestWidth = Math.max(longestWidth, itemText.width);
        this.nextPosition.y += MARGIN_Y;
      }
    }

    const width = longestWidth + 2 * PADDING;
    const height = this.nextPosition.y - this.dragPosition.y;

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

  protected clearDisplay() {
    try {
      this.nextPosition = { ...DRAG_START_POSITION };
      this.children.removeAll();
    } catch (error) {
      this.logger.error(`Error clearing display: ${error}`);
    }
  }
}
