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
  const makeConfig = require('./cuks/core/helper/make/config')(cuk)
  const sortCollection = require('./cuks/core/helper/coll/sort_by')(cuk)

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
      tag: 'boot',
      level: 0
    }), cuk.dir.app, trace)]
    trace('╞═ Loading packages...')
    _.each(dirs, d => {
      const item = require(d)(cuk)
      proms.push(makePkg(cuk, item, d, trace))
    })
    Promise.all(proms)
    .then(() => {
      let cores = _.orderBy(_.filter(cuk.pkg, f => {
        return f.tag.indexOf('boot') > -1 && f.id !== 'core'
      }), ['level'], ['asc'])
      if (cores.length === 0) return Promise.resolve(true)
      let order = _.without(_.get(cuk.pkg.core, 'cfg.common.bootOrder', []), 'app')
      if (order.length > 0) {
        cores = _.concat(cuk.pkg.app, sortCollection(cores, order))
      }
      trace('╞═ Loading function helpers...')
      require('./lib/make_helper')(cuk, trace)
      trace('╞═ Trying to boot these packages: %s', _.map(cores, 'id').join(', '))
      return Promise.mapSeries(cores, c => {
        let bootFile = path.join(c.dir, 'boot.js')
        if (!fs.existsSync(bootFile)) return Promise.resolve(true)
        trace('╞═ Booting cuk:%s now...', c.id)
        return new Promise((resv, rejc) => {
          require(bootFile)(cuk)
          .then(resv).catch(rejc)
        })
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