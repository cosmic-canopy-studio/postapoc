import { addComponent, defineComponent, IWorld, Types } from 'bitecs';
import { IInteraction } from '@src/action/data/interactions';
import { getLogger } from '@src/telemetry/logger';

export interface IInteractionComponent {
  interactions: IInteraction[];
  getInteractionNames: () => string[];
  executeInteraction: (name: string, data: any) => void;
}

const interactions: IInteractionComponent[] = [];

const Interaction = defineComponent({
  interactionIndex: Types.ui16,
});

export default Interaction;

export function addInteractionComponent(
  world: IWorld,
  eid: number,
  interaction: IInteractionComponent
) {
  addComponent(world, Interaction, eid);
  Interaction.interactionIndex[eid] = interactions.length;
  interactions.push(interaction);
}

export function getInteractionComponent(
  eid: number
): IInteractionComponent | null {
  const index = Interaction.interactionIndex[eid];
  return interactions[index] || null;
}

export class InteractionComponentImpl implements IInteractionComponent {
  private logger = getLogger('action');

  constructor(public interactions: IInteraction[]) {}

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
