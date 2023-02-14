declare namespace Phaser.GameObjects {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {
    interactable(x: number, y: number, texture: string): IInteractable;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface GameObjectFactory {
    actor(x: number, y: number, texture: string): IActor;
  }
}
