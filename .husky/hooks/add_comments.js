const glob = require('glob');
const fs = require('fs');
const path = require('path');

// Add a comment to the top of JavaScript and TypeScript files
const filePattern = '{src,tests}/**/*.{js,ts}'; // Adjust this pattern to match your project structure
const commentTemplate = (relativePath) => `// Part: ${relativePath}\n\n`;

glob(filePattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    process.exit(1);
  }

  files.forEach((file) => {
    constrelativePath = path.relative(process.cwd(), file);
    const content = fs.readFileSync(file, 'utf8');

    // Check if the comment already exists
    const comment = commentTemplate(relativePath);
    const hasComment = content.startsWith(comment);

    // If the comment doesn't exist, add it
    if (!hasComment) {
      fs.writeFileSync(file, comment + content);
    }
  });
});
