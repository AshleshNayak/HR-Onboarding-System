const fs = require('fs');
const path = require('path');

// Create hooks directory
const hooksDir = path.join(__dirname, 'src', 'hooks');
fs.mkdirSync(hooksDir, { recursive: true });
console.log('✓ Created hooks directory');

// Create usePageTitle hook
const hookContent = `import { useEffect } from 'react'

function usePageTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}

export default usePageTitle
`;

const hookPath = path.join(hooksDir, 'usePageTitle.js');
fs.writeFileSync(hookPath, hookContent, 'utf8');
console.log('✓ Created usePageTitle.js hook');

console.log('\n✅ Setup complete! The hooks directory and usePageTitle hook have been created.');
console.log('\nNext steps:');
console.log('1. Update page components to use the usePageTitle hook');
console.log('2. Import: import usePageTitle from \'../../hooks/usePageTitle\'');
console.log('3. Use in component: usePageTitle("Page Name | MTL HR Onboard")');
