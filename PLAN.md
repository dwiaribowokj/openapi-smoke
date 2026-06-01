# openapi-smoke Plan

## Goal
A safe CLI that converts OpenAPI specs into quick smoke checks for local/staging APIs.

## MVP Scope
- Parse OpenAPI YAML/JSON.
- Require explicit `--base-url`.
- Default to GET-only smoke checks.
- Skip path-param endpoints until examples are supported.
- Per-request timeout.
- Summary output: passed, failed, skipped.

## Non-goals for MVP
- No automatic auth discovery.
- No mutating methods by default.
- No request body generation.
- No production server auto-use from OpenAPI `servers`.

## Roadmap
- `--json` output.
- `--path` / `--exclude-path` filters.
- Header support with redacted display.
- Example-based path param substitution.
- Max requests and low concurrency controls.
- Redirect host safety checks.

## Safety Notes
- Require explicit base URL.
- Keep GET-only default.
- Do not print auth headers/tokens.
- Do not send random payloads.
