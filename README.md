# PostApoc: Surviving and Thriving

Mashing up all the great survival games in pursuit of the ultimate survival simulator.

## How to Use

1. Clone this repository and run `yarn install`.
2. Run `yarn dev --open` to open the game in a browser at `localhost:8080`.
3. Click "Start Game" or press space bar to start.

## Milestones

This project exposes the evolution of its development over time in the form of milestones. Major milestones, linked to
branches, are documented to give moment-in-time windows into the game and its code at different stages.

### Milestone 1: Phaser3 getting started

Followed the [basic getting started guide](https://newdocs.phaser.io/docs/3.55.2) to create a basic "Hello World"
app. [Milestone 1 branch](https://github.com/Unnamed-GameDev-Studio/survival-game/tree/milestone-1).

### Milestone 2: An opinionated mashup of starter kits

This repository uses a combination
of [Phaser 3 + TypeScript Starter Kit](https://github.com/josephmbustamante/phaser3-typescript-starter-kit), [Phaser 3 Game Examples written in TypeScript](https://github.com/digitsensitive/phaser3-typescript),
and [Vite Phaser Game Starter](https://ubershmekel.github.io/vite-phaser-ts-starter/) as a starting point with a few
modifications. See [opinions.md](docs/opinions.md) in the docs folder for detailed discussions on design and package
choices. [More information on the base starter kit can be found in this blog post](https://spin.atomicobject.com/2019/07/13/phaser-3-typescript-tutorial/). [Milestone 2 branch](milestone-2).

### Milestone 3: A person, a bench, and some violence

The goal of this milestone is to start implementing game features and adopt best practices along the way. Work for this
milestone will use this [issue](https://github.com/Unnamed-GameDev-Studio/survival-game/issues/1), which describes the
desired features and includes a separate staging branch. Features will start on a feature branch that will merge into
the milestone 3 branch via pull request. This repeats for merging milestone 3 to the main branch upon completion (think
of this as the public release). More on
branches [here](https://stackoverflow.com/questions/2100829/when-should-you-branch).

### Milestone 4: The steady hand of game systems (when properly tested)

This milestone represents the shift from "kicking the tires" of Phaser toward laying a foundation that is solid enough
to build a game on. The two primary objectives are decoupling code with an eye on scalability and testing at both the
unit and behavioral level. The summary is below; see the opinions page in the docs for additional discourse.

The Composition pattern outlined in Robert Nystrom's
talk [Is There More to Game Architecture than ECS?](https://www.youtube.com/watch?v=JxI3Eu5DPwE) helps build loosely
coupled systems with components that scale and are easier to swap out compared to the tightly coupled model used in
Milestone

3. [These](https://www.youtube.com/watch?v=aKLntZcp27M&t=1769s) [videos](https://www.youtube.com/watch?v=U03XXzcThGU)
   were also helpful in coming to terms with optimal patterns derived from tough lessons learned. Going forward, design
   changes should be in response to problems or constraints encountered while building in an attempt to avoid
