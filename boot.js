'use strict'

global.Promise = require('bluebird')
const path = require('path')
const makePkg = require('./lib/make_pkg')

if (process.env.DDIR)
  process.env.DDIR = path.resolve(process.env.DDIR)

let cuk = {
  dir: {
    app: process.cwd(),
    data: process.env.DDIR || path.join(process.cwd(), 'data')
  },
  lib: {
    path: path,
    util: require('util'),
    _: require('lodash'),
    fs: require('fs-extra'),
    globby: require('globby'),
    moment: require('moment'),
    debug: require('debug')
  },
  pkg: {}
}

module.exports = function(options) {
  const { _, debug, fs, globby } = cuk.lib
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
      '**/node_modules/@rappopo/cuk',
      '**/node_modules/@rappopo/cuk-*',
      '**/node_modules/rcuk-*',
      '**/node_modules/*-rcuk-*',
      '**/node_modules/rappopo-cuk-*',
      '**/node_modules/*-rappopo-cuk-*'
    ], {
      onlyDirectories: true,
      absolute: true
    })
    trace('╒═ Starting...')
    let proms = [makePkg(cuk, Promise.resolve({
      id: 'app',
      level: 0
    }), cuk.dir.app, trace)]
    trace('%Z Loading packages...', null)
    _.each(dirs, d => {
      const item = require(d)(cuk)
      proms.push(makePkg(cuk, item, d, trace))
    })
    Promise.all(proms)
    .then(() => {
      trace('%Z Loading function helpers...', null)
      return require('./lib/make_helper')(cuk, trace)
    })
    .then(() => {
      helper = cuk.lib.helper
      trace('%Z Loading configurations...', null)
      return Promise.map(helper('core:pkgs')(), p => {
        return helper('core:loadConfig')(p.dir, 'config')
      })
    })
    .then(result => {
      defCfg = result
      return Promise.map(helper('core:pkgs')(), p => {
        let d = path.join(cuk.dir.data, 'config')
        return helper('core:loadConfig')(d, p.id)
      })
    })
    .then(result => {
      _.each(helper('core:pkgs')(), (p, i) => {
        let cfg = helper('core:merge')(defCfg[i], result[i])
        cfg.common = cfg.common || {}
        cfg.common.mount = cfg.common.mount || ('/' + p.id)
        cfg.cuks = cfg.cuks || {}
        cuk.pkg[p.id].cfg = cfg
      })
      let cores = _.orderBy(_.filter(cuk.pkg, f => {
        return (fs.existsSync(path.join(f.dir, 'boot.js')) || fs.existsSync(path.join(f.dir, 'boot', 'index.js'))) && f.id !== 'core'
      }), ['level'], ['asc'])
      if (cores.length === 0) return Promise.resolve(true)
      let order = _.without(_.get(cuk.pkg.core, 'cfg.common.bootOrder', []), 'app')
      if (order.length > 0) {
        cores = _.concat(cuk.pkg.app, sortCollection(cores, order))
      }
      trace('%Z Trying to boot these packages: %s', null, _.map(cores, 'id').join(', '))
      return Promise.mapSeries(cores, c => {
        return bootPkg(cuk)(c)
      })
    })
    .then(() => {
      trace('╘═ Boot process completed, enjoy!')
console.log(
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