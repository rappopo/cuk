'use strict'

module.exports = function (cuk, trace) {
  const { _, path, fs } = cuk.pkg.core.lib
  const bootDeep = require('../cuks/core/helper/boot/deep')(cuk)
  const splitToken = require('../cuks/core/helper/pkg/token_split')(cuk)

  fs.ensureDirSync(path.join(cuk.dir.app, 'cuks', 'core', 'helper'))
  trace('|= Loading function helpers...')

  cuk.pkg.core.lib.helper = name => {
    const names = splitToken(name, `Invalid helper (%s)`)
    return _.get(names[2], `cuks.core.helper.${names[1]}`)
  }

  const action = opt => {
    opt.pkg.cuks.core.helper[opt.key] = require(opt.file)(cuk)
    trace('|  |- %s:%s', opt.pkg.id, opt.key)
  }

  bootDeep({ pkgId: 'core', name: 'helper', action: action })
}
