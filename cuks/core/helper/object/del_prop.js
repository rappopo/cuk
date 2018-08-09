'use strict'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib

  return (obj, prop) => {
    _.each(prop, p => {
      delete obj[p]
    })
    return obj
  }
}
