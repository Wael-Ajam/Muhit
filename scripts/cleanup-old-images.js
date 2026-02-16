const fs = require('fs');
const path = require('path');

const directories = [
  'public/images/projects',
  'public/images/team', 
  'public/images/specializations'
];

let totalDeleted = 0;
let totalSize = 0;

for (const dir of directories) {
  if (!fs.existsSync(dir)) continue;
  
  console.log(`\n📁 Processing ${dir}...`);
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.png') {
      const baseName = path.basename(file, ext);
      const webpPath = path.join(dir, `${baseName}.webp`);
      
      // Only delete if WebP version exists
      if (fs.existsSync(webpPath)) {
        const filePath = path.join(dir, file);
        const size = fs.statSync(filePath).size;
        
        fs.unlinkSync(filePath);
        totalDeleted++;
        totalSize += size;
        
        console.log(`🗑️  Deleted ${file} (${(size / 1024).toFixed(1)} KB)`);
      }
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`📊 Total deleted: ${totalDeleted} files`);
console.log(`💾 Space freed: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
console.log('='.repeat(50));
