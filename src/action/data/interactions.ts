import { InteractionComponentImpl } from '@src/action/components/interactionComponent';
import EventBus from '@src/core/eventBus';
import { getLogger } from '@src/telemetry/logger';

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
      getLogger('action').info('Player opens the door.');
    },
  },
  {
    name: 'Close',
    action: () => {
      getLogger('action').info('Player closes the door.');
    },
  },
  {
    name: 'Lock',
    action: (data: { keyId: string }) => {
      getLogger('action').info(
        `Player locks the door with key ID: ${data.keyId}`
      );
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
      getLogger('action').info('Player chops down the tree.');
    },
  },
];

export const itemInteractions: Interaction[] = [
  {
    name: 'PickUp',
    action: (data: { eid: number }) => {
      getLogger('action').info('Player picks up the item.');
      EventBus.emit('itemPickedUp', { eid: data.eid });
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
