const fs = require('fs')
const path = require('path')
fs.copyFileSync(path.resolve('lib/data.json'), path.resolve('dist/data.json'))
