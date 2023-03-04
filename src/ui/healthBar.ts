import { Interactable } from '../entities';
import { log } from '../utilities';

export class HealthBar extends Phaser.GameObjects.Graphics {
    private interactable: Interactable;
    private value: number;
    private maxValue: number;
    private barWidth: number;
    private barHeight: number;
    private unitSize: number;
    private gapSize: number;
    private yOffset: number;
    private xOffset: number;

    constructor(
        interactable: Interactable,
        width = 6,
        height = 10,
        gapSize = 2
    ) {
        if (!interactable.sprite) {
            log.debug(interactable.id);
            throw Error('interactable sprite not defined');
        }

        if (!interactable.sprite.scene) {
            throw Error('interactable scene not defined');
        }
        const scene = interactable.sprite.scene;
        super(scene);

        this.interactable = interactable;
        this.value = interactable.health;
        this.maxValue = interactable.health;
        this.barWidth = this.maxValue * width;
        this.barHeight = height;
        this.unitSize = this.barWidth / this.maxValue;
        this.gapSize = gapSize;

        this.xOffset = this.barWidth / 2;
        this.yOffset = interactable.sprite.height / 2 + this.barHeight * 2;

        this.draw();
        this.updatePosition();

        scene.add.existing(this);

        this.interactable.sprite.scene.events.on(
            `${this.interactable.id}PositionChanged`,
            () => {
                this.updatePosition();
            }
        );
    }

    public setHealth(amount: number) {
        this.value = amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw();
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

    public setPosition(x: number, y: number) {
        this.x = x - this.xOffset;
        this.y = y - this.yOffset;
    }

    public updatePosition() {
        this.setPosition(
            this.interactable.sprite.x,
            this.interactable.sprite.y
        );
    }

    public destroy() {
        // Remove the event listener when the health bar is destroyed
        this.interactable.sprite.scene.events.off(
            `${this.interactable.id}PositionChanged`
        );
        // Call this.destroy() instead of super.destroy()
        super.destroy();
    }
}
