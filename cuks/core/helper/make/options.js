'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib
  const merge = require('../merge')(cuk)

  return (pkgId, objPath, options) => {
    let pkg = cuk.pkg[pkgId]
    let defOptions = _.get(pkg.cfg, objPath, {})
    return merge(defOptions, options || {})
  }
}