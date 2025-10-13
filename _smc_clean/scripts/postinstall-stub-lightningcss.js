const fs = require('fs');
const path = require('path');
try {
  const stubDir  = path.join(__dirname, '..', 'node_modules', 'lightningcss', 'node');
  const stubFile = path.join(stubDir, 'index.js');
  fs.mkdirSync(stubDir, { recursive: true });
  fs.writeFileSync(stubFile, `module.exports = {
  transform: (code) => ({ code }),
  minify:   (code) => ({ code }),
};\n`);
  console.log('Stubbed lightningcss at', stubFile);
} catch (e) {
  console.log('Could not stub lightningcss:', e && e.message ? e.message : e);
}
