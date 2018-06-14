'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  return (pkgId, objPath, options) => {
    let pkg = cuk.pkg[pkgId]
    let defOptions = _.get(pkg.cfg, objPath, {})
    return cuk.pkg.core.cuks.core.helper.merge(defOptions, options || {})
  }
}