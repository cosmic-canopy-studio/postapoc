import PlayerInputState from '../../states/playerInputState';

declare interface IActor extends Phaser.GameObjects.Sprite {
  setControlState(controlState: PlayerInputState): void;
  setFocus(interactable: Interactable | string): void;
  getId(): number;
  update(): void;
  interact(): void;
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    actor(x: number, y: number, texture: string): IActor;
  }
}
