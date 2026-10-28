/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { handleProxyRequest } from './src/server/proxyEngine';

function desktopProxyPlugin(): Plugin {
  return {
    name: 'desktop-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        await handleProxyRequest(req, res);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/proxy', async (req, res) => {
        await handleProxyRequest(req, res);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), desktopProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
