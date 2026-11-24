#!/usr/bin/env node

/**
 * Install the packed tarball in a clean project and load both entry points.
 */

const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.join(__dirname, '..');
const expectedVersion = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
const packedName = execFileSync('npm', ['pack', '--ignore-scripts'], {
  cwd: root,
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .pop();

if (!packedName || !/^[@\w.-]+\.tgz$/.test(packedName)) {
  throw new Error('npm pack did not report a tarball name');
}

const tarball = path.join(root, packedName);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-sitemap-smoke-'));

try {
  fs.writeFileSync(
    path.join(temp, 'package.json'),
    `${JSON.stringify({ name: 'sitemap-smoke', private: true, version: '1.0.0' }, null, 2)}\n`
  );
  execFileSync('npm', ['install', '--ignore-scripts', '--no-save', '--no-package-lock', tarball], {
    cwd: temp,
    stdio: 'inherit',
  });

  const checkCjs = [
    "const assert = require('assert');",
    "const mod = require('@rumenx/sitemap');",
    "assert.strictEqual(typeof mod.Sitemap, 'function');",
    `assert.strictEqual(mod.version, ${JSON.stringify(expectedVersion)});`,
    `assert.strictEqual(mod.packageInfo.version, ${JSON.stringify(expectedVersion)});`,
    "console.log('cjs', mod.version);",
    '',
  ].join('\n');
  const checkEsm = [
    "import assert from 'node:assert';",
    "import * as mod from '@rumenx/sitemap';",
    "assert.strictEqual(typeof mod.Sitemap, 'function');",
    `assert.strictEqual(mod.version, ${JSON.stringify(expectedVersion)});`,
    `assert.strictEqual(mod.packageInfo.version, ${JSON.stringify(expectedVersion)});`,
    "console.log('esm', mod.version);",
    '',
  ].join('\n');

  fs.writeFileSync(path.join(temp, 'check-cjs.cjs'), checkCjs);
  fs.writeFileSync(path.join(temp, 'check-esm.mjs'), checkEsm);

  for (const args of [
    ['check-cjs.cjs'],
    ['check-esm.mjs'],
    ['--no-experimental-detect-module', 'check-cjs.cjs'],
    ['--no-experimental-detect-module', 'check-esm.mjs'],
  ]) {
    execFileSync('node', args, { cwd: temp, stdio: 'inherit' });
  }
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
  fs.rmSync(tarball, { force: true });
}
