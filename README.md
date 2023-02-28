# survival-game

Mashing up all the things from our favorite survival games.

## How to Use

You should be able to clone this repository and run `yarn install` to get any of the necessary dependencies.

Once you're done installing, simply run `yarn dev` and the game should begin to run. You'll have to open an internet browser and go to the port that the game is running on (usually `localhost:8080` by default).

The game opens up to a main menu. Only the "Start Game" button does anything - the other two are placeholders. If you click "Start Game", you'll be taken to a black screen with a small sprite. You can move the sprite with the arrow keys. This starter kit is far from feature complete, but it's meant to take away the boilerplate that can come with getting a Phaser 3 + TypeScript project up-and-running.

Running `yarn dev` runs the game in development mode, which produces larger bundle sizes but compiles faster and provides better debug support. If you desire a smaller game bundle or to host your game on a server, you can use `yarn build:prod` to compile the project into an optimized bundle. You can use `yarn prod` to run your game locally with production compilation, but this will cause your hot reloading to take longer.

## Milestones

One intent of this project is to illustrate the evolution of a game over time. As such, major milestones, linked to both commits and branches, are documented here to give folks a chance to get moment in time glances at different stages.

### Milestone 1: Phaser3 getting started

Followed the [basic getting started guide](https://newdocs.phaser.io/docs/3.55.2) to create a basic "Hellow World" app. [Milestone 1 branch](https://github.com/Unnamed-GameDev-Studio/survival-game/tree/milestone-1).

### Milestone 2: An opinionated mashup of starter kits

This repository uses the a combination of [Phaser 3 + TypeScript Starter Kit](https://github.com/josephmbustamante/phaser3-typescript-starter-kit), [Phaser 3 Game Examples written in TypeScript](https://github.com/digitsensitive/phaser3-typescript), and [Vite Phaser Game Starter](https://ubershmekel.github.io/vite-phaser-ts-starter/) as a starting point with a few modifications. See [opinions.md](docs/opinions.md) in the docs folder for detailed discussions on design and package choices. [More information on the base starter kit can be found in this blog post](https://spin.atomicobject.com/2019/07/13/phaser-3-typescript-tutorial/). [Milestone 2 branch](milestone-2).

### Milestone 3: A person, a bench, and some violence

The goal of this milestone is to start implementing game features and adopt best practices along the way. Work for this milestone will use this [issue](https://github.com/Unnamed-GameDev-Studio/survival-game/issues/1), which describes the desired features and includes a separate staging branch. Features will start on a feature branch that will merge in to the milestone 3 branch via pull request. This repeats for merging milestone 3 to the main branch upon completion. (think of this as the public release). More on branches [here](https://stackoverflow.com/questions/2100829/when-should-you-branch).

### Milestone 4: The steady hand of game systems (when properly tested)

This milestone represents the shift from "kicking the tires" of Phaser toward laying a foundation that is solid enough to build a game on. The two primary objectives are de-coupling code with an eye on scalability, and testing at both the unit and behavioral level. The summary is below, see the opinions page in the docs for additional discourse.

The Composition pattern outlined in Robert Nystrom's talk [Is There More to Game Architecture than ECS?](https://www.youtube.com/watch?v=JxI3Eu5DPwE) helps build loosely coupled systems with components that scale and are easier to swap out compared to the tightly coupled model used in Milestone 3. [These](https://www.youtube.com/watch?v=aKLntZcp27M&t=1769s) [videos](https://www.youtube.com/watch?v=U03XXzcThGU) were also helpful in coming to terms with optimal patterns derived from tough lessons learned. Going forward design changes should be in response to problems or constraints encountered while building in an attempt to avoid gazing in to the infinite abyss of optimal pattern metaphysical meditation.

For testing, [Jest](https://jestjs.io/) has wide adoption resulting with many useful integrations, and no is harder to use than the alternatives. [Wallaby.js](https://wallabyjs.com/) is a VERY helpful visual test runner, and cucumber integration via [jest-cucumber](https://github.com/bencompton/jest-cucumber) adds some BDD/TDD capabilities to leverage as the larger parts of the codebase begin to stabilize. Be careful not to confuse jest-cucumber with cucumber-jest, \_sigh\_.

The repo at the end of milestone-4 is a little bloated with other tools as I experiment to find out what is useful longer term, but I expect to trim the fat once I've figured out the sweet spot. One parting thought on the matter, the process of trying to write tests laid bare many areas that I thought I'd done a sufficient job of decoupling that told a very different story when I went to write a few "simple" tests. If for no other reason I think this makes for a great spot checking mechanism on how clean the code is.

### Milestone 5:

Hopefully the number of milestones that don't add actual game features will be kept to a minimum going forward. For this milestone I intend to pursue the initial aspects of the crafting system, which means the bench's death with not go without purpose. Along the way some UI overlays are likely to end up in the mix, and "thing" related data will be pushed to config files.
