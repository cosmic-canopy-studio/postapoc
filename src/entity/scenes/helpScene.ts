import controlMappingJson from '@src/core/config/controlMapping.json';
import { ControlMapping } from '@src/core/data/types';
import {
  ITEM_TEXT_CONFIG,
  UPPER_RIGHT_DRAG_START_POSITION,
} from '@src/entity/data/constants';
import { getLogger } from '@src/telemetry/systems/logger';
import { DraggableScene } from './draggableScene';

export default class HelpScene extends DraggableScene {
  readonly controlMapping: ControlMapping;
  protected logger = getLogger('entity');

  constructor() {
    super({ key: 'HelpScene' });
    this.dragPosition = { ...UPPER_RIGHT_DRAG_START_POSITION };
    this.controlMapping = controlMappingJson as ControlMapping;
  }

  create() {
    try {
      this.updateDisplay();
    } catch (error) {
      this.logger.error(`Error during creation: ${error}`);
    }
  }

  protected updateDisplay() {
    try {
      this.logger.debugVerbose(`Updating help display`);
      this.clearDisplay();

      const controlEntries = this.getControlEntries();
      this.createDisplay(
        controlEntries,
        (entry) => `  ${entry.key} : ${entry.value}`,
        (entry) => this.drawControlText(entry),
        'Key Bindings:'
      );
    } catch (error) {
      this.logger.error(`Error during display update: ${error}`);
    }
  }

  private getControlEntries() {
    const controlEntries = [];
    for (const actionGroup in this.controlMapping) {
      for (const key in this.controlMapping[actionGroup]) {
        controlEntries.push({
          key: key,
          value: this.controlMapping[actionGroup][key],
        });
      }
    }
    return controlEntries;
  }

  private drawControlText(entry: { key: string; value: string }) {
    try {
      const controlText = this.add.text(
        this.nextPosition.x,
        this.nextPosition.y,
        `  ${entry.key} : ${entry.value}`,
        ITEM_TEXT_CONFIG
      );

      controlText.setDepth(1);

      return controlText;
    } catch (error) {
      this.logger.error(`Error drawing control text: ${error}`);
      return null;
    }
  }
}
