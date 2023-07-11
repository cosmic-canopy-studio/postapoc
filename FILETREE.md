```
.
├── CHANGELOG.md
├── COMMITLOG.md
├── CONTRIBUTING.md
├── FILETREE.md
├── LICENSE.md
├── PROMPT.md
├── README.md
├── assets
│   ├── biome
│   │   └── shelter
│   │       ├── exterior.png
│   │       └── shelter.json
│   ├── data
│   ├── kennynl
│   │   ├── Tilesheet.txt
│   │   ├── licenses.md
│   │   ├── player.png
│   │   ├── playerSheet.png
│   │   ├── roguelike-city.json
│   │   ├── roguelike-city.png
│   │   ├── roguelike-city.tmx
│   │   └── survival-items.png
│   └── prototype
│       ├── items
│       │   └── hammer.svg
│       ├── objects
│       │   ├── bench.svg
│       │   ├── board.svg
│       │   ├── door.svg
│       │   ├── log.svg
│       │   ├── pipe.svg
│       │   ├── player.svg
│       │   ├── rock.svg
│       │   ├── stick.svg
│       │   └── tree.svg
│       ├── tiles
│       │   ├── concrete_wall.svg
│       │   ├── dirt.svg
│       │   ├── dirt2.svg
│       │   ├── dirt3.svg
│       │   ├── grass.svg
│       │   ├── grass2.svg
│       │   ├── grass3.svg
│       │   ├── grass4.svg
│       │   └── white_tile.svg
│       └── ui
│           ├── forest_silhouette.svg
│           ├── grey_arrow.svg
│           ├── mushroom_cloud.svg
│           ├── postapoc_title.svg
│           ├── red_arrow.svg
│           └── starry_night.svg
├── conventional-changelog.config.js
├── index.html
├── jest.config.ts
├── jest.coverage.config.ts
├── package.json
├── playwright-report
├── playwright-screenshots
│   └── titleScreen.png
├── playwright.config.ts
├── public
│   ├── icons
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── favicon.ico
│   └── site.webmanifest
├── sonar-project.properties
├── src
│   ├── action
│   │   ├── components
│   │   │   └── attack.ts
│   │   ├── data
│   │   │   ├── enums.ts
│   │   │   ├── events.ts
│   │   │   ├── interfaces.ts
│   │   │   └── types.ts
│   │   └── systems
│   │       ├── actionHandler.ts
│   │       ├── actionLogic.ts
│   │       └── craftSystem.ts
│   ├── biome
│   │   ├── data
│   │   │   ├── biomes.ts
│   │   │   ├── constants.ts
│   │   │   └── interfaces.ts
│   │   └── systems
│   │       ├── biomeJSONCache.ts
│   │       ├── biomeManager.ts
│   │       └── overworldManager.ts
│   ├── core
│   │   ├── assets
│   │   │   ├── kennynl
│   │   │   │   ├── objectAssets.json
│   │   │   │   └── tilesetAssets.json
│   │   │   └── prototype
│   │   │       ├── itemAssets.json
│   │   │       ├── menuAssets.json
│   │   │       ├── objectAssets.json
│   │   │       ├── terrainAssets.json
│   │   │       └── uiAssets.json
│   │   ├── config
│   │   │   ├── constants.ts
│   │   │   └── controlMapping.json
│   │   ├── data
│   │   │   ├── events.ts
│   │   │   └── types.ts
│   │   ├── scenes
│   │   │   ├── bootScene.ts
│   │   │   ├── mainScene.ts
│   │   │   └── titleScene.ts
│   │   ├── systems
│   │   │   ├── assetLoader.ts
│   │   │   ├── controlSystem.ts
│   │   │   ├── eventBus.ts
│   │   │   ├── eventHandler.ts
│   │   │   ├── inversify.config.ts
│   │   │   ├── keyBindings.ts
│   │   │   ├── tileProcessor.ts
│   │   │   └── universe.ts
│   │   └── utils
│   │       └── svgUtils.ts
│   ├── entity
│   │   ├── components
│   │   │   ├── focus.ts
│   │   │   ├── health.ts
│   │   │   ├── inventory.ts
│   │   │   ├── openableState.ts
│   │   │   └── phaserSprite.ts
│   │   ├── data
│   │   │   ├── constants.ts
│   │   │   ├── enums.ts
│   │   │   ├── events.ts
│   │   │   ├── items.json
│   │   │   ├── staticObjects.json
│   │   │   └── types.ts
│   │   ├── factories
│   │   │   ├── creatureFactory.ts
│   │   │   ├── entityFactory.ts
│   │   │   ├── itemFactory.ts
│   │   │   └── staticObjectFactory.ts
│   │   ├── scenes
│   │   │   ├── craftingScene.ts
│   │   │   ├── draggableScene.ts
│   │   │   ├── helpScene.ts
│   │   │   └── inventoryScene.ts
│   │   └── systems
│   │       ├── dataManager.ts
│   │       ├── entityHandler.ts
│   │       ├── entityManager.ts
│   │       ├── entityNames.ts
│   │       ├── focusManager.ts
│   │       ├── healthSystem.ts
│   │       ├── objectPool.ts
│   │       └── uiHandler.ts
│   ├── main.ts
│   ├── movement
│   │   ├── components
│   │   │   ├── collider.ts
│   │   │   ├── motion.ts
│   │   │   └── position.ts
│   │   ├── data
│   │   │   ├── constants.ts
│   │   │   ├── enums.ts
│   │   │   └── events.ts
│   │   └── systems
│   │       ├── collision.ts
│   │       ├── movement.ts
│   │       └── movementHandler.ts
│   ├── telemetry
│   │   ├── config
│   │   │   └── debug.json
│   │   ├── data
│   │   │   ├── enums.ts
│   │   │   └── events.ts
│   │   └── systems
│   │       ├── debugPanel.ts
│   │       └── logger.ts
│   └── time
│       ├── data
│       │   ├── enums.ts
│       │   ├── events.ts
│       │   └── interfaces.ts
│       └── systems
│           ├── phaserTimeController.ts
│           └── timeSystem.ts
├── temp.txt
├── test-results
│   └── load_game-When-the-game-loads-the-canvas-loads-and-matches-the-screenshot-chromium
├── tests
│   ├── playwright
│   │   ├── load_game.spec.ts
│   │   └── screenshots
│   │       └── load_game.spec.ts
│   │           └── titleScreen.png
│   ├── setup.ts
│   └── unit
│       ├── eventBus.test.ts
│       ├── objectPool.test.ts
│       └── timeSystem.test.ts
├── tsconfig.json
├── utils
│   ├── cdda_to_tiled.js
│   └── examples
│       ├── converted.json
│       ├── original.json
│       ├── tilemap_packed.png
│       ├── tileset.json
│       └── tileset.png
├── vite.config.ts
└── yarn.lock

```
