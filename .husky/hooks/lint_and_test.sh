#!/bin/sh

# Check staged files with Lint-Staged
yarn test && yarn lint-staged

git add coverage/*
