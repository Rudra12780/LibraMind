import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function run() {
  const mod = await import('../frontend/src/data/visualBlueprints.js');
  const pages = mod.BLUEPRINT_PAGES;

  const outDir = path.join(rootDir, 'offline_blueprints');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const publicOutDir = path.join(rootDir, 'frontend', 'public', 'offline_blueprints');
  if (!fs.existsSync(publicOutDir)) {
    fs.mkdirSync(publicOutDir, { recursive: true });
  }

  const manifest = [];

  for (const page of pages) {
    const safeTitle = page.shortTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${String(page.pageNumber).padStart(2, '0')}_LibraMind_${safeTitle}_Blueprint.svg`;
    const filePath = path.join(outDir, filename);
    const publicFilePath = path.join(publicOutDir, filename);

    fs.writeFileSync(filePath, page.svg, 'utf-8');
    fs.writeFileSync(publicFilePath, page.svg, 'utf-8');

    manifest.push({
      pageNumber: page.pageNumber,
      id: page.id,
      name: page.name,
      shortTitle: page.shortTitle,
      route: page.route,
      category: page.category,
      desc: page.desc,
      sections: page.sections,
      filename: filename
    });

    console.log(`Exported Page ${page.pageNumber}: ${filename}`);
  }

  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');
  fs.writeFileSync(path.join(publicOutDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`\nSuccessfully exported all ${pages.length} blueprint SVGs!`);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

