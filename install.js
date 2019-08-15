#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const HOOKS = require('./hooks')

function isCI (env) {
  // copy from https://github.com/watson/ci-info/blob/2012259979fc38517f8e3fc74daff714251b554d/index.js#L52
  return env.CI || // Travis CI, CircleCI, Cirrus CI, Gitlab CI, Appveyor, CodeShip, dsari
  env.CONTINUOUS_INTEGRATION || // Travis CI, Cirrus CI
  env.BUILD_NUMBER || // Jenkins, TeamCity
  env.RUN_ID || // TaskCluster, dsari
  false
}

function installHook (hook) {
  const source = path.join(__dirname, 'hook')
  const target = path.join('.git', 'hooks', hook)
  if (fs.existsSync(source) && fs.existsSync('.git')) {
    if (isCI(process.env)) {
      console.log('[git-hooks]', 'CI Environment detected, skip the git-hooks installation')
    } else {
      fs.copyFileSync(source, target, 'utf-8')
      fs.chmodSync(target, 0o0755)
    }
  }
};

HOOKS.forEach(installHook)
