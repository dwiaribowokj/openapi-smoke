# openapi-smoke

A safe CLI that reads an OpenAPI YAML/JSON spec and runs smoke checks against an explicit base URL.

## Usage

```bash
npm install -g openapi-smoke
openapi-smoke --spec ./openapi.yaml --base-url http://localhost:3000
```

## Safety

- Requires explicit `--base-url`.
- Defaults to `GET` operations.
- Skips endpoints with path params in MVP.
- Treats 2xx/3xx as pass.

## Development

```bash
npm install
npm run build
npm test
```
