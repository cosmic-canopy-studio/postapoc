import { getInteractionComponent } from '@src/action/components/interaction';
import { interaction } from '@src/action/systems/interaction';
import { getDamage } from '@src/action/components/attack';
import EventBus from '@src/core/eventBus';
import Health from '@src/entity/components/health';
import { Actions } from '@src/action/data/enums';
import { getFocusTarget } from '@src/action/components/focus';
import { getLogger } from '@src/telemetry/logger';
import { IHandler } from '@src/config/interfaces';
import {
  ActionEventPayload,
  DamageEventPayload,
} from '@src/action/data/events';

export class ActionHandler implements IHandler {
  private logger;

  constructor() {
    this.logger = getLogger('action');
  }

  initialize() {
    EventBus.on('damage', this.onDamage.bind(this));
    EventBus.on('action', this.onAction.bind(this));
  }

  onAction(payload: ActionEventPayload) {
    const { action, entity } = payload;
    switch (action) {
      case Actions.ATTACK:
        this.onAttack(entity);
        break;
      case Actions.INTERACT:
        this.onInteract(entity);
        break;
    }
  }

  private onAttack(entity: number) {
    const damage = getDamage(entity);
    const focusedObject = getFocusTarget(entity);
    if (focusedObject) {
      EventBus.emit('damage', { entity: focusedObject, damage });
      this.logger.info(`${entity} is damaging ${focusedObject}`);
    }
  }

  private onDamage({ entity, damage }: DamageEventPayload) {
    Health.current[entity] -= damage;
    this.logger.info(
      `Damage ${damage} to ${entity}, health: ${Health.current[entity]}`
    );
  }

  private onInteract(entity: number) {
    const focusedObject = getFocusTarget(entity);
    if (focusedObject) {
      this.logger.info(`${entity} interacting with ${focusedObject}`);
      const interactionComponent = getInteractionComponent(focusedObject);
      if (interactionComponent) {
        const interactionName = 'PickUp';
        interaction(focusedObject, interactionName);
      } else {
        this.logger.info(`No interaction component found for ${focusedObject}`);
      }
    }
  }
}