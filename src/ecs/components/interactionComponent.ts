// Part: src/ecs/components/interactionComponent.ts
// Code Reference:
// Documentation:

import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { Interaction } from '@src/config/interactions';

export interface IInteractionComponent {
  interactions: Interaction[];
  getInteractionNames: () => string[];
  executeInteraction: (name: string) => void;
}

const interactions: IInteractionComponent[] = [];

const InteractionComponent = defineComponent({
  interactionIndex: Types.ui16,
});

export default InteractionComponent;

export function addInteractionComponent(
  world: IWorld,
  eid: number,
  interaction: IInteractionComponent
) {
  addComponent(world, InteractionComponent, eid);
  InteractionComponent.interactionIndex[eid] = interactions.length;
  interactions.push(interaction);
}

export function getInteractionComponent(
  eid: number
): IInteractionComponent | null {
  const index = InteractionComponent.interactionIndex[eid];
  return interactions[index] || null;
}

export class InteractionComponentImpl implements IInteractionComponent {
  constructor(public interactions: Interaction[]) {}

  getInteractionNames(): string[] {
    return this.interactions.map((interaction) => interaction.name);
  }

  executeInteraction(name: string): void {
    const interaction = this.interactions.find((i) => i.name === name);
    if (interaction) {
      interaction.action(interaction.data);
    }
  }
}
