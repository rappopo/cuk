'use strict'

module.exports = function(cuk) {
  const { path, fs, helper, globby } = cuk.lib
  const trace = helper('core:bootTrace')

  return pkg => {
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
          let text = '%B %s'
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
          let text = '%B %s'
          trace(text, null, path.basename(f, '.js'))
          return require(f)(cuk)
        })
      })
      .then(result => {
        resolve(true)
      })
      .catch(err => {
        resolve(true)
      })
    })
  }
}