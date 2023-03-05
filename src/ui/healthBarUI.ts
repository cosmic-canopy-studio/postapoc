import * as Phaser from 'phaser';

export class HealthBarUI extends Phaser.GameObjects.Graphics {
    private value: number;
    private readonly maxValue: number;
    private readonly barWidth: number;
    private readonly barHeight: number;
    private readonly gapSize: number;
    private readonly yOffset: number;
    private readonly xOffset: number;

    constructor(
        sprite: Phaser.Physics.Arcade.Sprite,
        health: number,
        width = 6,
        height = 10,
        gapSize = 2
    ) {
        const scene = sprite.scene;
        super(scene);

        this.value = health;
        this.maxValue = health;
        this.barWidth = this.maxValue * width;
        this.barHeight = height;
        this.gapSize = gapSize;

        this.xOffset = this.barWidth / 2;
        this.yOffset = sprite.height / 2 + this.barHeight * 2;
        this.updatePosition(sprite.x, sprite.y);
        this.draw();

        scene.add.existing(this);
    }

    public draw() {
        this.clear();

        // Calculate the size of each unit of health
        const unitWidth =
            (this.barWidth - (this.maxValue - 1) * this.gapSize) /
            this.maxValue;

        // Draw each unit of health
        for (let i = 0; i < this.maxValue; i++) {
            // Calculate the position of this unit of health
            const xPos = i * (unitWidth + this.gapSize);
            const yPos = 0;

            // Determine the color of this unit of health based on the current value
            const healthColor = i < this.value ? 0x00ff00 : 0xff0000;

            // Draw the unit of health
            this.fillStyle(healthColor, 1);
            this.fillRect(xPos, yPos, unitWidth, this.barHeight);
        }
    }

    public updateHealth(amount: number) {
        this.value = amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw();
    }

    public updatePosition(x: number, y: number) {
        this.setPosition(x - this.xOffset, y - this.yOffset);
    }

    public destroy() {
        super.destroy();
    }
}
