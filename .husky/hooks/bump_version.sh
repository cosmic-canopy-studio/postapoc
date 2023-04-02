#!/bin/sh

# Bump version based on commit message
last_commit_message=$(git log --format=%B -n 1 HEAD)

if echo "$last_commit_message" | grep -q 'bump skip'; then
  echo "Skipping version bump"
else
  # bump patch version
  yarn version --patch --no-commit-hooks --no-git-tag-version
fi

# Get the new version number
new_version=$(jq -r .version package.json)

# Create a tag with the new version number
git tag "v$new_version"

# Commit the version bump
git add package.json
