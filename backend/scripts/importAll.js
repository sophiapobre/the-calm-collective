const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  'clearCarts.js',
  'clearOrders.js'
];

for (const script of scripts) {
  const scriptPath = path.join(__dirname, script);
  console.log(`Running ${script}...`);
  try {
    execSync(`node "${scriptPath}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error running ${script}:`, err);
    process.exit(1);
  }
}

console.log('All import scripts completed.');