#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
test -s public/core.wasm || { echo 'Compile o WASM primeiro: ./build-wasm.sh' >&2; exit 1; }
mkdir -p dist/public
cp index.html style.css game.js dist/
cp public/core.wasm dist/public/
printf 'AddType application/wasm .wasm\nDirectoryIndex index.html\n' > dist/.htaccess
# Permissões de leitura e travessia necessárias ao servidor web.
find dist -type d -exec chmod 755 {} +
find dist -type f -exec chmod 644 {} +
python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
with ZipFile('guararema-site.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted(Path('dist').rglob('*')):
        archive.write(path, path.relative_to('dist'))
PY
