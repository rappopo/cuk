'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return (filter) => {
    let pkgs = []
    _.forOwn(cuk.pkg, (v, k) => {
      pkgs.push(v)
    })
    if (filter) pkgs = _.filter(pkgs, filter)
    return pkgs
  }
}