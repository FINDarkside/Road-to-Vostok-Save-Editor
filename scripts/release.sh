#!/bin/bash
set -e
export GH_TOKEN=$(gh auth token)
pnpm run build
electron-builder --win --publish always
