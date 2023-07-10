
**Project Overview:**

We're building a real-time survival simulation game, centered around a single player character. The game will integrate
the intricate dynamics of skill mastery, crafting, building, and vehicle operation, drawing inspiration from Cataclysm:
Dark Days Ahead. It will also feature AI teammate coordination and emergent storytelling reminiscent of RimWorld. A key
feature of the game is time manipulation, allowing players to pause during inactivity and accelerate for laborious
tasks. Our gaming environment is non-grid-based, offering high customizability with skinnable and themeable settings
that can accommodate a variety of time frames and environments.

**Inspirations:**

- [Cataclysm: Dark Days Ahead](https://github.com/CleverRaven/Cataclysm-DDA)
- [RimWorld](https://rimworldgame.com/)
- [Neo Scavenger](https://store.steampowered.com/app/248860/NEO_Scavenger/)
- [Project Zomboid](https://projectzomboid.com/)
- [UnReal World](https://www.unrealworld.fi/)
- [Dwarf Fortress](https://www.bay12games.com/dwarves/)

**Key Tech Stack:**

- [Phaser](https://github.com/photonstorm/phaser)
- [bitECS](https://github.com/NateTheGreatt/bitECS)
- [RBush](https://github.com/mourner/rbush)
- [Mitt](https://github.com/developit/mitt)
- [LogLevel](https://github.com/pimterry/loglevel)

**Design Considerations:**

The development process will involve Typescript, Yarn, and Vite. We're aiming for a clean codebase with smaller,
purpose-driven classes and functions. The goal is to maintain a loosely coupled architecture with dependency injection
where necessary. Key design patterns to be employed include object pooling, state, and factory patterns. Event-driven
programming will be preferred, with updates factoring in elapsed time. Prefer to use existing packages. When an external
package is needed, only suggest packages that have commits within the last six months.

**Moddability:**

The game should be moddable, enabling players to introduce self-contained add-on modules that can be quickly swapped in
and out.

**Additional Tools and Libraries:**

- [Tweakpane](https://github.com/cocopon/tweakpane)
- [SVG Web Guide](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [SVG.js](https://github.com/svgdotjs/svg.js)
- [Inversify](http://inversify.io/)
- [InversifyJS](https://github.com/inversify/InversifyJS)

**Testing:**

The testing framework will include Jest and Playwright. Functions should be implemented with debug logging. For path
references, absolute paths are preferred.

- [Jest](https://jestjs.io/)
- [ts-jest](https://kulshekhar.github.io/ts-jest/)
- [jsdom](https://github.com/jsdom/jsdom)
- [Playwright](https://playwright.dev/docs/)
- [jest-playwright](https://github.com/playwright-community/jest-playwright)

**File Handling:**

In terms of file management, the 'touch' command should be utilized to create new files before any editing takes place.

**Project Structure:**

<<insert FILETREE.md>>

**Current Instructions:**
This is only context, wait for my next instruction
