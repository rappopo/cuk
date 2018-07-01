'use strict'

module.exports = function(cuk, trace) {
  const { _, globby, path, fs } = cuk.lib
  const merge = require('../cuks/core/helper/merge')(cuk)
  const bootDeep = require('../cuks/core/helper/boot/deep')(cuk)

  fs.ensureDirSync(path.join(cuk.dir.app, 'cuks', 'core', 'helper'))
  trace('%Z Loading function helpers...', null)

  cuk.lib.helper = name => {
    let names = (name || '').split(':')
    if (names.length === 1) names = ['app', names[0]]
    if (names.length !== 2) throw new Error(`Invalid helper (${name})`)
    const pkg = cuk.pkg[names[0]]
    if (!pkg) throw new Error(`Invalid helper (${name})`)
    let fn = _.get(pkg, `cuks.core.helper.${names[1]}`)
    if (!_.isFunction(fn))  throw new Error(`Invalid helper (${name})`)
    return fn
  }

  const action = opt => {
    opt.pkg.cuks.core.helper[opt.key] = require(opt.file)(cuk)
    trace('%A %s:%s', null, opt.pkg.id, opt.key)
  }

  bootDeep({ pkgId: 'core', name: 'helper', action: action })
}