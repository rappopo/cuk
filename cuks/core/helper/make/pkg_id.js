'use strict'

module.exports = function (cuk) {
  const _ = require('lodash')
  const path = require('path')

  return (dir) => {
    let pkg
    _.forOwn(cuk.pkg, (v, k) => {
      if (v.dir === dir) {
        pkg = v
        return false
      }
    })
    if (pkg) return pkg.id
    return path.basename(dir)
  }
}
