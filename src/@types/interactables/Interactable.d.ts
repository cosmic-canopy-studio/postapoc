declare interface IInteractable extends Phaser.Physics.Arcade.Sprite {
  getId(): number;
  damage(): void;
}
