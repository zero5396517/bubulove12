/**
 * Copies uni-app CLI output (dist/build/app) into HBuilder-Integrate-AS:
 *   <module>/src/main/assets/apps/<appId>/www/
 * and updates assets/data/dcloud_control.xml from offline-android/dcloud_control.xml
 *
 * Usage:
 *   node scripts/sync-offline-android.cjs <path-to-HBuilder-Integrate-AS-root>
 * Or:
 *   set HBUILDER_INTEGRATE_ROOT=C:\path\to\HBuilder-Integrate-AS
 *   node scripts/sync-offline-android.cjs
 */

const fs = require('fs')
const path = require('path')

const APP_ID = '__UNI__FE00560'
const DEFAULT_MODULE = 'simpleDemo'

const integrateRoot =
  process.env.HBUILDER_INTEGRATE_ROOT ||
  process.argv[2]

if (!integrateRoot) {
  console.error(
    'Missing path. Usage: node scripts/sync-offline-android.cjs <HBuilder-Integrate-AS-dir>'
  )
  process.exit(1)
}

const moduleName = process.env.HBUILDER_ANDROID_MODULE || DEFAULT_MODULE
const mobileAppRoot = path.join(__dirname, '..')
const srcDist = path.join(mobileAppRoot, 'dist', 'build', 'app')
const controlSrc = path.join(mobileAppRoot, 'offline-android', 'dcloud_control.xml')

if (!fs.existsSync(srcDist)) {
  console.error('Not found:', srcDist, '\nRun: npm run build:app-android')
  process.exit(1)
}

const destWww = path.join(
  integrateRoot,
  moduleName,
  'src',
  'main',
  'assets',
  'apps',
  APP_ID,
  'www'
)
const destDataDir = path.join(integrateRoot, moduleName, 'src', 'main', 'assets', 'data')
const destControl = path.join(destDataDir, 'dcloud_control.xml')

fs.mkdirSync(destWww, { recursive: true })
fs.cpSync(srcDist, destWww, { recursive: true })

if (!fs.existsSync(controlSrc)) {
  console.warn('Skip dcloud_control.xml (missing):', controlSrc)
} else {
  fs.mkdirSync(destDataDir, { recursive: true })
  fs.copyFileSync(controlSrc, destControl)
}

console.log('Synced www ->', destWww)
console.log('Updated ->', destControl)
