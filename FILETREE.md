```
.
|-- CHANGELOG.md
|-- COMMITLOG.md
|-- CONTRIBUTING.md
|-- FILETREE.md
|-- LICENSE.md
|-- PROMPT.md
|-- README.md
|-- assets
|   |-- objects
|   |   |-- bench.svg
|   |   |-- board.svg
|   |   |-- door.svg
|   |   |-- log.svg
|   |   |-- pipe.svg
|   |   |-- player.svg
|   |   |-- stick.svg
|   |   `-- tree.svg
|   |-- tiled
|   |   |-- postapoc.tiled-project
|   |   |-- postapoc.tiled-session
|   |   `-- terrain.tsx
|   |-- tiles
|   |   |-- concrete_wall.svg
|   |   |-- grass.svg
|   |   |-- grass2.svg
|   |   |-- grass3.svg
|   |   |-- grass4.svg
|   |   `-- white_tile.svg
|   `-- ui
|       |-- forest_silhouette.svg
|       |-- grey_arrow.svg
|       |-- mushroom_cloud.svg
|       |-- postapoc_title.svg
|       |-- red_arrow.svg
|       `-- starry_night.svg
|-- conventional-changelog.config.js
|-- index.html
|-- jest.config.ts
|-- jest.coverage.config.ts
|-- package.json
|-- playwright-screenshots
|   `-- titleScreen.png
|-- playwright.config.ts
|-- public
|   |-- icons
|   |   |-- android-chrome-192x192.png
|   |   |-- android-chrome-512x512.png
|   |   |-- apple-touch-icon.png
|   |   |-- favicon-16x16.png
|   |   |-- favicon-32x32.png
|   |   `-- favicon.ico
|   `-- site.webmanifest
|-- src
|   |-- action
|   |   |-- actionHandler.ts
|   |   |-- attack.ts
|   |   |-- enums.ts
|   |   |-- focus.ts
|   |   |-- focusSystem.ts
|   |   |-- interactionComponent.ts
|   |   |-- interactionSystem.ts
|   |   `-- interactions.ts
|   |-- assets
|   |   |-- menuAssets.json
|   |   |-- objectAssets.json
|   |   |-- terrainAssets.json
|   |   `-- uiAssets.json
|   |-- config
|   |   |-- constants.ts
|   |   |-- controlMapping.json
|   |   |-- debug.json
|   |   |-- eventTypes.ts
|   |   |-- interfaces.ts
|   |   |-- item_groups.json
|   |   `-- items.json
|   |-- core
|   |   |-- controlSystem.ts
|   |   |-- eventBus.ts
|   |   |-- eventHandler.ts
|   |   |-- inversify.config.ts
|   |   |-- keyBindings.ts
|   |   `-- universe.ts
|   |-- entity
|   |   |-- entityHandler.ts
|   |   |-- health.ts
|   |   |-- healthSystem.ts
|   |   |-- lootTable.ts
|   |   |-- objectPool.ts
|   |   `-- phaserSprite.ts
|   |-- factories
|   |   |-- playerFactory.ts
|   |   `-- staticObjectFactory.ts
|   |-- main.ts
|   |-- managers
|   |   |-- objectManager.ts
|   |   `-- playerManager.ts
|   |-- movement
|   |   |-- collider.ts
|   |   |-- collisionSystem.ts
|   |   |-- enums.ts
|   |   |-- movement.ts
|   |   |-- movementHandler.ts
|   |   `-- movementSystem.ts
|   |-- scenes
|   |   |-- bootScene.ts
|   |   |-- mainScene.ts
|   |   `-- titleScene.ts
|   |-- telemetry
|   |   |-- debugPanel.ts
|   |   `-- logger.ts
|   |-- time
|   |   |-- phaserTimeController.ts
|   |   `-- timeSystem.ts
|   `-- utils
|       `-- svgUtils.ts
|-- temp.txt
|-- test-results
|   `-- load_game-When-the-game-loads-the-canvas-loads-and-matches-the-screenshot-chromium
|-- tests
|   |-- playwright
|   |   |-- load_game.spec.ts
|   |   |-- screenshots
|   |   |   `-- load_game.spec.ts
|   |   |       `-- titleScreen.png
|   |   `-- utils
|   |-- setup.ts
|   `-- unit
|       |-- eventBus.test.ts
|       |-- objectPool.test.ts
|       `-- timeSystem.test.ts
|-- tsconfig.json
|-- vite.config.ts
`-- yarn.lock

```