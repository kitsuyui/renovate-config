#!/usr/bin/env bash
set -euo pipefail

version=${1:?usage: create-release.sh VERSION}
repo=${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}
sha=${GITHUB_SHA:?GITHUB_SHA is required}
notes=$(mktemp)
trap 'rm -f "$notes"' EXIT

# Generate the notes before creating the tag so a failure is safe to retry.
gh api --method POST "repos/${repo}/releases/generate-notes" \
  -f "tag_name=${version}" -f "target_commitish=${sha}" --jq '.body' > "$notes"
if [ "$(wc -c < "$notes")" -gt 120000 ]; then
  printf 'Release %s. See the commit history for the complete change list.\n' "$version" > "$notes"
fi

# Creating the ref is atomic: an existing tag must never be reused or moved.
gh api --method POST "repos/${repo}/git/refs" \
  -f "ref=refs/tags/${version}" -f "sha=${sha}" >/dev/null
verify_tag() {
  actual=$(gh api "repos/${repo}/git/ref/tags/${version}" --jq '.object.sha')
  if [ "$actual" != "$sha" ]; then
    echo '::error::The release tag does not point to the verified commit.' >&2
    exit 1
  fi
}
verify_tag
gh release create "$version" --verify-tag --notes-file "$notes"
verify_tag
