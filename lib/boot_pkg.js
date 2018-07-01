'use strict'

module.exports = function(cuk, trace) {
  const { _, path, fs, helper, globby } = cuk.lib

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
        trace('%C hook:before cuk:%s', null, pkg.id)
        return Promise.map(files, f => {
          let text = '%P %s'
          trace(text, null, path.basename(f, '.js'))
          return require(f)(cuk)
        })
      })
      .then(result => {
        trace('%Z Booting cuk:%s now...', null, pkg.id)
        return require(bootFile)(cuk)
      })
      .then(result => {
        const files = globby.sync(path.join(pkg.dir, 'boot', 'hook', 'after', '*.js'), {
          ignore: [path.join(pkg.dir, 'boot', 'hook', 'after', '_*.js')]
        })
        if (files.length === 0) return Promise.resolve(true)
        trace('%C hook:after cuk:%s', null, pkg.id)
        return Promise.map(files, f => {
          let text = '%P %s'
          trace(text, null, path.basename(f, '.js'))
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
    if (cores.length === 0) return Promise.resolve(true)
    let order = _.without(_.get(cuk.pkg.core, 'cfg.common.bootOrder', []), 'app')
    if (order.length > 0) {
      cores = _.concat(cuk.pkg.app, sortCollection(cores, order))
    }
    trace('%Z Trying to boot these packages: %s', null, _.map(cores, 'id').join(', '))
    Promise.mapSeries(cores, p => {
      return bootSingle(p)
    }).then(resolve).catch(reject)
  })
}