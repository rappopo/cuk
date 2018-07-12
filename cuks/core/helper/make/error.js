'use strict'

module.exports = function(cuk) {
  const { _ } = cuk.pkg.core.lib

  return msg => {
    let param = _.isPlainObject(msg) ? msg : { msg: msg }
    param.msg = param.msg || 'Unknown Error'
    let err = new Error(param.msg)
    err.statusCode = param.status || param.statusCode || 500
    err.detail = param.detail || {}
    return err
  }
}