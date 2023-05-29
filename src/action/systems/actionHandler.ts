import EventBus from '@src/core/eventBus';
import Health from '@src/entity/components/health';
import { getLogger } from '@src/telemetry/logger';
import { IHandler } from '@src/config/interfaces';
import {
  ActionEventPayload,
  DamageEventPayload,
} from '@src/action/data/events';
import Actions from '@src/action/data/actions';

export default class ActionHandler implements IHandler {
  private logger;

  constructor() {
    this.logger = getLogger('action');
  }

  initialize() {
    EventBus.on('damage', this.onDamage.bind(this));
    EventBus.on('action', this.onAction.bind(this));
  }

  onAction(payload: ActionEventPayload) {
    this.logger.debug(`Action event received: ${JSON.stringify(payload)}`);
    const { action, entity } = payload;
    const result = Actions[action].execute(entity);
    this.logger.info(result.message);
  }

  private onDamage({ entity, damage }: DamageEventPayload) {
    Health.current[entity] -= damage;
    this.logger.info(
      `Damage ${damage} to ${entity}, health: ${Health.current[entity]}`
    );
  }
}
