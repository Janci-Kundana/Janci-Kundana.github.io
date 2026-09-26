#!/usr/bin/env bash
# PostToolUse hook: after Claude edits index.html or script.js, make sure
# the JS still parses and every "View Project" button has a matching dialog.
# Exit code 2 sends the message back to Claude so it fixes the problem.

file=$(jq -r '.tool_input.file_path // empty')
case "$file" in
  *index.html|*script.js) ;;
  *) exit 0 ;;
esac

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

if ! out=$(node --check script.js 2>&1); then
  echo "script.js has a syntax error:" >&2
  echo "$out" >&2
  exit 2
fi

missing=""
for id in $(grep -oE 'data-open="[^"]+"|open: "[^"]+"' index.html script.js | grep -oE '"[^"]+"' | tr -d '"' | sort -u); do
  grep -q "<dialog[^>]*id=\"$id\"" index.html || missing="$missing $id"
done

if [ -n "$missing" ]; then
  echo "These project ids are opened somewhere but have no <dialog> in index.html:$missing" >&2
  exit 2
fi

exit 0
