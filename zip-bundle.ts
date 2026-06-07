import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

async function buildItchBundle() {
  console.log('[Itch Packer] Packaging assets for itch.io...');

  const distDir = path.join(process.cwd(), 'dist');
  const zipPath = path.join(distDir, 'nexora-monetize.zip');

  if (!fs.existsSync(distDir)) {
    console.error('[Itch Packer] Error: dist/ directory does not exist. Run build first.');
    process.exit(1);
  }

  // Clear previous zip
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  const zip = new AdmZip();

  // Add the index.html from dist
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    zip.addLocalFile(indexHtmlPath, ''); // Add to root of ZIP
    console.log('[Itch Packer] Added index.html to ZIP root.');
  } else {
    console.error('[Itch Packer] Error: index.html not found in dist.');
    process.exit(1);
  }

  // Add the assets/ folder from dist
  const assetsDir = path.join(distDir, 'assets');
  if (fs.existsSync(assetsDir)) {
    zip.addLocalFolder(assetsDir, 'assets');
    console.log('[Itch Packer] Added assets/ directory recursively to ZIP.');
  } else {
    console.warn('[Itch Packer] Warning: assets/ directory not found.');
  }

  // Scan and copy latest itch cover image to dist/itch-cover.png
  const imagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
  const destCoverPath = path.join(distDir, 'itch-cover.png');
  
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    const coverFiles = files
      .filter((file) => file.startsWith('itch_cover') && file.endsWith('.png'))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(imagesDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (coverFiles.length > 0) {
      const sourceCoverPath = path.join(imagesDir, coverFiles[0].name);
      fs.copyFileSync(sourceCoverPath, destCoverPath);
      console.log(`[Itch Packer] Copied latest cover image "${coverFiles[0].name}" to: ${destCoverPath}`);
    } else {
      console.log('[Itch Packer] No generated cover image found in src/assets/images.');
    }
  } else {
    console.log('[Itch Packer] src/assets/images directory does not exist.');
  }

  // Write the zip file
  zip.writeZip(zipPath);
  console.log(`[Itch Packer] Success! ZIP archive successfully created at: ${zipPath}`);
}

buildItchBundle();
