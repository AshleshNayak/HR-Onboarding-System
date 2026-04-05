const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components',
  'src/pages/candidate',
  'src/pages/candidate/forms',
  'src/pages/hr',
  'src/hooks'
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`Created: ${fullPath}`);
});

console.log('All directories created successfully!');
