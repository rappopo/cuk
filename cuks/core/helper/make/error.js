'use strict'

module.exports = function (cuk) {
  const { _, CukError } = cuk.pkg.core.lib

  return message => {
    let msg
    let body = {}
    if (_.isError(message)) {
      msg = message.message
      if (message.details) body = _.cloneDeep(message.details)
      if (message.statusCode) body.statusCode = body
    } else if (_.isPlainObject(message)) {
      msg = message.msg || 'Unknown Error'
      body = _.omit(message, ['msg'])
      if (message.status) body.statusCode = message.status
    } else {
      msg = _.isString(message) ? message : 'Unknown error'
      body.statusCode = 500
    }
    let err = new CukError(msg, body)
    return err
  }
}
