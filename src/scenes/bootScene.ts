import { assetPackUrl, getGameHeight, getGameWidth, log } from '../utilities';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Boot'
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig);
    }

    public preload(): void {
        const {
            progressBarContainer,
            progressBar,
            loadingText,
            percentText,
            assetText
        } = this.createLoadingBar();

        this.load.on('progress', (value: number) => {
            progressBar.width = (progressBarContainer.width - 30) * value;

            const percent = value * 100;
            percentText.setText(`${percent}%`);
        });

        this.load.on('fileprogress', (file: Phaser.Loader.File) => {
            assetText.setText(file.key);
        });

        this.load.on('complete', () => {
            [
                loadingText,
                percentText,
                assetText,
                progressBar,
                progressBarContainer
            ].forEach((element) => element.destroy());

            this.scene.start('MainMenu');
        });

        this.loadAssets();
    }

    private loadAssets(): void {
        this.load.image(
            'sky',
            'https://labs.phaser.io/assets/skies/space3.png'
        );
        this.load.pack('asset-pack', assetPackUrl);
        log.debug('assets loaded');
    }

    private createLoadingBar() {
        const halfWidth = getGameWidth(this) * 0.5;
        const halfHeight = getGameHeight(this) * 0.5;

        const progressBarHeight = 100;
        const progressBarWidth = 400;

        const progressBarContainer = this.add.rectangle(
            halfWidth,
            halfHeight,
            progressBarWidth,
            progressBarHeight,
            0x000000
        );
        const progressBar = this.add.rectangle(
            halfWidth + 20 - progressBarContainer.width * 0.5,
            halfHeight,
            10,
            progressBarHeight - 20,
            0x888888
        );

        const loadingText = this.add
            .text(halfWidth - 75, halfHeight - 100, 'Loading...')
            .setFontSize(24);
        const percentText = this.add
            .text(halfWidth - 25, halfHeight, '0%')
            .setFontSize(24);
        const assetText = this.add
            .text(halfWidth - 25, halfHeight + 100, '')
            .setFontSize(24);

        return {
            progressBarContainer,
            progressBar,
            loadingText,
            percentText,
            assetText
        };
    }
}
