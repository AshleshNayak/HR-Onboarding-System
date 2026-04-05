const fs = require('fs');
const path = require('path');

const hooksDir = path.join(__dirname, 'src', 'hooks');
fs.mkdirSync(hooksDir, { recursive: true });
console.log(`Created: ${hooksDir}`);
