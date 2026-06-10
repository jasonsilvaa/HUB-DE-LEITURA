#!/usr/bin/env bash
set -e

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH}"

if [ -s "${HOME}/.nvm/nvm.sh" ]; then
    # shellcheck source=/dev/null
    . "${HOME}/.nvm/nvm.sh"
fi

if ! command -v node >/dev/null 2>&1; then
    echo "ERRO: Node.js não encontrado no PATH do Jenkins."
    echo "PATH atual: ${PATH}"
    echo "Instale Node.js (https://nodejs.org/) ou configure o plugin NodeJS no Jenkins."
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "ERRO: npm não encontrado no PATH do Jenkins."
    exit 1
fi

echo "Node: $(node --version)"
echo "npm: $(npm --version)"
