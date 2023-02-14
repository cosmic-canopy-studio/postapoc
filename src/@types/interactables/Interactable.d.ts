declare interface IInteractable extends Phaser.GameObjects.Sprite {
  getId(): number;
  damage(): void;
}
