import { getInventory } from '@src/entity/components/inventory';
import {
  getEntityName,
  getEntityNameWithID,
} from '@src/entity/systems/entityNames';
import EventBus from '@src/core/systems/eventBus';
import { getLogger } from '@src/telemetry/systems/logger';
import { DraggableScene } from './draggableScene';
import { EntityActions } from '@src/entity/data/enums';
import {
  ITEM_TEXT_CONFIG,
  UPPER_LEFT_DRAG_START_POSITION,
} from '@src/entity/data/constants';

export default class InventoryScene extends DraggableScene {
  protected logger = getLogger('entity');
  private entityId!: number;

  constructor() {
    super({ key: 'InventoryScene' });
    this.dragPosition = { ...UPPER_LEFT_DRAG_START_POSITION };
  }

  init(data: { entityId: number }) {
    this.entityId = data.entityId;
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
      this.logger.debugVerbose(`Updating inventory display`);
      this.clearDisplay();

      const inventoryItems = getInventory(this.entityId);
      this.createDisplay(
        inventoryItems,
        (item) => `  ${getEntityNameWithID(item)}`,
        (item) => this.drawItemText(item),
        `${getEntityName(this.entityId)}'s inventory:`
      );
    } catch (error) {
      this.logger.error(`Error during display update: ${error}`);
    }
  }

  private drawItemText(item: number) {
    try {
      const itemText = this.add.text(
        this.nextPosition.x,
        this.nextPosition.y,
        `  ${getEntityName(item)}`,
        ITEM_TEXT_CONFIG
      );

      itemText.setDepth(1);

      return itemText;
    } catch (error) {
      this.logger.error(`Error drawing item text: ${error}`);
      return null;
    }
  }
}
