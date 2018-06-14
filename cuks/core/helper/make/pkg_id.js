'use strict'

module.exports = function(cuk) {
  const { _, path } = cuk.lib

  return (dir) => {
    let pkg
    _.forOwn(cuk.pkg, (v, k) => {
      if (v.dir === dir) pkg = v
    })
    if (pkg) return pkg.id
    return path.basename(dir)
  }
}