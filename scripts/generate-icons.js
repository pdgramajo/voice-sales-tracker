import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../public/favicon.svg');
const outputDir = join(__dirname, '../public');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  for (const size of sizes) {
    const outputPath = join(outputDir, `pwa-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: pwa-${size}x${size}.png`);
  }
  
  const appleIcon = join(outputDir, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleIcon);
  console.log('Generated: apple-touch-icon.png');
  
  console.log('All icons generated successfully!');
}

generateIcons().catch(console.error);
