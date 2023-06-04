import Phaser from 'phaser';
import { getLogger } from '@src/telemetry/systems/logger';

import controlMappingJson from '@src/core/config/controlMapping.json';
import { ControlMapping } from '@src/core/config/interfaces';

export default class HelpScene extends Phaser.Scene {
  private logger = getLogger('core');
  private visible = true;

  constructor() {
    super({ key: 'HelpScene' });
  }

  create() {
    this.updateHelpDisplay();
  }

  updateHelpDisplay() {
    this.logger.debugVerbose(`Updating help display`);
    this.clearHelpDisplay();
    const controlMapping: ControlMapping = controlMappingJson as ControlMapping;

    const marginY = 20;
    const padding = 10;

    const itemsText = [];

    const title = this.add.text(0, 0, 'Key Bindings:', {
      color: '#ffffff',
    });
    let longestWidth = title.width;

    let nextY = marginY;
    itemsText.push(title);

    for (const actionGroup in controlMapping) {
      for (const key in controlMapping[actionGroup]) {
        const itemText = this.add.text(
          0,
          nextY,
          `  ${key} : ${controlMapping[actionGroup][key]}`,
          {
            color: '#ffffff',
          }
        );
        itemsText.push(itemText);
        longestWidth = Math.max(longestWidth, itemText.width);
        nextY += marginY;
      }
    }

    const totalWidth = longestWidth + 2 * padding;
    const totalHeight = nextY + marginY;
    const startX = (this.cameras.main.width - totalWidth) / 2;
    const startY = (this.cameras.main.height - totalHeight) / 2;

    // Position the itemsText
    itemsText.forEach((item) => {
      item.x += startX + padding;
      item.y += startY + padding;
    });

    this.drawBackground(startX, startY, totalWidth, totalHeight, itemsText);
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

  clearHelpDisplay() {
    this.children.removeAll();
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}
