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
      message: `${entity} tried Ïto pick up, but there was no item`,
    };
  }),
  craft: new Action('craft', (entity: number) => {
    const result = craftSimpleItem(entity, 'hammer');
    if (result) {
      const { itemName, itemQuantity } = result;
      EventBus.emit('refreshInventory', { entityId: entity });
      EventBus.emit('itemCrafted', {
        creatingEntityId: entity,
        createdItemName: itemName,
        createdItemQuantity: itemQuantity,
      });
      return {
        message: `${entity} crafted ${itemQuantity} ${itemName}`,
      };
    } else {
      return {
        message: `${entity} tried to craft, but failed`,
      };
    }
  }),
};

export default ActionLogic;
