'use strict'

module.exports = function(cuk) {
  const _ = require('lodash')
  const fs = require('fs-extra')
  const path = require('path')

  return (dir, file = 'config') => {
    if (fs.existsSync(path.join(dir, `${file}.js`)))
      return require(path.join(dir, `${file}.js`))(cuk)
    if (fs.existsSync(path.join(dir, file, 'index.js')))
      return require(path.join(dir, file, 'index.js'))(cuk)
    if (fs.existsSync(path.join(dir, `${file}.json`))) {
      let cfg = {}
      try { cfg = require(path.join(dir, `${file}.json`))} catch(e) {}
      return Promise.resolve(cfg)
    }
    if (fs.existsSync(path.join(dir, file, 'index.json'))) {
      let cfg = {}
      try { cfg = require(path.join(dir, file, 'index.json'))} catch(e) {}
      return Promise.resolve(cfg)
    }
    return Promise.resolve({})
  }
}