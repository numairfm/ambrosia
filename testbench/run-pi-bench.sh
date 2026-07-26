#!/usr/bin/env bash

# Ambrosia Benchmark Launch Script for Pi CLI
# Usage: ./testbench/run-pi-bench.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "===================================================="
echo "    AMBROSIA BENCHMARK RUNNER (PI AGENT CLI)       "
echo "===================================================="

# Check if pi is installed
if ! command -v pi &> /dev/null; then
    echo "⚠️ Warning: 'pi' command line tool was not found in PATH."
    echo "   Install pi agent or ensure it is accessible in your environment."
    echo "   Continuing using mock/wrapper if needed..."
fi

# Run benchmark runner using pi non-interactive mode (-p flag)
node "$SCRIPT_DIR/benchmark-runner.js" \
  --vanilla-cmd 'pi -p "{prompt}"' \
  --ambrosia-cmd 'pi -p "Use Ambrosia to: {prompt}"'

echo ""
echo "===================================================="
echo "   BENCHMARK RUN COMPLETED!                         "
echo "   Dashboard: file://$SCRIPT_DIR/dashboard/index.html"
echo "===================================================="
