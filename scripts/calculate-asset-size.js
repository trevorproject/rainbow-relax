import { readdir, stat, access } from 'fs/promises';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { constants } from 'fs';

async function calculateAssetSize(dirPath) {
  let totalSize = 0;
  
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        totalSize += await calculateAssetSize(fullPath);
      } else if (entry.isFile()) {
        const stats = await stat(fullPath);
        totalSize += stats.size;
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }
  
  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

async function main() {
  const distPath = join(process.cwd(), 'dist');
  
  try {
    // Check if dist directory exists
    try {
      await access(distPath, constants.F_OK);
    } catch (error) {
      console.error('❌ Error: dist directory does not exist. Please run "npm run build" first.');
      process.exit(1);
    }
    
    // Calculate total size of all files in dist directory
    const totalSize = await calculateAssetSize(distPath);
    const formattedSize = formatBytes(totalSize);
    
    const output = {
      totalSizeBytes: totalSize,
      totalSizeFormatted: formattedSize,
      calculatedAt: new Date().toISOString()
    };
    
    const outputPath = join(distPath, 'app-size.json');
    await writeFile(outputPath, JSON.stringify(output, null, 2), 'utf-8');
    
    console.log(`✅ Asset size calculated: ${formattedSize} (${totalSize} bytes)`);
    console.log(`✅ Written to: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error calculating asset size:', error);
    process.exit(1);
  }
}

main();

