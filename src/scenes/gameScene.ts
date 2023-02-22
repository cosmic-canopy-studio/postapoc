import { Actor, Interactable } from '../entities';
import { log } from '../utilities';
import { Universe } from '../systems/universe';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private universe!: Universe;

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    this.universe = new Universe(this);

    this.initTileset();

    this.initPlayer();

    this.initObjects();
    log.debug('game scene created');
  }

  private initObjects() {
    const bench = new Interactable(this, 200, 200, 'bench');
    this.universe.addInteractable(bench);

    const currentPlayerActor = this.universe.getControlledActor();
    if (!currentPlayerActor) {
      throw new Error('No player actor');
    } else {
      this.physics.add.collider(
        currentPlayerActor.sprite,
        bench.sprite,
        () => this.handlePlayerInteractableCollision(bench),
        undefined,
        this
      );
    }
  }

  private initPlayer() {
    const player = new Actor(this, 100, 200, 'character');
    this.universe.addActor(player);
    this.universe.setControlledActor(player);
    this.universe.setSceneCameraToPlayer();
  }

  private initTileset() {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
  }

  private handlePlayerInteractableCollision(interactable: Interactable) {
    this.universe.getControlledActor().setFocus(interactable);
  }

  update() {
    this.universe.update();
  }
}
