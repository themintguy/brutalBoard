#!/usr/bin/env bash
set -e

cd ..
cd server
pnpm dev &

cd ..
cd client
pnpm dev &

wait
