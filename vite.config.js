import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [{
    name: 'worldloom-directory-entry',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        // Vite serves public files exactly; match production's directory index.
        request.url = request.url?.replace(/^\/worldloom\/(?=\?|$)/, '/worldloom/index.html');
        next();
      });
    },
  }],
  build: {
    rollupOptions: {
      input: {
        hub: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        tacticstrike: fileURLToPath(new URL('./src/tacticstrike/index.html', import.meta.url)),
      },
    },
  },
});
