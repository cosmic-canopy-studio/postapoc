import { MenuButton } from '../ui/menu-button';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'MainMenu'
};

/**
 * The initial scene that starts, shows the splash screens, and loads the necessary assets.
 */
export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const bg = this.add.sprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      'sky'
    );
    bg.setDisplaySize(this.sys.canvas.width, this.sys.canvas.height);

    this.add
      .text(
        100,
        50,
        'This is a sample main menu. Click the "Start" button below to run your game.',
        {
          color: '#FFFFFF'
        }
      )
      .setFontSize(24);

    new MenuButton(this, 100, 150, 'Start Game', () => {
      this.scene.start('Game');
    });

    new MenuButton(this, 100, 250, 'Settings', () =>
      console.log('settings button clicked')
    );

    new MenuButton(this, 100, 350, 'Help', () =>
      console.log('help button clicked')
    );
  }
}
