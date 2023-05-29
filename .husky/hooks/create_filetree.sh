#!/bin/sh

tree -I 'node_modules|dist' > temp.txt
sed -i '' -e '$d' temp.txt
echo '```' > FILETREE.md
cat temp.txt >> FILETREE.md
echo '```' >> FILETREE.md
rm temp.txt

git add FILETREE.md
