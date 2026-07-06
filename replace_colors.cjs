const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace all instances of #E41B23 (case insensitive) with #FF1493
    content = content.replace(/#e41b23/gi, '#FF1493');
    
    // Replace the gradient red-light red with deep pink gradient
    content = content.replace(/#ff4b52/gi, '#E91E63');
    
    // In ProductDetailsPage, there was #E91E63 which is also a nice pink. We'll leave it as is if it's already there.

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated: ' + filePath);
    }
  }
});
