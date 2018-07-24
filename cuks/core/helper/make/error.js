'use strict'

module.exports = function(cuk) {
  const { _, CukError } = cuk.pkg.core.lib

  return message => {
    let msg, extra
    if (_.isError(message)) {
      msg = message.message
      if (message.details) extra = message.details
    } else if (_.isPlainObject(message)) {
      msg = message.msg || 'Unknown error'
      extra = _.omit(message, ['msg'])
    } else {
      msg = _.isString(message) ? message : 'Unknown error'
    }
    let err = new CukError(msg, extra)
    err.statusCode = err.statusCode || 500
    return err
  }
}