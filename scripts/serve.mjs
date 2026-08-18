import {createReadStream, existsSync, statSync} from 'node:fs';
import {createServer} from 'node:http';
import {extname, join, normalize} from 'node:path';

const root = process.cwd();
const requestedPort = Number(process.env.PORT || 4173);
const hasExplicitPort = Boolean(process.env.PORT);
const maxFallbackPorts = 10;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml'
};

const server = createServer((request, response) => {
  const urlPath = decodeURIComponent(
      new URL(request.url, `http://${request.headers.host}`).pathname);
  const relative = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = normalize(join(root, relative));
  if (!file.startsWith(root) || !existsSync(file) ||
      statSync(file).isDirectory()) {
    response.writeHead(404, {'Content-Type': 'text/plain; charset=utf-8'});
    response.end('Not found');
    return;
  }
  response.writeHead(200, {
    'Content-Type': mime[extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-cache'
  });
  createReadStream(file).pipe(response);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`DevPath Academy available at http://127.0.0.1:${address.port}`);
});

const listen = port => {
  server.once('error', error => {
    const canTryAnotherPort =
        error.code === 'EADDRINUSE' && !hasExplicitPort &&
        port < requestedPort + maxFallbackPorts;
    if (canTryAnotherPort) {
      const nextPort = port + 1;
      console.warn(
          `Port ${port} is already in use; trying http://127.0.0.1:${nextPort}`);
      listen(nextPort);
      return;
    }

    if (error.code === 'EADDRINUSE') {
      console.error(
          `Cannot start the Academy: port ${port} is already in use. ` +
          'Stop the other server or choose another port, for example: ' +
          '$env:PORT=4174; npm start');
    } else {
      console.error(`Cannot start the Academy: ${error.message}`);
    }
    process.exitCode = 1;
  });

  server.listen(port, '127.0.0.1');
};

listen(requestedPort);
