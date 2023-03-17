import * as Phaser from 'phaser';
import { HealthValue } from '@src/components/health';

export interface UIBarDimensions {
    gapSize: number;
    unitWidth: number;
    unitHeight: number;
    yOffset: number;
    xOffset: number;
}

export const defaultBarDimensions: UIBarDimensions = {
    gapSize: 2,
    unitWidth: 6,
    unitHeight: 10,
    yOffset: 0,
    xOffset: 0
};

export class HealthBarUI extends Phaser.GameObjects.Graphics {
    private healthValue: HealthValue;
    private uiBarDimensions: UIBarDimensions;

    constructor(
        sprite: Phaser.Physics.Arcade.Sprite,
        healthValue: HealthValue,
        uiBarDimensions: UIBarDimensions
    ) {
        const scene = sprite.scene;
        super(scene);

        this.healthValue = healthValue;
        this.uiBarDimensions = uiBarDimensions;
        if (this.uiBarDimensions.xOffset === 0) {
            const barWidth =
                (this.uiBarDimensions.unitWidth +
                    this.uiBarDimensions.gapSize) *
                this.healthValue.maxValue;
            this.uiBarDimensions.xOffset = barWidth / 2;
        }
        this.draw();

        scene.add.existing(this);
    }

    public draw() {
        this.clear();

        for (let i = 0; i < this.healthValue.maxValue; i++) {
            const xPos =
                i *
                (this.uiBarDimensions.unitWidth + this.uiBarDimensions.gapSize);
            const yPos = 0;

            // Determine the color of this unit of health based on the current value
            const healthColor =
                i < this.healthValue.value ? 0x00ff00 : 0xff0000;

            // Draw the unit of health
            this.fillStyle(healthColor, 1);
            this.fillRect(
                xPos,
                yPos,
                this.uiBarDimensions.unitWidth,
                this.uiBarDimensions.unitHeight
            );
        }
    }

    public updateHealth(amount: number) {
        this.healthValue.value = Math.max(0, amount);
        this.draw();
    }

    public updatePosition(x: number, y: number) {
        this.setPosition(
            x - this.uiBarDimensions.xOffset,
            y - this.uiBarDimensions.yOffset
        );
    }

    public destroy() {
        super.destroy();
    }
}
