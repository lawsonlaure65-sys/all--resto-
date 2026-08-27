import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  const publicDir = path.resolve('public');

  const targets = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon.png', size: 64 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'apple-touch-icon-180x180.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'icon-maskable-192.png', size: 192 },
    { name: 'icon-maskable-512.png', size: 512 },
  ];

  for (const target of targets) {
    const outputPath = path.join(publicDir, target.name);
    await sharp(svgBuffer)
      .resize(target.size, target.size)
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${target.name} (${target.size}x${target.size})`);
  }

  // Also create favicon.ico as a 32x32 / 48x48 PNG format or copy
  fs.copyFileSync(path.join(publicDir, 'favicon-32x32.png'), path.join(publicDir, 'favicon.ico'));
  console.log('Generated: favicon.ico');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
