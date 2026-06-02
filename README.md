# openapi-smoke

[![CI](https://github.com/dwiaribowokj/openapi-smoke/actions/workflows/ci.yml/badge.svg)](https://github.com/dwiaribowokj/openapi-smoke/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

A safe CLI that reads an OpenAPI YAML/JSON spec and runs smoke checks against an explicit base URL.

## Why

OpenAPI specs already describe your API surface. `openapi-smoke` turns that contract into a quick sanity check for local and staging environments without generating destructive requests by default.

## Usage

```bash
npm install -g openapi-smoke
openapi-smoke --spec ./openapi.yaml --base-url http://localhost:3000
openapi-smoke --spec ./openapi.yaml --base-url http://localhost:3000 --json
```

Local development:

```bash
npm install
npm run build
node dist/cli.js --spec examples/openapi.yaml --base-url http://localhost:3000
```

## Example output

```txt
API Smoke Test
✓ GET /health 200
i GET /users/{id} skipped
  Path params are not generated in MVP.

Summary: 1 passed, 0 failed, 1 skipped
```

## Features

- Reads OpenAPI YAML/JSON.
- Requires explicit `--base-url`.
- Defaults to GET-only checks.
- Supports `--method all` when you explicitly want broader coverage.
- Per-request timeout.
- Clear pass/fail/skipped summary.

- Machine-readable `--json` output for CI and automation.

## Safety

- Requires explicit `--base-url`.
- Defaults to `GET` operations.
- Skips endpoints with path params in MVP.
- Does not generate request bodies.
- Does not auto-use production URLs from OpenAPI `servers`.

## Development

```bash
npm install
npm run build
npm test
npm audit --audit-level=high
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

This project uses the [MIT License](./LICENSE), which means you can use, copy, modify, and distribute it freely as long as the license notice is included.

## Community

- Bug reports: use the GitHub issue template.
- Feature ideas: keep them small, practical, and safe by default.
- Security issues: please follow [SECURITY.md](./SECURITY.md).
