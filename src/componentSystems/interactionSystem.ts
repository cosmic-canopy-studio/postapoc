import { getInteractionComponent } from '@src/components/interactionComponent';
import { getLogger } from '@src/telemetry/logger';

export function interactionSystem(eid: number, interactionName: string): void {
  const interactionComponent = getInteractionComponent(eid);
  const logger = getLogger('interaction');
  if (interactionComponent) {
    logger.debug(`Executing interaction ${interactionName} on entity ${eid}`);
    interactionComponent.executeInteraction(interactionName, { eid });
  } else {
    logger.error(`No interaction component found for entity ${eid}`);
  }
}
