declare interface IInteractable extends Phaser.GameObjects.Sprite {}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    interactable(x: number, y: number, texture: string): IInteractable;
  }
}
