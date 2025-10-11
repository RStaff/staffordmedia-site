/**
 * Validates alignment.json against alignment.schema.json using JSON Schema draft 2020-12.
 * - Prefers Ajv 2020 API (bundles the metaschema)
 * - Falls back to classic Ajv + explicit meta-schema registration
 */
const fs = require('fs');

const schemaPath = process.env.ALIGN_SCHEMA || 'alignment.schema.json';
const dataPath   = process.env.ALIGN_DATA   || 'alignment.json';

function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { console.error(`❌ Cannot read ${p}:`, e.message); process.exit(1); }
}

const schema = readJson(schemaPath);
const data   = readJson(dataPath);

let ajv, used = '';
try {
  const Ajv2020 = require('ajv/dist/2020');
  ajv = new Ajv2020({ strict: false, allErrors: true });
  used = 'Ajv2020';
} catch {
  const Ajv = require('ajv');
  ajv = new Ajv({ strict: false, allErrors: true });
  try {
    const meta2020 = require('ajv/dist/refs/json-schema-draft-2020-12.json');
    ajv.addMetaSchema(meta2020);
    used = 'Ajv classic + metaschema';
  } catch (e) {
    console.error('❌ Failed to load metaschema:', e.message);
    process.exit(1);
  }
}
try { require('ajv-formats')(ajv); } catch {}
const ok = ajv.validate(schema, data);
if (!ok) { console.error(`❌ Validation failed (${used}):`, ajv.errors); process.exit(1); }
console.log(`✅ ${dataPath} valid against ${schemaPath} (${used})`);
