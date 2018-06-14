'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.lib

  const filter = (coll, arr, field) => {
    let newColl = []
    _.each(arr, a => {
      let c = _.find(coll, _.set({}, field, a))
      if (c) newColl.push(c)
    })
    return newColl
  }

  return (coll, arr, field = 'id') => {
    const strict = _.last(arr) !== '*'
    let newColl = filter(coll, arr, field)
    if (!strict) {
      const missing = _.difference(_.map(coll, field), _.map(newColl, field))
      newColl = _.concat(newColl, filter(coll, missing, field))
    }
    return newColl
  }
}