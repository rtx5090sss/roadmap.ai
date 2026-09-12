import { runCommand } from './utils.mjs';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

async function main() {
  const startTime = Date.now();

  console.log('⚡ Launching Parallel Sub-Agent Quality Gates...');

  // Run all 3 checks in parallel
  const [lintResult, typeResult, auditResult] = await Promise.all([
    runCommand('npm run lint'),
    runCommand('npx tsc --noEmit'),
    runCommand('npm audit --audit-level=high'),
  ]);

  const allPassed = lintResult.passed && typeResult.passed && auditResult.passed;
  const duration = Date.now() - startTime;

  const report = {
    timestamp: new Date().toISOString(),
    durationMs: duration,
    allPassed,
    checks: {
      lint: {
        passed: lintResult.passed,
        durationMs: lintResult.durationMs,
        output: lintResult.passed ? 'No lint issues detected' : lintResult.stderr || lintResult.stdout,
      },
      typeCheck: {
        passed: typeResult.passed,
        durationMs: typeResult.durationMs,
        output: typeResult.passed ? 'TypeScript verification passed' : typeResult.stdout || typeResult.stderr,
      },
      security: {
        passed: auditResult.passed,
        durationMs: auditResult.durationMs,
        output: auditResult.passed ? 'Zero high/critical vulnerabilities' : auditResult.stdout,
      },
    },
  };

  const reportPath = '.agents/reports/last-check.json';
  if (!existsSync(dirname(reportPath))) {
    mkdirSync(dirname(reportPath), { recursive: true });
  }
  writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`\n📊 Parallel Quality Results (${duration}ms):`);
  console.log(`  🔍 Lint:      ${lintResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`  🔷 TypeScript:${typeResult.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`  🔒 Security:  ${auditResult.passed ? '✅ PASSED' : '❌ FAILED'}`);

  if (!allPassed) {
    if (!lintResult.passed) console.error('\nLint Output:\n', lintResult.stdout || lintResult.stderr);
    if (!typeResult.passed) console.error('\nType Output:\n', typeResult.stdout || typeResult.stderr);
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error('Error running parallel quality check:', err);
  process.exit(1);
});
