const glob = require('glob');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
console.log('Root directory:', rootDir);
const filePattern = path.join(rootDir, '{src,test}/**/*.{js,ts}');
console.log('File pattern:', filePattern);

const commentTemplate = (relativePath) => {
  return (
    `// Part: ${relativePath}\n` +
    `// Code Reference: \n` +
    `// Documentation: \n\n`
  );
};

const removeOldPathComment = (content) => {
  const regex = /^\/\/\s*(Part:)?\s*[\w-.\/\\]+.*\n?/i;
  return content.replace(regex, '');
};

const hasNewCommentStructure = (content) => {
  const regex =
    /^\/\/\s*Part:.*\n\/\/\s*Code Reference:.*\n\/\/\s*Documentation:.*\n\n/i;
  return regex.test(content);
};

try {
  const files = glob.sync(filePattern);

  files.forEach((file) => {
    const relativePath = path.relative(rootDir, file);
    const content = fs.readFileSync(file, 'utf8');

    // Check if the new comment structure already exists
    if (!hasNewCommentStructure(content)) {
      // Remove old path comments
      const contentWithoutOldComments = removeOldPathComment(content);

      console.log(`Adding comment to ${relativePath}...`);
      const comment = commentTemplate(relativePath);
      fs.writeFileSync(file, comment + contentWithoutOldComments);
    } else {
      console.log(`New comment structure already exists in ${relativePath}`);
    }
  });
} catch (err) {
  console.error('Error finding files:', err);
  process.exit(1);
}
