import { getInventory } from '@src/entity/components/inventory';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import EventBus from '@src/core/systems/eventBus';
import { getLogger } from '@src/telemetry/systems/logger';
import { DraggableScene } from './draggableScene';

const DRAG_START_POSITION = { x: 10, y: 10 };
const ITEM_TEXT_CONFIG = { color: 'white' };
const TITLE_TEXT_CONFIG = { color: 'white' };
const PADDING = 10;
const MARGIN_Y = 20;

export default class InventoryScene extends DraggableScene {
  private inventory: number[] = [];
  private entityId!: number;
  private logger = getLogger('entity');

  constructor() {
    super({ key: 'InventoryScene' });
    this.dragPosition = { ...DRAG_START_POSITION };
  }

  init(data: { entityId: number }) {
    this.entityId = data.entityId;
  }

  create() {
    this.updateDisplay();
    EventBus.on('refreshInventory', this.updateDisplay.bind(this));
  }

  protected updateDisplay() {
    this.logger.debugVerbose(
      `Updating inventory display for ${getEntityNameWithID(this.entityId)}`
    );
    this.inventory = getInventory(this.entityId);
    this.clearDisplay();

    const nextPosition = {
      x: this.dragPosition.x + PADDING,
      y: this.dragPosition.y + PADDING,
    };
    const title = this.add.text(
      nextPosition.x,
      nextPosition.y,
      `${getEntityNameWithID(this.entityId)}'s inventory:`,
      TITLE_TEXT_CONFIG
    );
    let longestWidth = title.width;

    nextPosition.y += MARGIN_Y;
    const itemsText = [title];

    for (const element of this.inventory) {
      if (element !== 0) {
        const itemText = this.add.text(
          nextPosition.x,
          nextPosition.y,
          `  -${getEntityNameWithID(element)}`,
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
