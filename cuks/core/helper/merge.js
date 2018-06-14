'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  return (source = {}, doc = {}) => {
    let src = _.cloneDeep(source)
    return _.merge(src, doc)
  }
}