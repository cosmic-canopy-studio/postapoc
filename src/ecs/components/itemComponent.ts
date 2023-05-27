// src/ecs/components/itemComponent.ts
import { addComponent, defineComponent, IWorld, removeComponent, Types } from 'bitecs';
import { Item } from './item';

const items: Item[] = [];

const ItemComponent = defineComponent({
  itemIndex: Types.ui16,
});

export function addItemComponent(world: IWorld, eid: number, item: Item) {
  addComponent(world, ItemComponent, eid);
  ItemComponent.itemIndex[eid] = items.length;
  items.push(item);
}

export function removeItemComponent(world: IWorld, eid: number) {
  const item = getItem(eid);
  if (item) {
    const index = ItemComponent.itemIndex[eid];
    items.splice(index, 1);
  }
  removeComponent(world, ItemComponent, eid);
}

export function getItem(eid: number): Item | undefined {
  const index = ItemComponent.itemIndex[eid];
  return items[index];
}

export default ItemComponent;
