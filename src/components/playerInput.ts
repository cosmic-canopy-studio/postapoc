import { Direction, GridEngine } from 'grid-engine';
import { injectable, inject } from 'inversify';
import { TYPES } from '../constants/types';
import Interactable from '../interactables/interactable';
import ObjectMovement from './objectMovement';


@injectable()
export default class PlayerInput {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private objectMovement: ObjectMovement;
  private gridEngine: GridEngine; // TODO: Refactor to use controller
  private interactionTriggered: boolean;
  private focus?: Interactable;

  constructor(
    @inject(TYPES.GridEngineController) gridEngine: GridEngine,
    @inject(TYPES.ObjectMovement) objectMovement: ObjectMovement
  ) {
    this.gridEngine = gridEngine;
    this.objectMovement = objectMovement;
    this.interactionTriggered = false;
  }
  
  setCursors(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    this.cursors = cursors;
  }

  update(gridActor: string) {
    if (this.cursors.left.isDown) {
      this.objectMovement.move(gridActor, Direction.LEFT);
    } else if (this.cursors.right.isDown) {
      this.objectMovement.move(gridActor, Direction.RIGHT);
    } else if (this.cursors.up.isDown) {
      this.objectMovement.move(gridActor, Direction.UP);
    } else if (this.cursors.down.isDown) {
      this.objectMovement.move(gridActor, Direction.DOWN);
    }

    if (this.cursors.space.isDown) {
      if (!this.interactionTriggered) {
        const actorSprite = this.gridEngine.getSprite(gridActor);
        actorSprite?.play(
          'action-'.concat(this.gridEngine.getFacingDirection(gridActor))
        );
        this.interact();
        this.interactionTriggered = true;
      }
    } else {
      this.interactionTriggered = false;
    }
  }

  getFocus() {
    if (!this.focus) {
      return;
    }
    return this.focus.getId();
  }

  setFocus(interactable: Interactable | undefined) {
    this.focus = interactable;
  }

  interact(interactable?: Interactable) {
    let target = interactable;
    if (!target) {
      if (this.focus) {
        target = this.focus;
      } else {
        return;
      }
    }

    target.damage();
  }
}
