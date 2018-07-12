'use strict'

module.exports = function(cuk) {
  const _ = require('lodash')

  return (source = {}, doc = {}) => {
    let src = _.cloneDeep(source)
    return _.merge(src, doc)
  }
}