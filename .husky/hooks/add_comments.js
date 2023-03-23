const glob = require('glob');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../..');
console.log('Root directory:', rootDir);
const filePattern = path.join(rootDir, '{src,test}/**/*.{js,ts}');
console.log('File pattern:', filePattern);

// Add a comment to the top of JavaScript and TypeScript files
const commentTemplate = (relativePath) => `// Part: ${relativePath}\n\n`;

try {
  const files = glob.sync(filePattern);

  console.log('Matched files:', files);

  files.forEach((file) => {
    const relativePath = path.relative(rootDir, file);
    const content = fs.readFileSync(file, 'utf8');

    // Check if the comment already exists
    const comment = commentTemplate(relativePath);
    const hasComment = content.startsWith(comment);

    // If the comment doesn't exist, add it
    if (!hasComment) {
      console.log(`Adding comment to ${relativePath}...`);
      fs.writeFileSync(file, comment + content);
    }
  });
} catch (err) {
  console.error('Error finding files:', err);
  process.exit(1);
}
