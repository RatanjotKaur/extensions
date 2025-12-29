const fs = require('fs')
const path = require('path')


const manifest = path.resolve(__dirname, '..', 'manifest.json')
const dest = path.resolve(__dirname, '..', 'dist', 'manifest.json')


fs.copyFileSync(manifest, dest)
console.log('manifest.json copied to dist')