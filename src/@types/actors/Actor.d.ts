import Interactable from '../../entities/interactable';
import PlayerInput from '../../components/playerInput';

declare interface IActor extends IInteractable {
  setControlState(controlState: PlayerInput): void;
  getFocus(): Interactable | undefined;
  update(): void;
  setFocus(interactable: Interactable): void;
}
