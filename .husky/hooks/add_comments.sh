#!/bin/sh

# Run the Node.js script to add comments to JS and TS files
node "$(dirname "$0")/hooks/add_comments.js"
