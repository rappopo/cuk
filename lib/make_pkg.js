'use strict'

module.exports = function(cuk, item, dir, trace) {
  const { _, path, debug } = cuk.lib

  const makeChoices = require('../cuks/core/helper/make/choices')(cuk)
  const makePkgId = require('../cuks/core/helper/make/pkg_id')(cuk)
  const makeConfig = require('../cuks/core/helper/make/config')(cuk)
  const isSet = require('../cuks/core/helper/is_set')(cuk)
  const merge = require('../cuks/core/helper/merge')(cuk)

  return new Promise((resolve, reject) => {
    let id
    item
    .then(pkg => {
      pkg.tag = makeChoices(pkg.tag)
      pkg.info = _.pick(require(path.join(dir, 'package.json')), ['name', 'version', 'description', 'author', 'license'])
      pkg.id = pkg.id || makePkgId(dir)
      pkg.dir = dir
      pkg.trace = debug(`cuk:${pkg.id}`)
      pkg.log = (...args) => {}
      pkg.lib = {}
      pkg.cuks = {}
      if (!isSet(pkg.level)) pkg.level = 9999
      cuk.pkg[pkg.id] = pkg
      trace('%A %s (%s v%s)', null, pkg.id, pkg.info.name, pkg.info.version)
      id = pkg.id
      return makeConfig(dir, 'config')
    })
    .then(cfg => {
      if (!isSet(_.get(cfg, 'common.mount'))) _.set(cfg, 'common.mount', '/' + id)
      cuk.pkg[id].cfg = cfg
      let d = path.join(cuk.dir.data, 'config')
      return makeConfig(d, id)
    })
    .then(cfg => {
      let pkg = cuk.pkg[id]
      pkg.cfg = merge(pkg.cfg, cfg)
      resolve(true)
    })
    .catch(reject)
  })
}