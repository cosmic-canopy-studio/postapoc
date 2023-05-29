import { ActionEventPayload, DamageEventPayload } from '@src/config/eventTypes';
import { getInteractionComponent } from '@src/action/interactionComponent';
import { interactionSystem } from '@src/action/interactionSystem';
import { getDamage } from '@src/action/attack';
import EventBus from '@src/coreSystems/eventBus';
import Health from '@src/components/health';
import { Actions } from '@src/config/enums';
import { getFocusTarget } from '@src/action/focus';
import { getLogger } from '@src/telemetry/logger';
import { IHandler } from '@src/config/interfaces';

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
        interactionSystem(focusedObject, interactionName);
      } else {
        this.logger.info(`No interaction component found for ${focusedObject}`);
      }
    }
  }
}
