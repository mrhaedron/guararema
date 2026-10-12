#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
test -s public/core.wasm || { echo 'Compile o WASM primeiro: ./build-wasm.sh' >&2; exit 1; }
mkdir -p dist/public
cp index.html style.css game.js dist/
cp public/core.wasm dist/public/
printf 'AddType application/wasm .wasm\nDirectoryIndex index.html\n' > dist/.htaccess
