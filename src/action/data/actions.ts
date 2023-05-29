import { getAttackDamage } from '@src/action/components/attack';
import EventBus from '@src/core/eventBus';
import { getFocusTarget } from '@src/action/components/focus';
import Action from '@src/action/systems/action';

const Actions: Record<string, Action> = {
  attack: new Action('attack', (entity: number) => {
    const damage = getAttackDamage(entity);
    const focusedObject = getFocusTarget(entity);
    if (focusedObject) {
      EventBus.emit('damage', { entity: focusedObject, damage });
      return {
        message: `${entity} is damaging ${focusedObject}`,
      };
    }
    return {
      message: `${entity} tried to attack, but there was no target`,
    };
  }),
  pickUp: new Action('pickUp', (entity: number) => {
    const focusedObject = getFocusTarget(entity);
    if (focusedObject) {
      EventBus.emit('itemPickedUp', { entityId: entity });
      return {
        message: `${entity} is picking up ${focusedObject}`,
      };
    }
    return {
      message: `${entity} tried to pick up, but there was no item`,
    };
  }),
};

export default Actions;
