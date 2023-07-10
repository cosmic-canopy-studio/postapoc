import { getAttackDamage } from '@src/action/components/attack';
import { ActionEventOptions } from '@src/action/data/events';
import Action from '@src/action/data/interfaces';
import { craftSimpleItem } from '@src/action/systems/craftSystem';
import EventBus from '@src/core/systems/eventBus';
import { getFocusTarget } from '@src/entity/components/focus';
import { getEntityNameWithID } from '@src/entity/systems/entityNames';

const ActionLogic: Record<string, Action> = {
  attack: new Action('attack', (entityId: number) => {
    const damage = getAttackDamage(entityId);
    const focusedObject = getFocusTarget(entityId);
    if (focusedObject) {
      EventBus.emit('damage', { entity: focusedObject, damage });
      return {
        message: `${getEntityNameWithID(
          entityId
        )} is damaging ${focusedObject}`,
      };
    }
    return {
      message: `${getEntityNameWithID(
        entityId
      )} tried to attack, but has no focus target`,
    };
  }),
  pickUp: new Action('pickUp', (entityId: number) => {
    const focusedObject = getFocusTarget(entityId);
    if (focusedObject) {
      EventBus.emit('itemPickedUp', { entityId: entityId });
      return {
        message: `${getEntityNameWithID(
          entityId
        )} is picking up ${focusedObject}`,
      };
    }
    return {
      message: `${getEntityNameWithID(
        entityId
      )} tried to pick up, but has no focus target`,
    };
  }),
  toggleOpenable: new Action('toggleOpenable', (entityId: number) => {
    const focusedObject = getFocusTarget(entityId);
    if (focusedObject) {
      EventBus.emit('openableToggled', { entityId: entityId });
      return {
        message: `${getEntityNameWithID(
          entityId
        )} is attempting to toggle the openable state of ${focusedObject}`,
      };
    }
    return {
      message: `${getEntityNameWithID(
        entityId
      )} tried to toggle an openable, but has no focus target`,
    };
  }),
  craft: new Action(
    'craft',
    (entityId: number, options?: ActionEventOptions) => {
      const recipe = options?.recipe;
      if (!recipe) {
        return {
          message: `${getEntityNameWithID(
            entityId
          )} tried to craft, but no recipe was specified`,
        };
      }
      const result = craftSimpleItem(entityId, recipe);
      if (result) {
        const { itemName, itemQuantity } = result;
        EventBus.emit('refreshInventory', { entityId: entityId });
        EventBus.emit('itemCrafted', {
          creatingEntityId: entityId,
          createdItemName: itemName,
          createdItemQuantity: itemQuantity,
        });
        return {
          message: `${getEntityNameWithID(
            entityId
          )} crafted ${itemQuantity} ${itemName}`,
        };
      } else {
        return {
          message: `${getEntityNameWithID(
            entityId
          )} tried to craft, but failed`,
        };
      }
    }
  ),
};

export default ActionLogic;
