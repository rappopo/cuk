'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return msg => {
    let param
    if (_.isError(msg))
      param = { msg: msg.message, detail: msg.detail || msg.details || {}, status: msg.status || msg.statusCode }
    else
      param = _.isPlainObject(msg) ? msg : { msg: msg }
    param.msg = param.msg || 'Unknown Error'
    let err = new Error(param.msg)
    err.statusCode = param.status || param.statusCode || 500
    err.detail = param.detail || param.details || {}
    return err
  }
}