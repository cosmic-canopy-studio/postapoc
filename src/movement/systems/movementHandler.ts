import { getLogger } from '@src/telemetry/systems/logger';
import { MOVEMENT_SPEED } from '@src/core/config/constants';
import Movement from '@src/movement/components/movement';
import EventBus from '@src/core/eventBus';
import { IHandler } from '@src/core/config/interfaces';
import { MoveActions } from '@src/movement/data/enums';
import { MoveEventPayload } from '@src/movement/data/events';

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
