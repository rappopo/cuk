'use strict'

module.exports = function (cuk) {
  const path = require('path')

  return Promise.resolve({
    id: 'core',
    level: 0,
    lib: {
      path: path,
      util: require('util'),
      _: require('lodash'),
      fs: require('fs-extra'),
      globby: require('globby'),
      moment: require('moment'),
      debug: require('debug'),
      deleteEmpty: require('delete-empty'),
      getParameterNames: require('@captemulation/get-parameter-names'),
      CukError: require('./lib/class_error')
    }
  })
}
