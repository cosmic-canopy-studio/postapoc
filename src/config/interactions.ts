import { InteractionComponentImpl } from '@src/components/interactionComponent';
import EventBus from '@src/coreSystems/eventBus';
import { EntityIDPayload } from '@src/config/eventTypes';

export type InteractionAction = (data?: any) => void;

export interface Interaction {
  name: string;
  action: InteractionAction;
  data?: any;
}

export const doorInteractions: Interaction[] = [
  {
    name: 'Open',
    action: () => {
      console.log('Player opens the door.');
    },
  },
  {
    name: 'Close',
    action: () => {
      console.log('Player closes the door.');
    },
  },
  {
    name: 'Lock',
    action: (data: { keyId: string }) => {
      console.log(`Player locks the door with key ID: ${data.keyId}`);
    },
    data: {
      keyId: 'some-key-id',
    },
  },
];

export const treeInteractions: Interaction[] = [
  {
    name: 'Chop Down',
    action: () => {
      console.log('Player chops down the tree.');
    },
  },
];

export const itemInteractions: Interaction[] = [
  {
    name: 'PickUp',
    action: (data: { eid: number }) => {
      console.log('Player picks up the item.');
      EventBus.emit('itemPickedUp', { eid: data.eid } as EntityIDPayload);
    },
    data: {
      eid: null,
    },
  },
];

export const interactionMapping: { [key: string]: InteractionComponentImpl } = {
  tree: new InteractionComponentImpl(treeInteractions),
  door: new InteractionComponentImpl(doorInteractions),
  item: new InteractionComponentImpl(itemInteractions),
  board: new InteractionComponentImpl(itemInteractions),
  pipe: new InteractionComponentImpl(itemInteractions),
};
