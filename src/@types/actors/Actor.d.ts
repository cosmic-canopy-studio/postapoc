import Interactable from '../../interactables/interactable';
import PlayerInputState from '../../states/playerInputState';

declare interface IActor extends IInteractable {
  setControlState(controlState: PlayerInputState): void;
  getFocus(): Interactable | undefined;
  update(): void;
  setFocus(interactable: Interactable): void;
}
