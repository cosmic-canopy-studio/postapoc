import { Direction, GridEngine } from 'grid-engine';
import { filterCharacters } from 'grid-engine/dist/GridCharacter/CharacterFilter/CharacterFilter';
import Interactable from '../interactables/interactable';

export default class PlayerInputState {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private gridEngine: GridEngine;
  private focus?: Interactable;
  private interactionTriggered: boolean;

  constructor(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    gridEngine: GridEngine
  ) {
    this.cursors = cursors;
    this.gridEngine = gridEngine;
    this.interactionTriggered = false;
  }

  update(gridActor: string) {
    if (this.cursors.left.isDown) {
      this.gridEngine.move(gridActor, Direction.LEFT);
    } else if (this.cursors.right.isDown) {
      this.gridEngine.move(gridActor, Direction.RIGHT);
    } else if (this.cursors.up.isDown) {
      this.gridEngine.move(gridActor, Direction.UP);
    } else if (this.cursors.down.isDown) {
      this.gridEngine.move(gridActor, Direction.DOWN);
    }

    if (this.cursors.space.isDown) {
      if (!this.interactionTriggered) {
        const actorSprite = this.gridEngine.getSprite(gridActor);
        actorSprite.play(
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
    if (this.focus) {
      return this.focus.getId();
    }
    return 'none';
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
