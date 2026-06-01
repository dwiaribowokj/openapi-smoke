import { Command } from 'commander';
import SwaggerParser from '@apidevtools/swagger-parser';
import { exitCodeFromFindings, Finding, printFindings } from './output.js';

interface SmokeOptions {
  spec: string;
  baseUrl: string;
  timeout: string;
  method?: string;
}

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';
const METHODS = new Set<HttpMethod>(['get', 'post', 'put', 'patch', 'delete', 'options', 'head']);

interface SmokeTarget {
  method: HttpMethod;
  path: string;
}

export async function collectSmokeTargets(specPath: string, methodFilter = 'GET'): Promise<SmokeTarget[]> {
  const api = await SwaggerParser.bundle(specPath) as any;
  const paths = api.paths ?? {};
  const filter = methodFilter.toLowerCase();
  const targets: SmokeTarget[] = [];

  for (const [path, operations] of Object.entries<any>(paths)) {
    for (const method of Object.keys(operations)) {
      if (!METHODS.has(method as HttpMethod)) continue;
      if (filter !== 'all' && method !== filter) continue;
      targets.push({ method: method as HttpMethod, path });
    }
  }

  return targets.sort((a, b) => `${a.method} ${a.path}`.localeCompare(`${b.method} ${b.path}`));
}

function hasPathParams(path: string): boolean {
  return /\{[^}]+\}/.test(path);
}

export async function runSmoke(specPath: string, baseUrl: string, timeoutMs: number, methodFilter?: string): Promise<Finding[]> {
  const targets = await collectSmokeTargets(specPath, methodFilter ?? 'GET');
  const findings: Finding[] = [];

  if (targets.length === 0) {
    findings.push({ level: 'warn', message: 'No matching OpenAPI operations found' });
    return findings;
  }

  for (const target of targets) {
    if (hasPathParams(target.path)) {
      findings.push({ level: 'info', message: `${target.method.toUpperCase()} ${target.path} skipped`, detail: 'Path params are not generated in MVP.' });
      continue;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const url = new URL(target.path.replace(/^\//, ''), baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

    try {
      const response = await fetch(url, { method: target.method.toUpperCase(), signal: controller.signal });
      const ok = response.status >= 200 && response.status < 400;
      findings.push({ level: ok ? 'ok' : 'error', message: `${target.method.toUpperCase()} ${target.path} ${response.status}` });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      findings.push({ level: 'error', message: `${target.method.toUpperCase()} ${target.path} failed`, detail: message });
    } finally {
      clearTimeout(timeout);
    }
  }

  return findings;
}

export function openapiSmokeCommand(): Command {
  return new Command('api-smoke')
    .alias('smoke')
    .description('Run safe smoke checks for GET operations from an OpenAPI spec.')
    .requiredOption('-s, --spec <path>', 'OpenAPI YAML/JSON file')
    .requiredOption('-b, --base-url <url>', 'Target base URL')
    .option('-t, --timeout <ms>', 'Request timeout in milliseconds', '5000')
    .option('-m, --method <method>', 'HTTP method to test, or all', 'GET')
    .action(async (options: SmokeOptions) => {
      const findings = await runSmoke(options.spec, options.baseUrl, Number(options.timeout), options.method);
      printFindings('API Smoke Test', findings);
      const passed = findings.filter((f) => f.level === 'ok').length;
      const failed = findings.filter((f) => f.level === 'error').length;
      const skipped = findings.filter((f) => f.level === 'info').length;
      console.log(`\nSummary: ${passed} passed, ${failed} failed, ${skipped} skipped`);
      process.exitCode = exitCodeFromFindings(findings);
    });
}
