'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  return (item, sep = ',', formatter) => {
    if (_.isArray(item)) return item
    if (!_.isString(item)) throw new Error('Currently, only string supported')
    let result = _.map(item.split(sep), t => _.trim(t))
    if (!_.isFunction(formatter)) return result
    return _.map(result, r => formatter(r))
  }
}