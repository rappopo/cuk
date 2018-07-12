'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return (id) => {
    let pkgs = cuk.pkg.core.cuks.core.helper.pkgs({ id: id })
    return pkgs.length === 0 ? null : pkgs[0]
  }
}