'use strict'

const util = require('util')
const _ = require('lodash')

// based on: https://gist.github.com/justmoon/15511f92e5216fa2624b
module.exports = function CukError(msg, extra, status) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = msg
  if (typeof extra === 'number')
    this.statusCode = extra
  else if (_.isPlainObject(extra)) {
    let code
    if (extra.status) {
      this.statusCode = extra.status
      delete extra.status
    }
    this.details = extra
  }
  if (status) this.statusCode = status
}
util.inherits(module.exports, Error)

