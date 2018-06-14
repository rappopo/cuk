'use strict'

module.exports = function(cuk) {
  return (name) => {
    let pkg
    _.forOwn(cuk.pkg, (v, k) => {
      if (v.info.name === name) {
        pkg = v
        return false
      }
    })
    return pkg
  }
}