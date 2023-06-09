import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/systems/eventBus';
import items from '@src/entity/data/items.json';
import { Actions } from '@src/action/data/enums';
import { Item, XYCoordinates } from '@src/entity/data/types';
import { DraggableScene } from './draggableScene';

const DRAG_START_POSITION = { x: 325, y: 150 };
const ITEM_TEXT_CONFIG = { color: 'aqua' };
const TITLE_TEXT_CONFIG = { color: 'white' };
const PADDING = 10;
const MARGIN_Y = 20;

export default class CraftingScene extends DraggableScene {
  private entityId!: number;
  private logger = getLogger('crafting');

  constructor() {
    super({ key: 'CraftScene' });
    this.dragPosition = { ...DRAG_START_POSITION };
  }

  init(data: { entityId: number }) {
    this.entityId = data.entityId;
  }

  create() {
    this.updateDisplay();
    EventBus.on('refreshCrafting', this.updateDisplay.bind(this));
  }

  protected updateDisplay() {
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
}
