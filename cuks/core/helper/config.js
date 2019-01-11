'use strict'

module.exports = function (cuk) {
  const { _ } = cuk.pkg.core.lib
  const isSet = require('./is/set')(cuk)

  return (pkg, path, def, ctx) => {
    if (_.isEmpty(path)) return _.get(cuk.pkg, pkg + '.cfg', {})
    const cfg = _.get(cuk.pkg, `${pkg}.cfg.${path}`, def)
    let siteCfg
    if (!_.isEmpty(ctx)) siteCfg = _.get(ctx.state.site, `config.${pkg}.${path}`)
    return isSet(siteCfg) ? siteCfg : cfg
  }
}
