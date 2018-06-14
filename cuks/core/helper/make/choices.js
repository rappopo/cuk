'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  return (item, sep) => {
    sep = sep || ','
    if (_.isArray(item)) return item
    if (!_.isString(item)) throw new Error('Currently, only string supported')
    return _.map(item.split(sep), t => _.trim(t))
  }
}