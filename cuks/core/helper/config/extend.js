'use strict'

module.exports = function (cuk) {
  const { _, path } = cuk.pkg.core.lib
  const load = require('./load')(cuk)
  const pkgs = require('../pkgs')(cuk)

  return (from, to, base, dirSuffix) => {
    return new Promise((resolve, reject) => {
      const packages = pkgs(p => p.id !== from)
      Promise.map(packages, p => {
        let dirMerge = path.join(p.dir, 'cuks', from, 'extend', to)
        if (dirSuffix) {
          dirSuffix = dirSuffix.split('/').join(path.sep)
          dirMerge = path.join(dirMerge, dirSuffix)
        }
        return load(dirMerge, base)
      })
        .then(merge => {
          let result = {}
          _.each(merge, m => {
            result = _.merge(result, m)
          })
          resolve(result)
        })
        .catch(reject)
    })
  }
}
