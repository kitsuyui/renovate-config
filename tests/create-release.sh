#!/usr/bin/env bash
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
cat > "$tmp/gh" <<'MOCK'
#!/usr/bin/env bash
set -eu
printf '%s\n' "$*" >> "$MOCK_LOG"
case "$*" in
  *releases/generate-notes*)
    if [ "${MOCK_LONG:-0}" = 1 ]; then printf '%0120001d\n' 0; else printf 'Useful release notes\n'; fi ;;
  *git/refs*)
    if [ "${MOCK_COLLISION:-0}" = 1 ]; then exit 1; fi ;;
  *git/ref/tags*)
    if [ "${MOCK_MISMATCH:-0}" = 1 ]; then echo other; else echo "$GITHUB_SHA"; fi ;;
  release\ create*) cp "$6" "$MOCK_CAPTURE" ;;
esac
MOCK
chmod +x "$tmp/gh"
export PATH="$tmp:$PATH" GITHUB_REPOSITORY=test/repo GITHUB_SHA=deadbeef
export MOCK_LOG="$tmp/calls" MOCK_CAPTURE="$tmp/notes"
bash "$root/scripts/create-release.sh" v0.2.0
grep -q 'Useful release notes' "$MOCK_CAPTURE"
MOCK_LONG=1 bash "$root/scripts/create-release.sh" v0.2.1
grep -q 'See the commit history' "$MOCK_CAPTURE"
if MOCK_COLLISION=1 bash "$root/scripts/create-release.sh" v0.2.2; then exit 1; fi
if MOCK_MISMATCH=1 bash "$root/scripts/create-release.sh" v0.2.3; then exit 1; fi
