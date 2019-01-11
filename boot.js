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

module.exports = function (options = {}) {
  options.dir = options.dir || {}
  const trace = require('./cuks/core/helper/trace')(cuk)
  if (options.dir) cuk.dir = _.merge(cuk.dir, options.dir)

  return new Promise((resolve, reject) => {
    _.each(['config', 'tmp'], d => {
      fs.ensureDirSync(path.join(cuk.dir.data, d))
    })
    _.each(['cuks'], d => {
      fs.ensureDirSync(path.join(cuk.dir.app, d))
    })

    const pattern = [
      '**/node_modules/@rappopo/cuk-*',
      '**/node_modules/rcuk-*',
      '**/node_modules/*-rcuk-*',
      '**/node_modules/rappopo-cuk-*',
      '**/node_modules/*-rappopo-cuk-*'
    ].concat(options.extPkgs || [])

    const dirs = globby.sync(pattern, {
      onlyDirectories: true,
      absolute: true
    })
    trace('+= Starting...')
    if (!process.env.DEBUG) process.stdout.write('\n 🍎 Loading packages...')
    trace('|= Loading core...')

    makePkg(cuk, require('./index')(cuk), __dirname, trace)
      .then(pkg => {
        cuk.pkg[pkg.id] = pkg
        trace('|= Loading packages...')
        let proms = [
          makePkg(cuk, Promise.resolve({ id: 'app', level: 0 }), cuk.dir.app, trace)
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
        if (!process.env.DEBUG) process.stdout.write(' + 🐍 Booting packages...')
        return require('./lib/boot_pkg')(cuk, trace)
      })
      .then(() => {
        if (!process.env.DEBUG) process.stdout.write(' = 😈 Completed, enjoy!\n')
        trace('-= Completed, enjoy!')
        if (!process.env.NOBANNER) {
          console.log(`
   .----.-----.-----.-----.
  /      \\     \\     \\     \\
  |   /   |     |   __L_____L__      #NjancukiHargaMati!
  |  |    |     |  (           \\
  |   \\___/    /    \\______/    |
  |       \\___/\\___/\\___/       |
  \\      \\       /             /
   |                       __/
    \\_                  __/
     |       |         |             Documentation: https://docs.rappopo.com/cuk
     |                 |             Project: https://github.com/rappopo/cuk
     |   Rappopo CUK   |             Twitter: @rappopoto
`)
        }
        resolve(cuk)
      }).catch(reject)
  })
}
