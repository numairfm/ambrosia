#!/usr/bin/env node

/**
 * Ambrosia Test Bench Harness (Harness-Agnostic)
 * 
 * Usage:
 *   node testbench/benchmark-runner.js --vanilla-cmd "opencode run {prompt}" --ambrosia-cmd "opencode run {prompt}"
 * 
 * You can customize the commands via CLI flags or config file.
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const BENCH_DIR = __dirname;
const RESULTS_FILE = path.join(BENCH_DIR, 'dashboard', 'benchmark-data.json');
const TASKS_FILE = path.join(BENCH_DIR, 'tasks.json');

// Default tasks fallback if tasks.json missing
let DEFAULT_TASKS = [];
if (fs.existsSync(TASKS_FILE)) {
  DEFAULT_TASKS = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
} else {
  DEFAULT_TASKS = [
    {
      id: "game-1-tictactoe",
      name: "Level 1: Minimalist Neon Tic-Tac-Toe",
      category: "Simple Game (Core Logic & UI)",
      prompt: "Create a modern, sleek single-file HTML/CSS/JS Tic-Tac-Toe game."
    }
  ];
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    vanillaCmd: process.env.BENCH_VANILLA_CMD || 'opencode run "{prompt}"',
    ambrosiaCmd: process.env.BENCH_AMBROSIA_CMD || 'opencode run "{prompt}"',
    tasks: DEFAULT_TASKS
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--vanilla-cmd' && args[i + 1]) config.vanillaCmd = args[++i];
    if (args[i] === '--ambrosia-cmd' && args[i + 1]) config.ambrosiaCmd = args[++i];
  }

  return config;
}

function measureCodeMetrics(dirPath) {
  let totalLines = 0;
  let fileCount = 0;

  if (!fs.existsSync(dirPath)) return { totalLines: 0, fileCount: 0 };

  function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', '.ambrosia'].includes(entry.name)) scan(fullPath);
      } else if (entry.isFile() && /\.(js|ts|html|css|py|json|md)$/.test(entry.name)) {
        fileCount++;
        const content = fs.readFileSync(fullPath, 'utf-8');
        totalLines += content.split('\n').length;
      }
    }
  }

  scan(dirPath);
  return { totalLines, fileCount };
}

async function runSingleTask(task, runType, cmdTemplate) {
  const scratchDir = path.join(BENCH_DIR, 'scratch', `${task.id}-${runType}`);
  ensureDir(scratchDir);

  console.log(`\n▶ Running [${runType.toUpperCase()}] for Task: ${task.name}...`);
  console.log(`  Directory: ${scratchDir}`);

  // Substitute {prompt} in user-provided command template
  const formattedPrompt = task.prompt.replace(/"/g, '\\"');
  const command = cmdTemplate.replace('{prompt}', formattedPrompt);

  console.log(`  Executing: ${command}\n`);

  const startTime = Date.now();
  let stdout = '';
  let stderr = '';
  let exitCode = 0;

  try {
    // Stream output directly to terminal live while capturing for benchmark logs
    const [bin, ...args] = command.match(/(?:[^\s"]+|"[^"]*")+/g).map(arg => arg.replace(/^"|"$/g, ''));
    
    const proc = require('child_process').spawnSync(bin, args, {
      cwd: scratchDir,
      stdio: ['inherit', 'pipe', 'pipe'], // Live terminal output streaming captured via manual write
      encoding: 'utf-8',
      env: { ...process.env, BENCH_RUN_TYPE: runType }
    });

    if (proc.error) {
      exitCode = proc.status !== null && proc.status !== undefined ? proc.status : 1;
      stderr = proc.error.message || String(proc.error);
    } else {
      exitCode = proc.status !== null && proc.status !== undefined ? proc.status : 0;
    }
    stdout = proc.stdout || '';
    if (proc.stderr) stderr += proc.stderr;
    if (stdout) process.stdout.write(stdout);
    if (proc.stderr) process.stderr.write(proc.stderr);
  } catch (err) {
    exitCode = err.status || 1;
    stderr = err.message || '';
  }

  const durationMs = Date.now() - startTime;
  const metrics = measureCodeMetrics(scratchDir);

  let promptTokens = Math.round(formattedPrompt.length / 4);
  let completionTokens = Math.round(stdout.length / 4);
  let totalTokens = promptTokens + completionTokens;

  console.log(`\n  ✓ [${runType.toUpperCase()}] Completed in ${(durationMs / 1000).toFixed(1)}s | LOC: ${metrics.totalLines}`);

  return {
    runType,
    command,
    durationSec: parseFloat((durationMs / 1000).toFixed(2)),
    totalTokens,
    promptTokens,
    completionTokens,
    linesOfCode: metrics.totalLines,
    fileCount: metrics.fileCount,
    exitCode,
    stdoutSnippet: stdout ? stdout.slice(0, 2000) : `Completed in ${scratchDir}`,
    scratchDir
  };
}

async function main() {
  const config = parseArgs();
  ensureDir(path.join(BENCH_DIR, 'dashboard'));
  ensureDir(path.join(BENCH_DIR, 'scratch'));

  console.log('====================================================');
  console.log('      AMBROSIA AGENT-AGNOSTIC TEST BENCH HARNESS     ');
  console.log('====================================================');
  console.log(`Vanilla Command Template:  ${config.vanillaCmd}`);
  console.log(`Ambrosia Command Template: ${config.ambrosiaCmd}`);
  console.log(`Benchmark Tasks:           ${config.tasks.length}`);

  const results = [];

  for (const task of config.tasks) {
    console.log(`\n----------------------------------------------------`);
    console.log(`Task: ${task.name} (${task.category})`);
    console.log(`Prompt: "${task.prompt}"`);

    const vanillaResult = await runSingleTask(task, 'vanilla', config.vanillaCmd);
    const ambrosiaResult = await runSingleTask(task, 'ambrosia', config.ambrosiaCmd);

    const tokenSavingsPct = vanillaResult.totalTokens > 0
      ? (((vanillaResult.totalTokens - ambrosiaResult.totalTokens) / vanillaResult.totalTokens) * 100).toFixed(1)
      : 0;

    const speedupPct = vanillaResult.durationSec > 0
      ? (((vanillaResult.durationSec - ambrosiaResult.durationSec) / vanillaResult.durationSec) * 100).toFixed(1)
      : 0;

    results.push({
      taskId: task.id,
      taskName: task.name,
      category: task.category,
      prompt: task.prompt,
      vanilla: vanillaResult,
      ambrosia: ambrosiaResult,
      summary: {
        tokenSavingsPct: parseFloat(tokenSavingsPct),
        speedupPct: parseFloat(speedupPct),
        locDiff: ambrosiaResult.linesOfCode - vanillaResult.linesOfCode
      }
    });

    // Save progressively after each task finishes
    const payload = {
      timestamp: new Date().toISOString(),
      config: {
        vanillaCmd: config.vanillaCmd,
        ambrosiaCmd: config.ambrosiaCmd
      },
      results
    };
    fs.writeFileSync(RESULTS_FILE, JSON.stringify(payload, null, 2));
    console.log(`  💾 Saved progressive results to ${RESULTS_FILE}`);
  }

  console.log('\n====================================================');
  console.log('   BENCHMARK COMPLETE! RESULTS SAVED TO DASHBOARD   ');
  console.log(`   File: ${RESULTS_FILE}`);
  console.log(`   Open: ${path.join(BENCH_DIR, 'dashboard', 'index.html')}`);
  console.log('====================================================\n');
}

main().catch(console.error);
