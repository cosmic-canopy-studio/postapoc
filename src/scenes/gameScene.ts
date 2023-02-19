import 'reflect-metadata';
import { TYPES } from '../constants/types';
import PlayerInput from '../components/playerInput';
import '../actors/actor';
import '../interactables/interactable';
import Actor from '../actors/actor';
import Interactable from '../interactables/interactable';
import GridEngineController from '../components/gridEngineController';
import container from '../config/inversify.config';
import { Logger } from 'tslog';

const logger = new Logger({ type: 'pretty' });

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

export class GameScene extends Phaser.Scene {
  private controller: GridEngineController;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Actor;
  private status!: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
    this.controller = container.get<GridEngineController>(
      TYPES.GridEngineController
    );
  }

  public create(): void {
    const interiorTilemap = this.make.tilemap({ key: 'basic-interior' });
    interiorTilemap.addTilesetImage('interior', 'interior');
    for (let i = 0; i < interiorTilemap.layers.length; i++) {
      interiorTilemap.createLayer(i, 'interior', 0, 0);
    }
    this.cursors = this.input.keyboard.createCursorKeys();

    this.controller.create(this, interiorTilemap, { characters: [] });

    const gridEngine = this.controller.getEngine();

    const playerInput = container.get(TYPES.PlayerInput) as PlayerInput;
    playerInput.setCursors(this.cursors);

    const bench = this.add.interactable(0, 0, 'bench');

    this.player = this.add.actor(0, 0, 'character') as Actor;

    this.player.setControlState(playerInput);

    const playerCharacter = {
      id: this.player.getId(),
      sprite: this.player,
      startPosition: { x: 2, y: 2 },
      charLayer: 'ground'
    };

    this.status = this.add.text(-10, -20, this.player.getFocus() || 'none');

    gridEngine.addCharacter(playerCharacter);

    const benchCharacter = {
      id: 'bench',
      sprite: bench,
      startPosition: { x: 4, y: 2 },
      charLayer: 'ground'
    };

    gridEngine.addCharacter(benchCharacter);

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);

    gridEngine.movementStarted().subscribe(({ direction }) => {
      this.player.play('walk-'.concat(direction));
      logger.debug(`movement started: ${direction}`);
    });
    gridEngine.movementStopped().subscribe(({ direction }) => {
      this.player.play('idle-'.concat(direction));
      logger.debug(`movement stoped: ${direction}`);
    });

    gridEngine.directionChanged().subscribe(({ direction }) => {
      this.player.play('idle-'.concat(direction));
      logger.debug(`direction changed: ${direction}`);
    });

    this.physics.add.collider(
      this.player,
      bench,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      this.handlePlayerInteractableCollision as ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  public update(): void {
    this.player.update();
    //this.updatePlayerFocus();
  }

  private handlePlayerInteractableCollision(_obj1: Actor, obj2: Interactable) {
    this.add.text(100, -20, 'collision');
    this.player.setFocus(obj2);
  }

  private updatePlayerFocus() {
    const gridEngine = this.controller.getEngine();
    const facingTile = gridEngine.getFacingPosition(this.player.getId());
    const tileObject = gridEngine.getCharactersAt(facingTile, 'ground');
    if (tileObject.length > 0) {
      const object = gridEngine.getSprite(tileObject[0]) as Interactable;
      this.player.setFocus(object);
    }
    this.status.text = this.player.getFocus() || 'none';
  }
}
