// Part: src/ecs/systems/interactionSystem.ts
// Code Reference:
// Documentation:

import { getInteractionComponent } from '@src/ecs/components/interactionComponent';

export function interactionSystem(eid: number, interactionName: string): void {
  const interactionComponent = getInteractionComponent(eid);
  if (interactionComponent) {
    interactionComponent.executeInteraction(interactionName);
  }
}
