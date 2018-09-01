'use strict'

module.exports = function (cuk, trace) {
  const { _, path, fs, globby } = cuk.pkg.core.lib

  const sortCollection = require('../cuks/core/helper/coll/sort_by')(cuk)

  const bootSingle = pkg => {
    return new Promise((resolve, reject) => {
      let bootFile = path.join(pkg.dir, 'boot.js')
      if (!fs.existsSync(bootFile)) {
        bootFile = path.join(pkg.dir, 'boot', 'index.js')
        if (!fs.existsSync(bootFile)) return resolve(true)
      }
      Promise.resolve(true)
        .then(result => {
          const files = globby.sync(path.join(pkg.dir, 'boot', 'hook', 'before', '*.js'), {
            ignore: [path.join(pkg.dir, 'boot', 'hook', 'before', '_*.js')]
          })
          if (files.length === 0) return Promise.resolve(true)
          if (process.env.VERBOSE) trace('|---> hook:before cuk:%s', pkg.id)
          return Promise.map(files, f => {
            let text = '|     |- %s'
            if (process.env.VERBOSE) trace(text, path.basename(f, '.js'))
            return require(f)(cuk)
          })
        })
        .then(result => {
          trace('|= Booting cuk:%s now...', pkg.id)
          return require(bootFile)(cuk)
        })
        .then(result => {
          const files = globby.sync(path.join(pkg.dir, 'boot', 'hook', 'after', '*.js'), {
            ignore: [path.join(pkg.dir, 'boot', 'hook', 'after', '_*.js')]
          })
          if (files.length === 0) return Promise.resolve(true)
          if (process.env.VERBOSE) trace('|---> hook:after cuk:%s', pkg.id)
          return Promise.map(files, f => {
            let text = '|     |- %s'
            if (process.env.VERBOSE) trace(text, path.basename(f, '.js'))
            return require(f)(cuk)
          })
        })
        .then(result => {
          resolve(true)
        })
        .catch(reject)
    })
  }

  return new Promise((resolve, reject) => {
    let cores = _.orderBy(_.filter(cuk.pkg, f => {
      return (fs.existsSync(path.join(f.dir, 'boot.js')) || fs.existsSync(path.join(f.dir, 'boot', 'index.js'))) && f.id !== 'core'
    }), ['level'], ['asc'])
    if (cores.length === 0) return resolve(true)
    let order = _.without(_.get(cuk.pkg.core, 'cfg.common.bootOrder', []), 'app')
    if (order.length > 0) {
      cores = _.concat(cuk.pkg.app, sortCollection(cores, order))
    }
    trace('|= Trying to boot these packages: %s', _.map(cores, 'id').join(', '))
    Promise.mapSeries(cores, p => {
      return bootSingle(p)
    }).then(resolve).catch(reject)
  })
}
