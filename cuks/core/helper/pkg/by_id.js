'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.lib

  return (id) => {
    return helper.getPkg(id)
  }
}