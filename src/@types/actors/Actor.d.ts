declare interface IActor extends Phaser.GameObjects.Sprite {
  //attack(): void
}

declare namespace Phaser.GameObjects {
  interface GameObjectFactory {
    actor(x: number, y: number, texture: string): IActor;
  }
}
