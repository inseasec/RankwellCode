const fs = require('fs')
const path = require('path')

// read global config file (from repo root)
const globalConfigPath = path.resolve(__dirname, '../../global-config.properties')
const data = fs.readFileSync(globalConfigPath, 'utf-8')

const getValue = (key) => data.match(new RegExp(`^${key}=(.*)$`, 'm'))?.[1]?.trim()

const backendPort = getValue('USER_BACKEND_PORT')
const frontendUrl = getValue('USER_FRONTEND_URL')
const fallbackFrontendPort = getValue('USER_FRONTEND_PORT')
const fallbackBaseUrl = getValue('BASE_URL')

const originSource = frontendUrl || fallbackBaseUrl
if (!originSource || !backendPort) {
  throw new Error('Missing required USER_FRONTEND_URL/BASE_URL or USER_BACKEND_PORT in global-config.properties')
}

let apiBaseUrl = originSource
let vitePort = fallbackFrontendPort || '5173'
let viteHost = undefined
try {
  const frontendParsed = new URL(originSource)
  viteHost = frontendParsed.hostname
  vitePort = frontendParsed.port || vitePort
  const apiParsed = new URL(originSource)
  apiParsed.port = backendPort
  apiBaseUrl = apiParsed.toString().replace(/\/$/, '')
} catch (error) {
  apiBaseUrl = `${originSource.replace(/\/$/, '')}:${backendPort}`
}

// create .env file
const envData = `
VITE_API_URL=${apiBaseUrl}
VITE_PORT=${vitePort}
VITE_HOST=${viteHost || ''}
`

// write .env
fs.writeFileSync('.env', envData)

console.log('✅ User frontend config updated!')
