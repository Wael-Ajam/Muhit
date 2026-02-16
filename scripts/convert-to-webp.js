const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const directories = [
  'public/images/projects',
  'public/images/team', 
  'public/images/specializations'
];

async function convertToWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const oldSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((oldSize - newSize) / oldSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)} (${savings}% saved)`);
    return { old: oldSize, new: newSize };
  } catch (err) {
    console.error(`❌ Error converting ${inputPath}:`, err.message);
    return null;
  }
}

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalOld = 0, totalNew = 0;
  
  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const inputPath = path.join(dir, file);
      const baseName = path.basename(file, path.extname(file));
      const outputPath = path.join(dir, `${baseName}.webp`);
      
      // Skip if webp already exists
      if (fs.existsSync(outputPath)) {
        console.log(`⏭️  ${file} already has WebP version`);
        continue;
      }
      
      const result = await convertToWebP(inputPath, outputPath);
      if (result) {
        totalOld += result.old;
        totalNew += result.new;
      }
    }
  }
  
  return { totalOld, totalNew };
}

async function main() {
  console.log('🚀 Starting WebP conversion...\n');
  
  let grandTotalOld = 0, grandTotalNew = 0;
  
  for (const dir of directories) {
    if (fs.existsSync(dir)) {
      console.log(`\n📁 Processing ${dir}...`);
      const { totalOld, totalNew } = await processDirectory(dir);
      grandTotalOld += totalOld;
      grandTotalNew += totalNew;
    }
  }
  
  const totalSavings = grandTotalOld - grandTotalNew;
  const percentSaved = grandTotalOld > 0 ? (totalSavings / grandTotalOld * 100).toFixed(1) : 0;
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Total converted: ${(grandTotalOld / 1024 / 1024).toFixed(2)} MB → ${(grandTotalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`💾 Total saved: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${percentSaved}%)`);
  console.log('='.repeat(50));
}

main().catch(console.error);
