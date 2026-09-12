import { runCommand } from './utils.mjs';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

async function main() {
  console.log('🏗️ Verifying Next.js production build...');
  const buildResult = await runCommand('npm', ['run', 'build']);

  const report = {
    timestamp: new Date().toISOString(),
    passed: buildResult.passed,
    durationMs: buildResult.durationMs,
    output: buildResult.passed ? 'Build completed successfully' : buildResult.stdout + '\n' + buildResult.stderr,
  };

  const reportPath = '.agents/reports/build-report.json';
  if (!existsSync(dirname(reportPath))) {
    mkdirSync(dirname(reportPath), { recursive: true });
  }
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  if (buildResult.passed) {
    console.log('✅ Build verification passed in', buildResult.durationMs, 'ms');
    process.exit(0);
  } else {
    console.error('❌ Build verification failed!');
    console.error(buildResult.stdout);
    console.error(buildResult.stderr);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error running build gate:', err);
  process.exit(1);
});
