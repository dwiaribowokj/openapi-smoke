import { describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { collectSmokeTargets } from '../src/smoke.js';

describe('openapi smoke', () => {
  it('collects GET targets only by default', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'vdt-openapi-'));
    const specPath = join(dir, 'openapi.yaml');
    writeFileSync(specPath, `openapi: 3.0.0
info:
  title: Example
  version: 1.0.0
paths:
  /health:
    get:
      responses:
        '200':
          description: ok
  /users:
    post:
      responses:
        '201':
          description: created
`);
    const targets = await collectSmokeTargets(specPath);
    expect(targets).toEqual([{ method: 'get', path: '/health' }]);
  });
});
