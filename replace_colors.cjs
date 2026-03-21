const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\umam\\Downloads\\revisi-ta\\penta-revisi\\src';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace indigo with primary
    const original = content;
    content = content.replace(/\bindigo\b/g, 'primary');
    
    // Optional: replace hardcoded #F8FAFC with a class that we can map in tailwind v4, or add bg-background
    // But let's just do indigo -> primary for now to start.
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated colors in: ${file}`);
    }
  }
});
