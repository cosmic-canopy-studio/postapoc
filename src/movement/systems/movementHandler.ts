import { MOVEMENT_SPEED } from '@src/core/config/constants';
import { IHandler } from '@src/core/data/types';
import EventBus from '@src/core/systems/eventBus';
import Movement from '@src/movement/components/movement';
import { MoveActions } from '@src/movement/data/enums';
import { MoveEventPayload } from '@src/movement/data/events';
import { getLogger } from '@src/telemetry/systems/logger';

export default class MovementHandler implements IHandler {
  private logger;

  constructor() {
    this.logger = getLogger('movement');
  }

  initialize() {
    EventBus.on('move', this.onMove.bind(this));
  }

  onMove(payload: MoveEventPayload) {
    this.handleMovement(payload.state, payload.action, payload.entity);
  }

  private handleMovement(
    state: boolean,
    direction: MoveActions,
    entityId: number
  ) {
    const speed = MOVEMENT_SPEED;
    if (state) {
      switch (direction) {
        case MoveActions.UP:
          Movement.ySpeed[entityId] = -speed;
          break;
        case MoveActions.DOWN:
          Movement.ySpeed[entityId] = speed;
          break;
        case MoveActions.LEFT:
          Movement.xSpeed[entityId] = -speed;
          break;
        case MoveActions.RIGHT:
          Movement.xSpeed[entityId] = speed;
          break;
      }
    } else {
      switch (direction) {
        case MoveActions.UP:
        case MoveActions.DOWN:
          Movement.ySpeed[entityId] = 0;
          break;
        case MoveActions.LEFT:
        case MoveActions.RIGHT:
          Movement.xSpeed[entityId] = 0;
          break;
      }
    }

    this.logger.debug(
      `Entity ${entityId} move ${direction} ${state ? 'start' : 'stop'}`
    );
  }
}
