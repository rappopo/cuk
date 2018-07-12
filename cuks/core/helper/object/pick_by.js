'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return (src, by, key = 'id') => {
    if (_.isPlainObject(by))
      by = _.keys(by)
    else if (_.isArray(by) && by.length > 0 && _.isPlainObject(by[0]))
      by = _.map(by, key)
    return _(src).cloneDeep().pickBy((v, k) => {
      return by.indexOf(k) > 0
    })
  }
}