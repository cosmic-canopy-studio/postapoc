import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { getLogger } from '@src/telemetry/systems/logger';

export const CanBePickedUp = defineComponent({
  value: Types.ui8, // 0 for false, 1 for true
});

export function addCanBePickedUp(world: IWorld, entityId: number) {
  addComponent(world, CanBePickedUp, entityId);
  CanBePickedUp.value[entityId] = 1;
}

export function unsetCanBePickedUp(entityId: number) {
  CanBePickedUp.value[entityId] = 0;
}

export function entityCanBePickedUp(entityId: number) {
  const canBePickedUp = CanBePickedUp.value[entityId] === 1;
  getLogger('entity').debugVerbose(
    `Checking if entity ${entityId} can be picked up: ${canBePickedUp}`
  );
  return canBePickedUp;
}
