const config = require('conventional-changelog-conventionalcommits');

module.exports = config({
  infile: 'CHANGELOG.md',
  sameFile: true,
  releaseCount: 0,
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styles' },
    { type: 'refactor', section: 'Code Refactoring' },
    { type: 'test', section: 'Tests' },
    { type: 'build', section: 'Build System' },
    { type: 'ci', section: 'Continuous Integration' },
    { type: 'perf', section: 'Performance Improvements' },
    { type: 'revert', section: 'Reverts' },
    { type: 'improvement', section: 'Improvements' },
    { type: 'chore', hidden: true },
  ],
});
