'use strict'

const crypto = require('crypto')

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return (data, algorithm = 'md5', encoding = 'hex') => {
    if (!helper('core:isSet')(data)) throw helper('core:makeError')('Data is required')
    if (!_.isString(data)) data = JSON.stringify(data)
    return crypto.createHash(algorithm).update(data).digest(encoding)
  }
}
