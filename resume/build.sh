#!/usr/bin/env bash
# Prints resume/resume.html to assets/C-Janci-Kundana-Resume.pdf using headless Chrome.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="assets/C-Janci-Kundana-Resume.pdf" "file://$PWD/resume/resume.html" 2>/dev/null
echo "Wrote assets/C-Janci-Kundana-Resume.pdf"
