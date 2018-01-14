#!/bin/bash
set -xue

GH_PAGES_REPO_NAME=cornertime.github.io
GH_PAGES_REPO="git@github.com:cornertime/$GH_PAGES_REPO_NAME"
GH_PAGES_DIR="../$GH_PAGES_REPO_NAME"

[[ ! -d "$GH_PAGES_DIR" ]] && git clone "$GH_PAGES_REPO" "$GH_PAGES_DIR"
npm run build

rsync --delete --exclude '.git' -avH build/ "$GH_PAGES_DIR"

cd "$GH_PAGES_DIR"
git add -A
git commit -am 'automated deployment'
git push
