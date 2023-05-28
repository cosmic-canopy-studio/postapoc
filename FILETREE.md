```
.
|-- CHANGELOG.md
|-- COMMITLOG.md
|-- CONTRIBUTING.md
|-- FILETREE.md
|-- LICENSE.md
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
|   |-- assets
|   |   |-- menuAssets.json
|   |   |-- objectAssets.json
|   |   |-- terrainAssets.json
|   |   `-- uiAssets.json
|   |-- config
|   |   |-- controlMapping.json
|   |   |-- debug.json
|   |   |-- interactions.ts
|   |   `-- item_groups.json
|   |-- core
|   |   |-- components
|   |   |   |-- debugPanel.ts
|   |   |   `-- logger.ts
|   |   |-- definitions
|   |   |   |-- constants.ts
|   |   |   |-- eventTypes.ts
|   |   |   `-- interfaces.ts
|   |   |-- events
|   |   |   |-- actionEvents.ts
|   |   |   `-- movementEvents.ts
|   |   `-- systems
|   |       |-- controlSystem.ts
|   |       |-- eventBus.ts
|   |       |-- inversify.config.ts
|   |       |-- keyBindings.ts
|   |       |-- lootTable.ts
|   |       |-- objectPool.ts
|   |       |-- phaserTimeController.ts
|   |       |-- timeSystem.ts
|   |       `-- universe.ts
|   |-- data
|   |   `-- items.json
|   |-- ecs
|   |   |-- components
|   |   |   |-- attack.ts
|   |   |   |-- collider.ts
|   |   |   |-- container.ts
|   |   |   |-- health.ts
|   |   |   |-- interactionComponent.ts
|   |   |   |-- inventory.ts
|   |   |   |-- item.ts
|   |   |   |-- itemComponent.ts
|   |   |   |-- movement.ts
|   |   |   `-- phaserSprite.ts
|   |   `-- systems
|   |       |-- collisionSystem.ts
|   |       |-- focusSystem.ts
|   |       |-- healthSystem.ts
|   |       |-- interactionSystem.ts
|   |       |-- inventorySystem.ts
|   |       `-- movementSystem.ts
|   |-- main.ts
|   |-- phaser
|   |   |-- factories
|   |   |   |-- containerFactory.ts
|   |   |   |-- itemFactory.ts
|   |   |   |-- playerFactory.ts
|   |   |   `-- staticObjectFactory.ts
|   |   `-- scenes
|   |       |-- bootScene.ts
|   |       |-- mainScene.ts
|   |       `-- titleScene.ts
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
