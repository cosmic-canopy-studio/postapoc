import { MoveEventPayload } from '@src/config/eventTypes';
import { getLogger } from '@src/telemetry/logger';
import { MOVEMENT_SPEED } from '@src/config/constants';
import Movement from '@src/movement/movement';
import EventBus from '@src/core/eventBus';
import { IHandler } from '@src/config/interfaces';
import { MoveDirections } from '@src/movement/enums';

export class MovementHandler implements IHandler {
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
    direction: MoveDirections,
    entityId: number
  ) {
    const speed = MOVEMENT_SPEED;
    if (state) {
      switch (direction) {
        case MoveDirections.UP:
          Movement.ySpeed[entityId] = -speed;
          break;
        case MoveDirections.DOWN:
          Movement.ySpeed[entityId] = speed;
          break;
        case MoveDirections.LEFT:
          Movement.xSpeed[entityId] = -speed;
          break;
        case MoveDirections.RIGHT:
          Movement.xSpeed[entityId] = speed;
          break;
      }
    } else {
      switch (direction) {
        case MoveDirections.UP:
        case MoveDirections.DOWN:
          Movement.ySpeed[entityId] = 0;
          break;
        case MoveDirections.LEFT:
        case MoveDirections.RIGHT:
          Movement.xSpeed[entityId] = 0;
          break;
      }
    }

    this.logger.debug(
      `Entity ${entityId} move ${direction} ${state ? 'start' : 'stop'}`
    );
  }
}
