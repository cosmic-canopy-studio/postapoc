import * as Phaser from 'phaser';

export const getGameWidth = (scene: Phaser.Scene): number => {
    return scene.game.scale.width;
};

export const getGameHeight = (scene: Phaser.Scene): number => {
    return scene.game.scale.height;
};

export function createSprite(
    scene: Phaser.Scene,
    x: number,
    y: number,
    key: string
) {
    const sprite = new Phaser.Physics.Arcade.Sprite(scene, x, y, key);
    scene.add.existing(sprite);
    scene.physics.add.existing(sprite);
    return sprite;
}
