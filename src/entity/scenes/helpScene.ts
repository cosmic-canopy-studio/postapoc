import { getLogger } from '@src/telemetry/systems/logger';
import { DraggableScene } from './draggableScene';
import controlMappingJson from '@src/core/config/controlMapping.json';
import { ControlMapping } from '@src/core/data/interfaces';

const DRAG_START_POSITION = { x: 0, y: 0 }; // You may adjust this
const TITLE_TEXT_CONFIG = { color: 'white' };
const ITEM_TEXT_CONFIG = { color: 'yellow' };
const PADDING = 10;
const MARGIN_Y = 20;

export default class HelpScene extends DraggableScene {
  private logger = getLogger('core');
  private controlMapping: ControlMapping;

  constructor() {
    super({ key: 'HelpScene' });
    this.dragPosition = { ...DRAG_START_POSITION };
    this.controlMapping = controlMappingJson as ControlMapping;
  }

  create() {
    this.updateDisplay();
  }

  protected updateDisplay() {
    this.logger.debugVerbose(`Updating help display`);
    this.clearDisplay();

    const itemsText = [];

    const nextPosition = {
      x: this.dragPosition.x + PADDING,
      y: this.dragPosition.y + PADDING,
    };
    const title = this.add.text(
      nextPosition.x,
      nextPosition.y,
      'Key Bindings:',
      TITLE_TEXT_CONFIG
    );
    let longestWidth = title.width;

    nextPosition.y += MARGIN_Y;
    itemsText.push(title);

    for (const actionGroup in this.controlMapping) {
      for (const key in this.controlMapping[actionGroup]) {
        const itemText = this.add.text(
          nextPosition.x,
          nextPosition.y,
          `  ${key} : ${this.controlMapping[actionGroup][key]}`,
          ITEM_TEXT_CONFIG
        );
        itemsText.push(itemText);
        longestWidth = Math.max(longestWidth, itemText.width);
        nextPosition.y += MARGIN_Y;
      }
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
}
