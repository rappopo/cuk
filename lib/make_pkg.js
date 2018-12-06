'use strict'

module.exports = function (cuk, item, dir, trace) {
  const _ = require('lodash')
  const path = require('path')
  const debug = require('debug')

  const makeChoices = require('../cuks/core/helper/make/choices')(cuk)
  const makePkgId = require('../cuks/core/helper/make/pkg_id')(cuk)
  const isSet = require('../cuks/core/helper/is/set')(cuk)

  return new Promise((resolve, reject) => {
    Promise.resolve(item)
      .then(pkg => {
        pkg.tag = makeChoices(pkg.tag)
        try {
          pkg.info = _.pick(require(path.join(dir, 'package.json')), ['name', 'version', 'description', 'author', 'license'])
        } catch (e) {
          pkg.info = {}
        }
        pkg.id = pkg.id || makePkgId(dir)
        pkg.dir = dir
        pkg.trace = require('../cuks/core/helper/trace')(cuk, debug(`cuk:${pkg.id}`))
        pkg.log = (...args) => {}
        pkg.lib = pkg.lib || {}
        pkg.cuks = {}
        if (!isSet(pkg.level)) pkg.level = 9999
        if (trace) trace('|  |- %s (%s v%s)', pkg.id, pkg.info.name, pkg.info.version)
        resolve(pkg)
      })
      .catch(reject)
  })
}
