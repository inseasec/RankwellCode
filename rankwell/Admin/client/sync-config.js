import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../global-config.properties');
const data = fs.readFileSync(configPath, 'utf-8');

const getValue = (key) => data.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim();

const backendPort = getValue('ADMIN_BACKEND_PORT');
const frontendUrl = getValue('ADMIN_FRONTEND_URL');
const fallbackFrontendPort = getValue('FRONTEND_PORT');
const fallbackBaseUrl = getValue('BASE_URL');

const originSource = frontendUrl || fallbackBaseUrl;
if (!originSource || !backendPort) {
  throw new Error('Missing required ADMIN_FRONTEND_URL/BASE_URL or ADMIN_BACKEND_PORT in global-config.properties');
}

let apiBaseUrl = originSource;
let vitePort = fallbackFrontendPort || '5173';
let viteHost = undefined;

try {
  const frontendParsed = new URL(originSource);
  viteHost = frontendParsed.hostname;
  vitePort = frontendParsed.port || vitePort;
  const apiParsed = new URL(originSource);
  apiParsed.port = backendPort;
  apiBaseUrl = apiParsed.toString().replace(/\/$/, '');
} catch {
  apiBaseUrl = `${originSource.replace(/\/$/, '')}:${backendPort}`;
}

const envData = `
VITE_API_URL=${apiBaseUrl}
VITE_PORT=${vitePort}
VITE_HOST=${viteHost || ''}
`;

fs.writeFileSync('.env', envData);
console.log('✅ Admin frontend config updated!');