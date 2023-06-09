import Phaser from 'phaser';

const DRAG_START_POSITION = { x: 325, y: 150 };
const SEMI_TRANSPARENT = 0.5;
const OPAQUE = 1;
const BLACK = 0x000000;
const WHITE = 0xffffff;
const BORDER_WIDTH = 2;

export abstract class DraggableScene extends Phaser.Scene {
  protected dragPosition = DRAG_START_POSITION;
  protected dragOffset = { x: 0, y: 0 };

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

  protected clearDisplay() {
    this.children.removeAll();
  }
}
