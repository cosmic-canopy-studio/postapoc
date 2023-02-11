import PlayerInputState from '../../states/playerInputState';

declare interface IActor extends Phaser.GameObjects.Sprite {
  setControlState(controlState: PlayerInputState): void;

  update(): void;
  //attack(): void
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    actor(x: number, y: number, texture: string): IActor;
  }
}
