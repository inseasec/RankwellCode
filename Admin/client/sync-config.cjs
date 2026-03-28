const fs = require('fs');
const path = require('path');

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

try {
  const frontendParsed = new URL(originSource);
  vitePort = frontendParsed.port || vitePort;
  const apiParsed = new URL(originSource);
  apiParsed.port = backendPort;
  apiBaseUrl = apiParsed.toString().replace(/\/$/, '');
} catch (error) {
  apiBaseUrl = `${originSource.replace(/\/$/, '')}:${backendPort}`;
}

const envData = `
VITE_API_URL=${apiBaseUrl}
VITE_PORT=${vitePort}
`;

fs.writeFileSync('.env', envData);
console.log('✅ Admin frontend config updated!');