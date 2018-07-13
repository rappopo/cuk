'use strict'

global.Promise = require('bluebird')
const _ = require('lodash')
const path = require('path')
const fs = require('fs-extra')
const globby = require('globby')
const makePkg = require('./lib/make_pkg')

if (process.env.DDIR) process.env.DDIR = path.resolve(process.env.DDIR)

let cuk = {
  dir: {
    app: process.cwd(),
    data: process.env.DDIR || path.join(process.cwd(), 'data')
  },
  pkg: {}
}

module.exports = function(options) {
  const trace = require('./cuks/core/helper/boot/trace')(cuk)
  const merge = require('./cuks/core/helper/merge')(cuk)
  const sortCollection = require('./cuks/core/helper/coll/sort_by')(cuk)
  const bootPkg = require('./lib/boot_pkg')
  let helper, defCfg

  return new Promise((resolve, reject) => {
    _.each(['config', 'tmp'], d => {
      fs.ensureDirSync(path.join(cuk.dir.data, d))
    })
    _.each(['cuks'], d => {
      fs.ensureDirSync(path.join(cuk.dir.app, d))
    })

    const dirs = globby.sync([
      '**/node_modules/@rappopo/cuk-*',
      '**/node_modules/rcuk-*',
      '**/node_modules/*-rcuk-*',
      '**/node_modules/rappopo-cuk-*',
      '**/node_modules/*-rappopo-cuk-*'
    ], {
      onlyDirectories: true,
      absolute: true
    })
    trace('+= Starting...')
    trace('|= Loading core...')
    makePkg(cuk, require('./index')(cuk), __dirname, trace)
    .then(pkg => {
      cuk.pkg[pkg.id] = pkg
      trace('|= Loading packages...')
      let proms = [
        makePkg(cuk, Promise.resolve({ id: 'app', level: 0}), cuk.dir.app, trace)
      ]
      _.each(dirs, d => {
        const item = require(d)(cuk)
        proms.push(makePkg(cuk, item, d, trace))
      })
      return Promise.all(proms)
    })
    .then(pkgs => {
      _.each(pkgs, p => {
        cuk.pkg[p.id] = p
      })
      return require('./lib/load_helper')(cuk, trace)
    })
    .then(() => {
      return require('./lib/load_config')(cuk, trace)
    })
    .then(() => {
      return require('./lib/boot_pkg')(cuk, trace)
    })
    .then(() => {
      trace('-= Boot process completed, enjoy!')
      if (!process.env.NOBANNER) console.log(
`
╔════════════════════════════════╦══════════════════════════════════════════════╗
║   ██████╗██╗   ██╗██╗  ██╗██╗  ║  Rappopo CUK!                                ║
║  ██╔════╝██║   ██║██║ ██╔╝██║  ║                                              ║
║  ██║     ██║   ██║█████╔╝ ██║  ║  https://docs.rappopo.com/cuk                ║
║  ██║     ██║   ██║██╔═██╗ ╚═╝  ║  https://github.com/rappopo/cuk              ║
║  ╚██████╗╚██████╔╝██║  ██╗██╗  ║  https://www.npmjs.com/package/@rappopo/cuk  ║
║   ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ║  Twitter: @rappopoto                         ║
╚════════════════════════════════╩══════════════════════════════════════════════╝
`)
      resolve(cuk)
    }).catch(reject)
  })
}