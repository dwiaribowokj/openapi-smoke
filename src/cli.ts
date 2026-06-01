#!/usr/bin/env node
import { openapiSmokeCommand } from './smoke.js';
openapiSmokeCommand().name('openapi-smoke').parse();
