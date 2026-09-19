require('dotenv').config();
const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const mode = args[0] || 'pilot';
const isDryRun = args.includes('--dry-run');
const pilotLimitArg = (args.find(arg => arg.startsWith('--pilot-limit=')) || '').split('=')[1];
const pilotLimit = pilotLimitArg ? parseInt(pilotLimitArg, 10) : 25;

const baseDir = __dirname;
const reportsDir = path.join(baseDir, 'reports');
fs.mkdirSync(reportsDir, { recursive: true });

function runStep(label, script, stepArgs) {
  console.log(`\n[${label}] node ${script} ${stepArgs.join(' ')}`);
  const result = spawnSync('node', [script, ...stepArgs], { cwd: baseDir, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error(`${label} failed with exit code ${result.status}`);
  }
}

function main() {
  const hierarchyReport =
    mode === 'pilot'
      ? path.join(reportsDir, 'pilot-hierarchy-report.json')
      : path.join(reportsDir, 'full-hierarchy-report.json');
  const uploadReport =
    mode === 'pilot'
      ? path.join(reportsDir, 'pilot-upload-report.json')
      : path.join(reportsDir, 'full-upload-report.json');

  const hierarchyArgs = [`--report=${hierarchyReport}`];
  const uploadArgs = [`--report=${uploadReport}`];

  if (mode === 'pilot') {
    hierarchyArgs.push(`--limit=${pilotLimit}`);
    uploadArgs.push(`--limit=${pilotLimit}`);
  }

  if (isDryRun) {
    hierarchyArgs.push('--dry-run');
    uploadArgs.push('--dry-run');
  }

  runStep('Hierarchy', 'create-hierarchy.js', hierarchyArgs);
  runStep('Upload', 'upload-articles.js', uploadArgs);

  console.log('\nImport workflow completed.');
  console.log(`Hierarchy report: ${hierarchyReport}`);
  console.log(`Upload report: ${uploadReport}`);
}

main();
