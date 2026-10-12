const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const {instance} = await WebAssembly.instantiate(fs.readFileSync('public/core.wasm'));
  const core = instance.exports;
  assert.equal(core.can_walk(0, 24), 1);
  assert.equal(core.can_walk(49, 24), 0);
  const straight = core.movement_axis(1, 0, 0, .05);
  const diagonal = core.movement_axis(1, 1, 0, .05);
  assert(Math.abs(diagonal * Math.SQRT2 - straight) < 1e-6);
  assert(core.movement_axis(1, 0, 1, .05) > straight);
  assert.equal(core.movement_axis(1, 0, 0, -1), 0);
  console.log('OK: compiled Rust/WASM exports, movement and world limits.');
})().catch(error => { console.error(error); process.exitCode = 1; });
