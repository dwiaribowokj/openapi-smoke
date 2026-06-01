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

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening an issue or pull request.

This project uses the [MIT License](./LICENSE), which means you can use, copy, modify, and distribute it freely as long as the license notice is included.

## Community

- Bug reports: use the GitHub issue template.
- Feature ideas: keep them small, practical, and safe by default.
- Security issues: please follow [SECURITY.md](./SECURITY.md).

