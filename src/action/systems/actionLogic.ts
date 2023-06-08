import { getAttackDamage } from '@src/action/components/attack';
import EventBus from '@src/core/systems/eventBus';
import { getFocusTarget } from '@src/entity/components/focus';
import Action from '@src/action/data/interfaces';
import { craftSimpleItem } from '@src/action/systems/craftSystem';

const ActionLogic: Record<string, Action> = {
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
  craft: new Action('craft', (entity: number) => {
    const { itemName, itemQuantity } = craftSimpleItem();
    EventBus.emit('itemCrafted', {
      creatingEntityId: entity,
      createdItemName: itemName,
      createdItemQuantity: itemQuantity,
    });
    return {
      message: `${entity} crafted ${itemQuantity} ${itemName}`,
    };
  }),
};

export default ActionLogic;
