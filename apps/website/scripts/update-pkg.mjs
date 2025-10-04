import fs from 'fs';
const pkgPath = process.argv[2];
if (!pkgPath) {
  console.error('Missing argument: path to package.json'); process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts ||= {};
pkg.scripts.lint ??= 'eslint app components src --ext .ts,.tsx --max-warnings=0 --cache --cache-location .eslintcache';
pkg.scripts.typecheck ??= 'tsc -p tsconfig.json --noEmit';
pkg.scripts.build ??= 'next build';
pkg.scripts['guard:headers'] = 'bash scripts/guard-headers.sh'; // force file-based guard
if (!pkg.scripts.check) {
  pkg.scripts.check = 'npm run lint && npm run typecheck && npm run guard:headers';
} else if (!pkg.scripts.check.includes('guard:headers')) {
  pkg.scripts.check += ' && npm run guard:headers';
}
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('… package.json scripts ensured');
