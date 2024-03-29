import { getLogger } from '@src/telemetry/systems/logger';
import EventBus from '@src/core/systems/eventBus';
import items from '@src/entity/data/items.json';
import { Actions } from '@src/action/data/enums';
import { CraftableItem } from '@src/entity/data/types';
import { EntityActions } from '@src/entity/data/enums';
import {
  ITEM_TEXT_CONFIG,
  MID_LEFT_DRAG_START_POSITION,
  UN_CRAFTABLE_ITEM_TEXT_CONFIG,
} from '@src/entity/data/constants';
import { DraggableScene } from '@src/entity/scenes/draggableScene';
import { checkForMissingItems } from '@src/action/systems/craftSystem';

export default class CraftingScene extends DraggableScene {
  protected logger = getLogger('entity');
  private entityId!: number;

  constructor() {
    super({ key: 'CraftScene' });
    this.dragPosition = { ...MID_LEFT_DRAG_START_POSITION };
  }

  init(data: { entityId: number }) {
    try {
      this.entityId = data.entityId;
    } catch (error) {
      this.logger.error(`Error during initialization: ${error}`);
    }
  }

  create() {
    try {
      this.updateDisplay();
      EventBus.on(
        EntityActions.REFRESH_INVENTORY,
        this.updateDisplay.bind(this)
      );
    } catch (error) {
      this.logger.error(`Error during creation: ${error}`);
    }
  }

  shutdown() {
    EventBus.off(
      EntityActions.REFRESH_INVENTORY,
      this.updateDisplay.bind(this)
    );
  }

  protected updateDisplay() {
    try {
      this.logger.debugVerbose(`Updating crafting display`);
      this.clearDisplay();

      const craftableItems = this.getCraftableItems();
      this.createDisplay(
        craftableItems,
        (item) => `  ${item.name}`,
        (item) => this.drawItemText(item),
        'Craftable Recipes:'
      );
    } catch (error) {
      this.logger.error(`Error during display update: ${error}`);
    }
  }

  private getCraftableItems() {
    try {
      return items.filter(
        (item) => item.recipe !== undefined
      ) as CraftableItem[];
    } catch (error) {
      this.logger.error(`Error getting craftable items: ${error}`);
      return [];
    }
  }

  private drawItemText(item: CraftableItem) {
    try {
      const missingIngredients = checkForMissingItems(
        this.entityId,
        item.recipe
      );
      const itemTextConfig =
        missingIngredients.length > 0
          ? UN_CRAFTABLE_ITEM_TEXT_CONFIG
          : ITEM_TEXT_CONFIG;

      const itemText = this.add.text(
        this.nextPosition.x,
        this.nextPosition.y,
        `  ${item.name}`,
        itemTextConfig
      );

      itemText.setDepth(1);
      itemText.setInteractive({ useHandCursor: true });

      itemText.on('pointerdown', () => {
        if (missingIngredients.length === 0) {
          EventBus.emit('action', {
            action: Actions.CRAFT,
            entity: this.entityId,
            options: { recipe: item.id },
          });
        }
      });

      return itemText;
    } catch (error) {
      this.logger.error(`Error drawing item text: ${error}`);
      return null;
    }
  }
}
