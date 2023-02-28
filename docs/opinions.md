# Opinions

This document captures design and package choices not the authoritative intent of being "right", but to provide a basis for understanding choices that are available so that readers can form their own opinions.

## Use of TypeScript

Our intent to use patterns that are beginner friendly first, and have on long term utility second. Recognizing that Unity and Unreal use strongly typed C derivatives, it is desirable to introduce the pattern here (in addition to the benefits that static typing brings to programmers of all skill levels at helping to proactively identify issues). We have opted to use the ['only-warn' plugin](https://github.com/bfanger/eslint-plugin-only-warn) that downgrades all TypeScript errors to warnings so as not to prevent builds, but rather to provide users with recommended feedback. Future iterations of the project may remove this as part of the build pipeline for in favor of stricter code standards in production.

## Yarn vs NPM

This took me way too long to form a good opinion on, and it's not about speed. I prefer yarn for two reasons: NPM is extremely confusing when it comes to vulnerabilities, and following their default path is a often a recipe to build-breaking disaster. Furthermore, having worked a decent amount with Open Source Software (OSS) for Enterprises, ensuring license type, a feature of which is native to Yarn, is highly valuable due to the subtle legal implications of different OSS licenses. The one thing I've run in to that I would count against yarn is that NPM is far more common, meaning when you go to borrow from other projects you will often need to be prepared to translate build patterns from NPM to Yarn.

## Directory Structure

Following a React style structure with the intent to potentially include it later. It is a prevalent style that gives each root level folder a clear purpose and division of concerns.

## Vite vs Webpack (and others)

[Vite](https://vitejs.dev/) strikes a good balance between ease of use for beginners and scalability and has gained a solid share adoption. While Webpack is well established with advanced features, it's age and scope have made it less approachable over time as newer alternatives aimed to for a better user experience to competitively attract adoption. For quick projects that will remain small [Parcel](https://parceljs.org/) is another good alternative to consider.

## Linting

Linting is something I was slow to appreciate in the beginning but can't get enough of now. Linting is like spelling and grammar checking for code (although next level [prose and spelling](https://vale.sh/) linters exist as well). Linting is like having a patient mentor writing code with you. Linters fix trivial issues and nit-picks without needing the users attention (I dream of the day when the debate of [spaces vs tabs](https://alexkondov.com/indentation-warfare-tabs-vs-spaces/) is a museum relic and not an opening topic for aspirants), and will point out best practices in addition to errors. I recommend learning to tune linter output at some point mid-way in to your coding journey. As I write this, I cringe proselint judging my every word. That said, having become accustomed to the process I seek out linters for almost everything I engage with (i.e. configuration files, etc).

## Entity Component Systems (ECS), Dependency Injection (DI), and Composition

At the start of Milestone 4 I had intended to move everything to [bitECS](https://github.com/NateTheGreatt/bitECS) and [InversifyJS](https://inversify.io/) and call it a day. In Robert Nystrom's [video](https://www.youtube.com/watch?v=JxI3Eu5DPwE) he makes an off handed reference to how ECS is not the silver bullet and asks the room how many are using it, and the how many are having cache-miss issue. It was all of them. It's important to know that the context was about building rogue-likes, and in a room full of rogue-like developrs, so the specificity of the problem might not be relevant to other styles of games. But this is a rogue-like, so I felt myself warned. For all I know bitECS doesn't have the same risks, but it was enough to make me take a step back and re-evaluate what design patterns I would adopt.

While I was contemplating what to do, I began using InversifyJS to help break things up the gordian knot that my tiny codebase had already become. At first it was really helpful, and allowed me to eliminate some of the worst offending toxic relationships. As I moved toward using a composition oriented design I found myself remove the DI and not adding it to the newly refactored _saner_ modules. It's likely I don't fully appreciate their use, and / or the value isn't as high for smaller projects, but in either case I would chalk it up to me and not them.

To summarize what I have come to understand about composition, rather than direct inheritance being the primary form of feature sharing, you add parts to a given whole. For example a character's core stats can come from a module, currently named "thing", and separately it's representation in a given game engine (i.e. a Phaser Sprite) can be attached separately, and crucially, optionally. I briefly flirted with calling all things "Nouns" and actions "Verbs", which sounded really cool until I realized I'd be typing those words a lot and decided to reel my "creativity" in.

This pattern really began to gel for me once I tried to start testing things and realized that to have a person attack a bench initially required me to summon the entire game world, and continued to be a saving grace as I encountered similar unnecessary dependencies. A few places still need decoupling, and my hope is that judicious use of observer/ event patterns will help smooth this out. For now I also aim to rely as minimally as possible on Phaser libraries, using either natively available alternatives, or enterprise grade alternatives (like Redux).
