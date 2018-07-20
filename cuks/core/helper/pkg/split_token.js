'use strict'

module.exports = function(cuk) {
  const util = require('util')
  const getPkg = require('../pkg')(cuk)

  return (name, pattern = 'Invalid name (%s)') => {
    let names = (name || '').split(':')
    if (names.length === 1) names = ['app', names[0]]
    if (names.length !== 2) throw new Error(util.format(pattern, name))
    const pkg = getPkg(names[0])
    if (!pkg) throw new Error(util.format(pattern, name))
    names.push(pkg)
    return names
  }
}