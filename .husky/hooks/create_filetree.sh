#!/bin/sh

tree -I 'node_modules|dist' > temp.txt

# Check if the operating system is macOS
if [ "$(uname)" = "Darwin" ]; then
    # macOS
    sed -i '' -e '$d' temp.txt
else
    # Others (Linux, etc.)
    sed -i '$d' temp.txt
fi

echo '```' > FILETREE.md
cat temp.txt >> FILETREE.md
echo '```' >> FILETREE.md
rm temp.txt

git add FILETREE.md
