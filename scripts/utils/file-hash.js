const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

function calculateFileHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getDirectoryHash(dirPath) {
  const files = {};
  
  function processDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isFile()) {
        const relativePath = path.relative(dirPath, fullPath);
        files[relativePath] = {
          hash: calculateFileHash(fullPath),
          mtime: stat.mtime.toISOString()
        };
      } else if (stat.isDirectory()) {
        processDirectory(fullPath);
      }
    }
  }
  
  processDirectory(dirPath);
  return files;
}

module.exports = { calculateFileHash, getDirectoryHash };