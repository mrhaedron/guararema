#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
rustup target add wasm32-unknown-unknown
cargo build --release --target wasm32-unknown-unknown
mkdir -p public
cp target/wasm32-unknown-unknown/release/luis_carlos.wasm public/core.wasm
