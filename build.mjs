import { readdirSync, readFileSync, existsSync } from 'fs';

const htmlFiles = readdirSync('.').filter(f => f.endsWith('.html'));
let errors = 0;

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf8');

  const refs = [...content.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const ref of refs) {
    if (ref.startsWith('http') || ref.startsWith('#') || ref.startsWith('mailto:')) continue;
    if (!existsSync(ref)) {
      console.error(`  ${file}: broken reference -> ${ref}`);
      errors++;
    }
  }

  if (!content.includes('css/style.css')) {
    console.error(`  ${file}: missing css/style.css reference`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`\nBuild failed: ${errors} broken reference(s) found.`);
  process.exit(1);
}

console.log(`Build passed: ${htmlFiles.length} HTML pages verified, all references resolve.`);
