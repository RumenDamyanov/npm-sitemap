#!/usr/bin/env node

/**
 * Prepare distribution package.json
 * Creates a clean package.json for the dist directory without build scripts
 */

const fs = require('fs');
const path = require('path');

function prepareDistPackage() {
    const projectRoot = path.join(__dirname, '..');
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const distPackageJsonPath = path.join(projectRoot, 'dist', 'package.json');
    
    // Read the source package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Create a clean version for distribution
    const distPackageJson = {
        name: packageJson.name,
        version: packageJson.version,
        description: packageJson.description,
        keywords: packageJson.keywords,
        homepage: packageJson.homepage,
        bugs: packageJson.bugs,
        repository: packageJson.repository,
        license: packageJson.license,
        author: packageJson.author,
        type: packageJson.type,
        exports: {
            ".": {
                "import": "./esm/index.js",
                "require": "./cjs/index.js",
                "types": "./types/index.d.ts"
            },
            "./package.json": "./package.json"
        },
        main: "./cjs/index.js",
        module: "./esm/index.js",
        types: "./types/index.d.ts",
        files: [
            "esm",
            "cjs", 
            "types",
            "CHANGELOG.md",
            "LICENSE.md",
            "README.md"
        ],
        // Only include essential scripts for end users
        scripts: {
            postinstall: "echo 'Thank you for using @rumenx/sitemap! 🚀'"
        },
        dependencies: packageJson.dependencies,
        engines: packageJson.engines,
        publishConfig: packageJson.publishConfig
    };
    
    // Write the clean package.json to dist
    fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJson, null, 2), 'utf8');
    console.log('Created clean package.json for distribution');
}

prepareDistPackage();