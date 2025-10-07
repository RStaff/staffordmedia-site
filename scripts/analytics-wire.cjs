const fs = require('node:fs');

const p = process.env.LAYOUT_PATH;
if (!(p && fs.existsSync(p))) {
  console.error('❌ layout.tsx not found at', p);
  process.exit(1);
}

let s = fs.readFileSync(p, 'utf8');

// Ensure the import is present
const hasImport =
  s.includes('from "./analytics/Analytics"') ||
  s.includes("from './analytics/Analytics'");

if (!hasImport) {
  s = s.replace(
    /(^\s*['"]use client['"];\s*)?/,
    (m) => m + 'import Analytics from "./analytics/Analytics"\n'
  );
}

// Ensure <Analytics /> is inside <body>
if (!s.includes('<Analytics />')) {
  s = s.replace(/(<body[^>]*>)/, '$1\n      <Analytics />');
}

fs.writeFileSync(p, s);
console.log('✅ layout.tsx wired with <Analytics />');
