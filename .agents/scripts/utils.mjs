import { spawn } from 'child_process';

export function runCommand(command, args = [], options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const fullCmd = args.length > 0 ? `${command} ${args.join(' ')}` : command;

    const child = spawn(fullCmd, {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        command: fullCmd,
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        durationMs: Date.now() - startTime,
        passed: code === 0,
      });
    });

    child.on('error', (err) => {
      resolve({
        command: fullCmd,
        exitCode: 1,
        stdout: '',
        stderr: err.message,
        durationMs: Date.now() - startTime,
        passed: false,
      });
    });
  });
}

export function parseStdin() {
  return new Promise((resolve) => {
    let input = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
      input += chunk;
    });
    process.stdin.on('end', () => {
      try {
        resolve(input ? JSON.parse(input) : {});
      } catch {
        resolve({});
      }
    });
  });
}
