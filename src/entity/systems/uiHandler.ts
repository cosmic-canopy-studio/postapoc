import EventBus from '@src/core/systems/eventBus';
import { EntityIDPayload } from '@src/entity/data/events';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';
import { getLogger } from '@src/telemetry/systems/logger';
import ScenePlugin = Phaser.Scenes.ScenePlugin;

export default class UIHandler {
  private logger;
  private scene: ScenePlugin;

  constructor(scene: Phaser.Scene) {
    this.logger = getLogger('entity');
    this.scene = scene.scene;
  }

  initialize() {
    EventBus.on('toggleInventory', this.onToggleInventory.bind(this));
    EventBus.on('toggleHelp', this.onToggleHelp.bind(this));
    EventBus.on('toggleCrafting', this.onToggleCrafting.bind(this));
  }

  private toggleScene(sceneName: string, entityId: number) {
    this.logger.debug(
      `Toggling ${sceneName} for ${getEntityNameWithID(entityId)}`
    );
    if (this.scene.isActive(sceneName)) {
      this.scene.stop(sceneName);
    } else {
      this.scene.launch(sceneName, { entityId: entityId });
    }
  }

  private onToggleInventory(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('InventoryScene', entityId);
  }

  private onToggleHelp(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('HelpScene', entityId);
  }

  private onToggleCrafting(payload: EntityIDPayload) {
    const { entityId } = payload;
    this.toggleScene('CraftScene', entityId);
  }
}
