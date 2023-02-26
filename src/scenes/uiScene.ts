const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'UI'
};

export class UIScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  create() {
    let playerHealth = this.add.text(-10, -10, 'Player: 3');
    let benchHealth = this.add.text(-10, -10, 'Bench: 3');

    let ourGame = this.scene.get('Game');

    //  Listen for events from it
    ourGame.events.on(
      'addScore',
      function () {
        this.score += 10;

        info.setText('Score: ' + this.score);
      },
      this
    );
  }
}
