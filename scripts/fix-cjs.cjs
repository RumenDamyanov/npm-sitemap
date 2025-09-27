#!/usr/bin/env node

/**
 * Fix CommonJS module imports by removing .js extensions from require() calls
 * TypeScript generates .js extensions for CJS, but they should be omitted
 */

const fs = require('fs');
const path = require('path');

function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            walkDir(filePath, fileList);
        } else if (file.endsWith('.js')) {
            fileList.push(filePath);
        }
    }
    
    return fileList;
}

function fixCjsImports() {
    const cjsDir = path.join(__dirname, '..', 'dist', 'cjs');
    
    if (!fs.existsSync(cjsDir)) {
        console.log('CJS directory not found, skipping...');
        return;
    }
    
    const cjsFiles = walkDir(cjsDir);
    
    for (const filePath of cjsFiles) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Remove .js extensions from require() calls for relative imports
        const originalContent = content;
        content = content.replace(/require\("(\.[^"]+)\.js"\)/g, 'require("$1")');
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed CJS imports in: ${path.relative(process.cwd(), filePath)}`);
        }
    }
    
    console.log('CJS import fixes completed');
}

fixCjsImports();