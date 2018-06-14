'use strict'

module.exports = function(cuk) {
  const { _, globby, path, fs } = cuk.lib
  const merge = require('../merge')(cuk)
  const makeConfig = require('../make/config')(cuk)
  const pkgs = require('../pkgs')(cuk)

  return (pkgId, name) => {
    return new Promise((resolve, reject) => {
      Promise.map(pkgs(), p => {
        let dir = path.join(p.dir, 'cuks', pkgId)
        return makeConfig(dir, name)
      })
      .then(result => {
        const pids = _.map(pkgs(), 'id')
        resolve(_.zipObject(pids, result))
      })
      .catch(reject)
    })
  }
}
