'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.lib

  return (dir) => {
    let pkgs = helper.getPkgs({ dir: dir })
    return pkgs.length > 0 ? pkgs[0] : null
  }
}