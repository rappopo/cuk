'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return (name) => {
    let pkg = null
    _.forOwn(cuk.pkg, (v, k) => {
      if (v.info.name === name) {
        pkg = v
        return false
      }
    })
    return pkg
  }
}