# Contributing to Postapoc

First off, thank you for considering contributing to Postapoc! It's people like you that make Postapoc such a great game. This document provides guidelines for contributing to the project.

## How Can I Contribute?

There are many ways you can contribute:

### Reporting Bugs

This section guides you through submitting a bug report for Postapoc. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples.
- Describe the behavior you observed after following the steps and point out what exactly is the problem with that behavior.
- Explain which behavior you expected to see instead and why.
- Include screenshots and animated GIFs which show you following the described steps and clearly demonstrate the problem.
- If the problem is related to performance, include a performance profile capture with your report.
- If the problem wasn't triggered by a specific action, describe what you were doing before the problem happened.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Postapoc, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps. Include copy/pasteable snippets which you use in those examples, as Markdown code blocks.
- Describe the current behavior and explain which behavior you expected to see instead and why.
- Include screenshots and animated GIFs which help you demonstrate the steps or point out the part of Postapoc which the suggestion is related to.

### Pull Requests

The process described here has several goals:

- Maintain Postapoc's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Postapoc
- Enable a sustainable system for Postapoc's maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

- Follow all instructions in the template
- After you submit your pull request, verify that all status checks are passing
**NOTE:** Windows users will need to add gnuwin32's version of tree.exe to their PATH to get the filetree to generate properly. You can download it [here](http://gnuwin32.sourceforge.net/packages/tree.htm).

### Project Structure

This project is organized by features with the intent of making it easier to mod by adding new features that follow a standard pattern for integrating with core game systems and other features.

Each feature has a top level folder, followed by consistent use of subfolders as follows:
- component: Simple objects that are attached to entities. These are usually used to add functionality to an entity.
- config: Configuration files for the feature.
- data: Data files for the feature. This includes interface and enum definitions, as well as any other data that is used by the feature.
- systems: Systems that are used by the feature. These are usually used to add functionality to an entity.

Here is the high level intent of each feature:
- core: The core game systems and data. This is the base game.
- action: Actions that can be performed by entities.
- entity: Helper functions for working with entities.
- movement: Things related to moving entities around the map.
- telemetry: Things related to debugging, logging, and analytics.
- time: Things related to the manipulation and passage of time.

### Code Contributions

When contributing to the codebase, please keep the following in mind:

- Ensure cross-platform compatibility for every change that's accepted. Windows, Mac, and Linux are all required.
- Ensure that your code follows the established style guide. The codebase should look as if it was written by a single individual, not a group.
- Create issues for any major changes and enhancements that you wish to make. Discuss things transparently and get community feedback.
- Don't add any dependencies that aren't needed. If you do, please ensure they're added to the right location (devDependencies or dependencies).
- If you want to implement a new feature, please create a suggestion issue first to discuss it before sending a pull request.
- Keep your pull requests as small as possible. They should only add/remove features or fix bugs. If you're adding multiple features or fixing multiple bugs, send them as separate pull requests.
- Write detailed commit messages, in-line with the conventions followed in the project.

Thanks again for contributing! We're excited to see what you'll bring to the project.

