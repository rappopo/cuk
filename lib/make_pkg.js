'use strict'

module.exports = function(cuk, item, dir, trace) {
  const _ = require('lodash')
  const path = require('path')
  const debug = require('debug')

  const makeChoices = require('../cuks/core/helper/make/choices')(cuk)
  const makePkgId = require('../cuks/core/helper/make/pkg_id')(cuk)
  const configLoad = require('../cuks/core/helper/config/load')(cuk)
  const isSet = require('../cuks/core/helper/is/set')(cuk)
  const merge = require('../cuks/core/helper/merge')(cuk)

  return new Promise((resolve, reject) => {
    item
    .then(pkg => {
      pkg.tag = makeChoices(pkg.tag)
      pkg.info = _.pick(require(path.join(dir, 'package.json')), ['name', 'version', 'description', 'author', 'license'])
      pkg.id = pkg.id || makePkgId(dir)
      pkg.dir = dir
      pkg.trace = debug(`cuk:${pkg.id}`)
      pkg.log = (...args) => {}
      pkg.lib = pkg.lib || {}
      pkg.cuks = {}
      if (!isSet(pkg.level)) pkg.level = 9999
      if (trace) trace('%A %s (%s v%s)', null, pkg.id, pkg.info.name, pkg.info.version)
      resolve(pkg)
    })
    .catch(reject)
  })
}