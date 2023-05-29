import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { Interaction } from '@src/action/interactions';
import { getLogger } from '@src/telemetry/logger';

export interface IInteractionComponent {
  interactions: Interaction[];
  getInteractionNames: () => string[];
  executeInteraction: (name: string, data: any) => void;
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
  private logger = getLogger('action');

  constructor(public interactions: Interaction[]) {}

  getInteractionNames(): string[] {
    return this.interactions.map((interaction) => interaction.name);
  }

  executeInteraction(name: string, data: any): void {
    const interaction = this.interactions.find((i) => i.name === name);
    if (interaction) {
      this.logger.debug(`Executing interaction ${name} with data ${data}`);
      interaction.action(data);
    } else {
      this.logger.error(`No interaction found with name ${name}`);
    }
  }
}
