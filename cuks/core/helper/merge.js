'use strict'

module.exports = function (cuk) {
  const _ = require('lodash')

  return (source = {}, ...docs) => {
    let src = _.cloneDeep(source)
    _.each(docs, d => {
      src = _.merge(src, d)
    })
    return src
  }
}
