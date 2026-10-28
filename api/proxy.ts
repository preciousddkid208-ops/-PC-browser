/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { IncomingMessage, ServerResponse } from 'http';
import { handleProxyRequest } from '../src/server/proxyEngine';

/**
 * Vercel Serverless Function entry point for /api/proxy.
 * Ensures deployed Vercel instances never return 404 NOT_FOUND.
 */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  return handleProxyRequest(req, res);
}
